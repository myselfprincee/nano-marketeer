import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "./lib/zod"
import { getUserfromDB } from "./utils/db"
import { Pool } from "@neondatabase/serverless"
import NeonAdapter from "@auth/neon-adapter"
import type { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
  }

  interface JWT {
    id: string
    email: string
    name?: string | null
  }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        email: string
        name?: string | null
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    adapter: NeonAdapter(new Pool({ connectionString: process.env.DATABASE_URL }) as any),
    providers: [
        Credentials({
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "your@email.com"
                },
                password: {
                    label: "Password",
                    type: "password"
                },
            },
            authorize: async (credentials) => {
                try {
                    console.log("Incoming credentials:", credentials)
                    const { email, password } = await signInSchema.parseAsync(credentials)

                    const user = await getUserfromDB(email, password)
                    console.log("DB result:", user)

                    if (!user) {
                        console.log("No user found, returning null")
                        return null
                    }

                    return { id: user.id?.toString(), email: user.email, name: user.name }
                } catch (error) {
                    console.error("Authorize error:", error)
                    return null
                }
            }

        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // When a new user logs in
            if (user) {
                token.id = user.id
                token.email = user.email
                token.name = user.name
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
                session.user.email = token.email
                session.user.name = token.name
            }
            return session
        },
    },
});
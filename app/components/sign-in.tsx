'use client'

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function SignIn({ searchParams }: { searchParams?: { error?: string, message?: string } }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false, // Handle redirect manually
            })

            if (result?.error) {
                setError("Invalid credentials")
            } else if (result?.ok) {
                // Force page refresh to update navbar
                window.location.href = '/'
                // Or use router.push('/') and router.refresh()
                // router.push('/')
                // router.refresh()
            }
        } catch (error) {
            setError("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-full flex items-center justify-center">
            <div className="max-w-md w-full space-y-8 p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="text-3xl font-bold text-center text-white">Sign In</h2>
                    <p className="text-center text-gray-600 mt-2">Welcome back to Nano-Marketer</p>
                </div>

                {(error || searchParams?.error) && (
                    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
                        {error || searchParams?.error}
                    </div>
                )}

                {searchParams?.message && (
                    <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded">
                        {searchParams.message}
                    </div>
                )}

                <div>
                    Test Credentials are:
                    <p>princegupta@duck.com</p>
                    <p>11111111</p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white">
                            Email Address
                        </label>
                        <input
                            name="email"
                            type="email"
                            id="email"
                            required
                            disabled={loading}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-white placeholder:text-white disabled:opacity-50"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-white">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            id="password"
                            required
                            disabled={loading}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-white placeholder:text-white disabled:opacity-50"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold py-2 px-4 rounded-md hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/sign-up" className="text-orange-600 hover:text-orange-500 font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}
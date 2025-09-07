import { SessionProvider } from "next-auth/react"
import CreativeAdsMaker from "./CreativeAdsMaker"

const page = () => {
  return (
   <SessionProvider>
    <CreativeAdsMaker/>
   </SessionProvider>
  )
}

export default page
import { SessionProvider } from 'next-auth/react'
import AITRYON from './aiTryon'

const page = () => {
  return (
    <SessionProvider>
      <AITRYON />
    </SessionProvider>
  )
}

export default page
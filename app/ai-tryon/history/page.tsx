import TryOnHistory from '@/app/components/HistoryComponent'
import { SessionProvider } from 'next-auth/react'

const page = () => {
    return (
        <SessionProvider>
            <TryOnHistory />
        </SessionProvider>
    )
}

export default page
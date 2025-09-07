import { SessionProvider } from "next-auth/react";
import AccountPage from "./AccountPage";


const page = () => {
    return  (
        <SessionProvider><AccountPage/></SessionProvider>
    )
}

export default page
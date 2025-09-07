import { SessionProvider } from "next-auth/react";
import FolderDetail from "./FolderDetail";

const page = () => {
    return (
        <SessionProvider>
            <FolderDetail />
        </SessionProvider>
    )
}

export default page;
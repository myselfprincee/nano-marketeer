import { SessionProvider } from "next-auth/react";
import NavbarComponent from "./NavbarComponent"
import React from 'react'

const Navbar = () => {
    return (
        <SessionProvider>
            <NavbarComponent />
        </SessionProvider>
    )
}

export default Navbar
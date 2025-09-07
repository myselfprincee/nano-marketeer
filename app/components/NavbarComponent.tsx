'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

const NavbarComponent = () => {
    const { data: session, status } = useSession()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Show loading state instead of hiding completely
    if (status === 'loading') {
        return (
            <nav className='p-2 flex items-center justify-between relative'>
                <div className='flex items-center gap-3'>
                    <Link href={"/"}>
                        <Image
                            className='hover:scale-110 hover:rotate-6 transition-all duration-300 ease-in-out cursor-pointer'
                            draggable='false'
                            src='/nano-marketer-logo.png'
                            alt='nano-marketer-logo'
                            width={50}
                            height={50}
                        />
                    </Link>
                    <p className='header-animation'>Nano-Marketeer</p>
                </div>

                {/* <ul>
                    <li className='text-xl font-[Geist] font-bold'>Tools</li>
                </ul> */}

                {/* Loading spinner */}
                <div className='w-[40px] h-[40px] rounded-full flex justify-center items-center'>
                    <div className='w-6 h-6 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin'></div>
                </div>
            </nav>
        )
    }

    // Show sign in button if not authenticated
    if (!session?.user) {
        return (
            <nav className='p-2 flex items-center justify-between relative'>
                <div className='flex items-center gap-3'>
                    <Link href={"/"}>
                        <Image
                            className='hover:scale-110 hover:rotate-6 transition-all duration-300 ease-in-out cursor-pointer'
                            draggable='false'
                            src='/nano-marketer-logo.png'
                            alt='nano-marketer-logo'
                            width={50}
                            height={50}
                        />
                    </Link>
                    <p className='header-animation'>Nano-Marketeer</p>
                </div>

                {/* <ul>
                    <li className='text-xl font-[Geist] font-bold'>Tools</li>
                </ul> */}

                {/* Sign In Button */}
                <Link
                    href="/sign-in"
                    className='px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 text-sm font-semibold'
                >
                    Sign In
                </Link>
            </nav>
        )
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' })
    }

    // AUTHENTICATED USER NAVBAR - Complete this section
    return (
        <nav className='p-2 flex items-center justify-between relative'>
            <div className='flex items-center gap-3'>
                <Link href={"/"}>
                    <Image
                        className='hover:scale-110 hover:rotate-6 transition-all duration-300 ease-in-out cursor-pointer'
                        draggable='false'
                        src='/nano-marketer-logo.png'
                        alt='nano-marketer-logo'
                        width={50}
                        height={50}
                    />
                </Link>
                <p className='header-animation'>Nano-Marketeer</p>
            </div>

            {/* <ul>
                <li className='text-xl font-[Geist] font-bold'>Tools</li>
            </ul> */}

            {/* Profile Dropdown */}
            <div className='relative ml-4' ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    className='outline w-[40px] h-[40px] rounded-full flex justify-center items-center cursor-pointer hover:bg-gray-100 transition-colors duration-200 relative'
                >
                    <p className='font-bold text-lg text-center uppercase'>
                        {session.user.name?.charAt(0)}
                    </p>

                    {/* Status indicator dot */}
                    <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className='absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn'>
                        {/* User Info Header */}
                        <div className='px-4 py-3 border-b border-gray-100'>
                            <p className='text-sm font-medium text-gray-900'>
                                {session.user.name}
                            </p>
                            <p className='text-sm text-gray-600 truncate'>
                                {session.user.email}
                            </p>
                        </div>

                        {/* Menu Items */}
                        <div className='py-1'>
                            <Link
                                href='/account'
                                onClick={() => setIsDropdownOpen(false)}
                                className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150'
                            >
                                <svg className='w-4 h-4 mr-3 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                                </svg>
                                My Account
                            </Link>

                            <Link
                                href='/ai-tryon/history'
                                onClick={() => setIsDropdownOpen(false)}
                                className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150'
                            >
                                <svg className='w-4 h-4 mr-3 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                                </svg>
                                Try-On Gallery
                            </Link>

                            <Link
                                href='/campaigns'
                                onClick={() => setIsDropdownOpen(false)}
                                className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150'
                            >
                                <svg className='w-4 h-4 mr-3 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                                </svg>
                                My Campaigns
                            </Link>

                            <Link
                                href='/settings'
                                onClick={() => setIsDropdownOpen(false)}
                                className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150'
                            >
                                <svg className='w-4 h-4 mr-3 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                </svg>
                                Settings
                            </Link>
                        </div>

                        {/* Divider */}
                        <div className='border-t border-gray-100 my-1'></div>

                        {/* Sign Out */}
                        <button
                            onClick={handleSignOut}
                            className='flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150'
                        >
                            <svg className='w-4 h-4 mr-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                )}
            </div>

            {/* Custom CSS for fade-in animation */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </nav>
    )
}

export default NavbarComponent
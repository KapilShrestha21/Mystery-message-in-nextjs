'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { LogOut, User as UserIcon, LockKeyhole } from 'lucide-react'

const Navbar = () => {
    const { data: session } = useSession()
    const user: User = session?.user as User

    return (
        <nav className='p-4 md:p-6 shadow-lg bg-[#FAF0E6]/90 backdrop-blur-lg border-b border-[#E3DCC8] text-[#5C4033] sticky top-0 z-50'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center gap-4'>
                {/* Logo with a coppery/brass gradient */}
                <a 
                    className='text-2xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#A0522D] to-[#CD853F] flex items-center gap-2'
                    href="/"
                >
                    <LockKeyhole className="w-5 h-5 text-[#CD853F]" />
                    Mystery Message
                </a>

                <div className='flex items-center space-x-4'>
                    {session ? (
                        <div className='flex flex-col md:flex-row items-center gap-4'>
                            <span className='text-sm md:text-base font-medium text-[#8B7355] flex items-center gap-2.5'>
                                {/* Icon styled as a soft terracotta detail */}
                                <div className="p-1.5 bg-[#FAEBD7] rounded-full border border-[#D2B48C]">
                                    <UserIcon className="w-4 h-4 text-[#A0522D]" />
                                </div>
                                Welcome, <span className="text-[#5C4033] font-semibold">{user?.username || user?.email}</span>
                            </span>
                            <Button 
                                onClick={() => signOut()} 
                                variant="outline" 
                                // Soft terracotta outline with warm hover
                                className='w-full md:w-auto border-[#D2B48C] text-[#A0522D] hover:bg-[#F5DEB3] hover:border-[#CD853F] transition-all duration-300 flex gap-2 items-center rounded-full'
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </Button>
                        </div>
                    ) : (
                        <Link href='/sign-in'>
                            <Button className='w-full md:w-auto bg-[#A0522D] text-white hover:bg-[#8B4513] font-semibold px-6 rounded-full shadow-[0_4px_14px_rgba(160,82,45,0.3)]'>
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
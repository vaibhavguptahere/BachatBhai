'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, PenBox, Wallet } from 'lucide-react'
import { Button } from './ui/button'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

const Navbar = () => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Load login state from sessionStorage on first render
  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true'
    setIsLoggedIn(loggedIn)
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn')
    setIsLoggedIn(false)
    router.push('/login')
  }

  const handleLogin = () => {
    sessionStorage.setItem('isLoggedIn', 'true')
    setIsLoggedIn(true)
    router.push('/')
  }

  return (
    <div className='fixed top-0 w-full bg-white/80 z-50 border-b backdrop-blur-md'>
      <nav className='container mx-auto px-4 py-4 flex items-center justify-between'>
        {/* Logo */}
        <Link href='/'>
          <div className="flex items-center cursor-pointer">
            <Wallet className="h-6 w-6 text-blue-600" />
            <span className='font-extrabold text-xl ml-1 font-verdana bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              BaChatBhai
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" className='flex items-center gap-2'>
                  <span className='hidden md:inline'>Dashboard</span>
                  <LayoutDashboard size={18} />
                </Button>
              </Link>

              <Link href="/transaction/create">
                <Button className='flex items-center gap-2'>
                  <span className='hidden md:inline'>Add Transaction</span>
                  <PenBox size={18} />
                </Button>
              </Link>

              {/* Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 cursor-pointer">
                    <Image
                      src="/default-avatar.png"
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 mt-2">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleLogin}>Login</Button>
            </>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Navbar

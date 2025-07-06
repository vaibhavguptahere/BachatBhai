import React from 'react'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, PenBox, TrashIcon, Wallet } from 'lucide-react'
import { Button } from './ui/button'
import { checkUser } from '@/lib/checkUser'
const Navbar = async () => {
  await checkUser();
  return (
    <div className='fixed top-0 w-full bg-white/80 z-50 border-b backdrop-blur-md mt-1'>
      <nav className='container mx-auto px-4 py-4 flex items-center justify-between'>
        <Link href='/'>
          <div className="flex justify-center">
            <Wallet className="h-6 w-6 text-blue-600" />
            <span className='font-extrabold text-xl ml-1 font-verdana bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>BaChatBhai</span>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          {/* If signed in */}
          <SignedIn>
            <Link href={"/dashboard"} className='text-gray-600 hover:text-blue-600 flex item-center gap-2'>
              <Button variant="outline">
                <span className='hidden md:inline'>Dashboard</span>
                <LayoutDashboard size={18} />
              </Button>
            </Link>

            <Link href={"/transaction/create"} className='flex item-center gap-2'>
              <Button>
                <span className='hidden md:inline'>Add Transaction</span>
                <PenBox size={18} />
              </Button>
            </Link>
          </SignedIn>

          {/* If Signed out */}
          <SignedOut>
            <SignInButton forceRedirectUrl='/dashboard'>
              <Button variant="outline">Login</Button>
            </SignInButton >
            <SignUpButton forceRedirectUrl='/sign-up'>
              <Button>Signup</Button>
            </SignUpButton>
          </SignedOut>

          {/* If Signed in the avatar button will be visible */}
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-16 h-16',
                  userButtonAvatarImage: 'w-16 h-16 rounded-full object-cover',
                },
              }}
            />
          </SignedIn>

        </div>
      </nav>
    </div>
  )
}

export default Navbar

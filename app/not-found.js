'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Ghost } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <Ghost className="h-12 w-12 text-blue-600 mb-4" />
      <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link href="/">
        <Button className="animate-bounce">Get me Back</Button>
      </Link>
    </div>
  )
}

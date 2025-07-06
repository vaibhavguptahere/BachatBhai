"use client"
import CreateAccountDrawer from '@/components/create-account-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import React from 'react'
import { ReactLenis, useLenis } from 'lenis/react'

const DashboardPage = () => {
  const lenis = useLenis((lenis) => {
    // called every scroll
    console.log(lenis)
  })
  return (

    <div className='px-5'>
       {/* Making scroll more smoothly */}
      <ReactLenis root />

      {/* Budget process */}


      {/* Overview */}


      {/* Account Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center text-center justify-center text-muted-foreground h-full pt-5">
              <Plus className='h-10 w-10 mb-2' />
              <p className='text-sm text-center font-medium'>Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>
      </div>

    </div>
  )
}

export default DashboardPage
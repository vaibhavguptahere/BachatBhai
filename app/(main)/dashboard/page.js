import CreateAccountDrawer from '@/components/create-account-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import React from 'react'
// import { ReactLenis, useLenis } from 'lenis/react'
// import { motion, useScroll, useSpring } from "motion/react"
import { getUserAccounts } from '@/actions/dashboard'
import AccountCard from './_components/account-card'

async function DashboardPage() {



  // // Added for smooth scroll
  // const lenis = useLenis((lenis) => {
  //   // called every scroll
  //   console.log(lenis)
  // })

  // // Progress bar on top
  // const { scrollYProgress } = useScroll()
  // const scaleX = useSpring(scrollYProgress, {
  //   stiffness: 100,
  //   damping: 30,
  //   restDelta: 0.001,
  // })

  const accounts = await getUserAccounts();

  return (

    <div className='px-5'>
      {/* Making scroll more smoothly
      <ReactLenis root /> */}

      {/* Progress Bar on top */}
      {/* <motion.div
        id="scroll-indicator"
        style={{
          scaleX,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 10,
          originX: 0,
          backgroundColor: "blue",
        }}
      /> */}

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

        {accounts.length > 0 && accounts?.map((account) => {
          return <AccountCard key={account.id} account={account} />;
        })}


      </div>
    </div>
  )
}

export default DashboardPage
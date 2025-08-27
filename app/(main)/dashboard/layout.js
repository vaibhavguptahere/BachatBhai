import React, { Suspense } from 'react'
import DashboardPage from './page'
import { BarLoader } from 'react-spinners'

const DashboardLayout = () => {
    return (
        <div className='px-5 pt-28 mb-20'>
            <h1 className='text-6xl font-bold tracking-tighter mb-5 gradient-title'>Dashboard</h1>

            {/* Dashboard Section --start */}
            <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#9333ea' />}>
                <DashboardPage />
            </Suspense>
        </div>
    )
}

export default DashboardLayout

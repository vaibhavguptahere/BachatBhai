import { SignIn } from '@clerk/nextjs'
import React from 'react'

const login = () => {
  return (
    <div className='flex justify-center pt-40 pb-20'> 
      <SignIn/>
    </div>
  )
}

export default login

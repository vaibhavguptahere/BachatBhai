"use client"
import React from 'react'
import { motion, useScroll, useSpring } from "motion/react"
const AccountsPage = ({ params }) => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div className='mt-40'>
      <motion.div
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
      />
      {params.id}
    </div>
  )
}

export default AccountsPage

"use client"
import Hero from "@/components/Hero";
import { featuresData, howItWorksData } from "@/data/landing";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactLenis, useLenis } from 'lenis/react'
import { motion, useScroll, useSpring } from "motion/react"
import dynamic from 'next/dynamic';

export default function Home() {

  // using for smooth scroll
  const lenis = useLenis((lenis) => {
    console.log(lenis)
  })
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (

    <div className="mt-40">
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
      <ReactLenis root />
      <Hero />

      <section className="py-20 bg-blue-50">
        {/* Features Data div --start */}
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need to manage your finances!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {featuresData.map((feature, index) => (
              <Card key={index} className="p-6">
                <CardContent className="space-y-4 pt-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))};
          </div>
        </div>
      </section >
      {/* Features Data div --end */}

      {/* How It Works Data div --start */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How to Use me?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center ">
            {howItWorksData.map((howItWorksData, index) => (
              <Card key={index} className="p-6">
                <CardContent>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    {howItWorksData.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{howItWorksData.title}</h3>
                  <p className="text-gray-600">{howItWorksData.description}</p>
                </CardContent>
              </Card>
            ))};
          </div>
        </div>
      </section>
      {/* How It Works Data div --end */}

      <section className="py-8 bg-blue-600">
        {/* End of the Page --start */}
        <div className="container mx-auto px-8 text-center text-white">
          <h2 className="text-3xl font-bold text-center mb-4">Ready to take control of your finances?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">Let's join BaChatBhai and be a intelligent by managing the finances more smarter!</p>
          <div className="flex items-center text-center justify-center">
            <Link href={"/sign-in"}>
              <Button size="lg" className="px-14 py-5 bg-white text-blue-600 hover:bg-blue-50 animate-bounce">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section >
      {/* Ending of the page --end */}

    </div >
  );
}

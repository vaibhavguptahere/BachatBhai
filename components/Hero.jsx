"use client"
import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import Image from 'next/image'

const Hero = () => {
  const imageRef = useRef();

  // Logic for the animations for hero section
  useEffect(() => {
    const imageElement = imageRef.current;
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      }
      else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (

    <div className='pb-20 px-4'>
      <div className="container mx-auto text-center">

        {/* Hero Section main heading -- start*/}
        <h1 className='text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title'>
          Manage Your Finances <br /> with BaChatBhai
        </h1>
        <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
          An AI-powered financial management platform that helps you track, analyze, and optimize your spending with real-time insights.
        </p>
        {/* Hero Section main heading -- ended */}

        {/* Hero Section Buttons -- start */}
        <div className="flex gap-4 justify-center">
          <Link href={"/dashboard"}>
            <Button variant="outline" size="lg" className="px-14 py-5">
              Get Started
            </Button>
          </Link>

          <Link href={"/dashboard"}>
            <Button size="lg" className="px-16 py-5">
              Check Report
            </Button>
          </Link>
        </div>
        {/* Hero Section Buttons -- end */}

        {/* Hero Section Banner --start*/}
        <div className="hero-image-wrapper">
          <div ref={imageRef} className='hero-image'>
            <Image src="/hero.jpg" width={1280} height={720} alt='dashboard preview' className='rounded-lg shadow-2xl border mx-auto' />
          </div>
        </div>
        {/* Hero Section Banner --end */}
      </div>
    </div>
  )
}

export default Hero

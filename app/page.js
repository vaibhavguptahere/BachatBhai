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
import ScrollRevealSection from "@/components/ScrollRevealSection";
export default function Home() {

  return (

    <div className="mt-40">
      <Hero />
      <ScrollRevealSection>
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
      </ScrollRevealSection>
      {/* Features Data div --end */}

      <ScrollRevealSection>
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
      </ScrollRevealSection>
      {/* How It Works Data div --end */}

      {/* End of the Page --start */}
      <ScrollRevealSection>
        <section className="py-8 bg-blue-600">

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
      </ScrollRevealSection>
      {/* Ending of the page --end */}
    </div >
  );
}
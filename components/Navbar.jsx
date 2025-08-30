"use client";

import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, PenBox } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  const { user } = useUser(); // ✅ works now (client-side only)

  return (
    <div className="fixed top-0 w-full bg-white/80 z-50 border-b backdrop-blur-md mt-1">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex justify-center items-center">
            <img src="/busy.gif" alt="Logo" className="h-9 w-10 mr-0.5" />
            <span className="font-extrabold text-2xl ml-1 font-verdana bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BaChatBhai
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          {/* If signed in */}
          <SignedIn>
            <Link
              href={"/dashboard"}
              className="text-gray-600 hover:text-blue-600 flex item-center gap-2"
            >
              <Button variant="outline">
                <span className="hidden md:inline">Dashboard</span>
                <LayoutDashboard size={18} />
              </Button>
            </Link>

            <Link
              href={"/transaction/create"}
              className="flex item-center gap-2"
            >
              <Button>
                <span className="hidden md:inline">Add Transaction</span>
                <PenBox size={18} />
              </Button>
            </Link>
          </SignedIn>

          {/* If signed out */}
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
            <SignUpButton forceRedirectUrl="/sign-up">
              <Button>Signup</Button>
            </SignUpButton>
          </SignedOut>

          {/* Avatar if signed in */}
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10", // smaller avatar
                  userButtonAvatarImage:
                    "w-10 h-10 rounded-full object-cover",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

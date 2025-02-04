"use client"

import React from "react"
import localFont from "next/font/local"
import { ShoppingBag, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "../hooks/useAuth"
import useBagStore from "../stores/useBagStore" // Import Bag Store

const myFont = localFont({ src: "../public/fonts/Rekalgera-Regular.otf" })

const Header = () => {
  const { user } = useAuth()
  const { bag } = useBagStore()
  const bagCount = bag.length

  return (
    <header className="flex items-center justify-between p-4 bg-orange-400">
      <Link href="/">
        <h1 className={`${myFont.className} text-3xl text-white`}>Bill's Citrus Clean</h1>
      </Link>
      <div className="flex items-center gap-6">
        <Link href={user ? "/dashboard" : "/portal"}>
          <User className="h-6 w-6 text-white" />
        </Link>
        <Link href="/bag" className="relative">
          <ShoppingBag className="h-6 w-6 text-white" />
          {bagCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              {bagCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}

export default Header

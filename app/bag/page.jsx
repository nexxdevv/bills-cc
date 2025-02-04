"use client"
import dynamic from "next/dynamic"

// Dynamically import BagPage component with SSR disabled
const BagPage = dynamic(() => import("../../components/BagPage"), {
  ssr: false // This will disable SSR for this component, ensuring it's only rendered on the client side
})

export default BagPage

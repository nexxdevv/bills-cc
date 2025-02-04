"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { fetchProducts } from "../utils/fetchProducts"
import Image from "next/image"

const HomePage = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const getProducts = async () => {
      const fetchedProducts = await fetchProducts()
      setProducts(fetchedProducts)
    }

    getProducts()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold px-4 my-6">Featured Products</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-2 p-4">
        {products.map((product, index) => (
          <div key={index} className="  py-4  transition duration-200">
            <Link href={`/shop/${product.id}`}>
              <Image
                src={product.photo}
                alt={product.name}
                width={200}
                height={200}
                className="w-full object-cover mb-4"
              />
            </Link>
            <h3 className="text-sm font-semibold mb-2">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{product.weight}</p>
            <p className="text-sm text-gray-800 font-bold mb-4">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage

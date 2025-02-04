"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { db } from "../../../lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import useBagStore from "../../../stores/useBagStore" // Import Bag Store
import Image from "next/image"

const ProductDetailPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addToBag } = useBagStore()

  useEffect(() => {
    if (!id) return

    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "products", id)
        const productSnap = await getDoc(productRef)

        if (productSnap.exists()) {
          setProduct({ id: productSnap.id, ...productSnap.data() })
        } else {
          console.error("Product not found")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToBag = () => {
    if (product) {
      addToBag(product)
      console.log(`Added ${product.name} to bag`)
    }
  }

  const handleBuyNow = () => {
    console.log(`Buying ${product.name}`)
    // TODO: Redirect to checkout
  }

  if (loading) return <p>Loading...</p>
  if (!product) return <p>Product not found</p>

  return (
    <div className="p-6">
      <Image
        src={product.photo}
        alt={product.name}
        width={500}
        height={500}
        className="object-cover rounded-lg"
      />
      <h1 className="font-bold">{product.name}</h1>
      <p className="text-gray-600">{product.weight}</p>
      <p className="font-bold">${product.price}</p>
      <p className="mt-4">{product.description}</p>

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleAddToBag}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
        >
          Add to Bag
        </button>
        <button
          onClick={handleBuyNow}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Buy Now
        </button>
      </div>
    </div>
  )
}

export default ProductDetailPage

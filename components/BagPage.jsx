"use client"

import useBagStore from "../stores/useBagStore"
import Link from "next/link"

const BagPage = () => {
  const { bag, incrementQuantity, decrementQuantity, removeFromBag, clearBag } =
    useBagStore()

  // Ensure proper price calculation
  const totalPrice = bag
    .reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Bag</h1>

      {bag.length === 0 ? (
        <p className="text-gray-500 text-lg">There are no items in your Bag.</p>
      ) : (
        <div className="space-y-6">
          {bag.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b pb-4"
            >
              <img
                src={item.photo}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">${item.price}</p>
                <div className="flex items-center mt-2 gap-2">
                  <button
                    onClick={() => decrementQuantity(item.id)}
                    className="px-3 py-1 bg-gray-300 text-gray-800 rounded-lg"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border rounded-lg">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => incrementQuantity(item.id)}
                    className="px-3 py-1 bg-gray-300 text-gray-800 rounded-lg"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeFromBag(item.id)}
                className="px-3 py-1 bg-red-600 text-white rounded-lg"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center font-semibold text-lg mt-6">
            <p>Total:</p>
            <p>${totalPrice}</p>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={clearBag}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
            >
              Clear Bag
            </button>
            <Link href="/checkout">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default BagPage

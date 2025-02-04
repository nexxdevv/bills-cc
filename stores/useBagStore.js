import { create } from "zustand"
import { persist } from "zustand/middleware"

const useBagStore = create(
  persist(
    (set, get) => ({
      bag: [],
      
      addToBag: (product) => {
        set((state) => {
          const existingItem = state.bag.find((item) => item.id === product.id)
          if (existingItem) {
            return {
              bag: state.bag.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            }
          } else {
            return { bag: [...state.bag, { ...product, quantity: 1 }] }
          }
        })
      },

      incrementQuantity: (id) => {
        set((state) => ({
          bag: state.bag.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }))
      },

      decrementQuantity: (id) => {
        set((state) => ({
          bag: state.bag
            .map((item) =>
              item.id === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        }))
      },

      removeFromBag: (id) => {
        set((state) => ({ bag: state.bag.filter((item) => item.id !== id) }))
      },

      clearBag: () => set({ bag: [] }),
    }),
    { name: "bag-storage" } // Key for localStorage persistence
  )
)

export default useBagStore

// /utils/fetchProducts.js
import { db, collection, getDocs } from "../lib/firebase"

export const fetchProducts = async () => {
  const productsRef = collection(db, "products")
  const snapshot = await getDocs(productsRef)
  const productsList = snapshot.docs.map((doc) => ({
    id: doc.id, // Add the Firestore document ID
    ...doc.data()
  }))
  return productsList
}

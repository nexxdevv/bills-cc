import { useState, useEffect } from "react"
import { type User, onAuthStateChanged, updateProfile } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "../lib/firebase"

interface UserData {
  email: string | null
  displayName: string | null
  photoURL: string | null
  address: string | null
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData)
        } else {
          const defaultUserData: UserData = {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            address: null
          }
          await setDoc(userDocRef, defaultUserData)
          setUserData(defaultUserData)
        }
      } else {
        setUser(null)
        setUserData(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const updateUserData = async (newData: Partial<UserData>) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid)
      await setDoc(userDocRef, newData, { merge: true })
      setUserData((prevData) => ({ ...prevData, ...newData } as UserData))

      if (newData.displayName || newData.photoURL) {
        await updateProfile(user, {
          displayName: newData.displayName || user.displayName,
          photoURL: newData.photoURL || user.photoURL
        })
      }
    }
  }

  const updatePhotoURL = async (photoURL: string) => {
    if (user) {
      await updateUserData({ photoURL })
    }
  }

  return { user, updateUserData, updatePhotoURL }
}

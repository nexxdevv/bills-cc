"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signOut
} from "firebase/auth"
import { auth, db } from "../../lib/firebase"
import { useRouter } from "next/navigation"
import {
  useCloudinaryWidget,
  CloudinaryResult
} from "../../hooks/useCloudinaryWidget"
import { Camera } from "lucide-react"
import Image from "next/image"
import bcrypt from "bcryptjs"
import { doc, setDoc } from "firebase/firestore"

const Dashboard = () => {
  const { user, userData, updateUserData, updatePhotoURL } = useAuth()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(userData?.displayName || "")
  const [address, setAddress] = useState(userData?.address || "")
  const [city, setCity] = useState(userData?.city || "")
  const [state, setState] = useState(userData?.state || "")
  const [zipCode, setZipCode] = useState(userData?.zipCode || "")
  const [error, setError] = useState("")
  const { open: openCloudinaryWidget } = useCloudinaryWidget()
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const firstLetter = displayName.charAt(0)?.toUpperCase() || "?"

  const toggleForm = () => {
    setIsSignUp(!isSignUp)
    setError("")
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        displayName: name,
        password: hashedPassword
      })
    } catch (error) {
      setError(error.message || "An error occurred during sign up")
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Error signing in with email:", error)
      setError(error.message || "An error occurred during sign in")
    }
  }

  const handleGoogleSignIn = async () => {
    setError("")
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error("Error signing in with Google:", error)
      setError(error.message || "An error occurred during Google sign up")
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await updateUserData({ displayName, address, city, state, zipCode })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating user data:", error)
      setError("Failed to update user information. Please try again.")
    }
  }

  const handlePhotoUpload = () => {
    openCloudinaryWidget()
    if (typeof window !== "undefined" && (window as any).cloudinary) {
      const widget = (window as any).cloudinary.createUploadWidget(
        {
          cloudName: "cloud-x",
          uploadPreset: "user_photos"
        },
        async (error: any, result: CloudinaryResult) => {
          if (
            !error &&
            result &&
            result.event === "success" &&
            result.info.secure_url
          ) {
            try {
              await updatePhotoURL(result.info.secure_url)
            } catch (error) {
              console.error("Error updating photo URL:", error)
              setError("Failed to update profile picture. Please try again.")
            }
          }
        }
      )
      widget.open()
    }
  }

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || "")
      setAddress(userData.address || "")
      setCity(userData.city || "")
      setState(userData.state || "")
      setZipCode(userData.zipCode || "")
    }
  }, [userData])

  return (
    <div className="flex items-center justify-center sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-2 bg-white p-6">
        <div className="flex flex-col items-center">
          {user?.photoURL ? (
            <Image
              src={user.photoURL}
              alt="Profile Picture"
              width={100}
              height={100}
              className="rounded-full border"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center rounded-full border bg-gray-300 text-3xl font-bold text-white">
              {firstLetter}
            </div>
          )}
          {isEditing && (
            <button
              onClick={handlePhotoUpload}
              className="mt-2 flex items-center text-sm text-blue-600 hover:underline"
            >
              <Camera className="w-4 h-4 mr-1" /> Change Photo
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display Name"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Zip Code"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold">
              {displayName || "No name set"}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-gray-600">{address || ""}</p>
            <div className="flex items-center justify-center">
              {city && <p className="text-gray-600">{city || ""}</p>} {state && <span className="mr-1">,</span>}
              <p className="text-gray-600 mr-1">{state || ""}</p>
              <p className="text-gray-600">{zipCode || ""}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 text-blue-600 hover:underline"
            >
              Edit Profile
            </button>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="w-full mt-4 bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Dashboard

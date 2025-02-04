"use client"

import React, { useState, useEffect } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider
} from "firebase/auth"
import { auth, db } from "../../lib/firebase"
import { useRouter } from "next/navigation"
import bcrypt from "bcryptjs"
import { doc, setDoc } from "firebase/firestore"
import { useAuth } from "../../hooks/useAuth"

const Portal = () => {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

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
      router.push("/dashboard")
    } catch (error) {
      setError(error.message || "An error occurred during sign up")
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
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
      router.push("/dashboard")
    } catch (error) {
      console.error("Error signing in with Google:", error)
      setError(error.message || "An error occurred during Google sign up")
    }
  }

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        <form
          onSubmit={isSignUp ? handleEmailSignUp : handleEmailSignIn}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
          {isSignUp && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
          {isSignUp && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-600 text-white px-4 py-2 rounded-lg mt-4"
        >
          Sign in with Google
        </button>
        <p className="text-center mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={toggleForm}
            className="text-blue-600 hover:underline ml-1"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Portal

"use client"

import { createContext, useState, useContext, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem("user")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    setLoading(false)
  }, [])

  // Login function
  const login = (email, password, role) => {
    // In a real app, you would make an API call to verify credentials
    // This is a simplified version for demonstration

    // Mock users for demo
    const adminUser = { id: 1, email: "admin@restaurant.com", role: "admin", name: "Admin User" }
    const deliveryUser = { id: 2, email: "delivery@restaurant.com", role: "delivery", name: "Delivery User" }

    let user = null

    if (email === "admin@restaurant.com" && password === "password" && role === "admin") {
      user = adminUser
    } else if (email === "delivery@restaurant.com" && password === "password" && role === "delivery") {
      user = deliveryUser
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
      setCurrentUser(user)
      return true
    }

    return false
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("user")
    setCurrentUser(null)
  }

  const value = {
    currentUser,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    setLoading(false)
  }, [])

  const adminLogin = async (email, password) => {
    try {
      const response = await axios.post("login/", { email, password })
      if (response.data) {
        const email = response.data.user.email
        const token = response.data.token
        const user = { email, token, role: "admin" }
        localStorage.setItem("user", JSON.stringify(user))
        setCurrentUser(user)
        return true
      }
    } catch (error) {
      console.error(error)
      return false
    }
    return false
  }

  const deliveryLogin = async (phone, password) => {
    const phone_12 = "+91" + phone
    try {
      const response = await axios.post("deliveryman/login/", { phone_number: phone_12, password })
      // console.log(response)
      if (response.data) {
        const { phone_number, token } = response.data
        const deliveryManId = response.data.delivery_man?.id
        const name = response.data.delivery_man?.name
        const user = { phone: phone_number, token, role: "delivery", deliveryManId, name }
        localStorage.setItem("user", JSON.stringify(user))
        setCurrentUser(user)
        return true
      }
    } catch (error) {
      console.error(error)
      return false
    }
    return false
  }

  const logout = () => {
    // send logout request to server
    const user = localStorage.getItem("user")
    if (user) {
      const { token, role } = JSON.parse(user)
      if (role === "admin") {
        axios.post("logout/", {}, { headers: { Authorization: `Token ${token}` } })
          .then(() => {
            console.log("Logged out")
            localStorage.removeItem("user")
            setCurrentUser(null)
          })
          .catch((error) => {
            console.error(error)
            alert("Failed to logout")
          })
      } else if (role === "delivery") {
        axios.post("deliveryman/logout/", {}, { headers: { Authorization: `Token ${token}` } })
          .then(() => {
            console.log("Logged out")
            localStorage.removeItem("user")
            setCurrentUser(null)
          })
          .catch((error) => {
            console.error(error)
            alert("Failed to logout")
          })
      }
    }
  }

  const value = {
    currentUser,
    adminLogin,
    deliveryLogin,
    logout,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
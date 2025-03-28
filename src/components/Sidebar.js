"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { authActions } from "../store/slices/authSlice"

const Sidebar = () => {
  const token = useSelector((state) => state.auth.token)
  const role = useSelector((state) => state.auth.role)
  const email = useSelector((state) => state.auth.email)
  const name = useSelector((state) => state.auth.name)
  const phone = useSelector((state) => state.auth.phone)
  const deliverymanId = useSelector((state) => state.auth.deliverymanId)
  const dispatch = useDispatch()

  const logout = () => {
    if (token) {
      if (role === "admin") {
        axios.post("logout/", {}, { headers: { Authorization: `Token ${token}` } })
          .then(() => {
            console.log("Logged out")
            dispatch(authActions.logout())
          })
          .catch((error) => {
            console.error(error)
            alert("Failed to logout")
          })
      } else if (role === "delivery") {
        axios.post("deliveryman/logout/", {}, { headers: { Authorization: `Token ${token}` } })
          .then(() => {
            console.log("Logged out")
            dispatch(authActions.logout())
          })
          .catch((error) => {
            console.error(error)
            alert("Failed to logout")
          })
      }
    }
  }


  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path) => {
    return location.pathname === path
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="sidebar">
      <div className="user-info">
        <div className="avatar">LC</div>
        <div className="user-details">
          <p className="user-name">{name}</p>
          <p className="user-email">{email}</p>
        </div>
        {/* <button className="options-btn" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? "✕" : "☰"}
        </button> */}
      </div>

      <div className={`nav-menu ${mobileMenuOpen ? "mobile-open" : ""}`}>
        {role === "admin" && (
          <>
            <Link
              to="/admin/dashboard"
              className={`nav-item ${isActive("/admin/dashboard") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="icon">📊</span>
              <span>Dashboard</span>
            </Link>
            <Link
              to="/admin/orders"
              className={`nav-item ${isActive("/admin/orders") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="icon">🛒</span>
              <span>Orders</span>
            </Link>
            {/* <Link
              to="/admin/deliveries"
              className={`nav-item ${isActive("/admin/deliveries") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="icon">🚚</span>
              <span>Deliveries</span>
            </Link> */}
            <Link
              to="/admin/menu"
              className={`nav-item ${isActive("/admin/menu") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="icon">📋</span>
              <span>Menu</span>
            </Link>
            <Link
              to="/admin/register-delivery-man"
              className={`nav-item ${isActive("/admin/register-delivery-man") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="icon">👤</span>
              <span>Register Delivery Man</span>
            </Link>
          </>
        )}

        {role === "delivery" && (
          <Link
            to="/delivery/dashboard"
            className={`nav-item ${isActive("/delivery/dashboard") ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="icon">🚚</span>
            <span>My Deliveries</span>
          </Link>
        )}
      </div>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <span className="icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar

"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Sidebar = () => {
  const { currentUser, logout } = useAuth()
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
          <p className="user-name">{currentUser.name}</p>
          <p className="user-email">{currentUser.email}</p>
        </div>
        {/* <button className="options-btn" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? "✕" : "☰"}
        </button> */}
      </div>

      <div className={`nav-menu ${mobileMenuOpen ? "mobile-open" : ""}`}>
        {currentUser.role === "admin" && (
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
            <Link
              to="/admin/deliveries"
              className={`nav-item ${isActive("/admin/deliveries") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="icon">🚚</span>
              <span>Deliveries</span>
            </Link>
            <Link
              to="/admin/menu"
              className={`nav-item ${isActive("/admin/menu") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="icon">📋</span>
              <span>Menu</span>
            </Link>
          </>
        )}

        {currentUser.role === "delivery" && (
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

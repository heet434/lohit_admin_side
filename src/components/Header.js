"use client"

import { useState } from "react"
import { useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Header = ({ title }) => {
  const location = useLocation()
  const { logout } = useAuth()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Get page title from path
  const getPageTitle = () => {
    const path = location.pathname

    if (path.includes("/admin/dashboard")) return "Dashboard"
    if (path.includes("/admin/orders")) return "Orders"
    if (path.includes("/admin/deliveries")) return "Deliveries"
    if (path.includes("/admin/menu")) return "Menu"
    if (path.includes("/delivery/dashboard")) return "My Deliveries"

    return title || "Restaurant Management"
  }

  return (
    <header className="app-header">
      <div className="header-content">
        <h1>{getPageTitle()}</h1>
        <div className="header-actions">
          <div className="search-container">
            <input type="text" placeholder="Search..." className="search-input" />
            <button className="search-btn">🔍</button>
          </div>
          <div className="date-display">{currentDate}</div>
          <button className="notification-btn">🔔</button>
          <button className="theme-toggle">🌙</button>

          {/* Mobile logout button */}
          <button
            className="logout-btn mobile-only"
            onClick={logout}
            style={{
              display: "none",
              "@media (max-width: 767px)": { display: "flex" },
            }}
          >
            <span className="icon">🚪</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
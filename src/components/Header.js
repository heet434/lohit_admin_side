"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Header = (props) => {
  const { title, searchQuery, handleSearch } = props
  const location = useLocation()
  const { logout } = useAuth()
  const [showMobileMenu, setShowMobileMenu] = useState(true)

  useEffect(() => {
    // check if the window width is greater than 768px

    const windowWidth = window.innerWidth
    if (windowWidth > 768) {
      setShowMobileMenu(false)
    }else{
      setShowMobileMenu(true)
    }


    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowMobileMenu(false)
      }else{
        setShowMobileMenu(true)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize
    )
  }, [window.innerWidth])

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
            <input type="text" placeholder="Search..." className="search-input" value={searchQuery} onChange={handleSearch} />
            <button className="search-btn">🔍</button>
          </div>
          {!showMobileMenu && <div className="date-display">{currentDate}</div>}
          {/* <button className="notification-btn">🔔</button> */}
          {/* <button className="theme-toggle">🌙</button> */}

          {/* Mobile logout button */}
          {showMobileMenu && (<button
            className="logout-btn mobile-only"
            onClick={logout}
            style={{
              display: showMobileMenu ? "flex" : "none",
            }}
          >
            {/* <span className="icon">🚪</span> */}
            Logout
          </button>)}
        </div>
      </div>
    </header>
  )
}

export default Header
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "../styles/Login.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("admin")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { adminLogin, deliveryLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      let success = false

      if (role === "admin") {
        success = await adminLogin(email, password)
      } else {
        console.log(phone)
        success = await deliveryLogin(phone, password)
      }

      if (success) {
        navigate(role === "admin" ? "/admin/dashboard" : "/delivery/dashboard")
      } else {
        setError("Failed to sign in. Please check your credentials.")
      }
    } catch (error) {
      setError("Failed to sign in")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Restaurant Management</h1>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="admin">Administrator</option>
              <option value="delivery">Delivery Person</option>
            </select>
          </div>

          {role === "admin" ? (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="phone">Phone (10 digits)</label>
              <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="form-actions">
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          {/* <div className="form-footer">
            <a href="#forgot-password">Forgot password?</a>
          </div> */}
        </form>

        {/* <div className="demo-credentials">
          <p>
            <strong>Demo Credentials:</strong>
          </p>
          <p>Admin: admin@restaurant.com / password</p>
          <p>Delivery: delivery@restaurant.com / password</p>
        </div> */}
      </div>
    </div>
  )
}

export default Login
import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { authActions } from "../store/slices/authSlice"

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = useSelector((state) => state.auth.token)
  const role = useSelector((state) => state.auth.role)

  if (!token) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // User doesn't have the required role
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace />
    } else if (role === "delivery") {
      return <Navigate to="/delivery/dashboard" replace />
    } else {
      return <Navigate to="/login" replace />
    }
  }

  return children
}

export default ProtectedRoute
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // User doesn't have the required role
    if (currentUser.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />
    } else if (currentUser.role === "delivery") {
      return <Navigate to="/delivery/dashboard" replace />
    } else {
      return <Navigate to="/login" replace />
    }
  }

  return children
}

export default ProtectedRoute
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import AdminDashboard from "./pages/admin/Dashboard"
import AdminOrders from "./pages/admin/Orders"
// import AdminDeliveries from "./pages/admin/Deliveries"
import AdminMenu from "./pages/admin/Menu"
import DeliveryDashboard from "./pages/delivery/Dashboard"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Navigate to="/admin/dashboard" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/admin/deliveries"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDeliveries />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/admin/menu"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminMenu />
              </ProtectedRoute>
            }
          />

          {/* Delivery Routes */}
          <Route
            path="/delivery"
            element={
              <ProtectedRoute allowedRoles={["delivery"]}>
                <Navigate to="/delivery/dashboard" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/dashboard"
            element={
              <ProtectedRoute allowedRoles={["delivery"]}>
                <DeliveryDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

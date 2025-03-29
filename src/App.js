import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Login from "./pages/Login"
import AdminDashboard from "./pages/admin/Dashboard"
import AdminOrders from "./pages/admin/Orders"
// import AdminDeliveries from "./pages/admin/Deliveries"
import DeliveryManRegistration from "./pages/admin/DeliveryManRegisteration"
import AdminMenu from "./pages/admin/Menu"
import DeliveryDashboard from "./pages/delivery/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"

function App() {
  const token = useSelector((state) => state.auth.token)
  const role = useSelector((state) => state.auth.role)
  const FRONTEND_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3000/"
  return (
      <Router basename={FRONTEND_BASE_URL}>
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
            path="/admin/register-delivery-man"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DeliveryManRegistration />
              </ProtectedRoute>
            }
          />
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
          <Route path="/" element={<Navigate to={token ? (role === "admin" ? "/admin/dashboard" : "/delivery/dashboard") : "/login"} replace/>} />
          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
  )
}

export default App

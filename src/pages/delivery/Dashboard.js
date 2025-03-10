"use client"

import { useState } from "react"
import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"
import "../../styles/Delivery.css"

const DeliveryDashboard = () => {
  // Mock data for assigned deliveries
  const [deliveries, setDeliveries] = useState({
    pending: [
      {
        id: "DEL-0007",
        customer: "John Smith",
        phone: "+919825773190",
        address: "123 Main St, Apartment 4B, Landmark: Blue Building",
        date: "2025-03-10",
        time: "16:30",
        items: ["Pizza x 2", "Coke x 2"],
        total: 450,
        status: "pending",
      },
      {
        id: "DEL-0008",
        customer: "Emily Johnson",
        phone: "+919825773191",
        address: "456 Park Ave, House 7, Landmark: Near City Park",
        date: "2025-03-10",
        time: "16:45",
        items: ["Burger x 1", "Fries x 1", "Milkshake x 1"],
        total: 320,
        status: "pending",
      },
    ],
    in_progress: [
      {
        id: "DEL-0005",
        customer: "Michael Brown",
        phone: "+919825773192",
        address: "789 Oak St, Suite 12, Landmark: Opposite Gas Station",
        date: "2025-03-10",
        time: "16:00",
        items: ["Chicken Biryani x 1", "Raita x 1"],
        total: 220,
        status: "in_progress",
      },
      {
        id: "DEL-0006",
        customer: "Sarah Davis",
        phone: "+919825773193",
        address: "321 Elm St, Apartment 8C, Landmark: Red Building",
        date: "2025-03-10",
        time: "16:15",
        items: ["Pasta x 1", "Garlic Bread x 1", "Coke x 1"],
        total: 350,
        status: "in_progress",
      },
    ],
    completed: [
      {
        id: "DEL-0003",
        customer: "Robert Wilson",
        phone: "+919825773194",
        address: "654 Pine St, House 3, Landmark: Corner House",
        date: "2025-03-10",
        time: "15:30",
        items: ["Pizza x 1", "Garlic Bread x 1", "Coke x 1"],
        total: 280,
        status: "completed",
      },
      {
        id: "DEL-0004",
        customer: "Jennifer Taylor",
        phone: "+919825773195",
        address: "987 Maple St, Apartment 5D, Landmark: Near School",
        date: "2025-03-10",
        time: "15:45",
        items: ["Sandwich x 2", "Coffee x 2"],
        total: 320,
        status: "completed",
      },
    ],
  })

  const updateDeliveryStatus = (id, currentStatus, newStatus) => {
    // Create a copy of the deliveries object
    const updatedDeliveries = { ...deliveries }

    // Find the delivery in the current status array
    const deliveryIndex = updatedDeliveries[currentStatus].findIndex((d) => d.id === id)

    if (deliveryIndex !== -1) {
      // Get the delivery
      const delivery = { ...updatedDeliveries[currentStatus][deliveryIndex], status: newStatus }

      // Remove from current status array
      updatedDeliveries[currentStatus] = updatedDeliveries[currentStatus].filter((d) => d.id !== id)

      // Add to new status array
      updatedDeliveries[newStatus] = [...updatedDeliveries[newStatus], delivery]

      // Update state
      setDeliveries(updatedDeliveries)
    }
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="delivery-dashboard-container">
          <div className="delivery-stats">
            <div className="stat-card">
              <div className="stat-icon pending-icon">🕒</div>
              <div className="stat-details">
                <h3>Pending Deliveries</h3>
                <p className="stat-value">{deliveries.pending.length}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon progress-icon">🚚</div>
              <div className="stat-details">
                <h3>In Progress</h3>
                <p className="stat-value">{deliveries.in_progress.length}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon completed-icon">✅</div>
              <div className="stat-details">
                <h3>Completed Today</h3>
                <p className="stat-value">{deliveries.completed.length}</p>
              </div>
            </div>
          </div>

          <div className="delivery-section">
            <h2>Pending Deliveries</h2>
            <div className="delivery-cards">
              {deliveries.pending.map((delivery) => (
                <div className="delivery-card" key={delivery.id}>
                  <div className="delivery-header">
                    <h3>{delivery.id}</h3>
                    <span className="delivery-status pending">Pending</span>
                  </div>
                  <div className="delivery-details">
                    <p>
                      <strong>Customer:</strong> {delivery.customer}
                    </p>
                    <p>
                      <strong>Phone:</strong> {delivery.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {delivery.address}
                    </p>
                    <p>
                      <strong>Date:</strong> {delivery.date}
                    </p>
                    <p>
                      <strong>Time:</strong> {delivery.time}
                    </p>
                    <p>
                      <strong>Total:</strong> ₹{delivery.total}
                    </p>
                  </div>
                  <div className="delivery-items">
                    <h4>Items:</h4>
                    <ul>
                      {delivery.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="delivery-actions">
                    <button
                      className="action-btn start"
                      onClick={() => updateDeliveryStatus(delivery.id, "pending", "in_progress")}
                    >
                      Start Delivery
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="delivery-section">
            <h2>In Progress</h2>
            <div className="delivery-cards">
              {deliveries.in_progress.map((delivery) => (
                <div className="delivery-card" key={delivery.id}>
                  <div className="delivery-header">
                    <h3>{delivery.id}</h3>
                    <span className="delivery-status in-progress">In Progress</span>
                  </div>
                  <div className="delivery-details">
                    <p>
                      <strong>Customer:</strong> {delivery.customer}
                    </p>
                    <p>
                      <strong>Phone:</strong> {delivery.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {delivery.address}
                    </p>
                    <p>
                      <strong>Date:</strong> {delivery.date}
                    </p>
                    <p>
                      <strong>Time:</strong> {delivery.time}
                    </p>
                    <p>
                      <strong>Total:</strong> ₹{delivery.total}
                    </p>
                  </div>
                  <div className="delivery-items">
                    <h4>Items:</h4>
                    <ul>
                      {delivery.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="delivery-actions">
                    <button
                      className="action-btn complete"
                      onClick={() => updateDeliveryStatus(delivery.id, "in_progress", "completed")}
                    >
                      Mark as Delivered
                    </button>
                    <button className="action-btn navigate">Navigate 🗺️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="delivery-section">
            <h2>Completed Deliveries</h2>
            <div className="delivery-cards">
              {deliveries.completed.map((delivery) => (
                <div className="delivery-card" key={delivery.id}>
                  <div className="delivery-header">
                    <h3>{delivery.id}</h3>
                    <span className="delivery-status completed">Completed</span>
                  </div>
                  <div className="delivery-details">
                    <p>
                      <strong>Customer:</strong> {delivery.customer}
                    </p>
                    <p>
                      <strong>Phone:</strong> {delivery.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {delivery.address}
                    </p>
                    <p>
                      <strong>Date:</strong> {delivery.date}
                    </p>
                    <p>
                      <strong>Time:</strong> {delivery.time}
                    </p>
                    <p>
                      <strong>Total:</strong> ₹{delivery.total}
                    </p>
                  </div>
                  <div className="delivery-items">
                    <h4>Items:</h4>
                    <ul>
                      {delivery.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryDashboard
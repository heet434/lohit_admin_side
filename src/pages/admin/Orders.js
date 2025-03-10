"use client"

import { useState } from "react"
import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"
import "../../styles/Admin.css"

const Orders = () => {
  const [activeTab, setActiveTab] = useState("all")

  // Mock data for orders
  const orders = {
    pending: [
      {
        id: "ORD-0026",
        phone: "+919825773190",
        date: "2025-03-10",
        time: "15:45",
        mode: "dine-in",
        items: ["Pizza x 1", "Coke x 2"],
        total: 250,
        token: "0003",
      },
      {
        id: "ORD-0027",
        phone: "+919825773191",
        date: "2025-03-10",
        time: "15:50",
        mode: "takeaway",
        items: ["Burger x 2", "Fries x 1"],
        total: 320,
        token: "0004",
      },
    ],
    confirmed: [
      {
        id: "ORD-0024",
        phone: "+919825773192",
        date: "2025-03-10",
        time: "15:30",
        mode: "dine-in",
        items: ["Pasta x 1", "Garlic Bread x 1"],
        total: 280,
        token: "0001",
      },
      {
        id: "ORD-0025",
        phone: "+919825773193",
        date: "2025-03-10",
        time: "15:35",
        mode: "takeaway",
        items: ["Sandwich x 1", "Coffee x 1"],
        total: 180,
        token: "0002",
      },
    ],
    preparing: [
      {
        id: "ORD-0022",
        phone: "+919825773194",
        date: "2025-03-10",
        time: "15:15",
        mode: "dine-in",
        items: ["Biryani x 1", "Raita x 1"],
        total: 220,
        token: "0005",
      },
      {
        id: "ORD-0023",
        phone: "+919825773195",
        date: "2025-03-10",
        time: "15:20",
        mode: "delivery",
        items: ["Pizza x 2", "Coke x 2"],
        total: 450,
        token: "0006",
      },
    ],
    ready: [
      {
        id: "ORD-0020",
        phone: "+919825773196",
        date: "2025-03-10",
        time: "15:00",
        mode: "takeaway",
        items: ["Burger x 1", "Fries x 1"],
        total: 180,
        token: "0007",
      },
      {
        id: "ORD-0021",
        phone: "+919825773197",
        date: "2025-03-10",
        time: "15:05",
        mode: "dine-in",
        items: ["Salad x 1", "Juice x 1"],
        total: 150,
        token: "0008",
      },
    ],
    out_for_delivery: [
      {
        id: "ORD-0018",
        phone: "+919825773198",
        date: "2025-03-10",
        time: "14:45",
        mode: "delivery",
        items: ["Pizza x 2 (Rs.12.00)"],
        total: 240,
        token: "0002",
      },
      {
        id: "ORD-0019",
        phone: "+919825773199",
        date: "2025-03-10",
        time: "14:50",
        mode: "delivery",
        items: ["Pizza x 2 (Rs.12.00)"],
        total: 240,
        token: "0001",
      },
    ],
    delivered: [
      {
        id: "ORD-0016",
        phone: "+919825773200",
        date: "2025-03-10",
        time: "14:30",
        mode: "delivery",
        items: ["Biryani x 1", "Coke x 1"],
        total: 220,
        token: "0009",
      },
      {
        id: "ORD-0017",
        phone: "+919825773201",
        date: "2025-03-10",
        time: "14:35",
        mode: "delivery",
        items: ["Pasta x 1", "Garlic Bread x 1"],
        total: 280,
        token: "0010",
      },
    ],
  }

  // Filter orders by type (dine-in, takeaway, delivery)
  const filterOrdersByType = (type) => {
    const allOrders = [
      ...orders.pending,
      ...orders.confirmed,
      ...orders.preparing,
      ...orders.ready,
      ...orders.out_for_delivery,
      ...orders.delivered,
    ]

    if (type === "all") return allOrders
    return allOrders.filter((order) => order.mode === type)
  }

  const filteredOrders = filterOrdersByType(activeTab)

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="orders-container">
          <div className="order-tabs">
            <button className={`tab-btn ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
              All Orders
            </button>
            <button
              className={`tab-btn ${activeTab === "dine-in" ? "active" : ""}`}
              onClick={() => setActiveTab("dine-in")}
            >
              Dine-in
            </button>
            <button
              className={`tab-btn ${activeTab === "takeaway" ? "active" : ""}`}
              onClick={() => setActiveTab("takeaway")}
            >
              Takeaway
            </button>
            <button
              className={`tab-btn ${activeTab === "delivery" ? "active" : ""}`}
              onClick={() => setActiveTab("delivery")}
            >
              Delivery
            </button>
          </div>

          <div className="order-section">
            <h2>Pending Orders</h2>
            <div className="order-cards">
              {orders.pending
                .filter((order) => activeTab === "all" || order.mode === activeTab)
                .map((order) => (
                  <div className="order-card" key={order.id}>
                    <div className="order-header">
                      <h3>{order.id}</h3>
                      <span className={`order-type ${order.mode}`}>{order.mode}</span>
                    </div>
                    <div className="order-details">
                      <p>
                        <strong>Phone:</strong> {order.phone}
                      </p>
                      <p>
                        <strong>Date:</strong> {order.date}
                      </p>
                      <p>
                        <strong>Time:</strong> {order.time}
                      </p>
                      <p>
                        <strong>Token:</strong> {order.token}
                      </p>
                      <p>
                        <strong>Total:</strong> ₹{order.total}
                      </p>
                    </div>
                    <div className="order-items">
                      <h4>Items:</h4>
                      <ul>
                        {order.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="order-actions">
                      <button className="action-btn confirm">Confirm</button>
                      <button className="action-btn cancel">Cancel</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="order-section">
            <h2>Confirmed Orders</h2>
            <div className="order-cards">
              {orders.confirmed
                .filter((order) => activeTab === "all" || order.mode === activeTab)
                .map((order) => (
                  <div className="order-card" key={order.id}>
                    <div className="order-header">
                      <h3>{order.id}</h3>
                      <span className={`order-type ${order.mode}`}>{order.mode}</span>
                    </div>
                    <div className="order-details">
                      <p>
                        <strong>Phone:</strong> {order.phone}
                      </p>
                      <p>
                        <strong>Date:</strong> {order.date}
                      </p>
                      <p>
                        <strong>Time:</strong> {order.time}
                      </p>
                      <p>
                        <strong>Token:</strong> {order.token}
                      </p>
                      <p>
                        <strong>Total:</strong> ₹{order.total}
                      </p>
                    </div>
                    <div className="order-items">
                      <h4>Items:</h4>
                      <ul>
                        {order.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="order-actions">
                      <button className="action-btn prepare">Start Preparing</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="order-section">
            <h2>Out for Delivery Orders</h2>
            <div className="order-cards">
              {orders.out_for_delivery
                .filter((order) => activeTab === "all" || order.mode === activeTab)
                .map((order) => (
                  <div className="order-card" key={order.id}>
                    <div className="order-header">
                      <h3>{order.id}</h3>
                      <span className={`order-type ${order.mode}`}>{order.mode}</span>
                    </div>
                    <div className="order-details">
                      <p>
                        <strong>Phone:</strong> {order.phone}
                      </p>
                      <p>
                        <strong>Date:</strong> {order.date}
                      </p>
                      <p>
                        <strong>Time:</strong> {order.time}
                      </p>
                      <p>
                        <strong>Token:</strong> {order.token}
                      </p>
                      <p>
                        <strong>Total:</strong> ₹{order.total}
                      </p>
                    </div>
                    <div className="order-items">
                      <h4>Items:</h4>
                      <ul>
                        {order.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="order-actions">
                      <button className="action-btn delivered">Mark as Delivered</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="order-section">
            <h2>Delivered Orders</h2>
            <div className="order-cards">
              {orders.delivered
                .filter((order) => activeTab === "all" || order.mode === activeTab)
                .map((order) => (
                  <div className="order-card" key={order.id}>
                    <div className="order-header">
                      <h3>{order.id}</h3>
                      <span className={`order-type ${order.mode}`}>{order.mode}</span>
                    </div>
                    <div className="order-details">
                      <p>
                        <strong>Phone:</strong> {order.phone}
                      </p>
                      <p>
                        <strong>Date:</strong> {order.date}
                      </p>
                      <p>
                        <strong>Time:</strong> {order.time}
                      </p>
                      <p>
                        <strong>Token:</strong> {order.token}
                      </p>
                      <p>
                        <strong>Total:</strong> ₹{order.total}
                      </p>
                    </div>
                    <div className="order-items">
                      <h4>Items:</h4>
                      <ul>
                        {order.items.map((item, index) => (
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

export default Orders
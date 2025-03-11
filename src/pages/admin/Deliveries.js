"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"
import "../../styles/Admin.css"

const Deliveries = () => {
  // Mock data for deliveries
  const deliveries = {
    pending: [
      {
        id: "DEL-0005",
        phone: "+919825773190",
        date: "2025-03-10",
        token: "0005",
        total: 350,
        status: "pending",
        deliveryMan: "",
      },
      {
        id: "DEL-0006",
        phone: "+919825773191",
        date: "2025-03-10",
        token: "0006",
        total: 420,
        status: "pending",
        deliveryMan: "",
      },
    ],
    out_for_delivery: [
      {
        id: "DEL-0003",
        phone: "+919825773192",
        date: "2025-03-10",
        token: "0001",
        total: 240,
        status: "out_for_delivery",
        deliveryMan: "John Doe",
      },
      {
        id: "DEL-0004",
        phone: "+919825773193",
        date: "2025-03-10",
        token: "0002",
        total: 240,
        status: "out_for_delivery",
        deliveryMan: "Jane Smith",
      },
    ],
    delivered: [
      {
        id: "DEL-0001",
        phone: "+919825773194",
        date: "2025-03-10",
        token: "0003",
        total: 480,
        status: "delivered",
        deliveryMan: "John Doe",
      },
      {
        id: "DEL-0002",
        phone: "+919825773195",
        date: "2025-03-10",
        token: "0004",
        total: 320,
        status: "delivered",
        deliveryMan: "Jane Smith",
      },
    ],
  }

  // Mock data for delivery personnel
  const deliveryPersonnel = [
    { id: 1, name: "John Doe", phone: "+919876543210", status: "available" },
    { id: 2, name: "Jane Smith", phone: "+919876543211", status: "busy" },
    { id: 3, name: "Mike Johnson", phone: "+919876543212", status: "available" },
    { id: 4, name: "Sarah Williams", phone: "+919876543213", status: "offline" },
  ]

  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState("")

  const handleAssignDelivery = (deliveryId) => {
    // In a real app, this would make an API call to assign the delivery
    console.log(`Assigning delivery ${deliveryId} to ${selectedDeliveryPerson}`)
    alert(`Delivery ${deliveryId} assigned to ${selectedDeliveryPerson}`)
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="deliveries-container">
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
                      <strong>Phone:</strong> {delivery.phone}
                    </p>
                    <p>
                      <strong>Date:</strong> {delivery.date}
                    </p>
                    <p>
                      <strong>Token:</strong> {delivery.token}
                    </p>
                    <p>
                      <strong>Total:</strong> ₹{delivery.total}
                    </p>
                  </div>
                  <div className="delivery-assign">
                    <select
                      value={selectedDeliveryPerson}
                      onChange={(e) => setSelectedDeliveryPerson(e.target.value)}
                      className="delivery-person-select"
                    >
                      <option value="">Select Delivery Person</option>
                      {deliveryPersonnel
                        .filter((person) => person.status === "available")
                        .map((person) => (
                          <option key={person.id} value={person.name}>
                            {person.name} ({person.phone})
                          </option>
                        ))}
                    </select>
                    <button
                      className="assign-btn"
                      onClick={() => handleAssignDelivery(delivery.id)}
                      disabled={!selectedDeliveryPerson}
                    >
                      Assign Delivery
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="delivery-section">
            <h2>Out for Delivery</h2>
            <div className="delivery-cards">
              {deliveries.out_for_delivery.map((delivery) => (
                <div className="delivery-card" key={delivery.id}>
                  <div className="delivery-header">
                    <h3>{delivery.id}</h3>
                    <span className="delivery-status out-for-delivery">Out for Delivery</span>
                  </div>
                  <div className="delivery-details">
                    <p>
                      <strong>Phone:</strong> {delivery.phone}
                    </p>
                    <p>
                      <strong>Date:</strong> {delivery.date}
                    </p>
                    <p>
                      <strong>Token:</strong> {delivery.token}
                    </p>
                    <p>
                      <strong>Total:</strong> ₹{delivery.total}
                    </p>
                    <p>
                      <strong>Delivery Person:</strong> {delivery.deliveryMan}
                    </p>
                  </div>
                  <div className="delivery-actions">
                    <button className="action-btn delivered">Mark as Delivered</button>
                    <button className="action-btn reassign">Reassign</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="delivery-section">
            <h2>Delivered</h2>
            <div className="delivery-cards">
              {deliveries.delivered.map((delivery) => (
                <div className="delivery-card" key={delivery.id}>
                  <div className="delivery-header">
                    <h3>{delivery.id}</h3>
                    <span className="delivery-status delivered">Delivered</span>
                  </div>
                  <div className="delivery-details">
                    <p>
                      <strong>Phone:</strong> {delivery.phone}
                    </p>
                    <p>
                      <strong>Date:</strong> {delivery.date}
                    </p>
                    <p>
                      <strong>Token:</strong> {delivery.token}
                    </p>
                    <p>
                      <strong>Total:</strong> ₹{delivery.total}
                    </p>
                    <p>
                      <strong>Delivery Person:</strong> {delivery.deliveryMan}
                    </p>
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

export default Deliveries
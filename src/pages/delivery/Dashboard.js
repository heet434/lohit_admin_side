"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { authActions } from "../../store/slices/authSlice"
import axios from "axios"
import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"
import "../../styles/Delivery.css"

const formatTime = (time) => {
  // time is in format 23:33:49.306790
  // should return 11:33 PM
  let hours = parseInt(time.slice(0, 2))
  const minutes = time.slice(3, 5)
  let period = "AM"
  if (hours > 12) {
    period = "PM"
  }
  if (hours === 0) {
    hours = 12
  }
  if (hours > 12) {
    hours -= 12
  }
  return `${hours}:${minutes} ${period}`
}

const DeliveryDashboard = () => {

  const [activeTab, setActiveTab] = useState("all")
  const [deliveries, setDeliveries] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  const token = useSelector((state) => state.auth.token)
  const deliverymanId = useSelector((state) => state.auth.deliverymanId)
  const deliverymanName = useSelector((state) => state.auth.name)


  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }


  useEffect(() => {
    const deliveriesSocketUrl = `${process.env.REACT_APP_WEBSOCKET_URL}/deliveryman/${deliverymanId}/` || `ws://localhost:8000/ws/deliveryman/${deliverymanId}/`
    const deliveriesSocket = new WebSocket(deliveriesSocketUrl)

    deliveriesSocket.onopen = () => {
      console.log("Connected to deliveries socket")
    }

    deliveriesSocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log(data)
      if (data.type === "initial_orders"){
        // calculate total for each order using each item in items and add it as a field
        const orders = data.orders.map((order) => {
          const total = order.items.reduce((acc, item) => acc + parseFloat(item.item_price) * parseInt(item.quantity), 0)
          console.log(total)
          return { ...order, total }
        })

        setDeliveries(orders)
        
      } else if (data.type === "order_update"){
        
        // check if order exists already, if it exists update that order else add new order
        const updatedDeliveries = deliveries.map((order) => {
          if (order.id === data.order.id){
            // calculate total and update the order
            const total = data.order.items.reduce((acc, item) => acc + item.item_price * item.quantity, 0)
            return { ...data.order, total }
          }
          return order
        })
        
        setDeliveries(updatedDeliveries)
      }}

    deliveriesSocket.onclose = () => {
      console.log("Disconnected from deliveries socket")
    }

    return () => {
      deliveriesSocket.close()
    }
  }, [deliverymanId])

  const markDelivered = (orderId) => {
    axios.put(`orders/${orderId}/update-status/`, { status: "delivered" }, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
      .then((response) => {
        console.log(response)
        const updatedDeliveries = deliveries.map((order) => {
          if (order.id === orderId) {
            return { ...order, status: "delivered" }
          }
          return order
        })
        setDeliveries(updatedDeliveries)
        alert(`Order ${orderId} marked as delivered`)
      })
      .catch((error) => {
        console.error(error)
        alert(`Failed to mark order ${orderId} as delivered`)
      })
    }

  const displayNextStatus = (order) => {
    if(!order) return <button className="action-btn pending" disabled>
      Pending
    </button>
    const currentStatus = order.status
      if (currentStatus === "out_for_delivery") return (
      <button className="action-btn pending" onClick={() => markDelivered(order.id)}>
        Mark Delivered
      </button>)
      else if (currentStatus === "delivered") return (
      <button className="action-btn completed" disabled>
        Delivered
      </button>
      )

    return (
      <button className="action-btn pending" disabled>
        Pending
      </button>
    )
  }

  const filteredDeliveries = deliveries.filter(
    (delivery) => {
      const status = delivery.status
      const search = searchQuery.toLowerCase()
      return (
        (activeTab === "all" || status.toLowerCase() === activeTab.toLowerCase()) &&
        (status.toLowerCase().includes(search) ||
          delivery.phone_number?.includes(search) ||
          delivery.address.toLowerCase().includes(search) ||
          delivery.token_number.toLowerCase().includes(search)
        )
      )
    }
  )

  return (
    <div className="app-container">
    <Sidebar />
    <div className="main-content">
      <Header title="Orders" searchQuery={searchQuery} handleSearch={handleSearch} />
      <div className="orders-container">
        <div className="order-tabs">
          {["all", "out_for_delivery", "delivered"].map((type) => (
            <button
              key={type}
              className={`tab-btn ${activeTab === type ? "active" : ""}`}
              onClick={() => setActiveTab(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="order-section">
          <h2>Deliveries</h2>
          <div className="order-cards">
            {filteredDeliveries.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-header">
                  <h3>Order #{order.id}</h3>
                </div>
                <div className="order-details">
                  <p><strong>Phone:</strong> {order.phone_number}</p>
                  <p><strong>Date:</strong> {new Date(order.date).toDateString()}</p>
                  <p><strong>Time:</strong> {formatTime(order.time)}</p>
                  <p><strong>Token:</strong> {order.token_number}</p>
                  <p><strong>Total:</strong> ₹{order.total}</p>
                  <p><strong>Address:</strong> {order.address}</p>
                </div>
                <div className="order-items">
                  <h4>Items:</h4>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.item_name} ({item.quantity}x) - ₹{item.item_price}  
                        [{item.item_veg_nonveg_egg}]
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="order-actions">
                  {displayNextStatus(order)}
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
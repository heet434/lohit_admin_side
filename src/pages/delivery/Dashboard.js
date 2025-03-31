"use client"

import { useState, useEffect, use } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ThreeDots } from "react-loader-spinner"
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

  const dispatch = useDispatch()

  const [activeTab, setActiveTab] = useState("all")
  const [deliveries, setDeliveries] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  const token = useSelector((state) => state.auth.token)
  const deliverymanId = useSelector((state) => state.auth.deliverymanId)
  const deliverymanName = useSelector((state) => state.auth.name)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }

  // fetch deliveries from API
  useEffect(() => {
    axios.get("deliveryman/orders/", {
      headers: {
        Authorization: `Token ${token}`
      }
    }).then((response) => {
      const orders = response.data?.orders?.map((order) => {
        const total = order.items.reduce((acc, item) => acc + parseFloat(item.item_price) * parseInt(item.quantity), 0)
        return { ...order, total }
      }
      )
      setDeliveries(orders)
      setLoading(false)
    }).catch((error) => {
      console.error(error)
      setError("Failed to fetch deliveries")
      setLoading(false)
      if(error.response?.status === 401) {
        alert("Unauthorized. Please login again.")
        dispatch(authActions.logout())
      }
    })
  }, [token])

  useEffect(() => {
    const deliveriesSocketUrl = `${process.env.REACT_APP_WEBSOCKET_URL}/deliveryman/${deliverymanId}/` || `ws://localhost:8000/ws/deliveryman/${deliverymanId}/`
    const deliveriesSocket = new WebSocket(deliveriesSocketUrl)

    deliveriesSocket.onopen = () => {
      console.log("Connected to deliveries socket")
    }

    deliveriesSocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      // if (data.type === "initial_orders"){
      //   // calculate total for each order using each item in items and add it as a field
      //   const orders = data.orders.map((order) => {
      //     const total = order.items.reduce((acc, item) => acc + parseFloat(item.item_price) * parseInt(item.quantity), 0)
      //     console.log(total)
      //     return { ...order, total }
      //   })

      //   setDeliveries(orders)
        
      // } else if (data.type === "order_update"){
        
        // check if order exists already, if it exists update that order else add new order
      if (data.type === "order_update") {
        // check if order exists already, if it exists update that order else add new order
        const orderDetails = data.order_details
        const total = orderDetails.items.reduce((acc, item) => acc + parseFloat(item.item_price) * parseInt(item.quantity), 0)
        const newOrder = { ...orderDetails, total }
        const existingOrderIndex = deliveries.findIndex(order => order.id === newOrder.id)
        if (existingOrderIndex !== -1) {
          const updatedDeliveries = [...deliveries]
          updatedDeliveries[existingOrderIndex] = newOrder
          setDeliveries(updatedDeliveries)
        } else {
          setDeliveries(prevDeliveries => [...prevDeliveries, newOrder])
        }
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

  // sort orders first by date and then by token number
  filteredDeliveries.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    if (dateA.getTime() === dateB.getTime()) {
      return a.token_number - b.token_number
    }
    return dateB - dateA
  })
  // sort orders by date and then by token number
  

  return (
    <div className="app-container">
    <Sidebar />
    {loading ? 
    <div className="loading-container-main">
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="black"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
    </div> : error ?
    <div className="error-container-main">
      <p><strong>Error:</strong> {error}</p>
    </div> :
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
  }
  </div>
  )
}

export default DeliveryDashboard
"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"
import "../../styles/Admin.css"

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

const Orders = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [orders, setOrders] = useState([])
  const [deliveryMen, setDeliveryMen] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
    // console.log("Search query: ", event.target.value)
  }

  const user = JSON.parse(localStorage.getItem("user"))

  // fetch deliveryMen
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) return

    const user = JSON.parse(storedUser)
    if (!user.token) return

    // axios.get("admin/orders/", {
    //     headers: { Authorization: `Token ${user.token}` },
    //   })
    //   .then((response) => {
    //     const sortedOrders = response.data.sort((a, b) => b.token_number - a.token_number)
    //     console.log(sortedOrders)
    //     setOrders(sortedOrders)
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching orders:", error)
    //   })

    axios.get("admin/deliverymen/",
        { headers: { Authorization: `Token ${user.token}` } }
      )
      .then(response => {
        console.log("Delivery Men: ", response.data)
        setDeliveryMen(response.data)
      })
      .catch(error => {
        console.error("Error fetching deliverymen: ", error)
      }
    )
    
  }, [])

  // get orders using WebSockets
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/orders/admin/")
    ws.onopen = () => {
      console.log("Connected to orders websocket")
    }
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === "initial_orders") {
        // sort orders by token number
        const sortedOrders = data.orders?.sort((a, b) => {
          const dateA = new Date(a.date)
          const dateB = new Date(b.date)
          if (dateA < dateB) {
            return 1
          } else if (dateA > dateB) {
            return -1
          } else {
            return b.token_number - a.token_number
          }
        })
        setOrders(sortedOrders)
        console.log("Initial orders: ", data.orders)
      } else if (data.type === "order_update") {
        setOrders((prevOrders) => {
          const existingOrder = prevOrders.find((order) => order.id === data.order.id)
          let updatedOrders;
          if (existingOrder) {
            updatedOrders = prevOrders.map((order) =>
              order.id === data.order.id ? data.order : order
            )
          } else {
            updatedOrders = [data.order, ...prevOrders]
          }
          return updatedOrders.sort((a, b) => b.token_number - a.token_number)
        })
      }      
    }
    return () => {
      ws.close()
    }
  }, [])

  // const handleAssignDelivery = (order, delivery_man_id) => {
  //   console.log(delivery_man_id)
  //   axios.patch(
  //   '/orders/' + order.id + '/assign-deliveryman/',
  //   { delivery_man : delivery_man_id },
  //   { headers: { Authorization: `Token ${user.token}` } }
  //   )
  //   .then(response => {
  //     console.log(
  //       "Delivery person assigned to order: ",
  //       response.data
  //     )
      
  //     const updatedOrders = orders.map((o) => {
  //       if (o.id === order.id) {
  //         return { ...o, delivery_man_details: response.data.delivery_man_details }
  //       }
  //       return o
  //     })
  //     setOrders(updatedOrders)
  //     console.log("Updated orders: ", updatedOrders)
  //   }).catch(error => {
  //     console.error("Error assigning delivery person: ", error)
  //   })
  // }

  const handleSelectDelivery = (order, deliveryManId) => {

    // find delivery man with deliveryManId
    // console.log(deliveryMen)
    const delivery = deliveryMen.find((d) => d.id === parseInt(deliveryManId))
    console.log(delivery)
    if (!delivery) {
      console.log(`Delivery Man with id ${deliveryManId} not found`)
      return
    }
    const delivery_man_details = {
      id: delivery.id,
      name: delivery.name,
      is_available: delivery.is_available,
      phone_number: delivery.phone_number,
      vehicle_number: delivery.vehicle_number,
    }

    // update order with delivery_man_details
    const updatedOrders = orders.map((o) => {
      if (o.id === order.id) {
        return { ...o, delivery_man_details: delivery_man_details }
      }
      return o
    })
    console.log("Updated orders: ", updatedOrders)
    setOrders(updatedOrders)
  }

  const handleAssignDelivery = (order) => {
    axios.put('orders/' + order.id + '/assign-deliveryman/',
      {
        delivery_man: order.delivery_man_details?.id
      },
      { headers: { Authorization: `Token ${user.token}` } }
    )
    .then(response => {
      axios.put('orders/' + order.id + '/update-status/', 
        { status: "out_for_delivery" },
        { headers: { Authorization: `Token ${user.token}` } }
      ).then(response => {
        console.log("Order status updated: ", response.data)
        console.log("Delivery person assigned to order: ", response.data)
      // update order status
        const updatedOrders = orders.map((o) => {
        if (o.id === order.id) {
          return { ...o, status: "out_for_delivery" }
        }
        return o
        })
        setOrders(updatedOrders)
        alert("Delivery person " + order.delivery_man_details?.name + " assigned to order " + order.id)
      }).catch(error => {
        console.error("Error updating order status: ", error)
      })
    })
    .catch(error => {
      console.error("Error assigning delivery person: ", error)
      alert("Error assigning delivery person")
    })
  }

  const handleConfirm = (order) => {
    let status = "confirmed"
    if (order.mode_of_eating === "delivery") {
      if (order.status === "pending") {
        status = "confirmed"
      }else if (order.status === "confirmed") {
        if (!order.assignedDeliveryMan){
          alert("Please assign a delivery person to this order")
          return
        }
        status = "out_for_delivery"
      }else if (order.status === "out_for_delivery") {
        status = "delivered"
      }
    }else {
      if (order.status === "pending") {
        status = "confirmed"
      }else if (order.status === "confirmed") {
        status = "ready"
      }else if (order.status === "ready") {
        status = "completed"
      }
    }
    axios.put('orders/' + order.id + '/update-status/', 
      { status: status },
      { headers: { Authorization: `Token ${user.token}` } }
    )
    .then(response => {
      console.log("Order status updated: ", response.data)
      const updatedOrders = orders.map((o) => {
        if (o.id === order.id) {
          return { ...o, status: status }
        }
        return o
      })
      setOrders(updatedOrders)
    })
    .catch(error => {
      console.error("Error updating order status: ", error)
    })
  }

  // const handleCancel = (order) => {
  //   axios.put("orders/" + order.id + "/cancel/",
  //     {},
  //     { headers: { Authorization: `Token ${user.token}` } }
  //   )
  //   .then(response => {
  //     console.log("Order cancelled: ", response.data)
  //     const updatedOrders = orders.filter((o) => o.id !== order.id)
  //     setOrders(updatedOrders)
  //   })
  //   .catch(error => {
  //     console.error("Error cancelling order: ", error)
  //   })
  // }



  const displayNextStatus = (order) => {
    if(!order) return "Pending"
    const currentStatus = order.status
    const mode = (order.mode_of_eating).toLowerCase()
    if (mode === "dine-in" || mode === "take-away") {
      if (currentStatus === "pending") return "Confirm"
      if (currentStatus === "confirmed") return "Mark Ready"
      if (currentStatus === "ready") return "Mark Completed"
      if (currentStatus === "completed") return "Completed"
      
    }else if (mode === "delivery") {
      if (currentStatus === "pending") return "Confirm"
      if (currentStatus === "confirmed") return "Assign Delivery"
      if (currentStatus === "out_for_delivery") return "Mark Delivered"
      if (currentStatus === "delivered") return "Delivered"
    }
    return currentStatus
  }

  // Filter orders based on active tab and search query
  const filteredOrders = orders.filter(
    // (order) => activeTab === "all" || order.mode_of_eating === activeTab
    (order) => {
      const mode = order.mode_of_eating
      const status = order.status
      const search = searchQuery.toLowerCase()
      return (
        (activeTab === "all" || mode === activeTab) &&
        (status.toLowerCase().includes(search) ||
          mode.toLowerCase().includes(search) ||
          order.phone_number?.includes(search))
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
            {["all", "dine-in", "take-away", "delivery"].map((type) => (
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
            <h2>Orders</h2>
            <div className="order-cards">
              {filteredOrders.map((order) => (
                <div className="order-card" key={order.id}>
                  <div className="order-header">
                    <h3>Order #{order.id}</h3>
                    <span className={`order-type ${order.mode_of_eating}`}>
                      {order.mode_of_eating}
                    </span>
                  </div>
                  <div className="order-details">
                    <p><strong>Phone:</strong> {order.phone_number}</p>
                    <p><strong>Date:</strong> {new Date(order.date).toDateString()}</p>
                    <p><strong>Time:</strong> {formatTime(order.time)}</p>
                    <p><strong>Token:</strong> {order.token_number}</p>
                    <p><strong>Total:</strong> ₹{order.total_price}</p>
                    { (order.mode_of_eating).toLowerCase() === "delivery" &&
                    order.address && <p><strong>Address:</strong> {order.address}</p>
                    }{ (order.mode_of_eating).toLowerCase() === "delivery" &&
                    <p><strong>Delivery Man:</strong> {order.delivery_man_details?.name || "Not Assigned"}</p>
                    }
                  </div>
                  <div className="order-items">
                    <h4>Items:</h4>
                    <ul>
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.item_name} ({item.quantity}x) - ₹{item.item_price}  
                          [{item.veg_nonveg_egg}]
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="order-actions">
                    { (order.status).toLowerCase() === "confirmed" && (order.mode_of_eating).toLowerCase() === "delivery" && (
                      // display a dropdown to select delivery
                      <select className="delivery-person-select" onChange={(e) => handleSelectDelivery(order, e.target.value)}>
                        <option value="">Select Delivery Person</option>
                        {deliveryMen.map((person) => (
                          <option key={person.id} value={person.id}>
                            {person.name}
                          </option>
                        ))}
                      </select>
                    )}
                    {/* {(order.status).toLowerCase() === "confirmed" && (order.mode_of_eating).toLowerCase() === "delivery" && (
                      <button className="action-btn confirm" onClick={() => handleAssignDelivery(order)}>Assign Delivery</button>
                    )} */}

                    {(order.status).toLowerCase() !== "delivered" && (order.status).toLowerCase() !== "completed" && (
                      ((order.status).toLowerCase() === "confirmed" && (order.mode_of_eating).toLowerCase() === "delivery") ?
                        <button className="action-btn confirm" onClick={() => handleAssignDelivery(order)}>Assign Delivery</button> :
                        <button className="action-btn confirm" onClick= {() => handleConfirm(order)}>{displayNextStatus(order)}</button>
                      )
                    }
                    {(order.status).toLowerCase() === "pending" && (
                    <button className="action-btn cancel">Cancel</button>
                    )}
                    {((order.status).toLowerCase() === "delivered" || (order.status).toLowerCase() === "completed") && (
                      // add an unclickable button that shows the status
                      <button className="action-btn completed" disabled>{displayNextStatus(order)}</button>
                    )}
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
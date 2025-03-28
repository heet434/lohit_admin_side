import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { authActions } from "../../store/slices/authSlice"
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

const Dashboard = () => {
  const [orders, setOrders] = useState([])
  const [revenue, setRevenue] = useState(0)
  const [noOfCustomers, setNoOfCustomers] = useState(0)
  const [noOfDeliveries, setNoOfDeliveries] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [stats, setStats] = useState(null)

  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }

  const token = useSelector(state => state.auth.token)

  

  useEffect(() => {
      axios.get("admin/stats/",
        {
          headers: { Authorization: `Token ${token}` }
        })
        .then(response => {
          setStats(response.data)
        })
        .catch(error => {
          console.log("Error fetching stats: ", error)
        })
  }, [token])

// websocket connection for orders
  useEffect(() => {
    const ordersWsURL = `${process.env.REACT_APP_WEBSOCKET_URL}/orders/admin/` || "ws://localhost:8000/ws/orders/admin/"
    const ws = new WebSocket(ordersWsURL)
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
        // calculate total price for each order using items
        sortedOrders.forEach((order) => {
          order.total_price = order.items.reduce((total, item) => {
            return total + item.quantity * item.item_price
          }, 0)
        })
        setOrders(sortedOrders)
      } else if (data.type === "order_update") {
        setOrders((prevOrders) => {
          const existingOrder = prevOrders.find((order) => order.id === data.order_details?.id)
          let updatedOrders;
          if (existingOrder) {
            updatedOrders = prevOrders.map((order) =>
              order.id === data.order_details?.id ? data.order_details : order
            )
          } else {

            // add total price to new order
            data.order_details.total_price = data.order_details.items.reduce((total, item) => {
              return total + item.quantity * item.item_price
            }, 0)

            updatedOrders = [data.order_details, ...prevOrders]
          }
          return updatedOrders.sort((a, b) => {
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
        })
      }      
    }
    ws.onclose = () => {
      console.log("Disconnected from orders websocket")
    }
    ws.onerror = (error) => {
      console.error("WebSocket error: ", error)
    }
    return () => {
      ws.close()
    }
  }, [])

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header searchQuery={searchQuery} handleSearch={handleSearch} title="Lohit Canteen Admin" />
        <div className="dashboard-container">
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon orders-icon">🛒</div>
              <div className="stat-details">
                <h3>Total Orders this week</h3>
                <p className="stat-value">{stats?.weekly_stats?.order_count}</p>
                {/* <p className="stat-change positive">+12% from last week</p> */}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon revenue-icon">💰</div>
              <div className="stat-details">
                <h3>Revenue this week</h3>
                <p className="stat-value">₹{stats?.weekly_stats?.total_revenue}</p>
                {/* <p className="stat-change positive">+8% from last week</p> */}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon customers-icon">👥</div>
              <div className="stat-details">
                <h3>Customers</h3>
                <p className="stat-value">{stats?.overall_stats?.total_unique_customers}</p>
                {/* <p className="stat-change positive">+5% from last week</p> */}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon delivery-icon">🚚</div>
              <div className="stat-details">
                <h3>Deliveries</h3>
                <p className="stat-value">{stats?.overall_stats?.total_successful_deliveries}</p>
                {/* <p className="stat-change negative">-3% from last week</p> */}
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card recent-orders">
              <div className="card-header">
                <h2>Recent Orders</h2>
                {/* <button className="view-all-btn">View All</button> */}
              </div>
              <div className="card-content">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order Token</th>
                      <th>Customer Phone</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>#{order.token_number}</td>
                        <td>{order.phone_number}</td>
                        <td>
                          {order.status === "pending" && <span className="status-badge pending">Pending</span>}
                          {order.status === "out_for_delivery" && <span className="status-badge out-delivery">Out for Delivery</span>}
                          {order.status === "delivered" && <span className="status-badge delivered">Delivered</span>}
                          {order.status === "cancelled" && <span className="status-badge cancelled">Cancelled</span>}
                          {order.status === "completed" && <span className="status-badge delivered">Completed</span>}
                          {order.status === "ready" && <span className="status-badge delivered">Ready</span>}
                        </td>
                        <td>₹{order.total_price}</td>
                        <td>{formatTime(order.time)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* <div className="dashboard-card popular-items">
              <div className="card-header">
                <h2>Popular Items</h2>
                <button className="view-all-btn">View All</button>
              </div>
              <div className="card-content">
                <div className="popular-item">
                  <img src="/placeholder.svg?height=50&width=50" alt="Pizza" className="item-image" />
                  <div className="item-details">
                    <h3>Pizza</h3>
                    <p>120 orders this week</p>
                  </div>
                  <div className="item-stats">
                    <div className="progress-bar">
                      <div className="progress" style={{ width: "85%" }}></div>
                    </div>
                    <p>85%</p>
                  </div>
                </div>

                <div className="popular-item">
                  <img src="/placeholder.svg?height=50&width=50" alt="Chicken Biryani" className="item-image" />
                  <div className="item-details">
                    <h3>Chicken Biryani</h3>
                    <p>95 orders this week</p>
                  </div>
                  <div className="item-stats">
                    <div className="progress-bar">
                      <div className="progress" style={{ width: "70%" }}></div>
                    </div>
                    <p>70%</p>
                  </div>
                </div>

                <div className="popular-item">
                  <img src="/placeholder.svg?height=50&width=50" alt="Shawarma" className="item-image" />
                  <div className="item-details">
                    <h3>Shawarma</h3>
                    <p>78 orders this week</p>
                  </div>
                  <div className="item-stats">
                    <div className="progress-bar">
                      <div className="progress" style={{ width: "65%" }}></div>
                    </div>
                    <p>65%</p>
                  </div>
                </div>

                <div className="popular-item">
                  <img src="/placeholder.svg?height=50&width=50" alt="Sandwich" className="item-image" />
                  <div className="item-details">
                    <h3>Sandwich</h3>
                    <p>62 orders this week</p>
                  </div>
                  <div className="item-stats">
                    <div className="progress-bar">
                      <div className="progress" style={{ width: "55%" }}></div>
                    </div>
                    <p>55%</p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
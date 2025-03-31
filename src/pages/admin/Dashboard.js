import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { ThreeDots } from "react-loader-spinner"
import axios from "axios"
import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"
import { authActions } from "../../store/slices/authSlice"
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

  const dispatch = useDispatch()

  const [orders, setOrders] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [stats, setStats] = useState(null)
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [loadingStats, setLoadingStats] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

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
          setLoadingStats(false)
        })
        .catch(error => {
          console.log("Error fetching stats: ", error)
          setLoadingStats(false)
          // if error is for invalid token, log user out and give alert
          if (error.response.status === 401) {
            alert("Session expired. Please login again.")
            dispatch(authActions.logout())
          } else {
            setErrorMessage("Error fetching stats")
          }
        })
  }, [token])

  // fetch orders from API
  useEffect(() => {
      axios.get("admin/orders/",
        {
          headers: { Authorization: `Token ${token}` }
        })
      .then(response => {
        const sortedOrders = response.data?.sort((a, b) => {
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
        setLoadingOrders(false)
      })
      .catch(error => {
        // handle error
        console.log("Error fetching orders: ", error)
        setLoadingOrders(false)
        setErrorMessage("Error fetching orders")
        if (error.response.status === 401) {
          dispatch(authActions.logout())
          setErrorMessage("Session expired. Please login again.")
        } else {
          setErrorMessage("Error fetching stats")
        }
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

      // if (data.type === "initial_orders") {
      //   // sort orders by token number
      //   const sortedOrders = data.orders?.sort((a, b) => {
      //     const dateA = new Date(a.date)
      //     const dateB = new Date(b.date)
      //     if (dateA < dateB) {
      //       return 1
      //     } else if (dateA > dateB) {
      //       return -1
      //     } else {
      //       return b.token_number - a.token_number
      //     }
      //   })
      //   // calculate total price for each order using items
      //   sortedOrders.forEach((order) => {
      //     order.total_price = order.items.reduce((total, item) => {
      //       return total + item.quantity * item.item_price
      //     }, 0)
      //   })
      //   setOrders(sortedOrders)
      //   //setLoadingOrders(false)
      // } else if (data.type === "order_update") {
      if (data.type === "order_update") {
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
          {loadingStats ? 
          <div className="stats-loading-container">
            <ThreeDots
              height="80"
              width="80"
              color="black"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={true}
            />
          </div> :
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
          </div>}

          <div className="dashboard-grid">
            {loadingOrders ?
            <div className="orders-loading-container">
              <ThreeDots
                height="80"
                width="80"
                color="black"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
              />
            </div> :
            <div className="dashboard-card recent-orders">
              <div className="card-header">
                <h2>Recent Orders</h2>
                {/* <button className="view-all-btn">View All</button> */}
              </div>
              {errorMessage ? <div className="error-message">{errorMessage}</div> :
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
            }
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
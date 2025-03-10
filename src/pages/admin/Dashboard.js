import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"
import "../../styles/Admin.css"

const Dashboard = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-container">
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon orders-icon">🛒</div>
              <div className="stat-details">
                <h3>Total Orders</h3>
                <p className="stat-value">128</p>
                <p className="stat-change positive">+12% from last week</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon revenue-icon">💰</div>
              <div className="stat-details">
                <h3>Revenue</h3>
                <p className="stat-value">₹24,500</p>
                <p className="stat-change positive">+8% from last week</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon customers-icon">👥</div>
              <div className="stat-details">
                <h3>Customers</h3>
                <p className="stat-value">85</p>
                <p className="stat-change positive">+5% from last week</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon delivery-icon">🚚</div>
              <div className="stat-details">
                <h3>Deliveries</h3>
                <p className="stat-value">42</p>
                <p className="stat-change negative">-3% from last week</p>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card recent-orders">
              <div className="card-header">
                <h2>Recent Orders</h2>
                <button className="view-all-btn">View All</button>
              </div>
              <div className="card-content">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#ORD-0025</td>
                      <td>John Doe</td>
                      <td>
                        <span className="status-badge delivered">Delivered</span>
                      </td>
                      <td>₹450</td>
                      <td>10:30 AM</td>
                    </tr>
                    <tr>
                      <td>#ORD-0024</td>
                      <td>Jane Smith</td>
                      <td>
                        <span className="status-badge preparing">Preparing</span>
                      </td>
                      <td>₹320</td>
                      <td>10:15 AM</td>
                    </tr>
                    <tr>
                      <td>#ORD-0023</td>
                      <td>Robert Johnson</td>
                      <td>
                        <span className="status-badge out-delivery">Out for Delivery</span>
                      </td>
                      <td>₹550</td>
                      <td>9:45 AM</td>
                    </tr>
                    <tr>
                      <td>#ORD-0022</td>
                      <td>Emily Davis</td>
                      <td>
                        <span className="status-badge delivered">Delivered</span>
                      </td>
                      <td>₹280</td>
                      <td>9:30 AM</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="dashboard-card popular-items">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
"use client"

import { useState } from "react"
import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"
import "../../styles/Admin.css"

const Menu = () => {
  // Mock data for menu items
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Pizza",
      description: "yum yum",
      price: 12.0,
      category: "Italian",
      prepTime: 20,
      type: "veg",
      available: true,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 2,
      name: "Chicken Biryani",
      description: "yum biryani rice",
      price: 120.0,
      category: "Indian",
      prepTime: 10,
      type: "non_veg",
      available: true,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 3,
      name: "Boiled Egg",
      description: "Healthy",
      price: 10.0,
      category: "Breakfast",
      prepTime: 15,
      type: "egg",
      available: true,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 4,
      name: "Shawarma",
      description: "Garlic mayo is yum. ikr",
      price: 100.0,
      category: "Middle Eastern",
      prepTime: 10,
      type: "non_veg",
      available: true,
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 5,
      name: "Sandwich",
      description: "a vegetable between a bread",
      price: 100.0,
      category: "Snacks",
      prepTime: 15,
      type: "veg",
      available: true,
      image: "/placeholder.svg?height=400&width=400",
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    prepTime: "",
    type: "veg",
    available: true,
    image: "/placeholder.svg?height=300&width=300",
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewItem({
      ...newItem,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleAddItem = (e) => {
    e.preventDefault()

    const newItemWithId = {
      ...newItem,
      id: menuItems.length + 1,
      price: Number.parseFloat(newItem.price),
      prepTime: Number.parseInt(newItem.prepTime),
    }

    setMenuItems([...menuItems, newItemWithId])
    setShowAddForm(false)
    setNewItem({
      name: "",
      description: "",
      price: "",
      category: "",
      prepTime: "",
      type: "veg",
      available: true,
      image: "/placeholder.svg?height=300&width=300",
    })
  }

  const handleDeleteItem = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setMenuItems(menuItems.filter((item) => item.id !== id))
    }
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="menu-container">
          <div className="menu-header">
            <h2>Menu Items</h2>
            <button className="add-menu-btn" onClick={() => setShowAddForm(true)}>
              + Add Menu Item
            </button>
          </div>

          {showAddForm && (
            <div className="add-menu-form-container">
              <div className="add-menu-form">
                <h3>Add New Menu Item</h3>
                <form onSubmit={handleAddItem}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newItem.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={newItem.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="price">Price (₹)</label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={newItem.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="category">Category</label>
                      <input
                        type="text"
                        id="category"
                        name="category"
                        value={newItem.category}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="prepTime">Preparation Time (mins)</label>
                      <input
                        type="number"
                        id="prepTime"
                        name="prepTime"
                        value={newItem.prepTime}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="type">Type</label>
                      <select id="type" name="type" value={newItem.type} onChange={handleInputChange} required>
                        <option value="veg">Vegetarian</option>
                        <option value="non_veg">Non-Vegetarian</option>
                        <option value="egg">Egg</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group checkbox">
                    <input
                      type="checkbox"
                      id="available"
                      name="available"
                      checked={newItem.available}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="available">Available</label>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      Save Item
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="menu-grid">
            {menuItems.map((item) => (
              <div className="menu-card" key={item.id}>
                <div className="menu-image">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} />
                </div>
                <div className="menu-content">
                  <h3>{item.name}</h3>
                  <p className="menu-description">{item.description}</p>
                  <p className="menu-price">₹{item.price.toFixed(2)}</p>
                  <div className="menu-details">
                    <p>
                      <strong>Category:</strong> {item.category}
                    </p>
                    <p>
                      <strong>Avg Time:</strong> {item.prepTime} mins
                    </p>
                    <p>
                      <strong>Type:</strong> {item.type.replace("_", " ")}
                    </p>
                    <p>
                      <strong>Available:</strong> {item.available ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="menu-actions">
                    <button className="edit-btn">✏️</button>
                    <button className="delete-btn" onClick={() => handleDeleteItem(item.id)}>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Menu
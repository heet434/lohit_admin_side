"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"
import "../../styles/Admin.css"

const Menu = () => {
  
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
    // console.log("Search query: ", event.target.value)
  }

  const [menuItems, setMenuItems] = useState([])
  const [foodCategories, setFoodCategories] = useState([])

  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    axios.get("categories/")
      .then((response) => {
        setFoodCategories(response.data)
        console.log("Categories: ", response.data)
      })
      .catch((error) => {
        console.error("Error fetching categories:", error)
      })

    axios.get("menu/")
      .then((response) => {
        setMenuItems(response.data)
        console.log("Menu Items: ", response.data)
      })
      .catch((error) => {
        console.error("Error fetching menu items:", error)
      })
  }, [])




  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({
    item: "",
    description: "",
    price: "",
    category: [],
    avg_time_taken: "",
    veg_nonveg_egg: "veg",
    is_available: true,
    image: "https://placehold.co/300",
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked, options } = e.target;
    
    let newValue;
    if (type === "checkbox") {
      newValue = checked;
    } else if (name === "category") {
      // Handle multiple category selection
      newValue = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);

    } else {
      newValue = value;
    }
  
    setNewItem({
      ...newItem,
      [name]: newValue,
    });
  };
  
  
  

  

  const handleAddItem = (e) => {
    e.preventDefault()

    const newItemWithId = {
      ...newItem,
      // id: menuItems.length + 1,
      price: Number.parseFloat(newItem.price),
      avg_time_taken: Number.parseInt(newItem.avg_time_taken),
    }
    console.log("New Item: ", newItemWithId)
    axios.post("admin/menu/add/", newItemWithId, {
      headers: { Authorization: `Token ${user.token}` },
    })
      .then((response) => {
        console.log("Item added: ", response.data)
        setMenuItems([...menuItems, response.data])
      })
      .catch((error) => {
        console.error("Error adding item:", error)
      })
    
    setShowAddForm(false)
    setNewItem({
      item: "",
      description: "",
      price: "",
      category: [],
      avg_time_taken: "",
      veg_nonveg_egg: "veg",
      is_available: true,
      image: "https://placehold.co/300",
    })}

  // const handleDeleteItem = (id) => {
  //   if (window.confirm("Are you sure you want to delete this item?")) {
  //     setMenuItems(menuItems.filter((item) => item.id !== id))
  //   }
  // }

  const filteredMenuItems = menuItems.filter((item) =>
    item.item?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.join(" ").toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.veg_nonveg_egg?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Menu" searchQuery={searchQuery} handleSearch={handleSearch} />
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
                    <label htmlFor="item">Name</label>
                    <input
                      type="text"
                      id="item"
                      name="item"
                      value={newItem.item}
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
                      <label htmlFor="category">Category ( press ctrl for multiple )</label>
                      {/* <input
                        type="text"
                        id="category"
                        name="category"
                        value={newItem.category}
                        onChange={handleInputChange}
                        required
                      /> */}
                      {/* keep a multiple select dropdown for categories */}
                      <select
                        id="category"
                        name="category"
                        value={newItem.category}
                        onChange={handleInputChange}
                        required
                        multiple
                      >
                        {foodCategories.map((category, index) => (
                          <option key={index} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>

                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="avg_time_taken">Preparation Time (mins)</label>
                      <input
                        type="number"
                        id="avg_time_taken"
                        name="avg_time_taken"
                        value={newItem.avg_time_taken}
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
                      checked={newItem.is_available}
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
            {filteredMenuItems.map((item) => (
              <div className="menu-card" key={item.id}>
                <div className="menu-image">
                  <img src={item.image || "https://placehold.co/300"} alt={item.name} />
                </div>
                <div className="menu-content">
                  <h3>{item.item}</h3>
                  <p className="menu-description">{item.description}</p>
                  {/* slice the price string to first 4 characters */}
                  <p className="menu-price">₹{(item.price).toFixed(2)}</p>
                  <div className="menu-details">
                    <p>
                      {/* category is an array, so join it with a comma inside square brackets */}
                      <strong>Categories:</strong> [{item.category.join(", ")}]
                    </p>
                    <p>
                      <strong>Avg Time:</strong> {item.avg_time_taken} mins
                    </p>
                    <p>
                      <strong>Type:</strong> {item.veg_nonveg_egg}
                    </p>
                    <p>
                      <strong>Available:</strong> {item.available ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="menu-actions">
                    {/* <button className="edit-btn">✏️</button> */}
                    {/* <button className="delete-btn" onClick={() => handleDeleteItem(item.id)}>
                      🗑️
                    </button> */}
                    {/* add a toggle button to change availability */}
                    <button className="toggle-btn" onClick={() => {
                      axios.patch(`admin/menu/${item.id}/`, { is_available: !item.is_available }, {
                        headers: { Authorization: `Token ${user.token}` },
                      })
                        .then((response) => {
                          console.log("Item updated: ", response.data)
                          setMenuItems(menuItems.map((menu) => (menu.id === item.id ? response.data : menu)))
                        })
                        .catch((error) => {
                          console.error("Error updating item:", error)
                        })
                    }
                    }>
                      Available:
                      {item.is_available ? "🟢" : "🔴"}
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
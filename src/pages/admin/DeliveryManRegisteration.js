"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { authActions } from "../../store/slices/authSlice"
import axios from "axios"
import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"
import "../../styles/Admin.css"

const DeliveryManRegistration = () => {

  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)

  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    vehicle_number: "",
    password: "",
    confirm_password: "",
  })

  const [errors, setErrors] = useState({
    password: "",
    confirm_password: "",
  })

  const validatePassword = (password) => {
    const minLength = /.{8,}/
    const upperCase = /[A-Z]/
    const lowerCase = /[a-z]/
    const number = /[0-9]/
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/

    if (!minLength.test(password)) return "Password must be at least 8 characters long."
    if (!upperCase.test(password)) return "Password must contain at least one uppercase letter."
    if (!lowerCase.test(password)) return "Password must contain at least one lowercase letter."
    if (!number.test(password)) return "Password must contain at least one number."
    if (!specialChar.test(password)) return "Password must contain at least one special character."
    
    return ""
  }

  useEffect(() => {
    if (formData.password && formData.confirm_password) {
      if (formData.password !== formData.confirm_password) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirm_password: "Passwords do not match.",
        }))
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirm_password: "",
        }))
      }
    }
  }, [formData.password, formData.confirm_password])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))

    if (name === "password") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: validatePassword(value),
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (errors.password || errors.confirm_password) {
      alert("Please fix the errors before submitting.")
      return
    }

    axios.post("deliveryman/signup/",{
      name: formData.name,
      phone_number: `+91${formData.phone_number}`, // add +91 before phone number
      vehicle_number: formData.vehicle_number,
      password: formData.password,
      password2: formData.confirm_password,
    }).then((res) => {
      setFormData({
        name: "",
        phone_number: "",
        vehicle_number: "",
        password: "",
        confirm_password: "",
      })
      alert("Delivery man registered successfully!")
    }).catch((err) => {
      console.log(err)
      alert("An error occurred. Please try again.")
    })
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="delivery-man-registration-container">
          <h2>Register New Delivery Man</h2>
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="phone_number">Phone Number (10 digits)</label>
              <input type="tel" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="vehicle_number">Vehicle Number</label>
              <input type="text" id="vehicle_number" name="vehicle_number" value={formData.vehicle_number} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="confirm_password">Confirm Password</label>
              <input type="password" id="confirm_password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required />
              {errors.confirm_password && <p className="error-text">{errors.confirm_password}</p>}
            </div>
            <button type="submit" className="submit-btn" disabled={errors.password || errors.confirm_password}>
              Register Delivery Man
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DeliveryManRegistration
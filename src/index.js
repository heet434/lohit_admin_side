import React from "react"
import ReactDOM from "react-dom/client"
import axios from "axios"
import App from "./App"

const BASE_URL = 'http://127.0.0.1:8000/api/';

axios.defaults.baseURL = BASE_URL;

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

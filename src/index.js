import React from "react"
import ReactDOM from "react-dom/client"
import axios from "axios"
import App from "./App"
import { Provider } from "react-redux"
import { persistor, store } from "./store"
import { PersistGate } from "redux-persist/integration/react"

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/` || "http://localhost:8000/api/"

axios.defaults.baseURL = BASE_URL;

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
    </Provider>
  </React.StrictMode>,
)

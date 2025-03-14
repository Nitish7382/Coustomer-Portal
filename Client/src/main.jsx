import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import axios from "axios"

// Set base URL for axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000"

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user")
    if (user) {
      const { token } = JSON.parse(user)
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


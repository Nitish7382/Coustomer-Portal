"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await axios.post("/api/auth/login", { email, password })

      setUser(response.data)
      localStorage.setItem("user", JSON.stringify(response.data))

      // Redirect based on role
      if (response.data.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/")
      }

      toast.success("Login successful")
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Register user
  const register = async (name, email, password) => {
    try {
      setLoading(true)
      const response = await axios.post("/api/auth/register", { name, email, password })

      setUser(response.data)
      localStorage.setItem("user", JSON.stringify(response.data))

      navigate("/")
      toast.success("Registration successful")
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout user
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    navigate("/login")
    toast.success("Logged out successfully")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext


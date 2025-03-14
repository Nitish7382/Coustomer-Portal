"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function ProtectedRoute({ children, role }) {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to={role === "admin" ? "/admin/login" : "/login"} />
  }

  // Check if user has the required role
  if (role && user.role !== role) {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute


"use client"

import { Navigate, Outlet } from "react-router-dom"
import { useContext } from "react"
import AuthContext from "../context/AuthContext"
import Spinner from "./Spinner"

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext)

  if (loading) {
    return <Spinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" />
}

export default AdminRoute


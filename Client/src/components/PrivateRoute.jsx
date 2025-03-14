"use client"

import { Navigate, Outlet } from "react-router-dom"
import { useContext } from "react"
import AuthContext from "../context/AuthContext"
import Spinner from "./Spinner"

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext)

  if (loading) {
    return <Spinner />
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute


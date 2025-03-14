"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AdminHeader from "../../components/admin/AdminHeader"
import AdminSidebar from "../../components/admin/AdminSidebar"
import api from "../../utils/api"
import toast from "react-hot-toast"

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingUpdates: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/admin/dashboard")
        setStats(response.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="flex gap-2">
              <Link
                to="/admin/customers/new"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Add Customer
              </Link>
              <Link
                to="/admin/projects/new"
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary hover:bg-primary-dark"
              >
                New Project
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Customers</h3>
              <div className="text-3xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-gray-500 mt-1">+2 from last month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Active Projects</h3>
              <div className="text-3xl font-bold">{stats.activeProjects}</div>
              <p className="text-xs text-gray-500 mt-1">+3 from last month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Completed Projects</h3>
              <div className="text-3xl font-bold">{stats.completedProjects}</div>
              <p className="text-xs text-gray-500 mt-1">+5 from last month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Pending Updates</h3>
              <div className="text-3xl font-bold">{stats.pendingUpdates}</div>
              <p className="text-xs text-gray-500 mt-1">-2 from last week</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button className="border-primary text-primary border-b-2 py-4 px-6 text-sm font-medium">
                  Overview
                </button>
                <button className="text-gray-500 hover:text-gray-700 py-4 px-6 text-sm font-medium">Customers</button>
                <button className="text-gray-500 hover:text-gray-700 py-4 px-6 text-sm font-medium">Projects</button>
                <button className="text-gray-500 hover:text-gray-700 py-4 px-6 text-sm font-medium">
                  Recent Updates
                </button>
              </nav>
            </div>

            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="md:col-span-2 lg:col-span-4">
                  <h3 className="text-lg font-medium mb-4">Project Progress Overview</h3>
                  <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Bar chart showing monthly progress across all active projects</p>
                  </div>
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <h3 className="text-lg font-medium mb-4">Project Distribution</h3>
                  <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Pie chart showing distribution by project type and status</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard


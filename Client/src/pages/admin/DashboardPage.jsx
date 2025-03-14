"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import AdminLayout from "../../components/layouts/AdminLayout"
import Spinner from "../../components/Spinner"

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0,
  })
  const [recentProjects, setRecentProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get all customers
        const customersRes = await axios.get("/api/customers")

        // Get all projects
        const projectsRes = await axios.get("/api/projects")

        const projects = projectsRes.data

        setStats({
          totalCustomers: customersRes.data.length,
          totalProjects: projects.length,
          completedProjects: projects.filter((p) => p.status === "Completed").length,
          inProgressProjects: projects.filter((p) => p.status === "In Progress").length,
        })

        // Get recent projects (last 5)
        setRecentProjects(projects.slice(0, 5))

        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <Spinner />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600">Total Customers</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalCustomers}</p>
          <Link to="/admin/customers" className="text-blue-500 hover:text-blue-700 text-sm mt-2 inline-block">
            View all customers
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600">Total Projects</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalProjects}</p>
          <Link to="/admin/projects" className="text-blue-500 hover:text-blue-700 text-sm mt-2 inline-block">
            View all projects
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600">Completed Projects</h3>
          <p className="text-3xl font-bold mt-2">{stats.completedProjects}</p>
          <div className="text-sm text-gray-500 mt-2">
            {Math.round((stats.completedProjects / stats.totalProjects) * 100) || 0}% completion rate
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600">In Progress Projects</h3>
          <p className="text-3xl font-bold mt-2">{stats.inProgressProjects}</p>
          <div className="text-sm text-gray-500 mt-2">
            {Math.round((stats.inProgressProjects / stats.totalProjects) * 100) || 0}% of total projects
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Recent Projects</h3>
          <Link to="/admin/projects" className="text-blue-500 hover:text-blue-700">
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Project
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Progress
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <tr key={project._id}>
                    <td className="py-4 px-4 border-b border-gray-200">
                      <div className="font-medium text-gray-900">{project.title}</div>
                      <div className="text-sm text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="py-4 px-4 border-b border-gray-200">{project.customer?.name || "N/A"}</td>
                    <td className="py-4 px-4 border-b border-gray-200">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          project.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : project.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 border-b border-gray-200">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{project.progress}%</div>
                    </td>
                    <td className="py-4 px-4 border-b border-gray-200">
                      <Link to={`/admin/projects/${project._id}`} className="text-blue-500 hover:text-blue-700 mr-4">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 px-4 border-b border-gray-200 text-center">
                    No projects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default DashboardPage


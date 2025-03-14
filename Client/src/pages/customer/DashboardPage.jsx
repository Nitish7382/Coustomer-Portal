"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import CustomerLayout from "../../components/layouts/CustomerLayout"
import Spinner from "../../components/Spinner"

const DashboardPage = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/api/projects")
      setProjects(res.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast.error("Failed to fetch projects")
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <CustomerLayout>
        <Spinner />
      </CustomerLayout>
    )
  }

  return (
    <CustomerLayout>
      <h2 className="text-2xl font-semibold mb-6">My Projects</h2>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{project.progress}% Complete</span>
                    <span>{project.status}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      project.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : project.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {project.status}
                  </span>
                  <Link to={`/projects/${project._id}`} className="text-blue-500 hover:text-blue-700 font-medium">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No projects found.</p>
        </div>
      )}
    </CustomerLayout>
  )
}

export default DashboardPage


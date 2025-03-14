"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import CustomerLayout from "../../components/layouts/CustomerLayout"
import Spinner from "../../components/Spinner"

const ProjectDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjectData()
  }, [id])

  const fetchProjectData = async () => {
    try {
      const projectRes = await axios.get(`/api/projects/${id}`)
      setProject(projectRes.data)

      const updatesRes = await axios.get(`/api/updates/project/${id}`)
      setUpdates(updatesRes.data)

      setLoading(false)
    } catch (error) {
      console.error("Error fetching project data:", error)
      toast.error("Failed to fetch project data")
      navigate("/")
    }
  }

  if (loading) {
    return (
      <CustomerLayout>
        <Spinner />
      </CustomerLayout>
    )
  }

  // Data for pie chart
  const chartData = [
    { name: "Completed", value: project.progress },
    { name: "Remaining", value: 100 - project.progress },
  ]
  const COLORS = ["#3B82F6", "#E5E7EB"]

  return (
    <CustomerLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Project Details</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">{project.title}</h3>
            <div className="mb-4">
              <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div>
                <p className="text-sm text-gray-600">Status</p>
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
              </div>
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{project.progress}% Complete</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Timeline</p>
                <p className="text-sm">
                  <span className="font-medium">Start:</span> {new Date(project.startDate).toLocaleDateString()}
                </p>
                {project.estimatedEndDate && (
                  <p className="text-sm">
                    <span className="font-medium">Est. End:</span>{" "}
                    {new Date(project.estimatedEndDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Project Updates</h3>

            {updates.length > 0 ? (
              <div className="space-y-6">
                {updates.map((update) => (
                  <div key={update._id} className="border-b pb-6 last:border-b-0 last:pb-0">
                    <div>
                      <h4 className="font-medium text-lg">{update.title}</h4>
                      <p className="text-sm text-gray-500">{new Date(update.createdAt).toLocaleString()}</p>
                    </div>
                    <p className="mt-2 text-gray-700 whitespace-pre-line">{update.description}</p>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${update.progress}%` }}></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{update.progress}% Complete</div>
                    </div>

                    {update.files && update.files.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-medium mb-2">Attachments</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {update.files.map((file, index) => (
                            <div key={index} className="border rounded-lg overflow-hidden">
                              {file.type === "image" ? (
                                <a href={`/${file.path}`} target="_blank" rel="noopener noreferrer">
                                  <img
                                    src={`/${file.path}`}
                                    alt={file.originalName}
                                    className="w-full h-32 object-cover"
                                  />
                                </a>
                              ) : file.type === "video" ? (
                                <video src={`/${file.path}`} controls className="w-full h-32 object-cover" />
                              ) : (
                                <a
                                  href={`/${file.path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center h-32 bg-gray-100 p-4 text-center"
                                >
                                  <div>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-8 w-8 mx-auto text-gray-400"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                      />
                                    </svg>
                                    <span className="text-xs mt-2 block truncate">{file.originalName}</span>
                                  </div>
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No updates yet for this project.</p>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Progress Chart</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Project Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Updates</p>
                <p className="font-medium text-lg">{updates.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Latest Update</p>
                <p className="font-medium">
                  {updates.length > 0 ? new Date(updates[0].createdAt).toLocaleDateString() : "No updates yet"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Days Since Start</p>
                <p className="font-medium">
                  {Math.ceil((new Date() - new Date(project.startDate)) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
              {project.estimatedEndDate && (
                <div>
                  <p className="text-sm text-gray-600">Estimated Completion</p>
                  <p className="font-medium">{new Date(project.estimatedEndDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}

export default ProjectDetailsPage


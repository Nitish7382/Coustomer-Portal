"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import CustomerHeader from "../../components/customer/CustomerHeader"
import api from "../../utils/api"
import toast from "react-hot-toast"

function CustomerDashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("updates")

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/customer/projects")
        setProjects(response.data)
      } catch (error) {
        console.error("Error fetching projects:", error)
        toast.error("Failed to load projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <CustomerHeader />
      <main className="flex-1 container mx-auto p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Projects</h1>
          <p className="text-gray-500">View and track your ongoing projects</p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading your projects...</div>
        ) : projects.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <h2 className="text-xl font-medium mb-2">No Projects Found</h2>
            <p className="text-gray-500 mb-4">You don't have any active projects at the moment.</p>
            <p className="text-gray-500">Please contact your project manager for more information.</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project._id} className="bg-white shadow rounded-lg mb-8">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-medium">{project.name}</h2>
                    <p className="text-gray-500">Started: {new Date(project.startDate).toLocaleDateString()}</p>
                  </div>
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      project.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : project.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : project.status === "Planning"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Progress</h3>
                    <div className="text-2xl font-bold mb-1">{project.progress}%</div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Estimated Completion</h3>
                    <div className="text-2xl font-bold">{new Date(project.endDate).toLocaleDateString()}</div>
                    <p className="text-xs text-gray-500">
                      {Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Last Update</h3>
                    <div className="text-2xl font-bold">
                      {project.lastUpdate ? new Date(project.lastUpdate.date).toLocaleDateString() : "No updates yet"}
                    </div>
                    <p className="text-xs text-gray-500">
                      {project.lastUpdate ? project.lastUpdate.title : "Check back soon"}
                    </p>
                  </div>
                </div>

                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    <button
                      className={`py-4 px-6 text-sm font-medium ${
                        activeTab === "updates"
                          ? "border-primary text-primary border-b-2"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab("updates")}
                    >
                      Updates
                    </button>
                    <button
                      className={`py-4 px-6 text-sm font-medium ${
                        activeTab === "progress"
                          ? "border-primary text-primary border-b-2"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab("progress")}
                    >
                      Progress
                    </button>
                    <button
                      className={`py-4 px-6 text-sm font-medium ${
                        activeTab === "documents"
                          ? "border-primary text-primary border-b-2"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab("documents")}
                    >
                      Documents
                    </button>
                  </nav>
                </div>

                <div className="py-6">
                  {activeTab === "updates" && (
                    <div className="space-y-6">
                      {project.updates && project.updates.length > 0 ? (
                        project.updates.map((update) => (
                          <div key={update._id} className="border rounded-lg p-6">
                            <div className="flex justify-between mb-2">
                              <h3 className="text-xl font-medium">{update.title}</h3>
                              <span className="text-sm text-gray-500">
                                {new Date(update.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4">{update.description}</p>
                            {update.images && update.images.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {update.images.map((image, index) => (
                                  <img
                                    key={index}
                                    src={image || "/placeholder.svg"}
                                    alt={`Update image ${index + 1}`}
                                    className="rounded-md object-cover aspect-square w-full"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">No updates available yet. Check back soon!</div>
                      )}
                    </div>
                  )}

                  {activeTab === "progress" && (
                    <div className="space-y-6">
                      <div className="flex justify-center">
                        <div className="w-64 h-64 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold">{project.progress}%</span>
                          </div>
                          <svg viewBox="0 0 36 36" className="w-full h-full">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#eee"
                              strokeWidth="3"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#4f46e5"
                              strokeWidth="3"
                              strokeDasharray={`${project.progress}, 100`}
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="space-y-4 mt-8">
                        <h3 className="text-lg font-medium mb-4">Progress By Phase</h3>

                        {project.phases &&
                          project.phases.map((phase, index) => (
                            <div key={index}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">{phase.name}</span>
                                <span className="text-sm font-medium">{phase.progress}%</span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="bg-primary h-full rounded-full"
                                  style={{ width: `${phase.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}

                        {!project.phases && (
                          <div className="text-center py-8 text-gray-500">
                            Project is in {project.status} phase. Detailed progress tracking will be available soon.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "documents" && (
                    <div className="space-y-4">
                      {project.documents && project.documents.length > 0 ? (
                        project.documents.map((doc) => (
                          <div key={doc._id} className="flex items-center justify-between border rounded-lg p-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-gray-100 rounded-md p-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div>
                                <h3 className="font-medium">{doc.name}</h3>
                                <p className="text-sm text-gray-500">
                                  {doc.type.toUpperCase()} • {doc.size} • Uploaded on{" "}
                                  {new Date(doc.uploadedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                              Download
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">No documents available yet.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}

export default CustomerDashboard


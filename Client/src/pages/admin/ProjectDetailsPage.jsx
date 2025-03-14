"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import AdminLayout from "../../components/layouts/AdminLayout"
import Spinner from "../../components/Spinner"

const ProjectDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    progress: 0,
    estimatedEndDate: "",
  })

  useEffect(() => {
    fetchProjectData()
  }, [id])

  const fetchProjectData = async () => {
    try {
      const projectRes = await axios.get(`/api/projects/${id}`)
      setProject(projectRes.data)
      setFormData({
        title: projectRes.data.title,
        description: projectRes.data.description,
        status: projectRes.data.status,
        progress: projectRes.data.progress,
        estimatedEndDate: projectRes.data.estimatedEndDate
          ? new Date(projectRes.data.estimatedEndDate).toISOString().split("T")[0]
          : "",
      })

      const updatesRes = await axios.get(`/api/updates/project/${id}`)
      setUpdates(updatesRes.data)

      setLoading(false)
    } catch (error) {
      console.error("Error fetching project data:", error)
      toast.error("Failed to fetch project data")
      navigate("/admin/projects")
    }
  }

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      await axios.put(`/api/projects/${id}`, formData)
      toast.success("Project updated successfully")
      setEditing(false)
      fetchProjectData()
    } catch (error) {
      console.error("Error updating project:", error)
      toast.error("Failed to update project")
    }
  }

  const handleDeleteUpdate = async (updateId) => {
    if (window.confirm("Are you sure you want to delete this update?")) {
      try {
        await axios.delete(`/api/updates/${updateId}`)
        toast.success("Update deleted successfully")
        fetchProjectData()
      } catch (error) {
        console.error("Error deleting update:", error)
        toast.error("Failed to delete update")
      }
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <Spinner />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Project Details</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
          <Link
            to={`/admin/projects/${id}/update/add`}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Update
          </Link>
          <button
            onClick={() => navigate("/admin/projects")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {editing ? (
              <form onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                      Project Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={onChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={onChange}
                      rows="4"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={onChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="progress">
                      Progress (%)
                    </label>
                    <input
                      type="number"
                      id="progress"
                      name="progress"
                      value={formData.progress}
                      onChange={onChange}
                      min="0"
                      max="100"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estimatedEndDate">
                      Estimated End Date
                    </label>
                    <input
                      type="date"
                      id="estimatedEndDate"
                      name="estimatedEndDate"
                      value={formData.estimatedEndDate}
                      onChange={onChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div>
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
                    {project.actualEndDate && (
                      <p className="text-sm">
                        <span className="font-medium">Actual End:</span>{" "}
                        {new Date(project.actualEndDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Project Updates</h3>
              <Link to={`/admin/projects/${id}/update/add`} className="text-blue-500 hover:text-blue-700">
                Add Update
              </Link>
            </div>

            {updates.length > 0 ? (
              <div className="space-y-6">
                {updates.map((update) => (
                  <div key={update._id} className="border-b pb-6 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-lg">{update.title}</h4>
                        <p className="text-sm text-gray-500">{new Date(update.createdAt).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteUpdate(update._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            {project.customer ? (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{project.customer.name}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{project.customer.email}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-medium">{project.customer.contactNumber}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Building Type</p>
                  <p className="font-medium">{project.customer.buildingType}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{project.customer.address}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Site Location</p>
                  <p className="font-medium">{project.customer.siteLocation}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Square Feet</p>
                  <p className="font-medium">{project.customer.squareFeet}</p>
                </div>
                <Link to={`/admin/customers/${project.customer._id}`} className="text-blue-500 hover:text-blue-700">
                  View Customer Details
                </Link>
              </div>
            ) : (
              <p className="text-gray-500">Customer information not available.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ProjectDetailsPage


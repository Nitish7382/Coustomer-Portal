"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import AdminLayout from "../../components/layouts/AdminLayout"
import Spinner from "../../components/Spinner"

const AddUpdatePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    progress: 0,
  })
  const [files, setFiles] = useState([])

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/api/projects/${id}`)
      setProject(res.data)
      setFormData({
        ...formData,
        progress: res.data.progress,
      })
      setLoading(false)
    } catch (error) {
      console.error("Error fetching project:", error)
      toast.error("Failed to fetch project")
      navigate("/admin/projects")
    }
  }

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onFileChange = (e) => {
    setFiles(e.target.files)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const updateData = new FormData()
      updateData.append("project", id)
      updateData.append("title", formData.title)
      updateData.append("description", formData.description)
      updateData.append("progress", formData.progress)

      // Append files
      for (let i = 0; i < files.length; i++) {
        updateData.append("files", files[i])
      }

      await axios.post("/api/updates", updateData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Update added successfully")
      navigate(`/admin/projects/${id}`)
    } catch (error) {
      console.error("Error adding update:", error)
      toast.error(error.response?.data?.message || "Failed to add update")
    } finally {
      setSubmitting(false)
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
        <h2 className="text-2xl font-semibold">Add Project Update</h2>
        <button
          onClick={() => navigate(`/admin/projects/${id}`)}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Project: {project.title}</h3>
          <p className="text-sm text-gray-600">Current Progress: {project.progress}%</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Update Title
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

            <div>
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="files">
                Upload Files (Images, Documents, Videos)
              </label>
              <input
                type="file"
                id="files"
                name="files"
                onChange={onFileChange}
                multiple
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <p className="text-xs text-gray-500 mt-1">
                Allowed file types: JPEG, PNG, GIF, PDF, DOC, DOCX, MP4, WEBM, MOV
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={submitting}
            >
              {submitting ? "Adding..." : "Add Update"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

export default AddUpdatePage


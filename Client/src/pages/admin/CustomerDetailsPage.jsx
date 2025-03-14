"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import AdminLayout from "../../components/layouts/AdminLayout"
import Spinner from "../../components/Spinner"

const CustomerDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
    squareFeet: "",
    siteLocation: "",
    buildingType: "",
  })

  useEffect(() => {
    fetchCustomerData()
  }, [id])

  const fetchCustomerData = async () => {
    try {
      const customerRes = await axios.get(`/api/customers/${id}`)
      setCustomer(customerRes.data)
      setFormData({
        name: customerRes.data.name,
        email: customerRes.data.email,
        contactNumber: customerRes.data.contactNumber,
        address: customerRes.data.address,
        squareFeet: customerRes.data.squareFeet,
        siteLocation: customerRes.data.siteLocation,
        buildingType: customerRes.data.buildingType,
      })

      const projectsRes = await axios.get(`/api/projects/customer/${id}`)
      setProjects(projectsRes.data)

      setLoading(false)
    } catch (error) {
      console.error("Error fetching customer data:", error)
      toast.error("Failed to fetch customer data")
      navigate("/admin/customers")
    }
  }

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      await axios.put(`/api/customers/${id}`, formData)
      toast.success("Customer updated successfully")
      setEditing(false)
      fetchCustomerData()
    } catch (error) {
      console.error("Error updating customer:", error)
      toast.error("Failed to update customer")
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
        <h2 className="text-2xl font-semibold">Customer Details</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
          <button
            onClick={() => navigate("/admin/customers")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {editing ? (
              <form onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={onChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={onChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactNumber">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={onChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={onChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="squareFeet">
                      Square Feet
                    </label>
                    <input
                      type="number"
                      id="squareFeet"
                      name="squareFeet"
                      value={formData.squareFeet}
                      onChange={onChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="siteLocation">
                      Site Location
                    </label>
                    <input
                      type="text"
                      id="siteLocation"
                      name="siteLocation"
                      value={formData.siteLocation}
                      onChange={onChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="buildingType">
                      Building Type
                    </label>
                    <select
                      id="buildingType"
                      name="buildingType"
                      value={formData.buildingType}
                      onChange={onChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                    </select>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{customer.name}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Contact Number</p>
                    <p className="font-medium">{customer.contactNumber}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Building Type</p>
                    <p className="font-medium">{customer.buildingType}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Property Information</h3>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{customer.address}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Site Location</p>
                    <p className="font-medium">{customer.siteLocation}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Square Feet</p>
                    <p className="font-medium">{customer.squareFeet}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Projects</h3>
              <Link to={`/admin/projects/add?customer=${id}`} className="text-blue-500 hover:text-blue-700">
                Add Project
              </Link>
            </div>
            {projects.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <li key={project._id} className="py-3">
                    <Link
                      to={`/admin/projects/${project._id}`}
                      className="block hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                      <div className="flex justify-between">
                        <p className="font-medium text-gray-900">{project.title}</p>
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
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{project.progress}% Complete</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No projects found for this customer.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default CustomerDetailsPage


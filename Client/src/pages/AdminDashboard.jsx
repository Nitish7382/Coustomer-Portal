import { useState, useEffect } from "react";
import { fetchProjects, addProject } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [customers, setCustomers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    address: "",
    contact: "",
    email: "",
    squareFeet: "",
    siteLocation: "",
    buildingType: "",
  });
  const [newProject, setNewProject] = useState({
    customerName: "",
    status: "Pending",
    description: "",
    image: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  const addCustomer = () => {
    if (newCustomer.name && newCustomer.contact) {
      setCustomers([...customers, newCustomer]);
      setNewCustomer({
        name: "",
        address: "",
        contact: "",
        email: "",
        squareFeet: "",
        siteLocation: "",
        buildingType: "",
      });
    }
  };

  const handleAddProject = async () => {
    alert("added");
    if (newProject.customerName && newProject.description) {
      const project = await addProject(newProject);
      setProjects([...projects, project]);
      setNewProject({
        customerName: "",
        status: "Pending",
        description: "",
        image: null,
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setNewProject({ ...newProject, image: file });
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="p-6 bg-amber-200 min-h-screen text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-blue-600">Admin Panel</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600">Logout</button>
      </div>
      
      {/* Customer Section */}
      <div className="mb-6 p-6 bg-white shadow-xl rounded-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Add New Customer</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(newCustomer).map((key) => (
            <input
              key={key}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={key}
              value={newCustomer[key]}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, [key]: e.target.value })
              }
            />
          ))}
        </div>
        <button
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
          onClick={addCustomer}
        >
          Add Customer
        </button>
      </div>

      {/* Customer List Section */}
      <div className="mb-6 p-6 bg-white shadow-xl rounded-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Customers List</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Site Location</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{customer.name}</td>
                <td className="border border-gray-300 px-4 py-2">{customer.email}</td>
                <td className="border border-gray-300 px-4 py-2">{customer.siteLocation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Project Section */}
      <div className="mb-6 p-6 bg-white shadow-xl rounded-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Create New Project</h2>
        <select
          className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={newProject.customerName}
          onChange={(e) =>
            setNewProject({ ...newProject, customerName: e.target.value })
          }
        >
          <option value="">Select Customer</option>
          {customers.map((customer, index) => (
            <option key={index} value={customer.name}>{customer.name}</option>
          ))}
        </select>
        <textarea
          className="border p-3 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Project Description"
          value={newProject.description}
          onChange={(e) =>
            setNewProject({ ...newProject, description: e.target.value })
          }
        ></textarea>
        <input
          type="file"
          className="border p-3 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleImageUpload}
        />
        <button
          className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
          onClick={handleAddProject}
        >
          Add Project
        </button>
      </div>
    </div>
  );
}
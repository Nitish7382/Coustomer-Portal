import { useState, useEffect } from "react";
import { fetchProjects, addProject } from "../services/api";

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
    alert("added")
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-600">Admin Panel</h1>

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

      {/* Project Section */}
      <div className="mb-6 p-6 bg-white shadow-xl rounded-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Create New Project</h2>
        <input
          className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Customer Name"
          value={newProject.customerName}
          onChange={(e) =>
            setNewProject({ ...newProject, customerName: e.target.value })
          }
        />
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

      {/* Project List */}
      <div className="p-6 bg-white shadow-xl rounded-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Project List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-6 bg-gray-50 border rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-lg font-bold text-gray-700">{proj.name}</h3>
              <p className="text-gray-600">{proj.description}</p>
              {proj.image && (
                <img
                  src={URL.createObjectURL(proj.image)}
                  alt="Project"
                  className="mt-2 w-full h-40 object-cover rounded-lg"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
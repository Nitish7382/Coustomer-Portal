import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { fetchProjects } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CustomerPanel() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  const dummyProjects = [
    {
      id: 1,
      name: "Luxury Villa",
      description: "A high-end luxury villa with a pool and garden.",
      images: [
        "https://source.unsplash.com/300x200/?villa",
        "https://source.unsplash.com/300x200/?luxury-home"
      ],
      videos: [
        "https://samplelib.com/lib/preview/mp4/sample-5s.mp4"
      ],
      progress: 75,
    },
    {
      id: 2,
      name: "Modern Apartment",
      description: "A sleek, modern apartment in the city center.",
      images: ["https://source.unsplash.com/300x200/?apartment"],
      videos: ["https://samplelib.com/lib/preview/mp4/sample-10s.mp4"],
      progress: 50,
    },
  ];

  const filteredProjects = (projects.length ? projects : dummyProjects).filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-blue-600">Customer Panel</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600">Logout</button>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search projects..."
          className="border p-3 rounded-lg w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredProjects.map((project) => (
        <div key={project.id} className="mb-6 p-6 bg-white shadow-xl rounded-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">{project.name}</h2>
          <p className="mb-4 text-gray-600">{project.description}</p>

          {/* Images */}
          {project.images?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700">Images:</h3>
              <div className="flex space-x-2">
                {project.images.map((img, index) => (
                  <img key={index} src={img} alt={`Project ${index}`} className="w-32 h-32 object-cover rounded-lg shadow-md" />
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {project.videos?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700">Videos:</h3>
              {project.videos.map((video, index) => (
                <video key={index} src={video} controls className="w-64 h-40 rounded-lg shadow-md"></video>
              ))}
            </div>
          )}

          {/* Progress Pie Chart */}
          <div className="flex flex-col items-center">
            <h3 className="font-semibold text-gray-700">Progress:</h3>
            <PieChart width={200} height={200} className="mt-2">
              <Pie
                data={[
                  { name: "Completed", value: project.progress },
                  { name: "Remaining", value: 100 - project.progress }
                ]}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                label
                fill="#8884d8"
              >
                <Cell fill="#4CAF50" />
                <Cell fill="#E0E0E0" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      ))}
    </div>
  );
}
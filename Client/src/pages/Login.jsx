import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { AuthContext } from '../context/AuthContext';
import { loginUser } from '../services/api';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize useNavigate
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const userData = await loginUser(credentials);
    if (userData && userData.token) {
      localStorage.setItem("token", userData.token);
      login(userData);
      navigate("/admin"); // Redirect to admin page
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Welcome Back</h2>
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Email</label>
            <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Password</label>
            <input type="password" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-200">
            Login
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-4">Don't have an account? <a href="#" className="text-blue-500 hover:underline">Sign up</a></p>
      </div>
    </div>
  );
}

export default Login;

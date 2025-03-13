import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data; // { token }
  } catch (error) {
    console.error("Login failed:", error.response?.data?.message || error.message);
    return null;
  }
};


export const fetchProjects = async () => {
  const response = await axios.get(`${API_URL}/projects`);
  return response.data;
};

export const addProject = async (projectData) => {
  const response = await axios.post(`${API_URL}/projects`, projectData);
  return response.data;
};


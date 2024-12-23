// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Replace with your backend URL
});

// Add interceptors if needed (e.g., for authentication)

export default api;

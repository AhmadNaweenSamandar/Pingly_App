import axios from 'axios';   

// ---------------------------------------------------------
// API CLIENT SETUP (Scalability & Maintainability)
// ---------------------------------------------------------
// This file sets up a centralized API client using Axios. 
// It includes the base URL configuration and a request interceptor to automatically attach the JWT token for authentication.
// This way, we can easily manage all our API calls in one place and ensure consistency across the app.

// SCALABILITY: we use environment variables so this doesn't break in production
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// MAINTAINABILITY: The Request Interceptor
// Automatically attaches the JWT to every request so we never have to type it again.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
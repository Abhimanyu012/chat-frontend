import axios from "axios";

// Determine the API base URL with fallbacks
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Remove trailing /api if it exists to avoid double /api in the URL
const normalizedBaseURL = API_BASE_URL.endsWith('/api') 
    ? API_BASE_URL 
    : API_BASE_URL + '/api';

// Log the base URL for debugging
console.log("API Base URL:", normalizedBaseURL);

// Create axios instance with proper configuration
export const axiosInstance = axios.create({
    baseURL: normalizedBaseURL,
    withCredentials: true, // Needed for cookies/auth
    timeout: 30000, // 30 second timeout (increased from 10s)
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log errors for debugging
        console.error("API Error:", {
            status: error?.response?.status,
            data: error?.response?.data,
            url: error?.config?.url
        });
        
        return Promise.reject(error);
    }
);
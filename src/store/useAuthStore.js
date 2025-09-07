import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";


export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    checkAuth: async () => {
        try {
            console.log("Checking auth status...");
            const res = await axiosInstance.get("/auth/check");
            console.log("Auth check response:", res.data);
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in checkauth: ", error);
            
            // Check for CORS errors
            if (error.message === "Network Error") {
                console.warn("Possible CORS issue. Check that backend CORS settings include this frontend domain.");
            }
            
            // If unauthorized, don't show error toast as this is expected for new visitors
            if (error?.response?.status === 401) {
                console.log("User not authenticated (expected for new visitors)");
            } else {
                console.error("Unexpected error during auth check:", error);
            }
            
            // If not authenticated, clear user data
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signUp: async (data) => {
        set({ isSigningUp: true })
        try {
            console.log("Sending signup request with data:", data);
            // Make sure we're using the full path - this is a critical fix
            const res = await axiosInstance.post("/auth/signup", data);
            console.log("Signup response:", res.data);
            set({ authUser: res.data });
            toast.success("Account Created Successfully");
        } catch (error) {
            console.error("Signup error details:", error);
            
            // Check for timeout errors (common with slow connections to Render)
            if (error.code === 'ECONNABORTED') {
                toast.error("Connection timeout. The server might be starting up or experiencing high load. Please try again in a minute.");
                return;
            }
            
            // Get more detailed error information
            const errorMessage = error?.response?.data?.message || 
                                error?.message || 
                                "Signup failed. Please check your network connection.";
            
            // Show specific error messages for common issues
            if (error?.response?.status === 409) {
                toast.error("This email is already registered. Please login or use a different email.");
            } else if (error?.response?.status === 500) {
                toast.error("Server error. Please try again later or contact support.");
            } else if (error?.response?.status === 404) {
                toast.error("API endpoint not found. This is likely an issue with the API URL configuration.");
                console.error("API URL misconfiguration. Check baseURL in axios.js");
            } else {
                toast.error(errorMessage);
            }
        } finally {
            set({
                isSigningUp: false
            });
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            console.log("Attempting login with:", { email: data.email });
            const res = await axiosInstance.post("/auth/login", data);
            console.log("Login successful, user data:", res.data);
            set({ authUser: res.data });
            toast.success("Login successful");
        } catch (error) {
            console.error("Login error:", error);
            
            if (error.code === 'ECONNABORTED') {
                toast.error("Connection timeout. The server might be starting up or experiencing high load. Please try again in a minute.");
                return;
            }
            
            const message = error?.response?.data?.message || "Login failed. Please check your input.";
            toast.error(message);
        } finally {
            set({
                isLoggingIn: false
            })
        }
    },
    logout: async () => {
        try {
            console.log("Attempting logout");
            const res = await axiosInstance.post("/auth/logout");
            console.log("Logout successful");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
            // Even if logout fails on the server, we'll clear the local state
            set({ authUser: null });
            
            // Only show error if there's a specific message
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Logout failed but your session has been cleared");
            }
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            console.log("Updating profile");
            const res = await axiosInstance.put("/auth/update-profile", data);
            console.log("Profile updated:", res.data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Profile update error:", error);
            
            if (error.code === 'ECONNABORTED') {
                toast.error("Upload timeout. Please try again or use a smaller image.");
                return;
            }
            
            if (error?.response?.status === 408) {
                toast.error("Request timeout. Please try again with a smaller image.");
                return;
            }
            
            if (error?.response?.status === 413) {
                toast.error("Image too large. Please use a smaller image.");
                return;
            }
            
            const message = error?.response?.data?.message || "Profile update failed.";
            toast.error(message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    }
})); 
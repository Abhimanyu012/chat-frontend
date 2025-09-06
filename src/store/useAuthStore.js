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
            const res = await axiosInstance.post("auth/signup", data);
            console.log("Signup response:", res.data);
            set({ authUser: res.data });
            toast.success("Account Created Successfully");
        } catch (error) {
            console.error("Signup error details:", error);
            
            // Get more detailed error information
            const errorMessage = error?.response?.data?.message || 
                                 error?.message || 
                                 "Signup failed. Please check your network connection.";
            
            // Show specific error messages for common issues
            if (error?.response?.status === 409) {
                toast.error("This email is already registered. Please login or use a different email.");
            } else if (error?.response?.status === 500) {
                toast.error("Server error. Please try again later or contact support.");
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
            const res = await axiosInstance.post("auth/login", data)
            set({ authUser: res.data })
            toast.success("user login Successfully")
        } catch (error) {
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
            const res = await axiosInstance.post("/auth/logout")
            set({ authUser: null })
            toast.success("Logout Successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            const message = error?.response?.data?.message || "Profile update failed.";
            toast.error(message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    }
})); 
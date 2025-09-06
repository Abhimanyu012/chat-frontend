import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set) => ({
    messages: [],
    users: [],
    selectedUsers: null, // keeping plural to match existing component usage
    isUserLoading: false,
    isMessagesLoading: false,
    demoMode: false,
    onlineUsers:[],

    // Fetch list of users you can chat with
    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/message/users");
            const data = res?.data || [];
            console.log("🔍 Raw API Response:", res);
            console.log("👥 Users Data:", data);
            console.log("📊 Data Type:", typeof data, "Length:", data?.length);
            
            if (Array.isArray(data) && data.length > 0) {
                // Log each user's structure
                data.forEach((user, index) => {
                    console.log(`👤 User ${index +1}:`, {
                        _id: user._id,
                        fullName: user.fullName,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        isOnline: user.isOnline,
                        profilePic: user.profilePic
                    });
                });
                set({ users: data, demoMode: false });
            } else {
                console.log("⚠️ No users found, enabling demo mode");
                // Enable demo mode so UI can be previewed without extra users
                set({
                    demoMode: true,
                    users: [
                        { _id: "demo", name: "Demo User", email: "demo@example.com" },
                    ],
                });
            }
        } catch (error) {
            console.log("❌ Error fetching users:", error);
            console.log("📄 Error response:", error?.response);
            console.log("💬 Error message:", error?.response?.data?.message);
            
            const errMsg = error?.response?.data?.message || "Failed to load users";
            toast.error(errMsg);
            // Fall back to demo mode on error to allow UI preview
            set({
                demoMode: true,
                users: [
                    { _id: "demo", name: "Demo User", email: "demo@example.com" },
                ],
            });
            console.log("🎭 Demo mode enabled due to error");
        } finally {
            set({ isUserLoading: false });
            console.log("✅ getUsers completed, loading finished");
        }
    },

    // Track ongoing requests to prevent duplicates
    _pendingRequests: {},
    
    // Fetch messages for a given user id
    getMessages: async (userId) => {
        // Check if there's already a pending request for this user
        if (useChatStore.getState()._pendingRequests[userId]) {
            console.log(`Skipping duplicate request for user: ${userId}`);
            return;
        }
        
        // Mark this request as pending
        useChatStore.setState(state => ({
            _pendingRequests: { ...state._pendingRequests, [userId]: true }
        }));
        
        set({ isMessagesLoading: true });
        try {
            if (userId === "demo") {
                console.log("Loading demo messages");
                // Provide some sample messages for preview with different timestamps
                const now = new Date()
                const demoMessages = [
                    { 
                        id: "m1", 
                        text: "Hey! How are you doing?", 
                        senderId: "demo-other", 
                        createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
                    },
                    { 
                        id: "m2", 
                        text: "I'm doing great, thanks for asking!", 
                        senderId: "current-user", 
                        createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString() // 2 days ago + 5 min
                    },
                    { 
                        id: "m3", 
                        text: "Good morning! Ready for today's meeting?", 
                        senderId: "demo-other", 
                        createdAt: new Date(now - 24 * 60 * 60 * 1000).toISOString() // Yesterday
                    },
                    { 
                        id: "m4", 
                        text: "Absolutely! I've prepared all the documents.", 
                        senderId: "current-user", 
                        createdAt: new Date(now - 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString() // Yesterday + 10 min
                    },
                    { 
                        id: "m5", 
                        text: "Welcome to the chat preview!", 
                        senderId: "demo-other", 
                        createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago (today)
                    },
                    { 
                        id: "m6", 
                        text: "You can type and send messages below.", 
                        senderId: "demo-other", 
                        createdAt: new Date(now - 30 * 60 * 1000).toISOString() // 30 minutes ago
                    },
                    { 
                        id: "m7", 
                        text: "This is a recent message!", 
                        senderId: "demo-other", 
                        createdAt: new Date(now - 2 * 60 * 1000).toISOString() // 2 minutes ago
                    },
                ];
                set({ messages: demoMessages });
                return;
            }
            console.log(`Fetching messages for user: ${userId}`);
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data });
            console.log(`Received ${res.data.length} messages for user: ${userId}`);
        } catch (error) {
            const errMsg = error?.response?.data?.message || "Failed to load messages";
            console.error(`Error loading messages for user: ${userId}`,error);
            toast.error(errMsg);
        } finally {
            set({ isMessagesLoading: false });
            // Clear the pending request flag
            useChatStore.setState(state => {
                const newPendingRequests = { ...state._pendingRequests };
                delete newPendingRequests[userId];
                return { _pendingRequests: newPendingRequests };
            });
        }
    },

    // Select a user to chat with
    setSelectedUsers: (user) => set({ selectedUsers: user }),

    // Send a message to the currently selected user
    sendMessage: async (payload) => {
        // payload: { text?: string, image?: string }
        let userId;
        set((state) => {
            userId = state.selectedUsers?._id || state.selectedUsers?.id;
            return state;
        });
        if (!userId) return;
        try {
            if (userId === "demo") {
                // Local-only append so the preview works without a server
                const localMsg = {
                    id: `local-${Date.now()}`,
                    text: payload.text,
                    image: payload.image,
                    createdAt: new Date().toISOString(),
                    localMine: true,
                };
                set((state) => ({ messages: [...state.messages, localMsg] }));
                return;
            }
            const res = await axiosInstance.post(`/message/send/${userId}`, payload);
            set((state) => ({ messages: [...state.messages, res.data] }));
        } catch (error) {
            const errMsg = error?.response?.data?.message || "Failed to send message";
            toast.error(errMsg);
        }
    },
}));
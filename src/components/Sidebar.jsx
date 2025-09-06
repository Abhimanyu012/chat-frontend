import { useEffect, useCallback } from "react";
import { MessageCircle, Users, Search } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { useAuthStore } from "../store/useAuthStore";

const Sidebar = () => {
  const { getUsers, users, selectedUsers, setSelectedUsers, isUserLoading,onlineUsers } = useChatStore();
  
  // Use memoized function to avoid unnecessary re-renders
  const fetchUsers = useCallback(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    fetchUsers();
    // Run only once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full flex flex-col bg-white/5 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-purple-400" />
            Chats
          </h2> 
          <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
            {users?.length || 0}
          </span>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Online Status */}
      {onlineUsers.length > 0 && (
        <div className="px-4 py-2 border-b border-white/10">
          <div className="flex items-center text-green-400 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            {onlineUsers.length} Online
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {users && users.length > 0 ? (
            users.map((user) => {
              const isActive = selectedUsers?._id === user._id;
              const isOnline = user.isOnline;
              
              return (
                <div
                  key={user._id}
                  onClick={() => setSelectedUsers(user)}
                  className={`flex items-center p-3 rounded-lg text-black cursor-pointer transition-all duration-200 ${
                    isActive 
                      ? "bg-blue-950 border border-purple-500/50" 
                      : "hover:bg-purple-950"
                  }`}
                >
                  <div className="relative mr-3 flex-shrink-0">
                    <img
                      src={user.profilePic || '/avatar.png'}
                      alt={user.fullName}
                      className="h-10 w-10 rounded-full object-cover border-2 border-white/20"
                    />
                    {isOnline && (
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-800"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.fullName || user.name || user.username || user.email || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                  
                  {isActive && (
                    <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No users available</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
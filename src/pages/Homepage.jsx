import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import NoChatSelected from '../components/NoChatSelected';

const Homepage = () => {
  const { selectedUsers, isUserLoading, setSelectedUsers } = useChatStore();
  
  // getUsers is now only called in the Sidebar component to avoid duplicate calls

  // Mobile back handler
  const handleBackToSidebar = () => {
    setSelectedUsers(null);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16">
      <div className="h-full max-w-7xl mx-auto p-4">
        <div className="h-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex h-full">
            
            {/* Sidebar - Hidden on mobile when chat is selected */}
            <div className={`w-full md:w-80 lg:w-96 border-r border-white/10 ${selectedUsers ? 'hidden md:block' : 'block'}`}>
              <Sidebar />
            </div>

            {/* Main Chat Area - Hidden on mobile when no chat selected */}
            <div className={`flex-1 flex flex-col min-w-0 ${!selectedUsers ? 'hidden md:flex' : 'flex'}`}>
              {/* Mobile Back Button */}
              {selectedUsers && (
                <div className="md:hidden flex items-center p-4 border-b border-white/10 bg-white/5">
                  <button 
                    onClick={handleBackToSidebar}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                  >
                    <ArrowLeft size={20} />
                    <span>Back to chats</span>
                  </button>
                </div>
              )}
              
              {!selectedUsers ? (
                <NoChatSelected />
              ) : (
                <ChatContainer />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;

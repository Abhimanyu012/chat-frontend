
import React, { useState } from 'react';
import { Camera, X, User, Mail, Calendar, Shield } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const [showImageModal, setShowImageModal] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      try {
        await updateProfile({ profilePic: base64Image });
          } catch (error) {
        toast.error('Failed to update profile picture');
      }
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Profile Header */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            
            {/* Profile Image */}
            <div className="relative group">
              <div className="relative">
                <img
                  src={authUser?.profilePic || '/avatar.png'}
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-purple-500/50 shadow-lg cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setShowImageModal(true)}
                />
                
                {/* Upload overlay */}
                <label
                  htmlFor="avatar-upload"
                  className={`absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${
                    isUpdatingProfile ? 'opacity-100' : ''
                  }`}
                >
                  {isUpdatingProfile ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              
              <p className="text-xs text-center text-gray-400 mt-2">
                Click to change photo
              </p>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {authUser?.fullName || 'User'}
              </h1>
              <p className="text-gray-400 mb-4">{authUser?.email}</p>
              
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified Account
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  Active User
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Personal Information */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-400" />
              Personal Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-gray-400">Full Name</span>
                <span className="text-white font-medium">{authUser?.fullName || 'Not set'}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-gray-400">Email</span>
                <span className="text-white font-medium">{authUser?.email || 'Not set'}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-gray-400">Status</span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-green-400 font-medium">Online</span>
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-400">Member Since</span>
                <span className="text-white font-medium">
                  {authUser?.createdAt 
                    ? new Date(authUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Unknown'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-400" />
              Account Settings
            </h2>
            
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                <span className="text-white">Change Password</span>
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                <span className="text-white">Privacy Settings</span>
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                <span className="text-white">Notification Preferences</span>
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors border border-red-500/30 text-red-400">
                <span>Delete Account</span>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-3xl max-h-[80vh] p-4">
            <img
              src={authUser?.profilePic || '/avatar.png'}
              alt="Profile"
              className="w-full h-full object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

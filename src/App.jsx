import React, { useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Homepage from './pages/Homepage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

// Lazy load test components
const TestSignup = lazy(() => import('./pages/TestSignup'));

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className='h-screen w-full flex justify-center items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
        <div className='flex flex-col items-center space-y-4'>
          <Loader className='animate-spin w-8 h-8 text-purple-400' />
          <p className='text-white text-sm'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {authUser && <Navbar />}
      
      <Routes>
        <Route 
          path='/' 
          element={authUser ? <Homepage /> : <Navigate to="/login" />} 
        />
        <Route 
          path='/signup' 
          element={!authUser ? <SignupPage /> : <Navigate to="/" />} 
        />
        <Route 
          path='/login' 
          element={!authUser ? <LoginPage /> : <Navigate to="/" />} 
        />
        <Route 
          path='/profile' 
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />} 
        />
        <Route 
          path='/test' 
          element={
            <Suspense fallback={<div className="flex justify-center items-center h-screen">
              <Loader className='animate-spin w-8 h-8 text-purple-400' />
            </div>}>
              <TestSignup />
            </Suspense>
          } 
        />
      </Routes>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#ffffff',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  );
};

export default App;
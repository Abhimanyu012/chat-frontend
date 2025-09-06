import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <main className="pt-16"> {/* Padding top to account for fixed navbar */}
        {children}
      </main>
    </div>
  );
};

export default Layout;

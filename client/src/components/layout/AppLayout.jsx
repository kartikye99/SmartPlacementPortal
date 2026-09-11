import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { AmbientBackground } from './AmbientBackground';

export const AppLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div 
      className="flex min-h-screen font-sans relative overflow-x-hidden transition-colors duration-400"
      style={{
        backgroundColor: 'var(--theme-background)',
        backgroundImage: 'var(--theme-background-image)',
        color: 'var(--theme-text)',
      }}
    >
      {/* Living Atmospheric Aurora & Micro-Texture Background */}
      <AmbientBackground />

      {/* Sidebar navigation */}
      <div className="relative z-20">
        <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Navbar onMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

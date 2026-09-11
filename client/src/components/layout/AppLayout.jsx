import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { AmbientBackground } from './AmbientBackground';

export const AppLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div
      className="app-shell flex min-h-screen relative overflow-x-hidden"
      style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-text)' }}
    >
      <AmbientBackground />
      <div className="relative z-20 w-0 md:w-[252px] md:shrink-0">
        <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Navbar onMenuClick={() => setIsMobileOpen(true)} />
        <main className="app-main flex-1 w-full max-w-[1440px] mx-auto px-4 py-5 md:px-7 md:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

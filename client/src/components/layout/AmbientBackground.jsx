import React from 'react';

/**
 * Restrained institutional background shared by authenticated and public screens.
 * The grid is intentionally faint so data and forms remain the visual priority.
 */
export const AmbientBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none" aria-hidden="true">
    <div className="absolute inset-0" style={{ background: 'var(--theme-background-image)' }} />
    <div className="absolute inset-0 bg-grid-pattern opacity-[0.18]" />
  </div>
);

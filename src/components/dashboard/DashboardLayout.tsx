import React, { useState } from 'react';
import { Box } from '@mui/material';
import { PanelHeader } from './PanelHeader';
import { PanelNavbar } from './PanelNavbar';
import { PanelFooter } from './PanelFooter';

interface DashboardLayoutProps {
  currentUser: any;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  appointmentsCount?: number;
  emergencyCount?: number;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentUser,
  currentPage,
  onNavigate,
  onLogout,
  appointmentsCount = 3,
  emergencyCount = 1,
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Box
      id="dashboard-admin-layout"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc',
      }}
    >
      {/* 1. Common Top Header for Admin Panel */}
      <PanelHeader
        currentUser={currentUser}
        onLogout={onLogout}
        onNavigate={onNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Common Navigation Bar below Header */}
      <PanelNavbar
        currentPage={currentPage}
        onNavigate={onNavigate}
        appointmentsCount={appointmentsCount}
        emergencyCount={emergencyCount}
      />

      {/* 3. Main Body Content */}
      <Box
        component="main"
        id="dashboard-main-content-panel"
        sx={{
          flexGrow: 1,
          width: '100%',
          backgroundColor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>

      {/* 4. Single-Row Minimal Footer for Whole Admin Panel */}
      <PanelFooter />
    </Box>
  );
};

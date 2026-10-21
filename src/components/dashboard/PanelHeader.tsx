import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  InputBase,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Popover,
  List,
  ListItem,
  Chip,
  Tooltip,
  Button,
} from '@mui/material';
import {
  LocalHospital,
  Search as SearchIcon,
  NotificationsOutlined,
  Logout as LogoutIcon,
  Schedule,
  Public as PublicIcon,
  Circle,
  Close,
} from '@mui/icons-material';
import { THEME_COLOR } from '../../theme/theme';

interface PanelHeaderProps {
  currentUser: any;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  currentUser,
  onLogout,
  onNavigate,
  searchQuery,
  onSearchChange,
}) => {
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);

  const notifications = [
    {
      id: 1,
      title: 'New Consultation Booked',
      desc: 'Patient Robert Fox booked Dr. Sarah Mitchell for Today 2:30 PM',
      time: '10m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Patient Vitals Logged',
      desc: 'Normal BP reading recorded: 120/80 mmHg',
      time: '45m ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Emergency Queue Alert',
      desc: '1 priority emergency triage patient assigned to Duty Doctor',
      time: '2h ago',
      unread: false,
    },
  ];

  return (
    <Box
      id="panel-common-header"
      component="header"
      sx={{
        height: 70,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        px: { xs: 2, sm: 3, md: 4 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1200,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Left: Company Logo */}
      <Box
        onClick={() => onNavigate('appointments')}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: 'pointer',
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        <Box component="img" src="/logo.png" alt="G-One — Smarter Appointments, Better Patient Care" sx={{ width: { xs: 145, sm: 205 }, height: 58, objectFit: 'contain', objectPosition: 'left center' }} />
      </Box>

      {/* Center: Search Bar */}
      <Box
        sx={{
          flex: 1,
          maxWidth: { xs: 190, sm: 360, md: 460 },
          mx: { xs: 1, sm: 2, md: 3 },
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f1f5f9',
            border: '1.5px solid #cbd5e1',
            borderRadius: '9999px',
            px: 2,
            py: 0.6,
            transition: 'all 0.2s ease',
            '&:focus-within': {
              backgroundColor: '#ffffff',
              borderColor: THEME_COLOR,
              boxShadow: '0 0 0 3px rgba(183, 3, 2, 0.12)',
            },
          }}
        >
          <SearchIcon sx={{ color: '#64748b', fontSize: 20, mr: 1, flexShrink: 0 }} />
          <InputBase
            id="panel-header-search-input"
            fullWidth
            placeholder="Search patients, doctors, appointments..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              fontSize: '0.88rem',
              fontWeight: 500,
              color: '#0f172a',
              '& input::placeholder': {
                color: '#64748b',
                opacity: 0.9,
              },
            }}
          />
          {searchQuery && (
            <IconButton
              size="small"
              onClick={() => onSearchChange('')}
              sx={{ p: 0.2, color: '#94a3b8' }}
            >
              <Close sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Right: Notifications & Logged-In User Details */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, flexShrink: 0 }}>
        {/* On Duty Status Badge */}
        <Chip
          icon={<Circle sx={{ fontSize: '8px !important', color: '#16a34a' }} />}
          label="On Duty"
          size="small"
          sx={{
            display: { xs: 'none', lg: 'inline-flex' },
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            color: '#15803d',
            fontWeight: 700,
            fontSize: '0.72rem',
            borderRadius: '9999px',
            border: '1px solid rgba(34, 197, 94, 0.2)',
          }}
        />

        {/* Notifications Icon Button */}
        <Tooltip title="Notifications">
          <IconButton
            id="panel-notifications-btn"
            onClick={(e) => setNotifAnchor(e.currentTarget)}
            size="small"
            sx={{
              border: '1px solid #e2e8f0',
              borderRadius: '9999px',
              p: 0.9,
              color: '#475569',
              '&:hover': {
                backgroundColor: '#f1f5f9',
                color: THEME_COLOR,
              },
            }}
          >
            <Badge badgeContent={2} color="error" variant="dot">
              <NotificationsOutlined fontSize="small" />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Notification Popover */}
        <Popover
          open={Boolean(notifAnchor)}
          anchorEl={notifAnchor}
          onClose={() => setNotifAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            paper: {
              sx: {
                width: 340,
                mt: 1.5,
                borderRadius: '16px',
                boxShadow: '0 12px 36px rgba(15, 23, 42, 0.14)',
                border: '1px solid #e2e8f0',
                p: 1.5,
              },
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
              Notifications
            </Typography>
            <Chip
              label="2 New"
              size="small"
              sx={{
                backgroundColor: 'rgba(183, 3, 2, 0.1)',
                color: THEME_COLOR,
                fontWeight: 700,
                fontSize: '0.7rem',
              }}
            />
          </Box>
          <Divider sx={{ my: 0.5 }} />
          <List disablePadding>
            {notifications.map((notif) => (
              <ListItem
                key={notif.id}
                sx={{
                  px: 1.5,
                  py: 1.2,
                  borderRadius: '10px',
                  backgroundColor: notif.unread ? 'rgba(183, 3, 2, 0.03)' : 'transparent',
                  mb: 0.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f8fafc' },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 0.4 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    {notif.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.68rem' }}>
                    {notif.time}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#475569', lineHeight: 1.3 }}>
                  {notif.desc}
                </Typography>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 0.5 }} />
          <Button
            fullWidth
            size="small"
            onClick={() => setNotifAnchor(null)}
            sx={{ textTransform: 'none', fontWeight: 700, color: THEME_COLOR, fontSize: '0.78rem' }}
          >
            Mark All as Read
          </Button>
        </Popover>

        {/* User Detail & Profile Popover Trigger */}
        <Box
          id="panel-user-profile-btn"
          onClick={(e) => setProfileAnchor(e.currentTarget)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            p: '4px 10px 4px 6px',
            borderRadius: '9999px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#f8fafc',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#f1f5f9',
              borderColor: THEME_COLOR,
            },
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              backgroundColor: THEME_COLOR,
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
            }}
          >
            {currentUser.name.replace('Dr. ', '').charAt(0) || 'D'}
          </Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left', pr: 0.5 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.1,
                fontSize: '0.86rem',
              }}
            >
              {currentUser.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#64748b',
                fontWeight: 600,
                fontSize: '0.7rem',
                display: 'block',
              }}
            >
              {currentUser.role || 'Specialist Doctor'}
            </Typography>
          </Box>
        </Box>

        {/* Profile Menu */}
        <Menu
          open={Boolean(profileAnchor)}
          anchorEl={profileAnchor}
          onClose={() => setProfileAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            paper: {
              sx: {
                width: 230,
                mt: 1.5,
                borderRadius: '16px',
                boxShadow: '0 12px 36px rgba(15, 23, 42, 0.12)',
                border: '1px solid #e2e8f0',
                p: 0.5,
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
              {currentUser.name}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {currentUser.role || 'Specialist Doctor'}
            </Typography>
          </Box>
          <Divider sx={{ my: 0.5 }} />

          <MenuItem
            onClick={() => {
              setProfileAnchor(null);
              onNavigate('appointments');
            }}
            sx={{ borderRadius: '8px', fontSize: '0.86rem', fontWeight: 600 }}
          >
            <ListItemIcon>
              <Schedule fontSize="small" sx={{ color: THEME_COLOR }} />
            </ListItemIcon>
            <ListItemText primary="Doctor Schedule" />
          </MenuItem>

          <MenuItem
            onClick={() => {
              setProfileAnchor(null);
              onNavigate('home');
            }}
            sx={{ borderRadius: '8px', fontSize: '0.86rem', fontWeight: 600 }}
          >
            <ListItemIcon>
              <PublicIcon fontSize="small" sx={{ color: '#64748b' }} />
            </ListItemIcon>
            <ListItemText primary="View Public Website" />
          </MenuItem>

          <Divider sx={{ my: 0.5 }} />

          <MenuItem
            onClick={() => {
              setProfileAnchor(null);
              onLogout();
            }}
            sx={{
              borderRadius: '8px',
              fontSize: '0.86rem',
              fontWeight: 700,
              color: '#dc2626',
              '&:hover': {
                backgroundColor: 'rgba(220, 38, 38, 0.08)',
              },
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: '#dc2626' }} />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

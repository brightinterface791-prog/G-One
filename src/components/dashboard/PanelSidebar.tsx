import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Divider,
  Drawer,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  CalendarMonth,
  PeopleOutlined,
  MonitorHeart,
  MedicalServices,
  LocalFireDepartment,
  Public,
  Logout,
  LocalHospital,
  Shield,
  Circle,
} from '@mui/icons-material';
import { THEME_COLOR } from '../../theme/theme';

interface PanelSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
  appointmentsCount?: number;
  emergencyCount?: number;
}

export const PanelSidebar: React.FC<PanelSidebarProps> = ({
  currentPage,
  onNavigate,
  onLogout,
  open,
  onClose,
  appointmentsCount = 3,
  emergencyCount = 1,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    {
      id: 'appointments',
      label: 'Appointments',
      sublabel: 'Schedule & Visits',
      icon: <CalendarMonth />,
      badge: appointmentsCount > 0 ? `${appointmentsCount}` : undefined,
      badgeColor: THEME_COLOR,
    },
    {
      id: 'doctors',
      label: 'Doctor Directory',
      sublabel: 'Medical Staff',
      icon: <PeopleOutlined />,
    },
    {
      id: 'vitals',
      label: 'Patient Vitals',
      sublabel: 'Health Tracker',
      icon: <MonitorHeart />,
    },
    {
      id: 'specialties',
      label: 'Specialties',
      sublabel: 'Departments',
      icon: <MedicalServices />,
    },
    {
      id: 'emergency',
      label: 'Emergency ER',
      sublabel: 'Urgent Care Queue',
      icon: <LocalFireDepartment />,
      badge: 'URGENT',
      badgeColor: '#dc2626',
    },
  ];

  const sidebarContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        width: open ? { xs: 260, md: 260 } : { xs: 0, md: 76 },
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      {/* Top Section / Main Navigation */}
      <Box sx={{ py: 2, px: open ? 1.5 : 1 }}>
        {open && (
          <Box sx={{ px: 1.5, mb: 1.5 }}>
            <Typography
              variant="caption"
              sx={{
                color: '#94a3b8',
                fontWeight: 600,
                letterSpacing: '0.08em',
                fontSize: '0.68rem',
              }}
            >
              CLINICAL NAVIGATION
            </Typography>
          </Box>
        )}

        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <ListItem key={item.id} disablePadding>
                <Tooltip title={!open ? item.label : ''} placement="right">
                  <ListItemButton
                    id={`sidebar-nav-${item.id}`}
                    onClick={() => {
                      onNavigate(item.id);
                      if (isMobile) onClose();
                    }}
                    sx={{
                      borderRadius: '12px',
                      py: 1.2,
                      px: open ? 1.8 : 1.2,
                      justifyContent: open ? 'flex-start' : 'center',
                      backgroundColor: isActive ? 'rgba(183, 3, 2, 0.08)' : 'transparent',
                      color: isActive ? THEME_COLOR : '#334155',
                      borderLeft: isActive ? `4px solid ${THEME_COLOR}` : '4px solid transparent',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: isActive ? 'rgba(183, 3, 2, 0.12)' : '#f8fafc',
                        color: THEME_COLOR,
                        '& .MuiListItemIcon-root': {
                          color: THEME_COLOR,
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: open ? 38 : 'auto',
                        color: isActive ? THEME_COLOR : '#64748b',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    {open && (
                      <Box sx={{ flex: 1, overflow: 'hidden' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: isActive ? 800 : 600,
                            fontSize: '0.88rem',
                            lineHeight: 1.2,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.label}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#94a3b8',
                            fontSize: '0.7rem',
                            display: 'block',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.sublabel}
                        </Typography>
                      </Box>
                    )}

                    {open && item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          backgroundColor: item.badgeColor,
                          color: '#ffffff',
                          ml: 1,
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Website & External links */}
        {open && (
          <Box sx={{ px: 1.5, mb: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: '#94a3b8',
                fontWeight: 600,
                letterSpacing: '0.08em',
                fontSize: '0.68rem',
              }}
            >
              PORTAL SWITCH
            </Typography>
          </Box>
        )}

        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
          <ListItem disablePadding>
            <Tooltip title={!open ? 'View Public Website' : ''} placement="right">
              <ListItemButton
                id="sidebar-nav-public-site"
                onClick={() => {
                  onNavigate('home');
                  if (isMobile) onClose();
                }}
                sx={{
                  borderRadius: '12px',
                  py: 1.1,
                  px: open ? 1.8 : 1.2,
                  justifyContent: open ? 'flex-start' : 'center',
                  color: '#475569',
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                    color: '#0f172a',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: open ? 38 : 'auto', color: '#64748b' }}>
                  <Public fontSize="small" />
                </ListItemIcon>
                {open && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      color: '#475569',
                    }}
                  >
                    Public Website
                  </Typography>
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Box>

      {/* Bottom Section: Security Badge & Logout */}
      <Box sx={{ p: open ? 2 : 1, borderTop: '1px solid #f1f5f9' }}>
        {open && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              mb: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
            }}
          >
            <Shield sx={{ color: '#16a34a', fontSize: 20 }} />
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#0f172a', display: 'block', lineHeight: 1.1 }}>
                Secure Clinical Portal
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                End-to-end Encrypted
              </Typography>
            </Box>
          </Box>
        )}

        <Tooltip title={!open ? 'Sign Out' : ''} placement="right">
          <ListItemButton
            id="sidebar-logout-btn"
            onClick={onLogout}
            sx={{
              borderRadius: '12px',
              py: 1.1,
              px: open ? 1.8 : 1.2,
              justifyContent: open ? 'flex-start' : 'center',
              color: '#dc2626',
              backgroundColor: 'rgba(220, 38, 38, 0.04)',
              '&:hover': {
                backgroundColor: 'rgba(220, 38, 38, 0.12)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: open ? 38 : 'auto', color: '#dc2626' }}>
              <Logout fontSize="small" />
            </ListItemIcon>
            {open && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: '#dc2626',
                }}
              >
                Sign Out
              </Typography>
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        id="panel-mobile-sidebar-drawer"
        anchor="left"
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: { invisible: false },
          paper: {
            sx: {
              top: 70,
              height: 'calc(100% - 70px)',
              boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
              border: 'none',
            },
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Box
      id="panel-desktop-sidebar"
      component="nav"
      sx={{
        flexShrink: 0,
        height: 'calc(100vh - 70px)',
        position: 'sticky',
        top: 70,
        zIndex: 1100,
      }}
    >
      {sidebarContent}
    </Box>
  );
};

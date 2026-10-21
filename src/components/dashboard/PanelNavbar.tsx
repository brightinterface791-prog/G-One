import React from 'react';
import {
  Box,
  Typography,
  Chip,
  ButtonBase,
} from '@mui/material';
import {
  CalendarMonth,
  PeopleOutlined,
  MonitorHeart,
  MedicalServices,
  LocalFireDepartment,
  DynamicForm,
} from '@mui/icons-material';
import { THEME_COLOR } from '../../theme/theme';

interface PanelNavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  appointmentsCount?: number;
  emergencyCount?: number;
}

export const PanelNavbar: React.FC<PanelNavbarProps> = ({
  currentPage,
  onNavigate,
  appointmentsCount = 3,
  emergencyCount = 1,
}) => {
  const navItems = [
    {
      id: 'appointments',
      label: 'OPD Appointments',
      icon: <CalendarMonth sx={{ fontSize: 18 }} />,
      badge: appointmentsCount > 0 ? `${appointmentsCount}` : undefined,
      badgeColor: THEME_COLOR,
    },
    {
      id: 'doctors',
      label: 'Doctors & Sitting Timings',
      icon: <PeopleOutlined sx={{ fontSize: 18 }} />,
    },
    {
      id: 'specialties',
      label: 'Specialties & Departments',
      icon: <MedicalServices sx={{ fontSize: 18 }} />,
    },
    {
      id: 'form-builder',
      label: 'Dynamic Intake Form',
      icon: <DynamicForm sx={{ fontSize: 18 }} />,
      badge: 'FORM',
      badgeColor: '#0284c7',
    },
    {
      id: 'vitals',
      label: 'Patient Vitals',
      icon: <MonitorHeart sx={{ fontSize: 18 }} />,
    },
    {
      id: 'emergency',
      label: 'Emergency ER',
      icon: <LocalFireDepartment sx={{ fontSize: 18 }} />,
      badge: 'URGENT',
      badgeColor: '#dc2626',
    },
  ];

  return (
    <Box
      id="panel-sub-navbar"
      component="nav"
      sx={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        px: { xs: 1.5, sm: 3, md: 4 },
        py: 0.8,
        display: 'flex',
        alignItems: 'center',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        position: 'sticky',
        top: 70,
        zIndex: 1100,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0.8, sm: 1.2 },
          width: '100%',
          maxWidth: '100%',
        }}
      >
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <ButtonBase
              key={item.id}
              id={`panel-nav-btn-${item.id}`}
              onClick={() => onNavigate(item.id)}
              sx={{
                px: { xs: 1.6, sm: 2.2 },
                py: 0.85,
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: isActive ? 'rgba(183, 3, 2, 0.08)' : 'transparent',
                color: isActive ? THEME_COLOR : '#475569',
                border: isActive ? `1.5px solid ${THEME_COLOR}` : '1.5px solid transparent',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                '&:hover': {
                  backgroundColor: isActive ? 'rgba(183, 3, 2, 0.12)' : '#f1f5f9',
                  color: isActive ? THEME_COLOR : '#0f172a',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: isActive ? THEME_COLOR : '#64748b',
                }}
              >
                {item.icon}
              </Box>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.84rem',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </Typography>

              {item.badge && (
                <Chip
                  label={item.badge}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    backgroundColor: item.badgeColor || THEME_COLOR,
                    color: '#ffffff',
                    borderRadius: '9999px',
                    px: 0.2,
                  }}
                />
              )}
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
};

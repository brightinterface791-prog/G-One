import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  LocalHospital,
  PersonOutlined,
} from '@mui/icons-material';
import { THEME_COLOR } from '../../theme/theme';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenLogin?: () => void;
  user?: { name: string; role: string } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenLogin,
  user,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 8);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginClick = () => {
    onNavigate('login');
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pure text single-row navigation items (no icons)
  const navItems = [
    {
      id: 'home',
      label: 'Home',
    },
    {
      id: 'doctors',
      label: 'Find Doctors',
    },
    {
      id: 'specialties',
      label: 'Specialties',
    },
    {
      id: 'newsroom',
      label: 'Newsroom',
    },
  ];

  return (
    <AppBar
      id="main-navbar"
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: currentPage === 'home' && !isScrolled ? 'transparent' : '#fffaf9',
        // The circle is drawn once by the shared page wrapper, not separately here.
        backgroundImage: 'none',
        backdropFilter: 'none',
        color: '#0f172a',
        borderBottom: 'none',
        boxShadow: isScrolled ? '0 5px 22px rgba(15, 23, 42, 0.12)' : 'none',
        transition: 'box-shadow 220ms ease',
        zIndex: 1100,
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 64, md: 72 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          {/* Brand Identity / Logo */}
          <Box
            id="brand-logo"
            onClick={() => handleNavClick('home')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              textDecoration: 'none',
              userSelect: 'none',
              transition: 'opacity 0.25s ease',
              '&:hover': {
                opacity: 0.88,
              },
            }}
          >
            <Box component="img" src="/logo.png" alt="G-One — Smarter Appointments, Better Patient Care" sx={{ width: { xs: 154, sm: 210, md: 225 }, height: { xs: 49, md: 61 }, objectFit: 'contain', objectPosition: 'left center', display: 'block' }} />
          </Box>

          {/* Desktop Navigation & Actions in Single Row */}
          {!isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { md: 4, lg: 5 } }}>
              {/* Clean Single-Row Navigation Menu with Premium Animation */}
              <Box
                component="nav"
                id="desktop-nav-menu"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { md: 3, lg: 4 },
                  background: 'none',
                  backgroundColor: 'transparent',
                }}
              >
                {navItems.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <Box
                      key={item.id}
                      id={`nav-${item.id}-wrapper`}
                      onClick={() => handleNavClick(item.id)}
                      sx={{
                        position: 'relative',
                        cursor: 'pointer',
                        py: 1,
                        px: 0.5,
                        userSelect: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? THEME_COLOR : '#475569',
                        transition: 'color 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        '&:hover': {
                          color: THEME_COLOR,
                          transform: 'translateY(-1px)',
                        },
                        '&:hover .menu-underline': {
                          transform: 'scaleX(1)',
                          opacity: 1,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '0.84rem',
                          fontWeight: isActive ? 700 : 500,
                          letterSpacing: '0.02em',
                          lineHeight: 1.2,
                          transition: 'font-weight 0.2s ease',
                        }}
                      >
                        {item.label}
                      </Typography>

                      {/* Premium Animated Indicator Bar (expanding smoothly from center) */}
                      <Box
                        className="menu-underline"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          width: '100%',
                          height: '2px',
                          backgroundColor: THEME_COLOR,
                          borderRadius: '2px',
                          transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                          opacity: isActive ? 1 : 0,
                          transformOrigin: 'center',
                          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>

              {/* Login Button in Header */}
              <Button
                id="header-login-btn"
                variant="contained"
                onClick={handleLoginClick}
                startIcon={<PersonOutlined />}
                sx={{
                  backgroundColor: currentPage === 'login' ? '#950201' : THEME_COLOR,
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  py: 0.9,
                  px: 2.6,
                  borderRadius: '9999px',
                  boxShadow: '0 3px 12px rgba(183, 3, 2, 0.25)',
                  whiteSpace: 'nowrap',
                  textTransform: 'none',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': {
                    backgroundColor: '#950201',
                    boxShadow: '0 5px 16px rgba(183, 3, 2, 0.35)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                {user ? user.name : 'Doctor Login'}
              </Button>
            </Box>
          ) : (
            /* Mobile Actions in Single Row */
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                id="mobile-header-login-btn"
                variant="contained"
                size="small"
                onClick={handleLoginClick}
                startIcon={<PersonOutlined sx={{ fontSize: 16 }} />}
                sx={{
                  backgroundColor: currentPage === 'login' ? '#950201' : THEME_COLOR,
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  py: 0.6,
                  px: 1.6,
                  borderRadius: '9999px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#950201',
                  },
                }}
              >
                {user ? 'Profile' : 'Doctor Login'}
              </Button>

              <IconButton
                id="mobile-menu-toggle"
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{
                  backgroundColor: '#f1f5f9',
                  borderRadius: '8px',
                  p: 0.9,
                  color: '#0f172a',
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer Navigation */}
      <Drawer
        id="mobile-nav-drawer"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              p: 2.5,
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box component="img" src="/logo.png" alt="G-One" sx={{ width: 170, maxHeight: 58, objectFit: 'contain', objectPosition: 'left center' }} />
          <IconButton onClick={handleDrawerToggle} aria-label="Close menu" size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List sx={{ p: 0, mb: 3 }}>
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavClick(item.id)}
                  disableRipple
                  sx={{
                    py: 1.2,
                    px: 1,
                    backgroundColor: 'transparent',
                    borderLeft: isActive ? `3px solid ${THEME_COLOR}` : '3px solid transparent',
                    color: isActive ? THEME_COLOR : '#1e293b',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: THEME_COLOR,
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.9rem',
                          color: isActive ? THEME_COLOR : '#0f172a',
                        }}
                      >
                        {item.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Button
          id="mobile-drawer-login-btn"
          variant="contained"
          fullWidth
          onClick={handleLoginClick}
          startIcon={<PersonOutlined />}
          sx={{
            backgroundColor: currentPage === 'login' ? '#950201' : THEME_COLOR,
            color: '#ffffff',
            py: 1.2,
            borderRadius: '9999px',
            fontWeight: 600,
            boxShadow: '0 4px 14px rgba(183, 3, 2, 0.25)',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#950201',
            },
          }}
        >
          {user ? `Logged in as ${user.name}` : 'Login to Patient Portal'}
        </Button>
      </Drawer>
    </AppBar>
  );
};

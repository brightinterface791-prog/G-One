import React, { useState } from 'react';
import { login } from '../services/authService';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Alert,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  LocalHospital,
  Lock,
  Email,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Login as LoginIcon,
  Logout as LogoutIcon,
  MedicalServices,
} from '@mui/icons-material';
import { THEME_COLOR } from '../theme/theme';
import doctorClearImage from '../assets/images/doctor_clear_portrait_1788202870646.jpg';

interface LoginPageProps {
  currentUser: any | null;
  onLoginSuccess: (user: any) => void;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  currentUser,
  onLoginSuccess,
  onLogout,
  onNavigate,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your doctor registered email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your account password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const user = await login({ email, password });
      
      onLoginSuccess(user);
      setSuccessMsg('Authentication successful!');
      setTimeout(() => {
        onNavigate('appointments');
      }, 400);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If doctor is already logged in, show authenticated state card
  if (currentUser) {
    return (
      <Box
        id="login-page-logged-in"
        sx={{
          height: { xs: 'auto', md: 'calc(100vh - 72px)' },
          minHeight: { xs: 'calc(100vh - 72px)', md: 'unset' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          py: { xs: 4, md: 0 },
          px: 2,
          overflow: 'hidden',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 480,
            width: '100%',
            p: { xs: 3, sm: 4.5 },
            borderRadius: '24px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.08)',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              backgroundColor: 'rgba(34, 197, 94, 0.12)',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <CheckCircle sx={{ fontSize: 38 }} />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
            Doctor Portal Active
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 3, fontSize: '0.88rem' }}>
            You are currently signed in with active clinical staff credentials.
          </Typography>

          <Box
            sx={{
              p: 2.2,
              borderRadius: '16px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              textAlign: 'left',
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>
                DOCTOR PROFILE
              </Typography>
              <Chip
                label={currentUser.role || 'Specialist Doctor'}
                size="small"
                icon={<MedicalServices sx={{ fontSize: 13 }} />}
                sx={{
                  backgroundColor: 'rgba(183, 3, 2, 0.08)',
                  color: THEME_COLOR,
                  fontWeight: 700,
                  fontSize: '0.72rem',
                }}
              />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
              {currentUser.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
            <Button
              id="logged-in-return-home-btn"
              variant="contained"
              fullWidth
              size="large"
              onClick={() => onNavigate('home')}
              sx={{
                py: 1.2,
                backgroundColor: THEME_COLOR,
                fontWeight: 700,
                borderRadius: '9999px',
                textTransform: 'none',
                fontSize: '0.94rem',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#950201',
                  boxShadow: '0 4px 12px rgba(183, 3, 2, 0.25)',
                },
              }}
            >
              Go to Hospital Homepage
            </Button>

            <Button
              id="logged-in-appointments-btn"
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => onNavigate('appointments')}
              sx={{
                py: 1.1,
                borderColor: '#94a3b8',
                color: '#1e293b',
                fontWeight: 700,
                borderRadius: '9999px',
                textTransform: 'none',
                fontSize: '0.92rem',
                '&:hover': {
                  borderColor: '#475569',
                  backgroundColor: '#f8fafc',
                },
              }}
            >
              View Consultation Bookings
            </Button>

            <Button
              id="logged-in-logout-btn"
              variant="text"
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={onLogout}
              sx={{
                color: '#dc2626',
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '0.88rem',
                mt: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(220, 38, 38, 0.06)',
                },
              }}
            >
              Sign Out of Doctor Account
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      id="doctor-login-page"
      sx={{
        height: { xs: 'auto', md: 'calc(100vh - 72px)' },
        maxHeight: { md: 'calc(100vh - 72px)' },
        backgroundColor: '#ffffff',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      <Grid container sx={{ flexGrow: 1, height: '100%' }}>
        {/* Left Side: Full edge-to-edge Clear Doctor Image (No text, No margins/borders) */}
        <Grid
          size={{ xs: 12, md: 6, lg: 6 }}
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'relative',
            height: '100%',
            overflow: 'hidden',
            backgroundColor: '#0f172a',
          }}
        >
          <Box
            component="img"
            src={doctorClearImage}
            alt="Doctor in clinic"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 15%',
              display: 'block',
            }}
          />
        </Grid>

        {/* Right Side: Center Aligned Sign In with Material UI 3 Realistic Dark Inputs */}
        <Grid
          size={{ xs: 12, md: 6, lg: 6 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            px: { xs: 3, sm: 5, md: 6, lg: 8 },
            py: { xs: 4, md: 2 },
            backgroundColor: '#ffffff',
            overflowY: { xs: 'auto', md: 'hidden' },
          }}
        >
          <Box sx={{ maxWidth: 420, width: '100%', mx: 'auto' }}>
            {/* Brand Logo - Centered */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2.5 }}>
              <Box component="img" src="/logo.png" alt="G-One — Smarter Appointments, Better Patient Care" sx={{ width: { xs: 210, sm: 260 }, height: 'auto', maxHeight: 100, objectFit: 'contain', mb: 1.5 }} />
              
              {/* Centered Sign In Title */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: '#0f172a',
                  fontSize: { xs: '1.75rem', sm: '2rem' },
                  letterSpacing: '-0.025em',
                  textAlign: 'center',
                }}
              >
                Sign In
              </Typography>
            </Box>

            {/* Alerts */}
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '12px', fontSize: '0.84rem' }}>
                {error}
              </Alert>
            )}

            {successMsg && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: '12px', fontSize: '0.84rem' }}>
                {successMsg}
              </Alert>
            )}

            {/* Tailwind pill inputs shared with the G-One search and filter controls */}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
              <div className="space-y-1.5">
                <label htmlFor="doctor-email-input" className="block text-sm font-medium text-slate-700">Email address</label>
                <div className="flex h-11 items-center gap-3 rounded-full border border-slate-200 bg-white px-4 transition-colors focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100">
                  <Email sx={{ color: '#64748b', fontSize: 19 }} aria-hidden="true" />
                  <input
                    id="doctor-email-input"
                    type="email"
                    autoComplete="username"
                    required
                    placeholder="doctor@gonehealth.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="doctor-password-input" className="block text-sm font-medium text-slate-700">Password</label>
                <div className="flex h-11 items-center gap-3 rounded-full border border-slate-200 bg-white pl-4 pr-2 transition-colors focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100">
                  <Lock sx={{ color: '#64748b', fontSize: 19 }} aria-hidden="true" />
                  <input
                    id="doctor-password-input"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                  >
                    {showPassword ? <VisibilityOff sx={{ fontSize: 19 }} /> : <Visibility sx={{ fontSize: 19 }} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: -0.5 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  }
                  label="Remember me"
                />
                <Typography
                  variant="caption"
                  onClick={() => {
                    setEmail('dr.sarah@gonehealth.org');
                    setPassword('DoctorPassword123!');
                  }}
                  sx={{
                    color: THEME_COLOR,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '14px',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Forgot Password?
                </Typography>
              </Box>

              {/* Submit Button */}
              <Button
                id="doctor-login-submit-btn"
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LoginIcon />}
                sx={{
                  py: 1.2,
                  mt: 0.5,
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

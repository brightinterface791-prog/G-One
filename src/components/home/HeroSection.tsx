import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search,
  EventAvailable,
  Favorite,
  VerifiedUser,
  Shield,
  Star,
  AccessTime,
  CheckCircle,
} from '@mui/icons-material';
import { THEME_COLOR } from '../../theme/theme';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onOpenVitals: () => void;
  onSearchDoctors: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  onOpenVitals,
  onSearchDoctors,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchDoctors(searchValue);
    const el = document.getElementById('doctors-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      id="hero-section"
      sx={{
        backgroundColor: 'transparent',
        pt: { xs: 4, md: 8 },
        pb: { xs: 6, md: 10 },
        position: 'relative',
        overflow: 'hidden',
        borderBottom: 'none',
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: 'center' }}>
          {/* Left Column: Hero Copy & Actions */}
          <Grid size={{ xs: 12, md: 7 }}>
            {/* Trust Pill */}
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <Chip
                icon={<VerifiedUser sx={{ color: `${THEME_COLOR} !important`, fontSize: 18 }} />}
                label="Integrated Patient Care & Vitals Monitoring"
                size="medium"
                sx={{
                  backgroundColor: 'rgba(183, 3, 2, 0.07)',
                  color: THEME_COLOR,
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  border: '1px solid rgba(183, 3, 2, 0.2)',
                  px: 0.5,
                }}
              />
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.25rem', sm: '3rem', md: '3.5rem' },
                lineHeight: 1.15,
                fontWeight: 800,
                color: '#0f172a',
                mb: 2.5,
              }}
            >
              Excellence in Care,{' '}
              <Box
                component="span"
                sx={{
                  color: THEME_COLOR,
                  display: 'inline',
                  position: 'relative',
                }}
              >
                Personalized
              </Box>{' '}
              for Your Wellbeing.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1.05rem', md: '1.2rem' },
                color: '#475569',
                mb: 4,
                maxWidth: { xs: '100%', lg: 750 },
                lineHeight: 1.6,
              }}
            >
              Book consultations with top medical specialists, monitor your daily vitals in real-time, and access certified clinical care with total peace of mind.
            </Typography>

            {/* Quick Search Doctor Bar */}
            <Paper
              component="form"
              onSubmit={handleSearchSubmit}
              id="hero-doctor-search-form"
              elevation={0}
              sx={{
                p: 0.8,
                display: 'flex',
                alignItems: 'center',
                border: '2px solid #e2e8f0',
                borderRadius: 3,
                mb: 3.5,
                maxWidth: { xs: '100%', sm: 650 },
                '&:focus-within': {
                  borderColor: THEME_COLOR,
                  boxShadow: '0 0 0 3px rgba(183, 3, 2, 0.12)',
                },
              }}
            >
              <TextField
                fullWidth
                placeholder="Search by doctor name, specialty, or condition (e.g., Cardiology)..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                variant="standard"
                slotProps={{
                  input: {
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start" sx={{ pl: 1.5, color: '#64748b' }}>
                        <Search />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ ml: 1 }}
              />
              <Button
                id="hero-search-submit-btn"
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  px: 3,
                  py: 1.2,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  borderRadius: 2,
                }}
              >
                Find Doctor
              </Button>
            </Paper>

            {/* Primary Action Buttons */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              <Button
                id="hero-schedule-appointment-cta"
                variant="contained"
                color="primary"
                size="large"
                onClick={onOpenBooking}
                startIcon={<EventAvailable />}
                sx={{
                  py: 1.4,
                  px: 3.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: 2,
                  boxShadow: '0 8px 20px rgba(183, 3, 2, 0.25)',
                }}
              >
                Schedule Appointment
              </Button>

              <Button
                id="hero-track-vitals-cta"
                variant="outlined"
                color="primary"
                size="large"
                onClick={onOpenVitals}
                startIcon={<Favorite sx={{ color: THEME_COLOR }} />}
                sx={{
                  py: 1.4,
                  px: 3,
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: 2,
                  borderWidth: 2,
                  backgroundColor: '#ffffff',
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'rgba(183, 3, 2, 0.04)',
                  },
                }}
              >
                Track Daily Vitals
              </Button>
            </Box>

            {/* Micro Trust Proofs */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, color: '#475569', fontSize: '0.875rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CheckCircle sx={{ color: '#16a34a', fontSize: 18 }} />
                <span>Instant Confirmation</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CheckCircle sx={{ color: '#16a34a', fontSize: 18 }} />
                <span>Zero Booking Fees</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CheckCircle sx={{ color: '#16a34a', fontSize: 18 }} />
                <span>Encrypted Patient Data</span>
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Visual Feature Card & Quick Vitals Preview */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: 'relative' }}>
              {/* Main Visual Image Card */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  backgroundColor: '#f1f5f9',
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
                  alt="Doctor consulting patient with clinical vitals"
                  sx={{
                    width: '100%',
                    height: { xs: 280, sm: 380 },
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />

                {/* Overlay Floating Badge: 4.9 Doctor Rating */}
                <Paper
                  elevation={3}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    p: 1.5,
                    borderRadius: 2.5,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      backgroundColor: '#fef3c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#d97706',
                    }}
                  >
                    <Star sx={{ fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                      4.95 / 5.0
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      1,800+ Patient Reviews
                    </Typography>
                  </Box>
                </Paper>

                {/* Bottom Floating Card: Vitals Quick Glance */}
                <Paper
                  elevation={4}
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    right: 16,
                    p: 2,
                    borderRadius: 2.5,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Favorite sx={{ color: THEME_COLOR, fontSize: 18 }} />
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                        Patient Vitals Sync
                      </Typography>
                    </Box>
                    <Chip
                      label="Optimal State"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(22, 163, 74, 0.1)',
                        color: '#16a34a',
                        fontWeight: 700,
                        height: 20,
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>

                  <Grid container spacing={1}>
                    <Grid size={4}>
                      <Box sx={{ p: 1, backgroundColor: '#f8fafc', borderRadius: 1.5, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>
                          Blood Pressure
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                          120/80
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={4}>
                      <Box sx={{ p: 1, backgroundColor: '#f8fafc', borderRadius: 1.5, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>
                          Heart Rate
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                          72 bpm
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={4}>
                      <Box sx={{ p: 1, backgroundColor: '#f8fafc', borderRadius: 1.5, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>
                          SpO2 Level
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                          99%
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

import React, { useState } from 'react';
import { Search as SearchIcon, CalendarCheck2, HeartPulse, ArrowRight, CheckCircle2 } from 'lucide-react';
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

            {/* Compact responsive doctor search */}
            <form id="hero-doctor-search-form" role="search" onSubmit={handleSearchSubmit} className="mb-5 w-full max-w-[650px]">
              <div className="flex flex-col gap-2 rounded-full border border-slate-200 bg-white p-1.5 shadow-[0_6px_24px_rgba(15,23,42,0.06)] transition focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-100 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full px-3.5">
                  <SearchIcon size={19} strokeWidth={1.8} aria-hidden="true" className="shrink-0 text-slate-400" />
                  <input
                    id="hero-doctor-search"
                    aria-label="Search doctors by name, specialty or condition"
                    type="search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Name, specialty or condition"
                    autoComplete="off"
                    className="h-10 w-full min-w-0 flex-1 rounded-full border-0 bg-transparent p-0 text-sm font-normal text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0"
                  />
                </div>
                <button id="hero-search-submit-btn" type="submit" className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#b70302] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#970201] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b70302] sm:w-auto">
                  Find Doctor <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </form>

            <div className="mb-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <button id="hero-schedule-appointment-cta" type="button" onClick={onOpenBooking} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#b70302] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(183,3,2,0.12)] transition-colors hover:bg-[#970201] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b70302]">
                <CalendarCheck2 size={18} aria-hidden="true" /> Schedule Appointment
              </button>
              <button id="hero-track-vitals-cta" type="button" onClick={onOpenVitals} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500">
                <HeartPulse size={18} aria-hidden="true" className="text-[#b70302]" /> Track Daily Vitals
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-normal text-slate-500 sm:text-[13px]">
              {['Instant Confirmation', 'Zero Booking Fees', 'Encrypted Patient Data'].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={15} aria-hidden="true" className="text-emerald-600" />{item}
                </span>
              ))}
            </div>
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

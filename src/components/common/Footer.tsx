import React from 'react';
import { Box, Container, Grid, Typography, Button, IconButton, Divider, Chip } from '@mui/material';
import {
  LocalHospital,
  Phone,
  Email,
  LocationOn,
  Security,
  VerifiedUser,
  AccessTime,
} from '@mui/icons-material';
import { THEME_COLOR } from '../../theme/theme';

interface FooterProps {
  onOpenBooking: () => void;
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onNavigate }) => {
  return (
    <Box
      id="main-footer"
      component="footer"
      sx={{
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        pt: 8,
        pb: 5,
        borderTop: `4px solid ${THEME_COLOR}`,
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        <Grid container spacing={4}>
          {/* Brand & About */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              onClick={() => onNavigate('home')}
              sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer' }}
            >
              <Box sx={{ backgroundColor: '#ffffff', borderRadius: 2, px: 1.5, py: 1, display: 'flex', alignItems: 'center' }}>
                <Box component="img" src="/logo.png" alt="G-One — Smarter Appointments, Better Patient Care" sx={{ width: { xs: 185, sm: 230 }, height: 'auto', maxHeight: 92, objectFit: 'contain' }} />
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2.5, lineHeight: 1.7 }}>
              Providing patient-centered outpatient care, multispecialty consultations, real-time vitals tracking, and rapid emergency intervention since 2012.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<VerifiedUser sx={{ color: '#22c55e !important', fontSize: 16 }} />}
                label="JCI Accredited"
                size="small"
                sx={{ backgroundColor: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' }}
              />
              <Chip
                icon={<Security sx={{ color: '#38bdf8 !important', fontSize: 16 }} />}
                label="HIPAA Compliant"
                size="small"
                sx={{ backgroundColor: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' }}
              />
            </Box>
          </Grid>

          {/* Quick Patient Services */}
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#ffffff', mb: 2 }}>
              Patient Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                id="footer-book-appointment-btn"
                onClick={onOpenBooking}
                sx={{ justifyContent: 'flex-start', color: '#94a3b8', px: 0, '&:hover': { color: '#ffffff' } }}
              >
                Schedule Appointment
              </Button>
              <Button onClick={() => onNavigate('newsroom')} sx={{ justifyContent: 'flex-start', color: '#94a3b8', px: 0, '&:hover': { color: '#ffffff' } }}>Newsroom</Button>
              <Button
                id="footer-doctors-link"
                onClick={() => onNavigate('doctors')}
                sx={{ justifyContent: 'flex-start', color: '#94a3b8', px: 0, '&:hover': { color: '#ffffff' } }}
              >
                Find Specialist Doctors
              </Button>
              <Button
                id="footer-vitals-btn"
                onClick={() => onNavigate('vitals')}
                sx={{ justifyContent: 'flex-start', color: '#94a3b8', px: 0, '&:hover': { color: '#ffffff' } }}
              >
                Track Patient Vitals
              </Button>
              <Button
                id="footer-appointments-link"
                onClick={() => onNavigate('appointments')}
                sx={{ justifyContent: 'flex-start', color: '#94a3b8', px: 0, '&:hover': { color: '#ffffff' } }}
              >
                My Consultations
              </Button>
              <Button
                id="footer-emergency-link"
                onClick={() => onNavigate('emergency')}
                sx={{ justifyContent: 'flex-start', color: '#ef4444', px: 0, fontWeight: 600 }}
              >
                24/7 Emergency Wing
              </Button>
            </Box>
          </Grid>

          {/* Medical Centers & Timings */}
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#ffffff', mb: 2 }}>
              Operating Hours
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, color: '#94a3b8', fontSize: '0.875rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <AccessTime sx={{ fontSize: 18, color: '#38bdf8', mt: 0.2 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600 }}>
                    Outpatient Clinics (OPD)
                  </Typography>
                  <span>Mon – Sat: 08:00 AM – 08:00 PM</span>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <AccessTime sx={{ fontSize: 18, color: '#ef4444', mt: 0.2 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600 }}>
                    Emergency & Trauma Center
                  </Typography>
                  <span style={{ color: '#f87171' }}>Open 24 Hours / 365 Days</span>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Contact & Address */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#ffffff', mb: 2 }}>
              Contact Center
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, color: '#94a3b8', fontSize: '0.875rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOn sx={{ fontSize: 18, color: THEME_COLOR, mt: 0.3 }} />
                <span>G-One Super Specialty Hospital, 450 Health Avenue, Medical District</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 18, color: THEME_COLOR }} />
                <span>Appointments: +1 (800) 414-6633</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 18, color: THEME_COLOR }} />
                <span>support@g-onehealthcare.com</span>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: '#1e293b' }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            color: '#64748b',
            fontSize: '0.8125rem',
          }}
        >
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            © {new Date().getFullYear()} G-One Health Care Systems. All medical rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <span>Clinical Governance</span>
            <span>Privacy Policy</span>
            <span>Patient Rights & Consent</span>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Chip,
} from '@mui/material';
import {
  LocalHospital,
  PhoneInTalk,
  CheckCircle,
} from '@mui/icons-material';
import { THEME_COLOR } from '../../theme/theme';

interface EmergencyCareSectionProps {
  onOpenBooking: () => void;
}

export const EmergencyCareSection: React.FC<EmergencyCareSectionProps> = ({ onOpenBooking }) => {
  return (
    <Box
      id="emergency-section"
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: '#fff7f7',
        borderTop: 'none',
        borderBottom: 'none',
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            backgroundColor: '#ffffff',
            border: `2px solid ${THEME_COLOR}`,
            boxShadow: '0 10px 30px rgba(183, 3, 2, 0.08)',
          }}
        >
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Chip
                  icon={<LocalHospital sx={{ color: '#ffffff !important', fontSize: 18 }} />}
                  label="24/7 LEVEL-1 TRAUMA & EMERGENCY CARE"
                  size="small"
                  sx={{
                    backgroundColor: THEME_COLOR,
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </Box>

              <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 600, color: '#0f172a', mb: 1.5 }}>
                Critical Emergency or Sudden Chest Pain?
              </Typography>

              <Typography variant="body1" sx={{ color: '#475569', mb: 3, lineHeight: 1.6 }}>
                Our rapid-response ambulance dispatch and advanced cardiac resuscitation unit operate non-stop. If you are experiencing shortness of breath, acute trauma, or stroke symptoms, reach out immediately.
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ color: '#16a34a', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                      Under 8-Minute Ambulance Dispatch
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ color: '#16a34a', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                      24/7 On-Duty Interventional Cardiologist
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ color: '#16a34a', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                      Zero Triage Delay for Cardiac Cases
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ color: '#16a34a', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                      Immediate Tele-Triage Doctor Call
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {/* Right side: Emergency Hotline Card */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  p: 3.5,
                  borderRadius: 3,
                  backgroundColor: THEME_COLOR,
                  color: '#ffffff',
                  textAlign: 'center',
                  boxShadow: '0 8px 25px rgba(183, 3, 2, 0.35)',
                }}
              >
                <PhoneInTalk sx={{ fontSize: 44, color: '#ffffff', mb: 1 }} />
                <Typography variant="caption" sx={{ color: '#fecaca', fontWeight: 600, letterSpacing: '0.08em', display: 'block' }}>
                  24/7 TOLL-FREE EMERGENCY HOTLINE
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 600,
                    color: '#ffffff',
                    my: 1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  +1 (800) 414-6633
                </Typography>
                <Typography variant="body2" sx={{ color: '#fecaca', mb: 2.5 }}>
                  Direct line to Chief Emergency Medical Officer
                </Typography>

                <Button
                  id="urgent-teleconsult-btn"
                  variant="contained"
                  fullWidth
                  onClick={onOpenBooking}
                  sx={{
                    backgroundColor: '#ffffff',
                    color: THEME_COLOR,
                    fontWeight: 600,
                    py: 1.3,
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                    },
                  }}
                >
                  Request Urgent Priority Slot
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

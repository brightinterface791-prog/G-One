import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  TextField,
  MenuItem,
  Alert,
  Divider,
} from '@mui/material';
import {
  PhoneInTalk,
  LocalHospital,
  AirportShuttle,
  HealthAndSafety,
  Warning,
  CheckCircle,
  LocationOn,
  Schedule,
  Shield,
} from '@mui/icons-material';
import { THEME_COLOR } from '../theme/theme';

interface EmergencyPageProps {
  onOpenBooking: () => void;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ onOpenBooking }) => {
  const [callerName, setCallerName] = useState('');
  const [callerPhone, setCallerPhone] = useState('');
  const [emergencyType, setEmergencyType] = useState('Cardiac / Chest Pain');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    if (callerPhone.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <Box id="emergency-page" sx={{ py: { xs: 4, md: 6 }, backgroundColor: '#f8fafc', minHeight: '80vh' }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        {/* Red Emergency Header Alert */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 4,
            borderRadius: 3,
            backgroundColor: '#ffffff',
            border: '2px solid #dc2626',
            boxShadow: '0 10px 30px rgba(220, 38, 38, 0.1)',
          }}
        >
          <Grid container spacing={3} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#dc2626',
                    animation: 'pulse 1.5s infinite',
                    boxShadow: '0 0 10px #dc2626',
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#dc2626', letterSpacing: '0.05em' }}>
                  24/7 LEVEL-1 TRAUMA & EMERGENCY DISPATCH ACTIVE
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 600, color: '#0f172a', mb: 1 }}>
                Instant Emergency & Ambulance Support
              </Typography>
              <Typography variant="body1" sx={{ color: '#475569', mb: 3 }}>
                If you or someone near you is experiencing severe chest pain, sudden numbness, difficulty breathing, or acute injury, connect with our emergency hotline immediately.
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PhoneInTalk />}
                  onClick={() => window.alert('Calling G-One 24/7 Emergency Dispatch: +1 (800) 41-44663')}
                  sx={{
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 3.5,
                    '&:hover': { backgroundColor: '#b91c1c' },
                  }}
                >
                  Call +1 (800) 41-G-ONE
                </Button>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Average response & triage dispatch time: <strong>&lt; 4 minutes</strong>
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: '#fef2f2',
                  borderRadius: 3,
                  border: '1px solid #fecaca',
                  textAlign: 'center',
                }}
              >
                <AirportShuttle sx={{ fontSize: 56, color: '#dc2626', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#991b1b', mb: 0.5 }}>
                  Ambulance Fleet on Standby
                </Typography>
                <Typography variant="caption" sx={{ color: '#7f1d1d', display: 'block', mb: 2 }}>
                  Equipped with Advanced Cardiac Life Support (ACLS), portable ventilators, and onboard emergency physicians.
                </Typography>
                <Chip label="12 Ambulances Live in Metro Area" color="error" size="small" sx={{ fontWeight: 600 }} />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Two Columns: Triage Checklist & Callback Form */}
        <Grid container spacing={4}>
          {/* Triage Checklist */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper elevation={0} sx={{ p: 3.5, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Warning sx={{ color: '#d97706' }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#0f172a' }}>
                  Emergency Triage Red Flags
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                Do not wait for regular clinic hours if any of these acute clinical signs occur:
              </Typography>

              <Grid container spacing={2}>
                {[
                  {
                    title: 'Cardiac Symptoms',
                    desc: 'Crushing chest pressure, radiating arm or jaw pain, cold sweats, sudden arrhythmia.',
                  },
                  {
                    title: 'Stroke (F.A.S.T.)',
                    desc: 'Facial drooping, arm weakness, slurred speech, sudden loss of vision or balance.',
                  },
                  {
                    title: 'Respiratory Distress',
                    desc: 'Severe shortness of breath, oxygen saturation <90%, persistent blue lips or face.',
                  },
                  {
                    title: 'Severe Trauma & Head Injury',
                    desc: 'High-impact fractures, loss of consciousness, persistent vomiting after a fall.',
                  },
                ].map((item, idx) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                    <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #f1f5f9' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a', mb: 0.5 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#475569', display: 'block', lineHeight: 1.5 }}>
                        {item.desc}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Shield sx={{ color: '#16a34a' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                    NABH Level 1 Trauma Center Certified
                  </Typography>
                </Box>
                <Button variant="outlined" size="small" onClick={onOpenBooking}>
                  Non-Emergency Booking
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Rapid Emergency Callback Request */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper elevation={0} sx={{ p: 3.5, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', height: '100%' }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#0f172a', mb: 1 }}>
                Priority Emergency Callback
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                Leave your number and our ER Medical Officer will call you back in under 60 seconds.
              </Typography>

              {submitted ? (
                <Alert severity="success" sx={{ borderRadius: 2, mb: 2 }}>
                  <strong>Callback Request Received!</strong> Our ER duty team is dialing {callerPhone} now. Stay on the line.
                </Alert>
              ) : (
                <Box component="form" onSubmit={handleSubmitEmergency} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    fullWidth
                    label="Patient / Caller Name"
                    required
                    value={callerName}
                    onChange={(e) => setCallerName(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Direct Contact Phone Number"
                    required
                    type="tel"
                    value={callerPhone}
                    onChange={(e) => setCallerPhone(e.target.value)}
                  />
                  <TextField
                    select
                    fullWidth
                    label="Chief Nature of Emergency"
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value)}
                  >
                    <MenuItem value="Cardiac / Chest Pain">Cardiac / Chest Pain</MenuItem>
                    <MenuItem value="Stroke / Neurological">Stroke / Neurological</MenuItem>
                    <MenuItem value="Trauma / Road Accident">Trauma / Road Accident</MenuItem>
                    <MenuItem value="Pediatric Emergency">Pediatric Emergency</MenuItem>
                    <MenuItem value="Respiratory Crisis">Respiratory Crisis</MenuItem>
                    <MenuItem value="Other Acute Condition">Other Acute Condition</MenuItem>
                  </TextField>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    color="error"
                    sx={{ fontWeight: 600, py: 1.5 }}
                  >
                    Request Emergency Callback Now
                  </Button>
                </Box>
              )}

              <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8fafc', borderRadius: 2, textAlign: 'center' }}>
                <LocationOn sx={{ color: THEME_COLOR, mb: 0.5 }} />
                <Typography variant="caption" sx={{ display: 'block', color: '#64748b', fontWeight: 600 }}>
                  Hospital Emergency Wing: 4500 Medical Center Blvd, Sector 4, North Wing (24/7 Gate 2 Access)
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

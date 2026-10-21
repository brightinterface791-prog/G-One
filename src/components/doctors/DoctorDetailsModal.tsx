import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  Rating,
  Divider,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Close,
  EventAvailable,
  Star,
  School,
  Work,
  LocationOn,
  Language,
  CheckCircle,
  Schedule,
  LocalHospital,
} from '@mui/icons-material';
import { Doctor } from '../../types';
import { THEME_COLOR } from '../../theme/theme';

interface DoctorDetailsModalProps {
  doctor: Doctor | null;
  open: boolean;
  onClose: () => void;
  onBookAppointment: (doctor: Doctor) => void;
}

export const DoctorDetailsModal: React.FC<DoctorDetailsModalProps> = ({
  doctor,
  open,
  onClose,
  onBookAppointment,
}) => {
  if (!doctor) return null;

  return (
    <Dialog
      id="doctor-details-modal"
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: 3 } },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Doctor Medical Profile
        </Typography>
        <IconButton onClick={onClose} aria-label="close modal">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Left Column: Avatar & Quick Info */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                src={doctor.avatar}
                alt={doctor.name}
                sx={{
                  width: 140,
                  height: 140,
                  borderRadius: 3,
                  mx: 'auto',
                  mb: 2,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  border: '3px solid #ffffff',
                }}
              />
              <Chip
                label={doctor.specialty}
                color="primary"
                sx={{ fontWeight: 700, mb: 1 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                {doctor.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1.5 }}>
                {doctor.department}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5, mb: 2 }}>
                <Rating value={doctor.rating} precision={0.1} readOnly size="small" />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {doctor.rating}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  ({doctor.reviewCount})
                </Typography>
              </Box>

              <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                  Consultation Fee
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: THEME_COLOR }}>
                  ${doctor.consultationFee}
                </Typography>
              </Paper>
            </Box>
          </Grid>

          {/* Right Column: Bio, Qualifications, Schedule */}
          <Grid size={{ xs: 12, sm: 8 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
              About Doctor
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.7, mb: 3 }}>
              {doctor.about}
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <School sx={{ color: THEME_COLOR, fontSize: 22, mt: 0.3 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block' }}>
                      Education & Degree
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      {doctor.qualification}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Work sx={{ color: '#0e7490', fontSize: 22, mt: 0.3 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block' }}>
                      Clinical Experience
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      {doctor.experienceYears}+ Years Active Practice
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <LocationOn sx={{ color: '#d97706', fontSize: 22, mt: 0.3 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block' }}>
                      OPD Clinic Location
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      {doctor.hospitalLocation}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Language sx={{ color: '#16a34a', fontSize: 22, mt: 0.3 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block' }}>
                      Languages Spoken
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      {doctor.languages.join(', ')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Weekly Schedule */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 1.5 }}>
              Available Consultation Days
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {doctor.availableDays.map((day) => (
                <Chip key={day} label={day} size="small" sx={{ backgroundColor: '#f1f5f9', fontWeight: 600 }} />
              ))}
            </Box>

            {/* Slots */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 1.5 }}>
              Daily OPD Time Slots
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {doctor.availableSlots.map((slot) => (
                <Chip
                  key={slot}
                  label={slot}
                  icon={<Schedule sx={{ fontSize: 16 }} />}
                  size="small"
                  sx={{ backgroundColor: 'rgba(183, 3, 2, 0.05)', color: THEME_COLOR, fontWeight: 700 }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <Button onClick={onClose} sx={{ color: '#64748b' }}>
          Close
        </Button>
        <Button
          id="doctor-modal-book-cta"
          variant="contained"
          color="primary"
          startIcon={<EventAvailable />}
          onClick={() => {
            onClose();
            onBookAppointment(doctor);
          }}
          sx={{ fontWeight: 700, px: 3 }}
        >
          Book Consultation with {doctor.name}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

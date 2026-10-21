import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Divider,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Close,
  Assignment,
  CalendarMonth,
  AccessTime,
  LocationOn,
  Videocam,
  Phone,
  Cancel,
  EditCalendar,
} from '@mui/icons-material';
import { Appointment } from '../../types';
import { THEME_COLOR } from '../../theme/theme';

interface MyAppointmentsModalProps {
  open: boolean;
  onClose: () => void;
  appointments: Appointment[];
  onCancelAppointment: (id: string, reason?: string) => void;
  onRescheduleAppointment: (id: string, newDate: string, newTimeSlot: string) => void;
  onOpenNewBooking: () => void;
}

export const MyAppointmentsModal: React.FC<MyAppointmentsModalProps> = ({
  open,
  onClose,
  appointments,
  onCancelAppointment,
  onRescheduleAppointment,
  onOpenNewBooking,
}) => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [newTimeSlot, setNewTimeSlot] = useState<string>('10:00 AM');

  const upcomingList = appointments.filter((a) => a.status === 'Confirmed' || a.status === 'Rescheduled');
  const pastList = appointments.filter((a) => a.status === 'Completed' || a.status === 'Cancelled');

  const currentList = tabValue === 0 ? upcomingList : pastList;

  const handleConfirmReschedule = (id: string) => {
    if (!newDate) {
      alert('Please choose a valid reschedule date');
      return;
    }
    onRescheduleAppointment(id, newDate, newTimeSlot);
    setReschedulingId(null);
  };

  return (
    <Dialog
      id="my-appointments-modal"
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: 3 } },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Assignment sx={{ color: THEME_COLOR, fontSize: 26 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            My Consultations & Visits
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="close appointments modal">
          <Close />
        </IconButton>
      </DialogTitle>

      <Box sx={{ px: 3, borderBottom: '1px solid #e2e8f0' }}>
        <Tabs
          value={tabValue}
          onChange={(_, val) => {
            setTabValue(val);
            setReschedulingId(null);
          }}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label={`Upcoming Visits (${upcomingList.length})`} sx={{ fontWeight: 700, textTransform: 'none' }} />
          <Tab label={`Past & History (${pastList.length})`} sx={{ fontWeight: 700, textTransform: 'none' }} />
        </Tabs>
      </Box>

      <DialogContent sx={{ py: 3, minHeight: 320 }}>
        {currentList.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CalendarMonth sx={{ fontSize: 56, color: '#cbd5e1', mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#475569', mb: 1 }}>
              {tabValue === 0 ? 'No Upcoming Consultations' : 'No Past Consultation Records'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
              Schedule a visit with any of our senior doctors whenever needed.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                onClose();
                onOpenNewBooking();
              }}
              sx={{ fontWeight: 700 }}
            >
              Book Doctor Appointment
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {currentList.map((apt) => {
              const isRescheduling = reschedulingId === apt.id;

              return (
                <Paper
                  key={apt.id}
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    transition: 'border-color 0.2s',
                    '&:hover': {
                      borderColor: '#cbd5e1',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Avatar src={apt.doctorAvatar} alt={apt.doctorName} sx={{ width: 56, height: 56, borderRadius: 2 }} />
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                            {apt.doctorName}
                          </Typography>
                          <Chip
                            label={apt.status}
                            size="small"
                            color={
                              apt.status === 'Confirmed'
                                ? 'success'
                                : apt.status === 'Rescheduled'
                                ? 'warning'
                                : apt.status === 'Completed'
                                ? 'default'
                                : 'error'
                            }
                            sx={{ fontWeight: 700, height: 22 }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ color: THEME_COLOR, fontWeight: 700, display: 'block' }}>
                          {apt.doctorSpecialty}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          Ref: <strong>{apt.bookingRef}</strong>
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      icon={
                        apt.consultationType === 'Video Call' ? (
                          <Videocam sx={{ fontSize: 16 }} />
                        ) : apt.consultationType === 'Instant Audio' ? (
                          <Phone sx={{ fontSize: 16 }} />
                        ) : (
                          <LocationOn sx={{ fontSize: 16 }} />
                        )
                      }
                      label={apt.consultationType}
                      sx={{
                        backgroundColor: '#f1f5f9',
                        color: '#334155',
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  {/* Date & Time Info */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, my: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarMonth sx={{ color: THEME_COLOR, fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                        Date: {apt.date}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime sx={{ color: '#0e7490', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                        Slot: {apt.timeSlot}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Patient: <strong>{apt.patientName}</strong>
                      </Typography>
                    </Box>
                  </Box>

                  {apt.symptoms && (
                    <Box sx={{ p: 1.5, backgroundColor: '#f8fafc', borderRadius: 2, my: 1.5 }}>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block' }}>
                        Reason for Visit / Symptoms:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#334155' }}>
                        {apt.symptoms}
                      </Typography>
                    </Box>
                  )}

                  {/* Reschedule inline editor */}
                  {isRescheduling && (
                    <Paper elevation={0} sx={{ p: 2, backgroundColor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 2, my: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#92400e', mb: 1.5 }}>
                        Select New Appointment Date & Time
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                        <TextField
                          type="date"
                          size="small"
                          label="New Date"
                          slotProps={{ inputLabel: { shrink: true } }}
                          value={newDate || apt.date}
                          onChange={(e) => setNewDate(e.target.value)}
                        />
                        <TextField
                          select
                          size="small"
                          label="Time Slot"
                          value={newTimeSlot}
                          onChange={(e) => setNewTimeSlot(e.target.value)}
                          sx={{ minWidth: 140 }}
                        >
                          {['09:00 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'].map((slot) => (
                            <MenuItem key={slot} value={slot}>
                              {slot}
                            </MenuItem>
                          ))}
                        </TextField>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleConfirmReschedule(apt.id)}
                          sx={{ fontWeight: 700 }}
                        >
                          Save Reschedule
                        </Button>
                        <Button
                          size="small"
                          onClick={() => setReschedulingId(null)}
                          sx={{ color: '#64748b' }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Paper>
                  )}

                  {/* Action Buttons for upcoming appointments */}
                  {(apt.status === 'Confirmed' || apt.status === 'Rescheduled') && !isRescheduling && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 2 }}>
                      <Button
                        id={`cancel-apt-${apt.id}`}
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Cancel />}
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to cancel appointment ${apt.bookingRef}?`)) {
                            onCancelAppointment(apt.id, 'Patient requested cancellation');
                          }
                        }}
                        sx={{ fontWeight: 600 }}
                      >
                        Cancel
                      </Button>
                      <Button
                        id={`reschedule-apt-${apt.id}`}
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<EditCalendar />}
                        onClick={() => {
                          setReschedulingId(apt.id);
                          setNewDate(apt.date);
                        }}
                        sx={{ fontWeight: 600 }}
                      >
                        Reschedule
                      </Button>
                      {apt.consultationType === 'Video Call' && (
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          startIcon={<Videocam />}
                          onClick={() => alert(`Connecting to Secure Health Video Room for ${apt.doctorName}...`)}
                          sx={{ fontWeight: 700 }}
                        >
                          Join Video Room
                        </Button>
                      )}
                    </Box>
                  )}
                </Paper>
              );
            })}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <Button onClick={onClose} sx={{ color: '#475569', fontWeight: 600 }}>
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onClose();
            onOpenNewBooking();
          }}
          sx={{ fontWeight: 700 }}
        >
          Book Another Visit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

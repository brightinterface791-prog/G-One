import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import {
  Close,
  EventAvailable,
  CheckCircle,
  LocationOn,
  CalendarMonth,
  AccessTime,
  MedicalServices,
  ArrowBack,
  ArrowForward,
  Print,
  MeetingRoom,
  Assignment,
} from '@mui/icons-material';
import confetti from 'canvas-confetti';
import { Doctor, ConsultationType, Appointment, DynamicFormField } from '../../types';
import { THEME_COLOR } from '../../theme/theme';

interface BookAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  doctors: Doctor[];
  initialDoctor?: Doctor | null;
  initialSpecialty?: string;
  onBookingSuccess: (appointment: Appointment) => void;
  getFieldsForDoctor?: (doctorId?: string) => DynamicFormField[];
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  open,
  onClose,
  doctors,
  initialDoctor,
  initialSpecialty,
  onBookingSuccess,
  getFieldsForDoctor,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  // Step 1 states
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(initialSpecialty || 'All');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(initialDoctor?.id || '');

  // Step 2 states
  const [consultationType, setConsultationType] = useState<ConsultationType>('In-Person OPD');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Step 3 states: Patient details
  const [patientName, setPatientName] = useState('Alex Rivera');
  const [patientEmail, setPatientEmail] = useState('alex.rivera@example.com');
  const [patientPhone, setPatientPhone] = useState('+1 (555) 234-5678');
  const [patientAge, setPatientAge] = useState<number>(38);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [symptoms, setSymptoms] = useState('');

  // Dynamic Custom Questions responses
  const [dynamicResponses, setDynamicResponses] = useState<Record<string, any>>({});

  // Step 4 state: Confirmed appointment
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialDoctor) {
      setSelectedDoctorId(initialDoctor.id);
      setSelectedSpecialty(initialDoctor.specialty);
    } else if (initialSpecialty && initialSpecialty !== 'All') {
      setSelectedSpecialty(initialSpecialty);
      const doc = doctors.find((d) => d.specialty.toLowerCase() === initialSpecialty.toLowerCase());
      if (doc) setSelectedDoctorId(doc.id);
    } else if (doctors.length > 0 && !selectedDoctorId) {
      setSelectedDoctorId(doctors[0].id);
    }
  }, [initialDoctor, initialSpecialty, doctors]);

  // Set default date to tomorrow if not set
  useEffect(() => {
    if (!selectedDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [selectedDate]);

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  useEffect(() => {
    if (selectedDoctor && selectedDoctor.availableSlots.length > 0 && !selectedTimeSlot) {
      setSelectedTimeSlot(selectedDoctor.availableSlots[0]);
    }
  }, [selectedDoctor, selectedTimeSlot]);

  // Active dynamic fields for this doctor/global
  const activeDynamicFields: DynamicFormField[] = getFieldsForDoctor
    ? getFieldsForDoctor(selectedDoctor?.id)
    : [];

  const filteredDoctors = selectedSpecialty === 'All'
    ? doctors
    : doctors.filter((d) => d.specialty.toLowerCase() === selectedSpecialty.toLowerCase());

  const handleNext = () => {
    const newErrors: { [key: string]: string } = {};

    if (activeStep === 0) {
      if (!selectedDoctorId) newErrors.doctor = 'Please select a doctor';
    } else if (activeStep === 1) {
      if (!selectedDate) newErrors.date = 'Please choose an appointment date';
      if (!selectedTimeSlot) newErrors.timeSlot = 'Please pick a consultation time slot';
    } else if (activeStep === 2) {
      if (!patientName.trim()) newErrors.name = 'Patient name is required';
      if (!patientEmail.trim() || !patientEmail.includes('@')) newErrors.email = 'Valid email is required';
      if (!patientPhone.trim()) newErrors.phone = 'Phone number is required';
      if (!patientAge || patientAge <= 0) newErrors.age = 'Valid age is required';
      if (!symptoms.trim()) newErrors.symptoms = 'Please describe the symptoms or reason for consultation';

      // Validate required dynamic fields
      activeDynamicFields.forEach((field) => {
        if (field.required) {
          const val = dynamicResponses[field.id];
          if (val === undefined || val === null || val === '' || val === false) {
            newErrors[field.id] = `${field.label} is required`;
          }
        }
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    if (activeStep === 2) {
      // Execute booking
      const newApt: Appointment = {
        id: `apt-${Date.now()}`,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        doctorAvatar: selectedDoctor.avatar,
        patientName,
        patientEmail,
        patientPhone,
        patientAge,
        patientGender,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        consultationType,
        symptoms,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
        bookingRef: `G1-${selectedDoctor.specialty.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        notes: `Consultation at ${selectedDoctor.sittingSchedule?.roomChamber || selectedDoctor.hospitalLocation}`,
        chamberRoom: selectedDoctor.sittingSchedule?.roomChamber || selectedDoctor.hospitalLocation,
        customResponses: { ...dynamicResponses },
      };

      setConfirmedAppointment(newApt);
      onBookingSuccess(newApt);
      setActiveStep(3);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: [THEME_COLOR, '#16a34a', '#0284c7', '#d97706'],
        });
      } catch (e) {
        // Confetti fallback
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleResetAndClose = () => {
    setActiveStep(0);
    setConfirmedAppointment(null);
    setDynamicResponses({});
    onClose();
  };

  const steps = ['Select Doctor', 'Date & Shift', 'Patient Intake', 'Confirmation'];

  // Generate next 7 days for quick date selector
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + (i + 1));
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' }),
    };
  });

  return (
    <Dialog
      id="book-appointment-modal"
      open={open}
      onClose={handleResetAndClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            overflow: 'hidden',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2.5,
          borderBottom: '1px solid #f1f5f9',
          backgroundColor: '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              backgroundColor: 'rgba(183, 3, 2, 0.08)',
              color: THEME_COLOR,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EventAvailable sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: '"SF Pro Display", sans-serif',
                fontSize: '20px',
                fontWeight: 600,
                color: '#0f172a',
                lineHeight: 1.25,
              }}
            >
              {activeStep === 3 ? 'Appointment Registered Successfully' : 'Hospital Outpatient Consultation Booking'}
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#64748b', mt: 0.25 }}>
              {activeStep === 3 ? 'Booking confirmed • QR code issued' : 'Schedule your verified specialist hospital consultation'}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleResetAndClose}
          aria-label="close modal"
          size="small"
          sx={{
            color: '#94a3b8',
            borderRadius: '8px',
            '&:hover': { backgroundColor: '#f1f5f9', color: '#0f172a' },
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box sx={{ px: 3, pt: 1, pb: 2 }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            '& .MuiStepIcon-root.Mui-active': { color: THEME_COLOR },
            '& .MuiStepIcon-root.Mui-completed': { color: '#16a34a' },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: '0.78rem', fontWeight: 700 } }}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Divider />

      <DialogContent sx={{ py: 2.5 }}>
        {/* STEP 0: Select Doctor & Specialty */}
        {activeStep === 0 && (
          <Box>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="specialty-select-label">Filter Department</InputLabel>
                  <Select
                    labelId="specialty-select-label"
                    value={selectedSpecialty}
                    label="Filter Department"
                    onChange={(e) => {
                      const spec = e.target.value;
                      setSelectedSpecialty(spec);
                      const matchingDocs = spec === 'All' ? doctors : doctors.filter((d) => d.specialty.toLowerCase() === spec.toLowerCase());
                      if (matchingDocs.length > 0) {
                        setSelectedDoctorId(matchingDocs[0].id);
                      }
                    }}
                  >
                    <MenuItem value="All">All Clinical Departments</MenuItem>
                    {Array.from(new Set(doctors.map((d) => d.specialty))).map((sp) => (
                      <MenuItem key={sp} value={sp}>
                        {sp}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 8 }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.82rem', mt: 0.5 }}>
                  Select the attending physician for this hospital consultation or procedure:
                </Typography>
              </Grid>
            </Grid>

            {errors.doctor && (
              <Alert severity="error" sx={{ mt: 2, fontSize: '0.82rem' }}>
                {errors.doctor}
              </Alert>
            )}

            <Grid container spacing={2} sx={{ mt: 1 }}>
              {filteredDoctors.map((doc) => {
                const isSelected = selectedDoctorId === doc.id;
                const schedule = doc.sittingSchedule;
                return (
                  <Grid size={{ xs: 12, sm: 6 }} key={doc.id}>
                    <Paper
                      elevation={0}
                      onClick={() => setSelectedDoctorId(doc.id)}
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        border: isSelected ? `2px solid ${THEME_COLOR}` : '1px solid #e2e8f0',
                        backgroundColor: isSelected ? 'rgba(183, 3, 2, 0.02)' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: 1.5,
                        alignItems: 'center',
                        transition: 'all 0.15s',
                        '&:hover': {
                          borderColor: THEME_COLOR,
                        },
                      }}
                    >
                      <Avatar src={doc.avatar} alt={doc.name} sx={{ width: 52, height: 52, borderRadius: 2 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>
                            {doc.name}
                          </Typography>
                          {isSelected && <CheckCircle sx={{ color: THEME_COLOR, fontSize: 18 }} />}
                        </Box>
                        <Typography variant="caption" sx={{ color: THEME_COLOR, fontWeight: 700, display: 'block' }}>
                          {doc.specialty}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.74rem' }}>
                          {schedule?.roomChamber || doc.hospitalLocation}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#16a34a' }}>
                            ${doc.consultationFee} Fee
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            ★ {doc.rating} ({doc.reviewCount})
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {/* STEP 1: Mode, Date & Time */}
        {activeStep === 1 && selectedDoctor && (
          <Box>
            {/* Selected doctor summary badge */}
            <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2.5, mb: 2.5, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={selectedDoctor.avatar} alt={selectedDoctor.name} sx={{ width: 44, height: 44, borderRadius: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                  Attending Doctor: {selectedDoctor.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                  {selectedDoctor.specialty} • {selectedDoctor.sittingSchedule?.roomChamber || selectedDoctor.hospitalLocation}
                </Typography>
                <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 600 }}>
                  Hours: {selectedDoctor.sittingSchedule?.shiftMorning || '09:00 AM - 01:00 PM'}
                </Typography>
              </Box>
              <Chip label={`$${selectedDoctor.consultationFee} Fee`} color="primary" sx={{ fontWeight: 700, height: 24, fontSize: '0.75rem' }} />
            </Paper>

            {/* Consultation Mode */}
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1, fontSize: '0.85rem' }}>
              1. Select Clinical Consultation Modality
            </Typography>
            <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
              {[
                { type: 'In-Person OPD' as ConsultationType, icon: <MeetingRoom sx={{ fontSize: 20 }} />, label: 'Hospital OPD Visit', desc: 'Face-to-face consultation at clinic chamber' },
                { type: 'Follow-up Consultation' as ConsultationType, icon: <Assignment sx={{ fontSize: 20 }} />, label: 'Follow-up Review', desc: 'Treatment review & diagnostic reports' },
                { type: 'Diagnostic Assessment' as ConsultationType, icon: <MedicalServices sx={{ fontSize: 20 }} />, label: 'Diagnostic Assessment', desc: 'Pre-procedure triage & clinical intake' },
              ].map((mode) => {
                const isSelected = consultationType === mode.type;
                return (
                  <Grid size={{ xs: 12, sm: 4 }} key={mode.type}>
                    <Paper
                      elevation={0}
                      onClick={() => setConsultationType(mode.type)}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: isSelected ? `2px solid ${THEME_COLOR}` : '1px solid #e2e8f0',
                        backgroundColor: isSelected ? 'rgba(183, 3, 2, 0.03)' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s',
                        '&:hover': { borderColor: THEME_COLOR },
                      }}
                    >
                      <Box sx={{ color: isSelected ? THEME_COLOR : '#64748b', mb: 0.5 }}>{mode.icon}</Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.8rem' }}>
                        {mode.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>
                        {mode.desc}
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            {/* Date Selection */}
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1, fontSize: '0.85rem' }}>
              2. Select Appointment Date
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, mb: 2.5 }}>
              {availableDates.map((item) => {
                const isSelected = selectedDate === item.dateStr;
                return (
                  <Paper
                    key={item.dateStr}
                    elevation={0}
                    onClick={() => setSelectedDate(item.dateStr)}
                    sx={{
                      p: 1.2,
                      minWidth: 72,
                      textAlign: 'center',
                      borderRadius: 2,
                      border: isSelected ? `2px solid ${THEME_COLOR}` : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? THEME_COLOR : '#ffffff',
                      color: isSelected ? '#ffffff' : '#0f172a',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: isSelected ? '#fecaca' : '#64748b', fontSize: '0.72rem' }}>
                      {item.dayName}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1, fontSize: '1.1rem' }}>
                      {item.dayNumber}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', fontSize: '0.68rem', color: isSelected ? '#ffffff' : '#64748b' }}>
                      {item.monthName}
                    </Typography>
                  </Paper>
                );
              })}
            </Box>

            {/* Time Slot Selection */}
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1, fontSize: '0.85rem' }}>
              3. Available OPD Time Slots ({selectedDoctor.sittingSchedule?.slotDurationMinutes || 20}m duration)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedDoctor.availableSlots.map((slot) => {
                const isSelected = selectedTimeSlot === slot;
                return (
                  <Chip
                    key={slot}
                    label={slot}
                    icon={<AccessTime sx={{ fontSize: '14px !important' }} />}
                    onClick={() => setSelectedTimeSlot(slot)}
                    sx={{
                      p: 1,
                      fontWeight: 700,
                      borderRadius: 2,
                      fontSize: '0.76rem',
                      border: isSelected ? `2px solid ${THEME_COLOR}` : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? 'rgba(183, 3, 2, 0.1)' : '#ffffff',
                      color: isSelected ? THEME_COLOR : '#334155',
                      '&:hover': {
                        backgroundColor: 'rgba(183, 3, 2, 0.05)',
                      },
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        )}

        {/* STEP 2: Patient Info & Dynamic Intake Questions */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5, fontSize: '0.9rem' }}>
              A. Patient Demographics
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Patient Full Name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Contact Email"
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Phone Number"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Age"
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(Number(e.target.value))}
                  error={!!errors.age}
                  helperText={errors.age}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="gender-select-label">Gender</InputLabel>
                  <Select
                    labelId="gender-select-label"
                    value={patientGender}
                    label="Gender"
                    onChange={(e) => setPatientGender(e.target.value as any)}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Chief Clinical Complaint / Reason for Visit"
                  multiline
                  rows={2}
                  placeholder="E.g. Recurrent knee pain when walking, reviewing lab vitals..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  error={!!errors.symptoms}
                  helperText={errors.symptoms}
                  required
                />
              </Grid>
            </Grid>

            {/* Dynamic Custom Fields Section */}
            {activeDynamicFields.length > 0 && (
              <Box sx={{ mt: 3, pt: 2.5, borderTop: '1px solid #e2e8f0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: THEME_COLOR, fontSize: '0.88rem' }}>
                    B. Hospital Dynamic Intake Questionnaire ({selectedDoctor.name})
                  </Typography>
                  <Chip label="Required for OPD" size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }} />
                </Box>

                <Grid container spacing={2}>
                  {activeDynamicFields.map((field) => {
                    const hasError = !!errors[field.id];
                    return (
                      <Grid size={{ xs: 12, sm: field.type === 'textarea' ? 12 : 6 }} key={field.id}>
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', display: 'block', mb: 0.4 }}>
                            {field.label} {field.required && <span style={{ color: '#dc2626' }}>*</span>}
                          </Typography>

                          {field.type === 'text' && (
                            <TextField
                              fullWidth
                              size="small"
                              placeholder={field.placeholder}
                              value={dynamicResponses[field.id] || ''}
                              onChange={(e) => setDynamicResponses({ ...dynamicResponses, [field.id]: e.target.value })}
                              error={hasError}
                              helperText={errors[field.id] || field.helperText}
                            />
                          )}

                          {field.type === 'textarea' && (
                            <TextField
                              fullWidth
                              multiline
                              rows={2}
                              size="small"
                              placeholder={field.placeholder}
                              value={dynamicResponses[field.id] || ''}
                              onChange={(e) => setDynamicResponses({ ...dynamicResponses, [field.id]: e.target.value })}
                              error={hasError}
                              helperText={errors[field.id] || field.helperText}
                            />
                          )}

                          {field.type === 'number' && (
                            <TextField
                              fullWidth
                              type="number"
                              size="small"
                              placeholder={field.placeholder}
                              value={dynamicResponses[field.id] || ''}
                              onChange={(e) => setDynamicResponses({ ...dynamicResponses, [field.id]: e.target.value })}
                              error={hasError}
                              helperText={errors[field.id] || field.helperText}
                            />
                          )}

                          {field.type === 'select' && (
                            <FormControl fullWidth size="small" error={hasError}>
                              <Select
                                value={dynamicResponses[field.id] || ''}
                                onChange={(e) => setDynamicResponses({ ...dynamicResponses, [field.id]: e.target.value })}
                                displayEmpty
                              >
                                <MenuItem value="" disabled>
                                  <em>{field.placeholder || 'Select choice...'}</em>
                                </MenuItem>
                                {(field.options || []).map((opt) => (
                                  <MenuItem key={opt} value={opt}>
                                    {opt}
                                  </MenuItem>
                                ))}
                              </Select>
                              {hasError && <Typography variant="caption" sx={{ color: '#dc2626', mt: 0.3 }}>{errors[field.id]}</Typography>}
                            </FormControl>
                          )}

                          {field.type === 'radio' && (
                            <RadioGroup
                              value={dynamicResponses[field.id] || ''}
                              onChange={(e) => setDynamicResponses({ ...dynamicResponses, [field.id]: e.target.value })}
                            >
                              {(field.options || []).map((opt) => (
                                <FormControlLabel
                                  key={opt}
                                  value={opt}
                                  control={<Radio />}
                                  label={opt}
                                />
                              ))}
                            </RadioGroup>
                          )}

                          {field.type === 'checkbox' && (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={!!dynamicResponses[field.id]}
                                  onChange={(e) => setDynamicResponses({ ...dynamicResponses, [field.id]: e.target.checked })}
                                />
                              }
                              label={field.placeholder || 'Confirmed'}
                            />
                          )}
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}
          </Box>
        )}

        {/* STEP 3: Booking Success Confirmation */}
        {activeStep === 3 && confirmedAppointment && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 1.5,
              }}
            >
              <CheckCircle sx={{ fontSize: 38 }} />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5, fontSize: '1.25rem' }}>
              Consultation Successfully Scheduled!
            </Typography>

            <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5, fontSize: '0.84rem' }}>
              Patient has been queued in the hospital OPD roster. Consultation slip is ready.
            </Typography>

            {/* Booking Slip Card */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                backgroundColor: '#f8fafc',
                border: '1px dashed #cbd5e1',
                maxWidth: 520,
                mx: 'auto',
                textAlign: 'left',
                mb: 2.5,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, pb: 1, borderBottom: '1px solid #e2e8f0' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    REGISTRATION TOKEN
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, color: THEME_COLOR }}>
                    {confirmedAppointment.bookingRef}
                  </Typography>
                </Box>
                <Chip label="CONFIRMED OPD" color="success" size="small" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
              </Box>

              <Grid container spacing={1.5}>
                <Grid size={6}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Attending Physician
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>
                    {confirmedAppointment.doctorName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: THEME_COLOR, fontWeight: 600 }}>
                    {confirmedAppointment.doctorSpecialty}
                  </Typography>
                </Grid>

                <Grid size={6}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Schedule & Time
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>
                    {confirmedAppointment.date}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#0f172a', fontWeight: 600 }}>
                    {confirmedAppointment.timeSlot} ({confirmedAppointment.consultationType})
                  </Typography>
                </Grid>

                <Grid size={6}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Patient
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>
                    {confirmedAppointment.patientName} ({confirmedAppointment.patientAge}y, {confirmedAppointment.patientGender})
                  </Typography>
                </Grid>

                <Grid size={6}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    OPD Chamber Room
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.84rem' }}>
                    {confirmedAppointment.chamberRoom || selectedDoctor.hospitalLocation}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
              <Button
                variant="contained"
                onClick={handleResetAndClose}
                sx={{
                  backgroundColor: THEME_COLOR,
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textTransform: 'none',
                  borderRadius: '9999px',
                  px: 4,
                  '&:hover': { backgroundColor: '#900201' },
                }}
              >
                Close & Return to Dashboard
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      {activeStep < 3 && (
        <DialogActions sx={{ px: 3, py: 2, backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              startIcon={<ArrowBack />}
              variant="outlined"
              sx={{
                color: '#475569',
                borderColor: '#cbd5e1',
                borderRadius: '8px',
                px: 2.5,
                py: 0.8,
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: '#f1f5f9',
                },
              }}
            >
              Back
            </Button>
          )}
          <Box sx={{ flex: 1 }} />
          <Button
            onClick={handleResetAndClose}
            sx={{
              color: '#64748b',
              borderRadius: '8px',
              px: 2,
              '&:hover': { backgroundColor: '#f1f5f9' },
            }}
          >
            Cancel
          </Button>
          <Button
            id="modal-next-step-btn"
            variant="contained"
            onClick={handleNext}
            endIcon={activeStep < 2 ? <ArrowForward /> : <CheckCircle />}
            sx={{
              backgroundColor: THEME_COLOR,
              color: '#ffffff',
              fontWeight: 600,
              borderRadius: '8px',
              px: 3,
              py: 0.9,
              boxShadow: '0 4px 12px rgba(183, 3, 2, 0.25)',
              '&:hover': {
                backgroundColor: '#900201',
                boxShadow: '0 6px 16px rgba(183, 3, 2, 0.35)',
              },
            }}
          >
            {activeStep === 2 ? 'Confirm & Book OPD Visit' : 'Continue'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

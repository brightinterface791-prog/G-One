import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Grid,
  Chip,
  IconButton,
} from '@mui/material';
import {
  LocalFireDepartment,
  Close,
  PersonAdd,
} from '@mui/icons-material';
import { Appointment, ConsultationType, Doctor } from '../../types';
import { THEME_COLOR } from '../../theme/theme';

interface QuickTriageWalkInModalProps {
  open: boolean;
  onClose: () => void;
  doctors?: Doctor[];
  onSaveWalkIn: (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'bookingRef' | 'status'>) => void;
}

export const QuickTriageWalkInModal: React.FC<QuickTriageWalkInModalProps> = ({
  open,
  onClose,
  doctors = [],
  onSaveWalkIn,
}) => {
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number>(35);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [patientPhone, setPatientPhone] = useState('+1 (555) ');
  const [patientEmail, setPatientEmail] = useState('');
  const [doctorChoice, setDoctorChoice] = useState(doctors.length > 0 ? doctors[0].id : 'doc-1');
  const [triagePriority, setTriagePriority] = useState<'Routine' | 'Priority' | 'Urgent'>('Priority');
  const [modality, setModality] = useState<ConsultationType>('In-Person OPD');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('Walk-in intake via Hospital Triage Desk');

  const fallbackDoctors = [
    { id: 'doc-1', name: 'Dr. Sarah Jenkins, MD', specialty: 'Cardiology', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400', hospitalLocation: 'Chamber 402, Heart Institute' },
    { id: 'doc-5', name: 'Dr. Priya Sharma, MBBS, MD', specialty: 'General Medicine', avatar: 'https://images.unsplash.com/photo-1559839734-c2c62c21961a?auto=format&fit=crop&q=80&w=400', hospitalLocation: 'Room 105, Diagnostic Wing' },
    { id: 'doc-4', name: 'Dr. Arthur Sterling, MD', specialty: 'Orthopedics', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400', hospitalLocation: 'Room 208, Bone & Joint Wing' },
    { id: 'doc-2', name: 'Dr. Elena Rostova, MD, PhD', specialty: 'Neurology', avatar: 'https://images.unsplash.com/photo-1594824813571-638f0263613a?auto=format&fit=crop&q=80&w=400', hospitalLocation: 'Room 312, Neuro Science Center' },
  ];

  const availableDoctors = doctors.length > 0 ? doctors : fallbackDoctors;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const chosenDoc = availableDoctors.find((d) => d.id === doctorChoice) || availableDoctors[0];
    const todayStr = '2026-09-06';
    const currentTimeSlot = 'Immediate Walk-in';

    onSaveWalkIn({
      doctorId: chosenDoc.id,
      doctorName: chosenDoc.name,
      doctorSpecialty: chosenDoc.specialty,
      doctorAvatar: chosenDoc.avatar,
      patientName: patientName.trim(),
      patientEmail: patientEmail || `${patientName.toLowerCase().replace(/\s+/g, '.')}@hospital.opd`,
      patientPhone,
      patientAge,
      patientGender,
      date: todayStr,
      timeSlot: currentTimeSlot,
      consultationType: modality,
      symptoms: symptoms || 'Walk-in clinical assessment',
      notes: `Triage Level: ${triagePriority} • ${notes}`,
      chamberRoom: (chosenDoc as any).sittingSchedule?.roomChamber || chosenDoc.hospitalLocation,
    });

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
          p: 2.5,
          backgroundColor: '#ffffff',
          color: '#0f172a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '12px',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LocalFireDepartment sx={{ color: '#dc2626', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: '"SF Pro Display", sans-serif',
                fontWeight: 600,
                fontSize: '19px',
                color: '#0f172a',
                lineHeight: 1.25,
              }}
            >
              Quick Walk-in Patient Triage
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '13px' }}>
              Immediate Hospital Outpatient Desk Admission
            </Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: '#94a3b8',
            borderRadius: '8px',
            '&:hover': { backgroundColor: '#f1f5f9', color: '#0f172a' },
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3, backgroundColor: '#ffffff' }}>
          <Grid container spacing={2}>
            {/* Triage Priority Chips */}
            <Grid size={12}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 0.8, fontSize: '0.72rem' }}>
                TRIAGE LEVEL
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {(['Routine', 'Priority', 'Urgent'] as const).map((level) => (
                  <Chip
                    key={level}
                    label={level}
                    clickable
                    onClick={() => setTriagePriority(level)}
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.76rem',
                      backgroundColor:
                        triagePriority === level
                          ? level === 'Urgent'
                            ? '#fee2e2'
                            : level === 'Priority'
                            ? '#fef3c7'
                            : '#dcfce7'
                          : '#f1f5f9',
                      color:
                        triagePriority === level
                          ? level === 'Urgent'
                            ? '#dc2626'
                            : level === 'Priority'
                            ? '#b45309'
                            : '#15803d'
                          : '#64748b',
                      border: triagePriority === level ? '1.5px solid currentColor' : '1.5px solid transparent',
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Patient Name */}
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                required
                fullWidth
                size="small"
                label="Patient Full Name"
                placeholder="e.g. Rachel Adams"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </Grid>

            {/* Age */}
            <Grid size={{ xs: 6, sm: 4 }}>
              <TextField
                required
                fullWidth
                type="number"
                size="small"
                label="Age"
                value={patientAge}
                onChange={(e) => setPatientAge(Number(e.target.value))}
              />
            </Grid>

            {/* Gender */}
            <Grid size={{ xs: 6, sm: 4 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Gender"
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value as any)}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>

            {/* Phone */}
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                fullWidth
                size="small"
                label="Contact Phone"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
              />
            </Grid>

            {/* Doctor Selection */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Assign Attending Clinician"
                value={doctorChoice}
                onChange={(e) => setDoctorChoice(e.target.value)}
              >
                {availableDoctors.map((doc) => (
                  <MenuItem key={doc.id} value={doc.id}>
                    {doc.name} — {doc.specialty}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Modality */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Consultation Modality"
                value={modality}
                onChange={(e) => setModality(e.target.value as any)}
              >
                <MenuItem value="In-Person OPD">In-Person Hospital OPD</MenuItem>
                <MenuItem value="Follow-up Consultation">Follow-up Review Consultation</MenuItem>
                <MenuItem value="Diagnostic Assessment">Urgent Diagnostic Assessment</MenuItem>
              </TextField>
            </Grid>

            {/* Chief Complaints */}
            <Grid size={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={2}
                size="small"
                label="Chief Complaint / Presenting Symptoms"
                placeholder="e.g. Acute abdominal pain, dizziness since morning"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', gap: 1.5 }}>
          <Button
            onClick={onClose}
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
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<PersonAdd />}
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
            Admit to OPD Queue
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

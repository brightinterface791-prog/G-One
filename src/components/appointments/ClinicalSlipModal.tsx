import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Paper,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import {
  LocalHospital,
  Print,
  Download,
  Close,
  CheckCircle,
  VerifiedUser,
  QrCode2,
} from '@mui/icons-material';
import { Appointment } from '../../types';
import { THEME_COLOR } from '../../theme/theme';

interface ClinicalSlipModalProps {
  open: boolean;
  appointment: Appointment | null;
  onClose: () => void;
}

export const ClinicalSlipModal: React.FC<ClinicalSlipModalProps> = ({
  open,
  appointment,
  onClose,
}) => {
  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate simple simulated download trigger
    const slipText = `
======================================================
         G-ONE SUPER-SPECIALTY HEALTH SYSTEM
           Official Clinical Consultation Slip
======================================================
Booking Ref: ${appointment.bookingRef}
Date: ${appointment.date} | Time: ${appointment.timeSlot}
Modality: ${appointment.consultationType}

PATIENT PARTICULARS:
------------------------------------------------------
Name: ${appointment.patientName}
Age/Gender: ${appointment.patientAge} Y / ${appointment.patientGender}
Contact: ${appointment.patientPhone} | ${appointment.patientEmail}
Chief Complaint: ${appointment.symptoms}

ATTENDING CLINICIAN:
------------------------------------------------------
Doctor: ${appointment.doctorName}
Specialty: ${appointment.doctorSpecialty}
Clinical Notes: ${appointment.notes || 'Routine follow-up prescribed'}

VITALS RECORDED:
------------------------------------------------------
BP: 120/80 mmHg | Pulse: 72 bpm | SpO2: 99% | Temp: 98.6°F

Rx MEDICATIONS & INSTRUCTIONS:
------------------------------------------------------
1. Tab. Multivitamin Plus (1 tablet daily post breakfast x 30 days)
2. Tab. Hydration & Electrolyte Oral Pack as needed
3. Routine follow-up scheduled in 14 days or SOS

Electronically Signed & Authenticated
G-One Hospital Digital Health System
======================================================
    `.trim();

    const element = document.createElement('a');
    const file = new Blob([slipText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Clinical_Slip_${appointment.bookingRef}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: '#f8fafc',
          },
        },
      }}
    >
      {/* Modal Actions Header */}
      <Box
        sx={{
          px: 3,
          py: 1.5,
          backgroundColor: '#0f172a',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalHospital sx={{ color: THEME_COLOR, fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            Electronic Clinical Slip & Rx Prescription
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Print />}
            onClick={handlePrint}
            sx={{
              color: '#ffffff',
              borderColor: '#475569',
              textTransform: 'none',
              fontWeight: 700,
              '&:hover': { borderColor: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)' },
            }}
          >
            Print
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownload}
            sx={{
              backgroundColor: THEME_COLOR,
              color: '#ffffff',
              textTransform: 'none',
              fontWeight: 700,
              '&:hover': { backgroundColor: '#900201' },
            }}
          >
            Download
          </Button>
          <IconButton size="small" onClick={onClose} sx={{ color: '#94a3b8', ml: 1 }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Slip Sheet Body (Styled like official hospital slip) */}
      <DialogContent sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Paper
          elevation={0}
          id="printable-clinical-slip"
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: 2,
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            position: 'relative',
          }}
        >
          {/* Hospital Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, pb: 2.5, borderBottom: '2px solid #0f172a' }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  backgroundColor: THEME_COLOR,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.2rem',
                }}
              >
                +
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>
                  G-ONE SUPER-SPECIALTY HOSPITAL
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Center of Medical Excellence & Clinical Research • NABH & JCI Accredited
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontSize: '0.68rem' }}>
                  Emergency Trauma Care Wing • Tele-Health Node v2.4 • Phone: +1 (800) 466-3432
                </Typography>
              </Box>
            </Box>

            <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                Slip Reference ID:
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: THEME_COLOR, letterSpacing: '0.04em' }}>
                {appointment.bookingRef}
              </Typography>
              <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
                Date: <strong>{appointment.date}</strong> at <strong>{appointment.timeSlot}</strong>
              </Typography>
            </Box>
          </Box>

          {/* Patient and Doctor Grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, py: 2.5, borderBottom: '1px solid #e2e8f0' }}>
            {/* Patient Details */}
            <Box sx={{ p: 1.8, borderRadius: 2, backgroundColor: '#f8fafc', border: '1px solid #edf2f7' }}>
              <Typography variant="caption" sx={{ color: THEME_COLOR, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                PATIENT DEMOGRAPHICS
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.5 }}>
                {appointment.patientName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem' }}>
                <strong>Age / Sex:</strong> {appointment.patientAge} Years / {appointment.patientGender}
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem' }}>
                <strong>Phone:</strong> {appointment.patientPhone}
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem' }}>
                <strong>Email:</strong> {appointment.patientEmail}
              </Typography>
            </Box>

            {/* Doctor Details */}
            <Box sx={{ p: 1.8, borderRadius: 2, backgroundColor: '#f8fafc', border: '1px solid #edf2f7' }}>
              <Typography variant="caption" sx={{ color: THEME_COLOR, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ATTENDING CLINICIAN
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.5 }}>
                {appointment.doctorName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem' }}>
                <strong>Department:</strong> {appointment.doctorSpecialty}
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem' }}>
                <strong>Modality:</strong> {appointment.consultationType} (Room / Node)
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem' }}>
                <strong>Status:</strong> <span style={{ color: '#16a34a', fontWeight: 700 }}>{appointment.status}</span>
              </Typography>
            </Box>
          </Box>

          {/* Vitals Recorded Strip */}
          <Box sx={{ py: 2, borderBottom: '1px solid #e2e8f0' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
              CLINICAL VITALS AT INTAKE
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 1.5 }}>
              <Box sx={{ p: 1, backgroundColor: '#f1f5f9', borderRadius: 1.5, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>Blood Pressure</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>120/80 mmHg</Typography>
              </Box>
              <Box sx={{ p: 1, backgroundColor: '#f1f5f9', borderRadius: 1.5, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>Pulse / Heart Rate</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>72 bpm</Typography>
              </Box>
              <Box sx={{ p: 1, backgroundColor: '#f1f5f9', borderRadius: 1.5, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>Oxygen (SpO2)</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>99%</Typography>
              </Box>
              <Box sx={{ p: 1, backgroundColor: '#f1f5f9', borderRadius: 1.5, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>Temperature</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>98.6°F</Typography>
              </Box>
            </Box>
          </Box>

          {/* Chief Complaint & Diagnosis */}
          <Box sx={{ py: 2, borderBottom: '1px solid #e2e8f0' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              CHIEF COMPLAINT / SYMPTOMS
            </Typography>
            <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, mt: 0.5 }}>
              "{appointment.symptoms}"
            </Typography>
            {appointment.notes && (
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.8, fontStyle: 'italic' }}>
                Clinical Observation: {appointment.notes}
              </Typography>
            )}
          </Box>

          {/* Prescribed Medications (Rx Table) */}
          <Box sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: THEME_COLOR }}>
                ℞
              </Typography>
              <Typography variant="caption" sx={{ color: '#0f172a', fontWeight: 800, textTransform: 'uppercase' }}>
                PRESCRIBED MEDICATIONS & REGIMEN
              </Typography>
            </Box>

            <Table size="small" sx={{ border: '1px solid #e2e8f0', borderRadius: 1.5, overflow: 'hidden' }}>
              <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>Medicine Name</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>Dosage & Timing</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>Duration</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>Instructions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontSize: '0.8rem', fontWeight: 700 }}>1</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                    Tab. Paracetamol 650mg
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>1 Tablet TDS (Thrice daily)</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>3 Days</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>Post meals with water</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontSize: '0.8rem', fontWeight: 700 }}>2</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                    Cap. Multivitamin & Zinc Forte
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>1 Capsule OD (Once daily)</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>15 Days</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>Post breakfast</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontSize: '0.8rem', fontWeight: 700 }}>3</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                    Electrolyte Hydration Sachet
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>1 sachet in 500ml water</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>As needed</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>Stay well hydrated</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>

          {/* Advice & Signature Footer */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pt: 3, mt: 2, borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block' }}>
                Next Review / Follow-Up:
              </Typography>
              <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 700 }}>
                After 14 Days or SOS in case of acute distress.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: '#15803d' }}>
                <VerifiedUser sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.7rem' }}>
                  Authenticated Digital EHR Slip • Valid without physical seal
                </Typography>
              </Box>
            </Box>

            <Box sx={{ textAlign: 'right', minWidth: 180 }}>
              <Box sx={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Typography sx={{ fontFamily: 'cursive', color: THEME_COLOR, fontWeight: 700, fontSize: '1.2rem' }}>
                  {appointment.doctorName}
                </Typography>
              </Box>
              <Divider sx={{ my: 0.5, borderColor: '#cbd5e1' }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', display: 'block' }}>
                {appointment.doctorName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', display: 'block' }}>
                Senior Specialist • Reg. #MD-884210
              </Typography>
            </Box>
          </Box>
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

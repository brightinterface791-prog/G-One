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
  IconButton,
  Chip,
} from '@mui/material';
import { NoteAlt, Close, Save } from '@mui/icons-material';
import { Appointment } from '../../types';
import { THEME_COLOR } from '../../theme/theme';

interface ClinicalNotesDialogProps {
  open: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onSaveNotes: (id: string, newNotes: string) => void;
}

export const ClinicalNotesDialog: React.FC<ClinicalNotesDialogProps> = ({
  open,
  appointment,
  onClose,
  onSaveNotes,
}) => {
  const [noteText, setNoteText] = useState(appointment?.notes || '');

  React.useEffect(() => {
    if (appointment) {
      setNoteText(appointment.notes || '');
    }
  }, [appointment]);

  if (!appointment) return null;

  const handleSave = () => {
    onSaveNotes(appointment.id, noteText);
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
              backgroundColor: 'rgba(183, 3, 2, 0.08)',
              color: THEME_COLOR,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <NoteAlt sx={{ fontSize: 22 }} />
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
              Clinical Chart Notes & Observations
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '13px' }}>
              Ref: {appointment.bookingRef} • {appointment.patientName}
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

      <DialogContent sx={{ p: 3, backgroundColor: '#ffffff' }}>
        <Box sx={{ mb: 2.5, p: 2, borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <Typography sx={{ color: '#64748b', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}>
            Patient Reported Symptoms:
          </Typography>
          <Typography sx={{ fontWeight: 500, color: '#0f172a', fontSize: '15px' }}>
            "{appointment.symptoms}"
          </Typography>
        </Box>

        <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '14px', mb: 0.75 }}>
          Doctor's Consultation Observations / Prescription Notes:
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={5}
          placeholder="Add clinical findings, physical examination notes, differential diagnosis, and next follow-up instructions..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
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
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
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
          Save Clinical Note
        </Button>
      </DialogActions>
    </Dialog>
  );
};

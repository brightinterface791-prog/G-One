import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Alert,
  IconButton,
  Divider,
} from '@mui/material';
import { Close, Favorite, CheckCircle, AddTask } from '@mui/icons-material';
import { VitalRecord } from '../../types';
import { THEME_COLOR } from '../../theme/theme';
import { vitalsService } from '../../services/vitalsService';

interface AddVitalsDialogProps {
  open: boolean;
  onClose: () => void;
  onAddVital: (vital: Omit<VitalRecord, 'id' | 'timestamp' | 'bmi'>) => void;
}

export const AddVitalsDialog: React.FC<AddVitalsDialogProps> = ({ open, onClose, onAddVital }) => {
  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const [date, setDate] = useState(today);
  const [time, setTime] = useState(currentTime);
  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [bloodGlucose, setBloodGlucose] = useState<number>(95);
  const [glucoseType, setGlucoseType] = useState<'Fasting' | 'Post-Meal' | 'Random'>('Fasting');
  const [oxygenSaturation, setOxygenSaturation] = useState<number>(98);
  const [bodyTemperature, setBodyTemperature] = useState<number>(98.6);
  const [weightKg, setWeightKg] = useState<number>(68.5);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [notes, setNotes] = useState('');

  // Live evaluations
  const bpEval = vitalsService.evaluateBloodPressure(systolic, diastolic);
  const hrEval = vitalsService.evaluateHeartRate(heartRate);
  const glucoseEval = vitalsService.evaluateGlucose(bloodGlucose, glucoseType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVital({
      date,
      time,
      bloodPressureSystolic: Number(systolic),
      bloodPressureDiastolic: Number(diastolic),
      heartRate: Number(heartRate),
      bloodGlucose: Number(bloodGlucose),
      glucoseType,
      oxygenSaturation: Number(oxygenSaturation),
      bodyTemperature: Number(bodyTemperature),
      weightKg: Number(weightKg),
      heightCm: Number(heightCm),
      notes,
    });
    onClose();
  };

  return (
    <Dialog
      id="add-vitals-dialog"
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
      <form onSubmit={handleSubmit}>
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
              <Favorite sx={{ fontSize: 24 }} />
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
                Log Daily Patient Vitals
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '13px' }}>
                Record key biometrics for clinical tracking and trend monitoring
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            aria-label="close vitals dialog"
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

        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5}>
            {/* Date & Time */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Measurement Date"
                type="date"
                slotProps={{ inputLabel: { shrink: true } }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Time of Day"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 08:30 AM"
                required
              />
            </Grid>

            {/* Blood Pressure */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Systolic BP (Upper)"
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(Number(e.target.value))}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">mmHg</InputAdornment>,
                  },
                }}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Diastolic BP (Lower)"
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(Number(e.target.value))}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">mmHg</InputAdornment>,
                  },
                }}
                required
              />
            </Grid>

            {/* BP Range Alert feedback */}
            <Grid size={12}>
              <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: `${bpEval.color}15`, border: `1px solid ${bpEval.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: bpEval.color }}>
                  BP Status: {bpEval.label}
                </Typography>
                <Typography variant="caption" sx={{ color: '#475569' }}>
                  {bpEval.message}
                </Typography>
              </Box>
            </Grid>

            {/* Heart Rate & SpO2 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Heart Rate / Pulse"
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">bpm</InputAdornment>,
                  },
                }}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Oxygen Saturation (SpO2)"
                type="number"
                value={oxygenSaturation}
                onChange={(e) => setOxygenSaturation(Number(e.target.value))}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  },
                }}
                required
              />
            </Grid>

            {/* Blood Glucose & Type */}
            <Grid size={{ xs: 12, sm: 7 }}>
              <TextField
                fullWidth
                label="Blood Sugar / Glucose"
                type="number"
                value={bloodGlucose}
                onChange={(e) => setBloodGlucose(Number(e.target.value))}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">mg/dL</InputAdornment>,
                  },
                }}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 5 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="glucose-type-label">Measurement Type</InputLabel>
                <Select
                  labelId="glucose-type-label"
                  value={glucoseType}
                  label="Measurement Type"
                  onChange={(e) => setGlucoseType(e.target.value as any)}
                >
                  <MenuItem value="Fasting">Fasting</MenuItem>
                  <MenuItem value="Post-Meal">Post-Meal</MenuItem>
                  <MenuItem value="Random">Random</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Temperature, Weight & Height */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Temperature"
                type="number"
                value={bodyTemperature}
                onChange={(e) => setBodyTemperature(Number(e.target.value))}
                slotProps={{
                  htmlInput: { step: '0.1' },
                  input: {
                    endAdornment: <InputAdornment position="end">°F</InputAdornment>,
                  },
                }}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Weight"
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                slotProps={{
                  htmlInput: { step: '0.1' },
                  input: {
                    endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                  },
                }}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Height"
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                  },
                }}
                required
              />
            </Grid>

            {/* Notes */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Clinical Context or Note"
                placeholder="E.g. Measured before morning run, after 8 hours of sleep..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
            id="save-vitals-btn"
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<AddTask />}
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
            Save Vitals Entry
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

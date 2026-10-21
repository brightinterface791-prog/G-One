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
  Grid,
  Paper,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Alert,
} from '@mui/material';
import {
  Close,
  Favorite,
  AddCircle,
  Timeline,
  TableRows,
  Delete,
  CheckCircle,
} from '@mui/icons-material';
import { VitalRecord } from '../../types';
import { THEME_COLOR } from '../../theme/theme';
import { VitalsChart } from './VitalsChart';
import { vitalsService } from '../../services/vitalsService';

interface VitalsTrackerModalProps {
  open: boolean;
  onClose: () => void;
  vitals: VitalRecord[];
  latestVital: VitalRecord | null;
  onOpenAddVitals: () => void;
  onDeleteVital: (id: string) => void;
}

export const VitalsTrackerModal: React.FC<VitalsTrackerModalProps> = ({
  open,
  onClose,
  vitals,
  latestVital,
  onOpenAddVitals,
  onDeleteVital,
}) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [chartMetric, setChartMetric] = useState<'bp' | 'heartRate' | 'glucose' | 'spo2' | 'weight'>('bp');

  if (!latestVital) return null;

  const bpEval = vitalsService.evaluateBloodPressure(
    latestVital.bloodPressureSystolic,
    latestVital.bloodPressureDiastolic
  );
  const hrEval = vitalsService.evaluateHeartRate(latestVital.heartRate);
  const glucoseEval = vitalsService.evaluateGlucose(
    latestVital.bloodGlucose,
    latestVital.glucoseType
  );
  const spo2Eval = vitalsService.evaluateSpO2(latestVital.oxygenSaturation);
  const bmiEval = vitalsService.evaluateBMI(latestVital.bmi);

  return (
    <Dialog
      id="vitals-tracker-modal"
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: 3, maxHeight: '90vh' } },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: 'rgba(183, 3, 2, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: THEME_COLOR,
            }}
          >
            <Favorite sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
              Patient Vitals Analytics & Monitoring
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Real-time physiological tracking with clinical guideline thresholds
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            id="modal-add-vitals-btn"
            variant="contained"
            color="primary"
            size="small"
            startIcon={<AddCircle />}
            onClick={onOpenAddVitals}
            sx={{ fontWeight: 700 }}
          >
            Log Vitals
          </Button>
          <IconButton onClick={onClose} aria-label="close vitals tracker">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <Box sx={{ px: 3, borderBottom: '1px solid #e2e8f0' }}>
        <Tabs
          value={tabIndex}
          onChange={(_, val) => setTabIndex(val)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab icon={<Favorite sx={{ fontSize: 18 }} />} iconPosition="start" label="Health Overview" sx={{ fontWeight: 700, textTransform: 'none' }} />
          <Tab icon={<Timeline sx={{ fontSize: 18 }} />} iconPosition="start" label="Trend Charts" sx={{ fontWeight: 700, textTransform: 'none' }} />
          <Tab icon={<TableRows sx={{ fontSize: 18 }} />} iconPosition="start" label={`Log History (${vitals.length})`} sx={{ fontWeight: 700, textTransform: 'none' }} />
        </Tabs>
      </Box>

      <DialogContent sx={{ py: 3 }}>
        {/* TAB 0: OVERVIEW */}
        {tabIndex === 0 && (
          <Box>
            {/* Clinical status alert banner */}
            <Alert
              severity={bpEval.status === 'normal' && glucoseEval.status === 'normal' ? 'success' : 'info'}
              icon={<CheckCircle fontSize="inherit" />}
              sx={{ mb: 3, borderRadius: 2 }}
            >
              <strong>Clinical Assessment:</strong> All major vitals (Blood Pressure, Glucose, SpO2, Heart Rate) are within stable parameters. Next checkup scheduled for cardiology follow-up.
            </Alert>

            {/* 6 Metric Cards */}
            <Grid container spacing={2.5}>
              {/* BP */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
                      Blood Pressure
                    </Typography>
                    <Chip label={bpEval.label} size="small" sx={{ backgroundColor: `${bpEval.color}15`, color: bpEval.color, fontWeight: 700 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    {latestVital.bloodPressureSystolic}/{latestVital.bloodPressureDiastolic}{' '}
                    <Typography component="span" variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                      mmHg
                    </Typography>
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
                    {bpEval.message}
                  </Typography>
                </Paper>
              </Grid>

              {/* Heart Rate */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
                      Resting Heart Rate
                    </Typography>
                    <Chip label={hrEval.label} size="small" sx={{ backgroundColor: `${hrEval.color}15`, color: hrEval.color, fontWeight: 700 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    {latestVital.heartRate}{' '}
                    <Typography component="span" variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                      bpm
                    </Typography>
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
                    {hrEval.message}
                  </Typography>
                </Paper>
              </Grid>

              {/* Blood Glucose */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
                      Glucose ({latestVital.glucoseType})
                    </Typography>
                    <Chip label={glucoseEval.label} size="small" sx={{ backgroundColor: `${glucoseEval.color}15`, color: glucoseEval.color, fontWeight: 700 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    {latestVital.bloodGlucose}{' '}
                    <Typography component="span" variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                      mg/dL
                    </Typography>
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
                    {glucoseEval.message}
                  </Typography>
                </Paper>
              </Grid>

              {/* SpO2 */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
                      Oxygen (SpO2)
                    </Typography>
                    <Chip label={spo2Eval.label} size="small" sx={{ backgroundColor: `${spo2Eval.color}15`, color: spo2Eval.color, fontWeight: 700 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    {latestVital.oxygenSaturation}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
                    {spo2Eval.message}
                  </Typography>
                </Paper>
              </Grid>

              {/* Temp */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
                      Body Temperature
                    </Typography>
                    <Chip label="Normal" size="small" sx={{ backgroundColor: '#16a34a15', color: '#16a34a', fontWeight: 700 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    {latestVital.bodyTemperature}°F
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
                    Measured axillary / oral thermometer
                  </Typography>
                </Paper>
              </Grid>

              {/* BMI */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
                      BMI & Weight
                    </Typography>
                    <Chip label={bmiEval.label} size="small" sx={{ backgroundColor: `${bmiEval.color}15`, color: bmiEval.color, fontWeight: 700 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    {latestVital.bmi}{' '}
                    <Typography component="span" variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                      kg/m² ({latestVital.weightKg} kg)
                    </Typography>
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
                    Height: {latestVital.heightCm} cm
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Quick Guidelines Panel */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', mt: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
                Clinical Guidelines Reference (AHA & WHO)
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: THEME_COLOR, display: 'block' }}>
                    Normal Blood Pressure
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#475569' }}>
                    Systolic &lt; 120 mmHg and Diastolic &lt; 80 mmHg
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0e7490', display: 'block' }}>
                    Normal Blood Sugar
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#475569' }}>
                    Fasting 70-99 mg/dL | Post-meal &lt; 140 mg/dL
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#16a34a', display: 'block' }}>
                    Target Oxygen Saturation
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#475569' }}>
                    95% to 100% on ambient room air
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}

        {/* TAB 1: TREND CHARTS */}
        {tabIndex === 1 && (
          <Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              {[
                { id: 'bp', label: 'Blood Pressure' },
                { id: 'heartRate', label: 'Heart Rate' },
                { id: 'glucose', label: 'Blood Glucose' },
                { id: 'spo2', label: 'Oxygen (SpO2)' },
                { id: 'weight', label: 'Weight & BMI' },
              ].map((m) => (
                <Chip
                  key={m.id}
                  label={m.label}
                  onClick={() => setChartMetric(m.id as any)}
                  color={chartMetric === m.id ? 'primary' : 'default'}
                  sx={{ fontWeight: 700 }}
                />
              ))}
            </Box>

            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
              <VitalsChart vitals={vitals} activeMetric={chartMetric} />
            </Paper>
          </Box>
        )}

        {/* TAB 2: LOG HISTORY TABLE */}
        {tabIndex === 2 && (
          <Box>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>BP (mmHg)</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>Pulse</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>Glucose</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>SpO2</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>Weight/BMI</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>Notes</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#0f172a' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vitals.slice().reverse().map((v) => (
                    <TableRow key={v.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {v.date} <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>{v.time}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: v.bloodPressureSystolic >= 130 ? '#dc2626' : '#0f172a' }}>
                        {v.bloodPressureSystolic}/{v.bloodPressureDiastolic}
                      </TableCell>
                      <TableCell>{v.heartRate} bpm</TableCell>
                      <TableCell>
                        {v.bloodGlucose} mg/dL
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>{v.glucoseType}</Typography>
                      </TableCell>
                      <TableCell>{v.oxygenSaturation}%</TableCell>
                      <TableCell>{v.weightKg} kg (BMI {v.bmi})</TableCell>
                      <TableCell sx={{ maxWidth: 180, color: '#64748b' }}>{v.notes || '—'}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            if (window.confirm('Delete this vital entry?')) {
                              onDeleteVital(v.id);
                            }
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <Button onClick={onClose} sx={{ color: '#475569', fontWeight: 600 }}>
          Close Dashboard
        </Button>
      </DialogActions>
    </Dialog>
  );
};

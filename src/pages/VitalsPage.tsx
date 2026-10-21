import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Divider,
} from '@mui/material';
import {
  Favorite,
  AddCircle,
  Timeline,
  TableRows,
  Delete,
  CheckCircle,
  TrendingUp,
  InfoOutlined,
  HealthAndSafety,
} from '@mui/icons-material';
import { VitalRecord } from '../types';
import { THEME_COLOR } from '../theme/theme';
import { VitalsChart } from '../components/vitals/VitalsChart';
import { vitalsService } from '../services/vitalsService';

interface VitalsPageProps {
  vitals: VitalRecord[];
  latestVital: VitalRecord | null;
  onOpenAddVitals: () => void;
  onDeleteVital: (id: string) => void;
}

export const VitalsPage: React.FC<VitalsPageProps> = ({
  vitals,
  latestVital,
  onOpenAddVitals,
  onDeleteVital,
}) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [chartMetric, setChartMetric] = useState<'bp' | 'heartRate' | 'glucose' | 'spo2' | 'weight'>('bp');

  if (!latestVital) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h5">No vitals data available.</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={onOpenAddVitals}>
            Log First Vital Reading
          </Button>
        </Container>
      </Box>
    );
  }

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
    <Box id="vitals-analytics-page" sx={{ py: { xs: 4, md: 6 }, backgroundColor: '#f8fafc', minHeight: '80vh' }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        {/* Header Title & Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 4 }}>
          <Box>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip
                label="BIOMETRIC HEALTH MONITOR"
                size="small"
                sx={{
                  fontWeight: 700,
                  backgroundColor: 'rgba(183, 3, 2, 0.1)',
                  color: THEME_COLOR,
                  borderRadius: 1.5,
                }}
              />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
              Patient Vitals Analytics & Monitoring
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Real-time physiological tracking with clinical guideline thresholds & trend forecasting.
            </Typography>
          </Box>

          <Button
            id="vitals-page-add-btn"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddCircle />}
            onClick={onOpenAddVitals}
            sx={{ fontWeight: 700, py: 1.2, px: 3, boxShadow: '0 4px 14px rgba(183, 3, 2, 0.3)' }}
          >
            Log New Reading
          </Button>
        </Box>

        {/* Current Status Overview Cards */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {/* Blood Pressure Card */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: THEME_COLOR, transform: 'translateY(-2px)' },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                  Blood Pressure (BP)
                </Typography>
                <Chip
                  label={bpEval.label}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    backgroundColor: bpEval.status === 'normal' ? '#dcfce7' : bpEval.status === 'warning' ? '#fef3c7' : '#fee2e2',
                    color: bpEval.color,
                  }}
                />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                {latestVital.bloodPressureSystolic}/{latestVital.bloodPressureDiastolic}
                <Typography component="span" variant="body2" sx={{ color: '#64748b', ml: 1 }}>
                  mmHg
                </Typography>
              </Typography>
              <Typography variant="caption" sx={{ color: bpEval.color, fontWeight: 600, display: 'block' }}>
                {bpEval.message}
              </Typography>
            </Paper>
          </Grid>

          {/* Heart Rate Card */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: THEME_COLOR, transform: 'translateY(-2px)' },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                  Pulse / Heart Rate
                </Typography>
                <Chip
                  label={hrEval.label}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    backgroundColor: hrEval.status === 'normal' ? '#dcfce7' : '#fef3c7',
                    color: hrEval.color,
                  }}
                />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                {latestVital.heartRate}
                <Typography component="span" variant="body2" sx={{ color: '#64748b', ml: 1 }}>
                  bpm
                </Typography>
              </Typography>
              <Typography variant="caption" sx={{ color: hrEval.color, fontWeight: 600, display: 'block' }}>
                {hrEval.message} (Standard: 60-100 bpm)
              </Typography>
            </Paper>
          </Grid>

          {/* Blood Glucose Card */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: THEME_COLOR, transform: 'translateY(-2px)' },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                  Blood Glucose ({latestVital.glucoseType})
                </Typography>
                <Chip
                  label={glucoseEval.label}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    backgroundColor: glucoseEval.status === 'normal' ? '#dcfce7' : '#fee2e2',
                    color: glucoseEval.color,
                  }}
                />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                {latestVital.bloodGlucose}
                <Typography component="span" variant="body2" sx={{ color: '#64748b', ml: 1 }}>
                  mg/dL
                </Typography>
              </Typography>
              <Typography variant="caption" sx={{ color: glucoseEval.color, fontWeight: 600, display: 'block' }}>
                {glucoseEval.message}
              </Typography>
            </Paper>
          </Grid>

          {/* Oxygen Saturation SpO2 */}
          <Grid size={{ xs: 12, sm: 4, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                  Oxygen Saturation (SpO2)
                </Typography>
                <Chip
                  label={spo2Eval.label}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    backgroundColor: spo2Eval.status === 'normal' ? '#dcfce7' : '#fee2e2',
                    color: spo2Eval.color,
                  }}
                />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                {latestVital.oxygenSaturation}%
              </Typography>
              <Typography variant="caption" sx={{ color: spo2Eval.color, fontWeight: 600, display: 'block' }}>
                {spo2Eval.message}
              </Typography>
            </Paper>
          </Grid>

          {/* Body Temperature */}
          <Grid size={{ xs: 12, sm: 4, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                  Body Temperature
                </Typography>
                <Chip
                  label={latestVital.bodyTemperature <= 99.1 ? 'Normal' : 'Feverish'}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    backgroundColor: latestVital.bodyTemperature <= 99.1 ? '#dcfce7' : '#fee2e2',
                    color: latestVital.bodyTemperature <= 99.1 ? '#15803d' : '#dc2626',
                  }}
                />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                {latestVital.bodyTemperature}°F
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block' }}>
                Standard: 97.8°F – 99.1°F (Oral)
              </Typography>
            </Paper>
          </Grid>

          {/* Weight & BMI */}
          <Grid size={{ xs: 12, sm: 4, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                  Weight & Body Mass Index
                </Typography>
                <Chip
                  label={bmiEval.label}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    backgroundColor: bmiEval.status === 'normal' ? '#dcfce7' : '#fef3c7',
                    color: bmiEval.color,
                  }}
                />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                {latestVital.weightKg} kg
                <Typography component="span" variant="body2" sx={{ color: '#64748b', ml: 1 }}>
                  (BMI {latestVital.bmi})
                </Typography>
              </Typography>
              <Typography variant="caption" sx={{ color: bmiEval.color, fontWeight: 600, display: 'block' }}>
                {bmiEval.message}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Analytics Mode Tabs: Trends vs History Table */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            mb: 4,
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={tabIndex}
              onChange={(_, val) => setTabIndex(val)}
              sx={{
                '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', fontSize: '1rem' },
              }}
            >
              <Tab icon={<Timeline />} iconPosition="start" label="Visual Trend Analysis" />
              <Tab icon={<TableRows />} iconPosition="start" label={`Historical Log Entries (${vitals.length})`} />
            </Tabs>
          </Box>

          {/* TAB 0: Interactive Charts */}
          {tabIndex === 0 && (
            <Box>
              {/* Metric Selector Buttons */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {[
                  { key: 'bp', label: 'Blood Pressure (Systolic / Diastolic)' },
                  { key: 'heartRate', label: 'Pulse / Heart Rate (bpm)' },
                  { key: 'glucose', label: 'Blood Glucose (mg/dL)' },
                  { key: 'spo2', label: 'Oxygen Saturation (%)' },
                  { key: 'weight', label: 'Weight & Body Mass (kg)' },
                ].map((item) => (
                  <Chip
                    key={item.key}
                    label={item.label}
                    onClick={() => setChartMetric(item.key as any)}
                    color={chartMetric === item.key ? 'primary' : 'default'}
                    variant={chartMetric === item.key ? 'filled' : 'outlined'}
                    sx={{ fontWeight: 600 }}
                  />
                ))}
              </Box>

              {/* Chart Component */}
              <Box sx={{ height: 380, width: '100%' }}>
                <VitalsChart vitals={vitals} activeMetric={chartMetric} />
              </Box>
            </Box>
          )}

          {/* TAB 1: Complete History Table */}
          {tabIndex === 1 && (
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Blood Pressure</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Heart Rate</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Blood Glucose</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>SpO2</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Temp</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Weight / BMI</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vitals.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {row.date} <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>{row.time}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${row.bloodPressureSystolic}/${row.bloodPressureDiastolic} mmHg`}
                          size="small"
                          sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                        />
                      </TableCell>
                      <TableCell>{row.heartRate} bpm</TableCell>
                      <TableCell>{row.bloodGlucose} mg/dL ({row.glucoseType})</TableCell>
                      <TableCell>{row.oxygenSaturation}%</TableCell>
                      <TableCell>{row.bodyTemperature}°F</TableCell>
                      <TableCell>{row.weightKg} kg (BMI {row.bmi})</TableCell>
                      <TableCell sx={{ maxWidth: 160 }}>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {row.notes || 'Routine checkup'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDeleteVital(row.id)}
                          disabled={vitals.length <= 1}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Clinical Guidelines Reference Card */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <HealthAndSafety sx={{ color: THEME_COLOR }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
              Standard Clinical Reference Thresholds
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                  Blood Pressure (AHA)
                </Typography>
                <Typography variant="caption" sx={{ color: '#475569', display: 'block', lineHeight: 1.6 }}>
                  • <strong>Normal:</strong> &lt;120 and &lt;80 mmHg<br />
                  • <strong>Elevated:</strong> 120-129 and &lt;80 mmHg<br />
                  • <strong>Stage 1:</strong> 130-139 or 80-89 mmHg<br />
                  • <strong>Stage 2:</strong> ≥140 or ≥90 mmHg
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                  Heart Rate / Pulse
                </Typography>
                <Typography variant="caption" sx={{ color: '#475569', display: 'block', lineHeight: 1.6 }}>
                  • <strong>Bradycardia:</strong> &lt;60 bpm<br />
                  • <strong>Resting Normal:</strong> 60-100 bpm<br />
                  • <strong>Tachycardia:</strong> &gt;100 bpm<br />
                  • <strong>Athletic:</strong> 50-60 bpm
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                  Fasting Blood Glucose
                </Typography>
                <Typography variant="caption" sx={{ color: '#475569', display: 'block', lineHeight: 1.6 }}>
                  • <strong>Normal:</strong> 70-99 mg/dL<br />
                  • <strong>Pre-diabetes:</strong> 100-125 mg/dL<br />
                  • <strong>Diabetic:</strong> ≥126 mg/dL<br />
                  • <strong>Post-meal:</strong> &lt;140 mg/dL
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                  Oxygen Saturation SpO2
                </Typography>
                <Typography variant="caption" sx={{ color: '#475569', display: 'block', lineHeight: 1.6 }}>
                  • <strong>Normal:</strong> 95% - 100%<br />
                  • <strong>Mild Hypoxia:</strong> 90% - 94%<br />
                  • <strong>Severe Hypoxia:</strong> &lt;90% (Seek ER care)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

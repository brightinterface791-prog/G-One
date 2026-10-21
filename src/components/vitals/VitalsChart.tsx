import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { Box, Typography, Paper } from '@mui/material';
import { VitalRecord } from '../../types';
import { THEME_COLOR } from '../../theme/theme';

interface VitalsChartProps {
  vitals: VitalRecord[];
  activeMetric: 'bp' | 'heartRate' | 'glucose' | 'spo2' | 'weight';
}

export const VitalsChart: React.FC<VitalsChartProps> = ({ vitals, activeMetric }) => {
  // Format data for chart
  const data = vitals.map((v) => ({
    date: v.date.substring(5), // MM-DD
    systolic: v.bloodPressureSystolic,
    diastolic: v.bloodPressureDiastolic,
    heartRate: v.heartRate,
    glucose: v.bloodGlucose,
    spo2: v.oxygenSaturation,
    weight: v.weightKg,
    bmi: v.bmi,
  }));

  const renderChart = () => {
    switch (activeMetric) {
      case 'bp':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={[60, 160]} stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="systolic"
                name="Systolic (mmHg)"
                stroke={THEME_COLOR}
                strokeWidth={3}
                dot={{ r: 4, fill: THEME_COLOR }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="diastolic"
                name="Diastolic (mmHg)"
                stroke="#0e7490"
                strokeWidth={2}
                dot={{ r: 4, fill: '#0e7490' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'heartRate':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={THEME_COLOR} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={THEME_COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={[50, 110]} stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="heartRate"
                name="Heart Rate (bpm)"
                stroke={THEME_COLOR}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#hrGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'glucose':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={[60, 160]} stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="glucose"
                name="Blood Glucose (mg/dL)"
                stroke="#d97706"
                strokeWidth={3}
                dot={{ r: 5, fill: '#d97706' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'spo2':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={[90, 100]} stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="spo2"
                name="Oxygen Saturation (%)"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ r: 5, fill: '#16a34a' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'weight':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="weight"
                name="Weight (kg)"
                stroke="#7c3aed"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#7c3aed' }}
              />
              <Line
                type="monotone"
                dataKey="bmi"
                name="BMI (kg/m²)"
                stroke="#0284c7"
                strokeWidth={2}
                dot={{ r: 4, fill: '#0284c7' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Box sx={{ width: '100%', pt: 1 }}>
      {renderChart()}
    </Box>
  );
};

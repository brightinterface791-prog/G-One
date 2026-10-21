import { VitalRecord, VitalStatus } from '../types';

const STORAGE_KEY = 'g_one_vitals_v1';

export const INITIAL_VITALS: VitalRecord[] = [
  {
    id: 'vit-1',
    timestamp: '2026-08-14T08:30:00.000Z',
    date: '2026-08-14',
    time: '08:30 AM',
    bloodPressureSystolic: 122,
    bloodPressureDiastolic: 80,
    heartRate: 74,
    bloodGlucose: 94,
    glucoseType: 'Fasting',
    oxygenSaturation: 98,
    bodyTemperature: 98.4,
    weightKg: 69.2,
    heightCm: 175,
    bmi: 22.6,
    notes: 'Morning measurement before breakfast',
  },
  {
    id: 'vit-2',
    timestamp: '2026-08-15T08:15:00.000Z',
    date: '2026-08-15',
    time: '08:15 AM',
    bloodPressureSystolic: 119,
    bloodPressureDiastolic: 78,
    heartRate: 71,
    bloodGlucose: 91,
    glucoseType: 'Fasting',
    oxygenSaturation: 99,
    bodyTemperature: 98.6,
    weightKg: 69.0,
    heightCm: 175,
    bmi: 22.5,
    notes: 'Restful sleep, feeling energetic',
  },
  {
    id: 'vit-3',
    timestamp: '2026-08-16T09:00:00.000Z',
    date: '2026-08-16',
    time: '09:00 AM',
    bloodPressureSystolic: 125,
    bloodPressureDiastolic: 82,
    heartRate: 78,
    bloodGlucose: 102,
    glucoseType: 'Post-Meal',
    oxygenSaturation: 98,
    bodyTemperature: 98.5,
    weightKg: 69.1,
    heightCm: 175,
    bmi: 22.6,
    notes: 'After light breakfast & brisk walk',
  },
  {
    id: 'vit-4',
    timestamp: '2026-08-17T08:00:00.000Z',
    date: '2026-08-17',
    time: '08:00 AM',
    bloodPressureSystolic: 118,
    bloodPressureDiastolic: 76,
    heartRate: 69,
    bloodGlucose: 89,
    glucoseType: 'Fasting',
    oxygenSaturation: 99,
    bodyTemperature: 98.4,
    weightKg: 68.8,
    heightCm: 175,
    bmi: 22.5,
    notes: 'Normal routine',
  },
  {
    id: 'vit-5',
    timestamp: '2026-08-18T08:30:00.000Z',
    date: '2026-08-18',
    time: '08:30 AM',
    bloodPressureSystolic: 121,
    bloodPressureDiastolic: 79,
    heartRate: 72,
    bloodGlucose: 93,
    glucoseType: 'Fasting',
    oxygenSaturation: 98,
    bodyTemperature: 98.6,
    weightKg: 68.7,
    heightCm: 175,
    bmi: 22.4,
    notes: 'Hydrated well',
  },
  {
    id: 'vit-6',
    timestamp: '2026-08-19T08:45:00.000Z',
    date: '2026-08-19',
    time: '08:45 AM',
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    heartRate: 70,
    bloodGlucose: 92,
    glucoseType: 'Fasting',
    oxygenSaturation: 99,
    bodyTemperature: 98.6,
    weightKg: 68.5,
    heightCm: 175,
    bmi: 22.4,
    notes: 'Stable parameters',
  },
];

export const vitalsService = {
  getVitals: (): VitalRecord[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VITALS));
        return INITIAL_VITALS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse vitals from localStorage', e);
      return INITIAL_VITALS;
    }
  },

  addVitalRecord: (record: Omit<VitalRecord, 'id' | 'timestamp' | 'bmi'>): VitalRecord => {
    const vitals = vitalsService.getVitals();
    const heightInMeters = record.heightCm / 100;
    const bmi = Number((record.weightKg / (heightInMeters * heightInMeters)).toFixed(1));

    const newRecord: VitalRecord = {
      ...record,
      id: `vit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      bmi,
    };

    const updated = [...vitals, newRecord];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newRecord;
  },

  deleteVitalRecord: (id: string): VitalRecord[] => {
    const vitals = vitalsService.getVitals();
    const updated = vitals.filter((v) => v.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  getLatestVitals: (): VitalRecord => {
    const vitals = vitalsService.getVitals();
    return vitals[vitals.length - 1] || INITIAL_VITALS[INITIAL_VITALS.length - 1];
  },

  // Evaluation helpers
  evaluateBloodPressure: (systolic: number, diastolic: number): VitalStatus => {
    if (systolic >= 140 || diastolic >= 90) {
      return { status: 'critical', label: 'Stage 2 Hypertension', message: 'Seek medical evaluation', color: '#dc2626' };
    }
    if (systolic >= 130 || diastolic >= 80) {
      return { status: 'warning', label: 'Stage 1 Hypertension', message: 'Monitor closely', color: '#d97706' };
    }
    if (systolic >= 120 && diastolic < 80) {
      return { status: 'warning', label: 'Elevated', message: 'Maintain healthy lifestyle', color: '#d97706' };
    }
    return { status: 'normal', label: 'Optimal / Normal', message: 'Ideal blood pressure', color: '#16a34a' };
  },

  evaluateHeartRate: (bpm: number): VitalStatus => {
    if (bpm < 50) return { status: 'warning', label: 'Bradycardia (Low)', message: 'Resting pulse low', color: '#d97706' };
    if (bpm > 100) return { status: 'critical', label: 'Tachycardia (High)', message: 'Elevated heart rate', color: '#dc2626' };
    return { status: 'normal', label: 'Normal Pulse', message: 'Healthy resting range', color: '#16a34a' };
  },

  evaluateGlucose: (glucose: number, type: 'Fasting' | 'Post-Meal' | 'Random'): VitalStatus => {
    if (type === 'Fasting') {
      if (glucose >= 126) return { status: 'critical', label: 'High (Diabetic Range)', message: 'Consult physician', color: '#dc2626' };
      if (glucose >= 100) return { status: 'warning', label: 'Pre-diabetic Elevated', message: 'Watch sugar intake', color: '#d97706' };
      if (glucose < 70) return { status: 'warning', label: 'Hypoglycemia (Low)', message: 'Low blood sugar', color: '#d97706' };
      return { status: 'normal', label: 'Normal Fasting', message: 'Optimal blood sugar', color: '#16a34a' };
    } else {
      if (glucose >= 200) return { status: 'critical', label: 'High Spike', message: 'High blood sugar', color: '#dc2626' };
      if (glucose >= 140) return { status: 'warning', label: 'Elevated Post-Meal', message: 'Moderate spike', color: '#d97706' };
      return { status: 'normal', label: 'Normal Post-Meal', message: 'Healthy response', color: '#16a34a' };
    }
  },

  evaluateSpO2: (spo2: number): VitalStatus => {
    if (spo2 < 92) return { status: 'critical', label: 'Hypoxia (Critical)', message: 'Urgent medical attention', color: '#dc2626' };
    if (spo2 < 95) return { status: 'warning', label: 'Below Normal', message: 'Check respiratory comfort', color: '#d97706' };
    return { status: 'normal', label: 'Optimal Oxygen', message: 'Excellent lung efficiency', color: '#16a34a' };
  },

  evaluateBMI: (bmi: number): VitalStatus => {
    if (bmi < 18.5) return { status: 'warning', label: 'Underweight', message: 'Below optimal range', color: '#d97706' };
    if (bmi <= 24.9) return { status: 'normal', label: 'Healthy Weight', message: 'Optimal BMI range', color: '#16a34a' };
    if (bmi <= 29.9) return { status: 'warning', label: 'Overweight', message: 'Slightly above range', color: '#d97706' };
    return { status: 'critical', label: 'Obese', message: 'Consult nutritionist/MD', color: '#dc2626' };
  },
};

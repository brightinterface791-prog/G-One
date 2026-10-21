import { useState, useEffect, useCallback } from 'react';
import { vitalsService } from '../services/vitalsService';
import { VitalRecord } from '../types';

export function useVitals() {
  const [vitals, setVitals] = useState<VitalRecord[]>([]);
  const [latestVital, setLatestVital] = useState<VitalRecord | null>(null);

  const loadVitals = useCallback(() => {
    const data = vitalsService.getVitals();
    setVitals(data);
    setLatestVital(vitalsService.getLatestVitals());
  }, []);

  useEffect(() => {
    loadVitals();
  }, [loadVitals]);

  const addVital = useCallback(
    (record: Omit<VitalRecord, 'id' | 'timestamp' | 'bmi'>) => {
      const created = vitalsService.addVitalRecord(record);
      loadVitals();
      return created;
    },
    [loadVitals]
  );

  const deleteVital = useCallback(
    (id: string) => {
      vitalsService.deleteVitalRecord(id);
      loadVitals();
    },
    [loadVitals]
  );

  return {
    vitals,
    latestVital,
    addVital,
    deleteVital,
    refreshVitals: loadVitals,
    evaluateBloodPressure: vitalsService.evaluateBloodPressure,
    evaluateHeartRate: vitalsService.evaluateHeartRate,
    evaluateGlucose: vitalsService.evaluateGlucose,
    evaluateSpO2: vitalsService.evaluateSpO2,
    evaluateBMI: vitalsService.evaluateBMI,
  };
}

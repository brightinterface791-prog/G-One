import { useState, useEffect, useCallback } from 'react';
import { Doctor, Specialty, DynamicFormField, AppointmentFormConfig, DoctorSittingSchedule } from '../types';
import { SPECIALTIES, INITIAL_DOCTORS } from '../services/doctorService';

const DEFAULT_GLOBAL_FIELDS: DynamicFormField[] = [
  {
    id: 'field-emergency-contact',
    label: 'Emergency Contact (Name & Phone)',
    type: 'text',
    required: true,
    placeholder: 'e.g. Jane Doe - +1 (555) 987-6543',
    helperText: 'Hospital safety protocol requires next-of-kin contact for all consultations',
  },
  {
    id: 'field-allergies',
    label: 'Known Drug or Environmental Allergies',
    type: 'text',
    required: false,
    placeholder: 'e.g. Penicillin, Sulfa drugs, Latex, None',
    helperText: 'Alerts clinician before prescribing medications',
  },
  {
    id: 'field-insurance',
    label: 'Insurance / Healthcare TPA Provider',
    type: 'select',
    required: false,
    options: ['Self-Pay / Cashless', 'BlueCross BlueShield', 'Aetna Health', 'UnitedHealthcare', 'Cigna Global', 'Medicare / Medicaid', 'Other Corporate TPA'],
    helperText: 'Select your insurance coverage provider if applicable',
  },
  {
    id: 'field-prev-history',
    label: 'Relevant Past Medical History / Surgeries',
    type: 'textarea',
    required: false,
    placeholder: 'Briefly note any previous chronic illness, diabetes, hypertension, or past hospitalizations...',
  },
];

const DEFAULT_DOCTOR_FIELDS: Record<string, DynamicFormField[]> = {
  // Cardiology doctor fields
  'doc-1': [
    {
      id: 'doc1-ecg',
      label: 'Have you had an ECG / Echo within the past 6 months?',
      type: 'radio',
      required: true,
      options: ['Yes - Reports Available', 'Yes - No Physical Copy', 'No - First Time Evaluation'],
      helperText: 'Brings previous tracing or hospital discharge summary if available',
    },
    {
      id: 'doc1-bp-meds',
      label: 'Currently on blood pressure or anticoagulant medications?',
      type: 'radio',
      required: true,
      options: ['Yes (Taking Daily)', 'Occasionally', 'None'],
    },
    {
      id: 'doc1-chest-pain',
      label: 'Does chest discomfort occur during exertion or at rest?',
      type: 'select',
      required: false,
      options: ['During physical exertion', 'At rest / nocturnal', 'Post meals only', 'No chest discomfort'],
    },
  ],
  'doc-101': [
    {
      id: 'doc101-angio',
      label: 'Previous Angiography or Stenting History?',
      type: 'radio',
      required: true,
      options: ['Prior Stent Placed', 'Previous Bypass (CABG)', 'Diagnostic Angiogram Only', 'None'],
    },
  ],
  // Pediatrics doctor fields
  'doc-301': [
    {
      id: 'ped-immunization',
      label: "Child's Immunization Status up to date?",
      type: 'radio',
      required: true,
      options: ['Fully Vaccinated per Age Schedule', 'Delayed / Pending', 'Unsure'],
    },
    {
      id: 'ped-weight',
      label: 'Recent Weight or Birth Weight (if infant)',
      type: 'text',
      required: false,
      placeholder: 'e.g. 14.5 kg or 3.2 kg at birth',
    },
  ],
  // Orthopedics doctor fields
  'doc-401': [
    {
      id: 'ortho-joint',
      label: 'Primary Joint or Anatomical Area Affected',
      type: 'select',
      required: true,
      options: ['Knee (Left / Right)', 'Hip / Pelvis', 'Lumbar Spine / Lower Back', 'Cervical Spine / Neck', 'Shoulder / Rotator Cuff', 'Ankle / Foot', 'Multiple Joints'],
    },
    {
      id: 'ortho-injury-type',
      label: 'Onset Mechanism',
      type: 'radio',
      required: true,
      options: ['Acute Sports / Fall Injury', 'Gradual Wear / Chronic Osteoarthritis', 'Workplace Strain', 'Post-Surgical Recurrence'],
    },
  ],
};

const DEFAULT_SITTING_TIMINGS: Record<string, DoctorSittingSchedule> = {
  'doc-1': {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    shiftMorning: '09:00 AM - 01:00 PM',
    shiftEvening: '02:00 PM - 05:30 PM',
    roomChamber: 'Chamber 402, Heart Institute (Tower A)',
    slotDurationMinutes: 20,
    maxPatientsPerSlot: 1,
    isActive: true,
  },
  'doc-101': {
    days: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
    shiftMorning: '08:30 AM - 12:30 PM',
    shiftEvening: '02:00 PM - 05:00 PM',
    roomChamber: 'Chamber 405, Heart Institute (Tower A)',
    slotDurationMinutes: 25,
    maxPatientsPerSlot: 1,
    isActive: true,
  },
  'doc-102': {
    days: ['Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    shiftMorning: '09:30 AM - 01:30 PM',
    shiftEvening: '03:00 PM - 06:00 PM',
    roomChamber: 'Chamber 408, Cardiac Rhythm Center',
    slotDurationMinutes: 20,
    maxPatientsPerSlot: 1,
    isActive: true,
  },
  'doc-103': {
    days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    shiftMorning: '10:00 AM - 01:00 PM',
    shiftEvening: '03:00 PM - 05:30 PM',
    roomChamber: 'Chamber 410, Preventive Cardiology',
    slotDurationMinutes: 30,
    maxPatientsPerSlot: 1,
    isActive: true,
  },
};

const DEFAULT_FORM_CONFIG: AppointmentFormConfig = {
  mode: 'global',
  globalFields: DEFAULT_GLOBAL_FIELDS,
  doctorSpecificFields: DEFAULT_DOCTOR_FIELDS,
};

export function useHospitalManagement() {
  // 1. Specialties state with localStorage persistence
  const [specialties, setSpecialties] = useState<Specialty[]>(() => {
    try {
      const saved = localStorage.getItem('hospital_specialties');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error loading specialties from localStorage', e);
    }
    return SPECIALTIES;
  });

  // 2. Doctors state with sitting schedules
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    try {
      const saved = localStorage.getItem('hospital_doctors');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error loading doctors from localStorage', e);
    }

    // Attach rich sitting schedules to initial doctors
    return INITIAL_DOCTORS.map((doc) => {
      const schedule = DEFAULT_SITTING_TIMINGS[doc.id] || {
        days: doc.availableDays || ['Monday', 'Wednesday', 'Friday'],
        shiftMorning: '09:00 AM - 01:00 PM',
        shiftEvening: '03:00 PM - 06:00 PM',
        roomChamber: doc.hospitalLocation || 'Chamber 201, OPD Block',
        slotDurationMinutes: 20,
        maxPatientsPerSlot: 1,
        isActive: true,
      };
      return {
        ...doc,
        sittingSchedule: schedule,
      };
    });
  });

  // 3. Dynamic Form Configuration state
  const [formConfig, setFormConfig] = useState<AppointmentFormConfig>(() => {
    try {
      const saved = localStorage.getItem('hospital_form_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error loading form config from localStorage', e);
    }
    return DEFAULT_FORM_CONFIG;
  });

  // Persist specialties
  useEffect(() => {
    try {
      localStorage.setItem('hospital_specialties', JSON.stringify(specialties));
    } catch (e) {
      // ignore
    }
  }, [specialties]);

  // Persist doctors
  useEffect(() => {
    try {
      localStorage.setItem('hospital_doctors', JSON.stringify(doctors));
    } catch (e) {
      // ignore
    }
  }, [doctors]);

  // Persist form configuration
  useEffect(() => {
    try {
      localStorage.setItem('hospital_form_config', JSON.stringify(formConfig));
    } catch (e) {
      // ignore
    }
  }, [formConfig]);

  // =================== SPECIALTY ACTIONS ===================
  const addSpecialty = useCallback((newSpec: Omit<Specialty, 'id' | 'doctorCount'>) => {
    const id = newSpec.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created: Specialty = {
      ...newSpec,
      id: `spec-${id}-${Date.now()}`,
      doctorCount: 0,
    };
    setSpecialties((prev) => [created, ...prev]);
    return created;
  }, []);

  const removeSpecialty = useCallback((id: string) => {
    setSpecialties((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const updateSpecialty = useCallback((id: string, updates: Partial<Specialty>) => {
    setSpecialties((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  // =================== DOCTOR ACTIONS ===================
  const addDoctor = useCallback((doctorData: Omit<Doctor, 'id' | 'rating' | 'reviewCount'>) => {
    const id = `doc-${Date.now()}`;
    const newDoc: Doctor = {
      ...doctorData,
      id,
      rating: 5.0,
      reviewCount: 1,
      avatar: doctorData.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      sittingSchedule: doctorData.sittingSchedule || {
        days: doctorData.availableDays.length > 0 ? doctorData.availableDays : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        shiftMorning: '09:00 AM - 01:00 PM',
        shiftEvening: '03:00 PM - 06:00 PM',
        roomChamber: doctorData.hospitalLocation || 'Chamber 101, Main Block',
        slotDurationMinutes: 20,
        maxPatientsPerSlot: 1,
        isActive: true,
      },
    };

    setDoctors((prev) => [newDoc, ...prev]);

    // Increment doctorCount on specialty
    setSpecialties((prev) =>
      prev.map((s) =>
        s.title.toLowerCase() === newDoc.specialty.toLowerCase()
          ? { ...s, doctorCount: s.doctorCount + 1 }
          : s
      )
    );

    return newDoc;
  }, []);

  const removeDoctor = useCallback((id: string) => {
    setDoctors((prev) => {
      const removed = prev.find((d) => d.id === id);
      if (removed) {
        setSpecialties((specs) =>
          specs.map((s) =>
            s.title.toLowerCase() === removed.specialty.toLowerCase()
              ? { ...s, doctorCount: Math.max(0, s.doctorCount - 1) }
              : s
          )
        );
      }
      return prev.filter((d) => d.id !== id);
    });
  }, []);

  const updateDoctor = useCallback((id: string, updates: Partial<Doctor>) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  }, []);

  const updateDoctorSittingTiming = useCallback(
    (doctorId: string, sittingSchedule: DoctorSittingSchedule) => {
      setDoctors((prev) =>
        prev.map((d) => {
          if (d.id === doctorId) {
            return {
              ...d,
              sittingSchedule,
              availableDays: sittingSchedule.days,
              hospitalLocation: sittingSchedule.roomChamber,
            };
          }
          return d;
        })
      );
    },
    []
  );

  // =================== DYNAMIC FORM BUILDER ACTIONS ===================
  const setFormMode = useCallback((mode: 'global' | 'doctor-wise') => {
    setFormConfig((prev) => ({ ...prev, mode }));
  }, []);

  const addFormField = useCallback((target: 'global' | string, field: Omit<DynamicFormField, 'id'>) => {
    const id = `field-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newField: DynamicFormField = { ...field, id };

    setFormConfig((prev) => {
      if (target === 'global') {
        return {
          ...prev,
          globalFields: [...prev.globalFields, newField],
        };
      } else {
        const existing = prev.doctorSpecificFields[target] || [];
        return {
          ...prev,
          doctorSpecificFields: {
            ...prev.doctorSpecificFields,
            [target]: [...existing, newField],
          },
        };
      }
    });
  }, []);

  const removeFormField = useCallback((target: 'global' | string, fieldId: string) => {
    setFormConfig((prev) => {
      if (target === 'global') {
        return {
          ...prev,
          globalFields: prev.globalFields.filter((f) => f.id !== fieldId),
        };
      } else {
        const existing = prev.doctorSpecificFields[target] || [];
        return {
          ...prev,
          doctorSpecificFields: {
            ...prev.doctorSpecificFields,
            [target]: existing.filter((f) => f.id !== fieldId),
          },
        };
      }
    });
  }, []);

  const updateFormField = useCallback((target: 'global' | string, fieldOrId: string | DynamicFormField, updates?: Partial<DynamicFormField>) => {
    setFormConfig((prev) => {
      const fieldId = typeof fieldOrId === 'string' ? fieldOrId : fieldOrId.id;
      const patch = typeof fieldOrId === 'string' ? updates || {} : fieldOrId;

      if (target === 'global') {
        return {
          ...prev,
          globalFields: prev.globalFields.map((f) => (f.id === fieldId ? { ...f, ...patch } : f)),
        };
      } else {
        const existing = prev.doctorSpecificFields[target] || [];
        return {
          ...prev,
          doctorSpecificFields: {
            ...prev.doctorSpecificFields,
            [target]: existing.map((f) => (f.id === fieldId ? { ...f, ...patch } : f)),
          },
        };
      }
    });
  }, []);

  const resetFormToDefaults = useCallback(() => {
    setFormConfig(DEFAULT_FORM_CONFIG);
  }, []);

  const getFieldsForDoctor = useCallback(
    (doctorId?: string): DynamicFormField[] => {
      if (formConfig.mode === 'global' || !doctorId) {
        return formConfig.globalFields;
      }
      const specific = formConfig.doctorSpecificFields[doctorId];
      if (specific && specific.length > 0) {
        return specific;
      }
      // If doctor-wise mode is active but doctor has no custom fields yet, fallback to global fields
      return formConfig.globalFields;
    },
    [formConfig]
  );

  return {
    specialties,
    addSpecialty,
    removeSpecialty,
    updateSpecialty,
    doctors,
    addDoctor,
    removeDoctor,
    updateDoctor,
    updateDoctorSittingTiming,
    formConfig,
    setFormMode,
    addFormField,
    removeFormField,
    updateFormField,
    resetFormToDefaults,
    getFieldsForDoctor,
  };
}

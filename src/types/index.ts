export interface DoctorSittingSchedule {
  days: string[]; // e.g. ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  shiftMorning?: string; // e.g. '09:00 AM - 01:00 PM'
  shiftEvening?: string; // e.g. '04:00 PM - 08:00 PM'
  roomChamber: string; // e.g. 'Chamber 302, OPD Block A'
  slotDurationMinutes: number; // e.g. 20
  maxPatientsPerSlot: number;
  isActive: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  qualification: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  avatar: string;
  availableDays: string[];
  availableSlots: string[];
  consultationFee: number;
  about: string;
  languages: string[];
  hospitalLocation: string;
  sittingSchedule?: DoctorSittingSchedule;
}

export type AppointmentStatus = 'Confirmed' | 'Completed' | 'Cancelled' | 'Rescheduled';
export type ConsultationType = 'In-Person OPD' | 'Follow-up Consultation' | 'Diagnostic Assessment' | 'In-Person' | 'Video Call' | 'Instant Audio';

export type FormFieldType = 'text' | 'textarea' | 'number' | 'select' | 'radio' | 'checkbox';

export interface DynamicFormField {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  options?: string[]; // For select, radio
  helperText?: string;
  defaultValue?: string | boolean | number;
}

export interface AppointmentFormConfig {
  mode: 'global' | 'doctor-wise';
  globalFields: DynamicFormField[];
  doctorSpecificFields: Record<string, DynamicFormField[]>; // doctorId -> array of fields
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  date: string; // YYYY-MM-DD
  timeSlot: string;
  consultationType: ConsultationType;
  symptoms: string;
  status: AppointmentStatus;
  createdAt: string;
  bookingRef: string;
  notes?: string;
  chamberRoom?: string;
  customResponses?: Record<string, any>;
}

export interface VitalRecord {
  id: string;
  timestamp: string; // ISO date string
  date: string;      // YYYY-MM-DD
  time: string;      // HH:mm
  bloodPressureSystolic: number; // mmHg (e.g. 120)
  bloodPressureDiastolic: number; // mmHg (e.g. 80)
  heartRate: number;              // bpm (e.g. 72)
  bloodGlucose: number;           // mg/dL (e.g. 95)
  glucoseType: 'Fasting' | 'Post-Meal' | 'Random';
  oxygenSaturation: number;       // SpO2 % (e.g. 98)
  bodyTemperature: number;        // °F (e.g. 98.6)
  weightKg: number;               // kg (e.g. 68.5)
  heightCm: number;               // cm (e.g. 175)
  bmi: number;
  notes?: string;
}

export interface VitalStatus {
  status: 'normal' | 'warning' | 'critical';
  label: string;
  message: string;
  color: string;
}

export interface Specialty {
  id: string;
  title: string;
  department?: string;
  description: string;
  iconName: string;
  doctorCount: number;
  commonConditions: string[];
}

export interface HealthTip {
  id: string;
  title: string;
  category: string;
  summary: string;
  readTime: string;
  date: string;
  author: string;
  imageUrl: string;
}

import { Appointment } from '../types';

const STORAGE_KEY = 'g_one_appointments_v2';

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins, MD',
    doctorSpecialty: 'Cardiology',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    patientName: 'Alex Rivera',
    patientEmail: 'alex.rivera@example.com',
    patientPhone: '+1 (555) 234-5678',
    patientAge: 38,
    patientGender: 'Male',
    date: '2026-09-06',
    timeSlot: '09:30 AM',
    consultationType: 'In-Person',
    symptoms: 'Quarterly cardiovascular review & resting heart rate monitoring.',
    status: 'Confirmed',
    createdAt: '2026-09-02T14:20:00.000Z',
    bookingRef: 'G1-CARD-8921',
    notes: 'OPD Room 302 • Bring recent lipid profile & wearable vitals report.',
  },
  {
    id: 'apt-2',
    doctorId: 'doc-5',
    doctorName: 'Dr. Priya Sharma, MBBS, MD',
    doctorSpecialty: 'General Medicine',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-c2c62c21961a?auto=format&fit=crop&q=80&w=400',
    patientName: 'Elena Rostova-Ward',
    patientEmail: 'elena.ward@example.com',
    patientPhone: '+1 (555) 345-6789',
    patientAge: 42,
    patientGender: 'Female',
    date: '2026-09-06',
    timeSlot: '11:00 AM',
    consultationType: 'Video Call',
    symptoms: 'Follow-up on seasonal allergies, persistent fatigue & blood panel.',
    status: 'Confirmed',
    createdAt: '2026-09-03T09:15:00.000Z',
    bookingRef: 'G1-GEN-4109',
    notes: 'Telehealth Room G1-GEN-4109 • Secure WebRTC node active.',
  },
  {
    id: 'apt-3',
    doctorId: 'doc-4',
    doctorName: 'Dr. Arthur Sterling, MD',
    doctorSpecialty: 'Orthopedics',
    doctorAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    patientName: 'Marcus Brody',
    patientEmail: 'marcus.brody@example.com',
    patientPhone: '+1 (555) 890-1234',
    patientAge: 51,
    patientGender: 'Male',
    date: '2026-09-06',
    timeSlot: '02:30 PM',
    consultationType: 'In-Person',
    symptoms: 'Post-op knee rehab evaluation; range of motion check.',
    status: 'Confirmed',
    createdAt: '2026-09-04T11:00:00.000Z',
    bookingRef: 'G1-ORTH-3312',
    notes: 'OPD Suite 410 • Orthopedic Rehabilitation Center.',
  },
  {
    id: 'apt-4',
    doctorId: 'doc-2',
    doctorName: 'Dr. Elena Rostova, MD, PhD',
    doctorSpecialty: 'Neurology',
    doctorAvatar: 'https://images.unsplash.com/photo-1594824813571-638f0263613a?auto=format&fit=crop&q=80&w=400',
    patientName: 'Sophia Lin',
    patientEmail: 'sophia.lin@example.com',
    patientPhone: '+1 (555) 678-9012',
    patientAge: 29,
    patientGender: 'Female',
    date: '2026-09-06',
    timeSlot: '04:15 PM',
    consultationType: 'Instant Audio',
    symptoms: 'Chronic migraine trigger tracking & medication adjustment.',
    status: 'Confirmed',
    createdAt: '2026-09-05T08:30:00.000Z',
    bookingRef: 'G1-NEUR-5501',
    notes: 'Direct Audio Tele-Triage • EEG reports on file.',
  },
  {
    id: 'apt-5',
    doctorId: 'doc-3',
    doctorName: 'Dr. Michael Chen, MD, FAAP',
    doctorSpecialty: 'Pediatrics',
    doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    patientName: 'Lucas Vance (Child)',
    patientEmail: 'parent.vance@example.com',
    patientPhone: '+1 (555) 432-1098',
    patientAge: 6,
    patientGender: 'Male',
    date: '2026-09-07',
    timeSlot: '10:00 AM',
    consultationType: 'In-Person',
    symptoms: 'Annual pediatric developmental wellness check & booster shots.',
    status: 'Confirmed',
    createdAt: '2026-09-05T16:00:00.000Z',
    bookingRef: 'G1-PED-7729',
    notes: 'Pediatric Wing B, Station 12 • Accompanying guardian Eleanor Vance.',
  },
  {
    id: 'apt-6',
    doctorId: 'doc-6',
    doctorName: 'Dr. Sofia Patel, MD, FAAD',
    doctorSpecialty: 'Dermatology',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    patientName: 'David Miller',
    patientEmail: 'd.miller@example.com',
    patientPhone: '+1 (555) 765-4321',
    patientAge: 45,
    patientGender: 'Male',
    date: '2026-09-07',
    timeSlot: '03:00 PM',
    consultationType: 'Video Call',
    symptoms: 'High-resolution dermatoscope review of forearm rash.',
    status: 'Confirmed',
    createdAt: '2026-09-04T13:40:00.000Z',
    bookingRef: 'G1-DERM-2904',
    notes: 'Tele-Derm HD Video Room • Pre-uploaded high-res images.',
  },
  {
    id: 'apt-7',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins, MD',
    doctorSpecialty: 'Cardiology',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    patientName: 'Hannah Abbott',
    patientEmail: 'hannah.a@example.com',
    patientPhone: '+1 (555) 987-6543',
    patientAge: 64,
    patientGender: 'Female',
    date: '2026-09-04',
    timeSlot: '11:30 AM',
    consultationType: 'In-Person',
    symptoms: 'Post-stent 6-month checkup, normal rhythm confirmed.',
    status: 'Completed',
    createdAt: '2026-08-30T10:00:00.000Z',
    bookingRef: 'G1-CARD-1190',
    notes: 'Echocardiogram normal. Continue Atorvastatin 20mg & Aspirin 81mg.',
  },
  {
    id: 'apt-8',
    doctorId: 'doc-5',
    doctorName: 'Dr. Priya Sharma, MBBS, MD',
    doctorSpecialty: 'General Medicine',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-c2c62c21961a?auto=format&fit=crop&q=80&w=400',
    patientName: 'James Wilson',
    patientEmail: 'j.wilson@example.com',
    patientPhone: '+1 (555) 321-7890',
    patientAge: 34,
    patientGender: 'Male',
    date: '2026-09-03',
    timeSlot: '09:00 AM',
    consultationType: 'In-Person',
    symptoms: 'Mild viral pharyngitis; symptoms resolved before visit.',
    status: 'Cancelled',
    createdAt: '2026-08-31T08:00:00.000Z',
    bookingRef: 'G1-GEN-9021',
    notes: 'Cancelled by patient: Symptoms resolved.',
  },
];

export const appointmentService = {
  getAppointments: (): Appointment[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPOINTMENTS));
        return INITIAL_APPOINTMENTS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load appointments from localStorage', e);
      return INITIAL_APPOINTMENTS;
    }
  },

  createAppointment: (data: Omit<Appointment, 'id' | 'createdAt' | 'bookingRef' | 'status'>): Appointment => {
    const appointments = appointmentService.getAppointments();
    const id = `apt-${Date.now()}`;
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const prefix = data.doctorSpecialty.substring(0, 4).toUpperCase();
    const bookingRef = `G1-${prefix}-${randomCode}`;

    const newAppointment: Appointment = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      bookingRef,
      status: 'Confirmed',
    };

    const updated = [newAppointment, ...appointments];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newAppointment;
  },

  updateAppointmentStatus: (id: string, status: Appointment['status'], reason?: string): Appointment[] => {
    const appointments = appointmentService.getAppointments();
    const updated = appointments.map((apt) => {
      if (apt.id === id) {
        return {
          ...apt,
          status,
          notes: reason ? `${apt.notes ? apt.notes + ' | ' : ''}${reason}` : apt.notes,
        };
      }
      return apt;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  rescheduleAppointment: (id: string, newDate: string, newTimeSlot: string): Appointment[] => {
    const appointments = appointmentService.getAppointments();
    const updated = appointments.map((apt) => {
      if (apt.id === id) {
        return {
          ...apt,
          date: newDate,
          timeSlot: newTimeSlot,
          status: 'Rescheduled' as const,
        };
      }
      return apt;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteAppointment: (id: string): Appointment[] => {
    const appointments = appointmentService.getAppointments();
    const updated = appointments.filter((apt) => apt.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};

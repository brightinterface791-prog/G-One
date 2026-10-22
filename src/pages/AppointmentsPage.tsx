import React, { useState, useMemo } from 'react';
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
  Avatar,
  IconButton,
  Divider,
  TextField,
  MenuItem,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Assignment,
  CalendarToday,
  AccessTime,
  LocationOn,
  Download,
  EditCalendar,
  Cancel,
  AddCircle,
  CheckCircle,
  Phone,
  Search,
  LocalHospital,
  LocalFireDepartment,
  Circle,
  ViewAgenda,
  TableRows,
  Description,
  NoteAlt,
  Close,
  FilterList,
  Print,
  Refresh,
  Person,
  MedicalServices,
  MeetingRoom,
  PersonSearch,
  ArrowForward,
  Check,
  MoreVert,
} from '@mui/icons-material';
import { Appointment, ConsultationType, Doctor } from '../types';
import { THEME_COLOR } from '../theme/theme';
import { ClinicalSlipModal } from '../components/appointments/ClinicalSlipModal';
import { QuickTriageWalkInModal } from '../components/appointments/QuickTriageWalkInModal';
import { ClinicalNotesDialog } from '../components/appointments/ClinicalNotesDialog';

interface AppointmentsPageProps {
  appointments: Appointment[];
  doctors?: Doctor[];
  initialDoctorId?: string;
  onCancelAppointment: (id: string, reason: string) => void;
  onRescheduleAppointment: (id: string, newDate: string, newTimeSlot: string) => void;
  onOpenNewBooking: (doctor?: Doctor) => void;
  onUpdateStatus?: (id: string, status: Appointment['status'], notes?: string) => void;
  onAddWalkIn?: (data: Omit<Appointment, 'id' | 'createdAt' | 'bookingRef' | 'status'>) => void;
}

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({
  appointments,
  doctors = [],
  initialDoctorId,
  onCancelAppointment,
  onRescheduleAppointment,
  onOpenNewBooking,
  onUpdateStatus,
  onAddWalkIn,
}) => {
  // Filters
  const [tabValue, setTabValue] = useState<'All' | 'Confirmed' | 'Completed' | 'Cancelled'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState<string>(initialDoctorId || 'All');
  const [modalityFilter, setModalityFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modals state
  const [slipApt, setSlipApt] = useState<Appointment | null>(null);
  const [notesApt, setNotesApt] = useState<Appointment | null>(null);
  const [walkInOpen, setWalkInOpen] = useState(false);

  // Reschedule state
  const [rescheduleAptId, setRescheduleAptId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');

  // Cancel state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedForCancel, setSelectedForCancel] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('Patient requested cancellation');

  // Action overflow menu state
  const [actionMenuApt, setActionMenuApt] = useState<Appointment | null>(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);

  const handleOpenActionMenu = (event: React.MouseEvent<HTMLElement>, apt: Appointment) => {
    event.stopPropagation();
    setActionMenuAnchor(event.currentTarget);
    setActionMenuApt(apt);
  };

  const handleCloseActionMenu = () => {
    setActionMenuAnchor(null);
    setActionMenuApt(null);
  };

  const handleReopenAppointment = (apt: Appointment) => {
    if (onUpdateStatus) {
      onUpdateStatus(apt.id, 'Confirmed', 'Reopened to active consultation queue');
    }
  };

  const todayStr = '2026-09-06';

  // Find active selected doctor object if filtered
  const activeFilteredDoctor = useMemo(() => {
    if (selectedDoctorFilter === 'All') return null;
    return doctors.find((d) => d.id === selectedDoctorFilter) || null;
  }, [doctors, selectedDoctorFilter]);

  // Filtered appointments list
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Tab status
      const matchesTab =
        tabValue === 'All' ||
        (tabValue === 'Confirmed'
          ? apt.status === 'Confirmed' || apt.status === 'Rescheduled'
          : apt.status === tabValue);

      // Doctor-wise filter
      const matchesDoctor =
        selectedDoctorFilter === 'All' ||
        apt.doctorId === selectedDoctorFilter ||
        (activeFilteredDoctor && apt.doctorName.toLowerCase().includes(activeFilteredDoctor.name.toLowerCase()));

      // Modality filter
      const matchesModality = modalityFilter === 'All' || apt.consultationType === modalityFilter;

      // Date filter
      const matchesDate =
        dateFilter === 'all'
          ? true
          : dateFilter === 'today'
          ? apt.date === todayStr
          : dateFilter === 'upcoming'
          ? apt.date >= todayStr
          : apt.date < todayStr;

      // Search Query
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        apt.doctorName.toLowerCase().includes(query) ||
        apt.doctorSpecialty.toLowerCase().includes(query) ||
        apt.bookingRef.toLowerCase().includes(query) ||
        apt.patientName.toLowerCase().includes(query) ||
        apt.symptoms.toLowerCase().includes(query) ||
        (apt.notes && apt.notes.toLowerCase().includes(query));

      return matchesTab && matchesDoctor && matchesModality && matchesDate && matchesSearch;
    });
  }, [appointments, tabValue, selectedDoctorFilter, activeFilteredDoctor, modalityFilter, dateFilter, searchQuery]);

  // Operational Counts
  const upcomingCount = appointments.filter((a) => a.status === 'Confirmed' || a.status === 'Rescheduled').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;

  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const todayUpcoming = todayAppointments.filter((a) => a.status === 'Confirmed' || a.status === 'Rescheduled');
  const todayCompleted = todayAppointments.filter((a) => a.status === 'Completed');
  const todayCompletionRate = todayAppointments.length > 0 ? Math.round((todayCompleted.length / todayAppointments.length) * 100) : 0;

  // Active doctor-specific stats
  const doctorTodayApts = activeFilteredDoctor
    ? appointments.filter((a) => a.doctorId === activeFilteredDoctor.id || a.doctorName.includes(activeFilteredDoctor.name))
    : [];

  const handleStartReschedule = (apt: Appointment) => {
    setRescheduleAptId(apt.id);
    setNewDate(apt.date);
    setNewTimeSlot(apt.timeSlot);
  };

  const handleSaveReschedule = (id: string) => {
    if (newDate && newTimeSlot) {
      onRescheduleAppointment(id, newDate, newTimeSlot);
      setRescheduleAptId(null);
    }
  };

  const handlePromptCancel = (apt: Appointment) => {
    setSelectedForCancel(apt);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (selectedForCancel) {
      onCancelAppointment(selectedForCancel.id, cancelReason);
      setCancelDialogOpen(false);
      setSelectedForCancel(null);
    }
  };

  const handleToggleComplete = (apt: Appointment) => {
    if (onUpdateStatus) {
      const nextStatus = apt.status === 'Completed' ? 'Confirmed' : 'Completed';
      onUpdateStatus(apt.id, nextStatus, 'Status updated from hospital desk');
    }
  };

  const handleSaveNotes = (id: string, notes: string) => {
    if (onUpdateStatus) {
      const target = appointments.find((a) => a.id === id);
      if (target) {
        onUpdateStatus(id, target.status, notes);
      }
    }
  };

  const handleExportSchedule = () => {
    const csvContent = [
      'Ref No,Date,Time,Patient Name,Age,Gender,Phone,Doctor Name,Specialty,Room,Modality,Status,Symptoms,Custom Responses',
      ...filteredAppointments.map((a) => {
        const customStr = a.customResponses
          ? Object.entries(a.customResponses).map(([k, v]) => `${k}: ${v}`).join('; ')
          : '';
        return `"${a.bookingRef}","${a.date}","${a.timeSlot}","${a.patientName}","${a.patientAge}","${a.patientGender}","${a.patientPhone}","${a.doctorName}","${a.doctorSpecialty}","${a.chamberRoom || ''}","${a.consultationType}","${a.status}","${a.symptoms.replace(/"/g, '""')}","${customStr.replace(/"/g, '""')}"`;
      }),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `G_One_Hospital_OPD_Schedule_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box id="hospital-appointments-page" sx={{ py: { xs: 3, sm: 4 }, backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        {/* 1. Header & Live Hospital Command Strip */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
              <Chip
                icon={<Circle sx={{ fontSize: '8px !important', color: '#16a34a' }} />}
                label="HOSPITAL OPD OPERATIONAL"
                size="small"
                sx={{
                  fontWeight: 800,
                  backgroundColor: 'rgba(22, 163, 74, 0.1)',
                  color: '#15803d',
                  borderRadius: '9999px',
                  fontSize: '0.68rem',
                }}
              />
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                • Clinical Roster Date: <strong>Sunday, Sep 6, 2026</strong>
              </Typography>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: '#0f172a',
                fontSize: { xs: '1.5rem', sm: '1.85rem' },
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              Hospital OPD & Clinical Consultations Desk
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', maxWidth: 760, fontSize: '0.86rem' }}>
              Centralized appointment management, doctor-wise sitting rosters, chamber assignments, and dynamic intake questionnaires.
            </Typography>
          </Box>

          {/* Top Quick Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
            <Button
              id="quick-walk-in-btn"
              variant="outlined"
              size="small"
              startIcon={<LocalFireDepartment sx={{ color: '#dc2626', fontSize: 16 }} />}
              onClick={() => setWalkInOpen(true)}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                borderRadius: '9999px',
                borderColor: '#e2e8f0',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                px: 2,
                py: 0.7,
                '&:hover': { backgroundColor: '#fef2f2', borderColor: '#fca5a5' },
              }}
            >
              Walk-in Triage
            </Button>

            <Button
              id="schedule-new-patient-btn"
              variant="contained"
              size="small"
              startIcon={<AddCircle sx={{ fontSize: 16 }} />}
              onClick={() => onOpenNewBooking(activeFilteredDoctor || undefined)}
              sx={{
                backgroundColor: THEME_COLOR,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                borderRadius: '9999px',
                px: 2.2,
                py: 0.7,
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#900201' },
              }}
            >
              Schedule Appointment
            </Button>
          </Box>
        </Box>

        {/* 2. Hospital Bento Metrics Strip */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Card 1: Today's Patient Queue */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Paper elevation={0} sx={{ p: 2.2, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  Today's OPD Consultations
                </Typography>
                <Assignment sx={{ color: THEME_COLOR, fontSize: 18 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.45rem', mb: 0.3 }}>
                {todayAppointments.length} Patients
              </Typography>
              <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.75rem', display: 'block', mb: 1 }}>
                {todayUpcoming.length} in queue • {todayCompleted.length} completed
              </Typography>
              <LinearProgress variant="determinate" value={todayCompletionRate} sx={{ height: 5, borderRadius: 3, backgroundColor: '#f1f5f9', '& .MuiLinearProgress-bar': { backgroundColor: '#16a34a' } }} />
            </Paper>
          </Grid>

          {/* Card 2: Attending Doctors on Sitting Duty */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Paper elevation={0} sx={{ p: 2.2, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  Physicians on Sitting Duty
                </Typography>
                <MeetingRoom sx={{ color: '#0284c7', fontSize: 18 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.45rem', mb: 0.3 }}>
                {doctors.length || 5} Active Doctors
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>
                Assigned across OPD Chambers & Heart Institute
              </Typography>
            </Paper>
          </Grid>

          {/* Card 3: Total Scheduled Roster */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Paper elevation={0} sx={{ p: 2.2, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  Confirmed Hospital Bookings
                </Typography>
                <CalendarToday sx={{ color: '#16a34a', fontSize: 18 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.45rem', mb: 0.3 }}>
                {upcomingCount} Total Upcoming
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>
                {completedCount} historical records archived
              </Typography>
            </Paper>
          </Grid>

          {/* Card 4: Clinical Triage Status */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Paper elevation={0} sx={{ p: 2.2, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  Average Consultation Time
                </Typography>
                <AccessTime sx={{ color: '#d97706', fontSize: 18 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.45rem', mb: 0.3 }}>
                20 Min / Slot
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>
                Doctor sitting shifts: 09:00 AM – 06:30 PM
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* 3. DOCTOR-WISE VIEW & SITTING ROSTER CARD (DYNAMIC HOSPITAL FEATURE) */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 3,
            border: '1.5px solid #cbd5e1',
            backgroundColor: '#ffffff',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: activeFilteredDoctor ? 2 : 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, width: { xs: '100%', md: 'auto' } }}>
              <PersonSearch sx={{ color: THEME_COLOR, fontSize: 24 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                  Doctor-Wise Appointments & Sitting Schedule View
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.78rem' }}>
                  Select an individual clinician to isolate their daily patient queue, OPD chamber, and sitting hours:
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: '100%', md: 'auto' } }}>
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 300 } }}>
                <InputLabel id="doctor-roster-filter-label">Filter by Doctor</InputLabel>
                <Select
                  labelId="doctor-roster-filter-label"
                  value={selectedDoctorFilter}
                  label="Filter by Doctor"
                  onChange={(e) => setSelectedDoctorFilter(e.target.value)}
                >
                  <MenuItem value="All">All Hospital Clinicians ({appointments.length} Appointments)</MenuItem>
                  {doctors.map((doc) => {
                    const docAptCount = appointments.filter((a) => a.doctorId === doc.id || a.doctorName.includes(doc.name)).length;
                    return (
                      <MenuItem key={doc.id} value={doc.id}>
                        {doc.name} ({doc.specialty}) — {docAptCount} visits
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              {selectedDoctorFilter !== 'All' && (
                <Button
                  size="small"
                  onClick={() => setSelectedDoctorFilter('All')}
                  sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', color: THEME_COLOR }}
                >
                  Clear Doctor Filter
                </Button>
              )}
            </Box>
          </Box>

          {/* Active Doctor Details & Sitting Timing Banner */}
          {activeFilteredDoctor && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={activeFilteredDoctor.avatar} alt={activeFilteredDoctor.name} sx={{ width: 54, height: 54, borderRadius: 2 }} />
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                      {activeFilteredDoctor.name}
                    </Typography>
                    <Chip label={activeFilteredDoctor.specialty} size="small" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, backgroundColor: 'rgba(183, 3, 2, 0.08)', color: THEME_COLOR }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: '#475569', display: 'block', fontSize: '0.76rem', mt: 0.2 }}>
                    <strong>OPD Chamber:</strong> {activeFilteredDoctor.sittingSchedule?.roomChamber || activeFilteredDoctor.hospitalLocation}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 700, fontSize: '0.74rem' }}>
                    Sitting Hours: {activeFilteredDoctor.sittingSchedule?.shiftMorning || '09:00 AM - 01:00 PM'}
                    {activeFilteredDoctor.sittingSchedule?.shiftEvening ? ` & ${activeFilteredDoctor.sittingSchedule.shiftEvening}` : ''}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Paper elevation={0} sx={{ p: 1.2, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, textAlign: 'center', minWidth: 100 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Total Doctor Queue
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: THEME_COLOR, lineHeight: 1.1 }}>
                    {doctorTodayApts.length}
                  </Typography>
                </Paper>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onOpenNewBooking(activeFilteredDoctor)}
                  sx={{
                    backgroundColor: THEME_COLOR,
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    boxShadow: 'none',
                    '&:hover': { backgroundColor: '#900201' },
                  }}
                >
                  Add Patient to This Doctor
                </Button>
              </Box>
            </Box>
          )}
        </Paper>

        {/* 4. Filter & Search Controls — Tailwind pill controls, aligned on one row at desktop widths */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1 lg:flex-[2]">
              <Search aria-hidden="true" sx={{ fontSize: 19 }} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                aria-label="Search appointments"
                placeholder="Search patient, doctor, booking token, symptoms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-full border border-slate-200 bg-white py-2 pl-11 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-3 lg:flex-[2]">
              <div className="relative min-w-0">
                <select
                  aria-label="Filter appointments by date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
                  className="h-11 w-full min-w-0 appearance-none rounded-full border border-slate-200 bg-white py-2 pl-5 pr-12 text-sm font-normal text-slate-800 shadow-sm outline-none transition-colors hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today (Sep 6)</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past Consultations</option>
                </select>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
              <div className="relative min-w-0">
                <select
                  aria-label="Filter appointments by modality"
                  value={modalityFilter}
                  onChange={(e) => setModalityFilter(e.target.value)}
                  className="h-11 w-full min-w-0 appearance-none rounded-full border border-slate-200 bg-white py-2 pl-5 pr-12 text-sm font-normal text-slate-800 shadow-sm outline-none transition-colors hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                >
                  <option value="All">All Modalities</option>
                  <option value="In-Person OPD">In-Person OPD</option>
                  <option value="Follow-up Consultation">Follow-up Consultation</option>
                  <option value="Diagnostic Assessment">Diagnostic Assessment</option>
                </select>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
            <div className="flex shrink-0 items-center justify-end gap-2">
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                <button type="button" aria-label="Card view" aria-pressed={viewMode === 'cards'} onClick={() => setViewMode('cards')} className={`flex h-8 w-8 items-center justify-center rounded-full ${viewMode === 'cards' ? 'bg-white text-[#b70302] shadow-sm' : 'text-slate-500'}`}>
                  <ViewAgenda sx={{ fontSize: 18 }} />
                </button>
                <button type="button" aria-label="Table view" aria-pressed={viewMode === 'table'} onClick={() => setViewMode('table')} className={`flex h-8 w-8 items-center justify-center rounded-full ${viewMode === 'table' ? 'bg-white text-[#b70302] shadow-sm' : 'text-slate-500'}`}>
                  <TableRows sx={{ fontSize: 18 }} />
                </button>
              </div>
              <button type="button" onClick={handleExportSchedule} className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-600 hover:bg-slate-50">
                <Download sx={{ fontSize: 17 }} /> Export CSV
              </button>
            </div>
          </div>

          {/* Status Tabs */}
          <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid #f1f5f9' }}>
            <Tabs
              value={tabValue}
              onChange={(_, val) => setTabValue(val)}
              sx={{
                minHeight: 36,
                '& .MuiTab-root': {
                  minHeight: 36,
                  py: 0.5,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  color: '#64748b',
                  '&.Mui-selected': { color: THEME_COLOR },
                },
                '& .MuiTabs-indicator': { backgroundColor: THEME_COLOR },
              }}
            >
              <Tab label={`All Consultations (${appointments.length})`} value="All" />
              <Tab label={`Confirmed / In-Queue (${upcomingCount})`} value="Confirmed" />
              <Tab label={`Completed (${completedCount})`} value="Completed" />
              <Tab label={`Cancelled (${cancelledCount})`} value="Cancelled" />
            </Tabs>
          </Box>
        </div>

        {/* 5. Appointment Content (Cards or Table) */}
        {filteredAppointments.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px dashed #cbd5e1', backgroundColor: '#ffffff' }}>
            <CalendarToday sx={{ fontSize: 40, color: '#94a3b8', mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5, fontSize: '1rem' }}>
              No Consultations Found
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontSize: '0.82rem' }}>
              No patient appointments match the selected doctor, date, or query filters.
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setTabValue('All');
                setSelectedDoctorFilter('All');
                setSearchQuery('');
                setDateFilter('all');
                setModalityFilter('All');
              }}
              sx={{ backgroundColor: THEME_COLOR, fontWeight: 700, textTransform: 'none', borderRadius: '9999px', fontSize: '0.8rem' }}
            >
              Reset Filters
            </Button>
          </Paper>
        ) : viewMode === 'cards' ? (
          /* Cards View - Streamlined, Compact & Professional Medical SaaS Layout */
          <Grid container spacing={2}>
            {filteredAppointments.map((apt) => {
              const isConfirmed = apt.status === 'Confirmed' || apt.status === 'Rescheduled';
              const isCompleted = apt.status === 'Completed';
              const isCancelled = apt.status === 'Cancelled';
              const hasCustomResponses = apt.customResponses && Object.keys(apt.customResponses).length > 0;

              return (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={apt.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.75,
                      borderRadius: 2.5,
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        borderColor: '#cbd5e1',
                        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
                      },
                    }}
                  >
                    {/* Top Header: Booking Ref Token, Modality & Status */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            color: THEME_COLOR,
                            fontSize: '0.74rem',
                            letterSpacing: '0.02em',
                            backgroundColor: 'rgba(183, 3, 2, 0.05)',
                            px: 0.8,
                            py: 0.2,
                            borderRadius: 1,
                            border: '1px solid rgba(183, 3, 2, 0.12)',
                          }}
                        >
                          {apt.bookingRef}
                        </Typography>
                        <Chip
                          label={apt.consultationType}
                          size="small"
                          sx={{ height: 20, fontSize: '0.66rem', fontWeight: 600, backgroundColor: '#f1f5f9', color: '#475569', borderRadius: 1 }}
                        />
                      </Box>

                      {isConfirmed && (
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 0.8,
                            py: 0.2,
                            borderRadius: 1,
                            backgroundColor: '#f0fdf4',
                            color: '#166534',
                            border: '1px solid #bbf7d0',
                            fontSize: '0.64rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                          }}
                        >
                          <Box sx={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#16a34a' }} />
                          Confirmed
                        </Box>
                      )}
                      {isCompleted && (
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.4,
                            px: 0.8,
                            py: 0.2,
                            borderRadius: 1,
                            backgroundColor: '#ecfdf5',
                            color: '#047857',
                            border: '1px solid #a7f3d0',
                            fontSize: '0.64rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                          }}
                        >
                          <Check sx={{ fontSize: 11 }} />
                          Completed
                        </Box>
                      )}
                      {isCancelled && (
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.4,
                            px: 0.8,
                            py: 0.2,
                            borderRadius: 1,
                            backgroundColor: '#fef2f2',
                            color: '#b91c1c',
                            border: '1px solid #fecaca',
                            fontSize: '0.64rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                          }}
                        >
                          <Close sx={{ fontSize: 11 }} />
                          Cancelled
                        </Box>
                      )}
                    </Box>

                    {/* Patient Particulars */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.2 }}>
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: 1.5,
                          backgroundColor: 'rgba(183, 3, 2, 0.08)',
                          color: THEME_COLOR,
                          fontWeight: 800,
                          fontSize: '0.82rem',
                        }}
                      >
                        {apt.patientName.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem', lineHeight: 1.2 }}>
                          {apt.patientName}
                        </Typography>
                        <Typography variant="caption" noWrap sx={{ color: '#64748b', display: 'block', fontSize: '0.72rem', mt: 0.2 }}>
                          {apt.patientAge} yrs • {apt.patientGender} • {apt.patientPhone}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Compact Physician & Chamber/Schedule Strip */}
                    <Box
                      sx={{
                        px: 1.2,
                        py: 0.85,
                        borderRadius: 1.5,
                        backgroundColor: '#f8fafc',
                        border: '1px solid #edf2f7',
                        mb: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, minWidth: 0 }}>
                          <MedicalServices sx={{ fontSize: 13, color: THEME_COLOR, flexShrink: 0 }} />
                          <Typography variant="body2" noWrap sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.78rem' }}>
                            {apt.doctorName}
                          </Typography>
                        </Box>
                        <Typography
                          variant="caption"
                          noWrap
                          sx={{
                            color: '#0284c7',
                            fontWeight: 700,
                            fontSize: '0.68rem',
                            backgroundColor: 'rgba(2, 132, 199, 0.08)',
                            px: 0.7,
                            py: 0.1,
                            borderRadius: 0.8,
                            flexShrink: 0,
                          }}
                        >
                          {apt.doctorSpecialty}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.6, pt: 0.6, borderTop: '1px solid #f1f5f9' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarToday sx={{ fontSize: 11, color: '#64748b' }} />
                          <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', fontSize: '0.72rem' }}>
                            {apt.date} • {apt.timeSlot}
                          </Typography>
                        </Box>
                        {apt.chamberRoom && (
                          <Typography variant="caption" noWrap sx={{ color: '#475569', fontWeight: 600, fontSize: '0.68rem' }}>
                            {apt.chamberRoom.split(',')[0]}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Chief Clinical Concern */}
                    <Box sx={{ mb: 1, minHeight: 32 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#475569',
                          fontSize: '0.74rem',
                          lineHeight: 1.35,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                        title={apt.symptoms}
                      >
                        <strong style={{ color: '#64748b', fontWeight: 700 }}>Concern: </strong>
                        {apt.symptoms}
                      </Typography>
                    </Box>

                    {/* Dynamic Form Responses (If provided by patient) */}
                    {hasCustomResponses && (
                      <Box sx={{ px: 1, py: 0.5, backgroundColor: 'rgba(2, 132, 199, 0.04)', borderRadius: 1, border: '1px solid #e0f2fe', mb: 1 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {Object.entries(apt.customResponses!).slice(0, 2).map(([k, v]) => {
                            if (!v) return null;
                            return (
                              <Chip
                                key={k}
                                label={`${k}: ${v}`}
                                size="small"
                                sx={{ height: 18, fontSize: '0.62rem', backgroundColor: '#ffffff', border: '1px solid #bae6fd', color: '#0369a1', borderRadius: 0.8 }}
                              />
                            );
                          })}
                        </Box>
                      </Box>
                    )}

                    {/* Streamlined Action Buttons Toolbar */}
                    <Box
                      sx={{
                        mt: 'auto',
                        pt: 1,
                        borderTop: '1px solid #f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 0.8,
                      }}
                    >
                      {/* Left: Slip & Notes */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Print sx={{ fontSize: 13 }} />}
                          onClick={() => setSlipApt(apt)}
                          sx={{
                            height: 28,
                            px: 1.2,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.72rem',
                            borderRadius: 1.5,
                            borderColor: '#cbd5e1',
                            color: '#1e293b',
                            backgroundColor: '#ffffff',
                            '&:hover': {
                              borderColor: '#94a3b8',
                              backgroundColor: '#f8fafc',
                            },
                          }}
                        >
                          Slip & Rx
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<NoteAlt sx={{ fontSize: 13 }} />}
                          onClick={() => setNotesApt(apt)}
                          sx={{
                            height: 28,
                            px: 1.2,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.72rem',
                            borderRadius: 1.5,
                            borderColor: '#cbd5e1',
                            color: '#475569',
                            backgroundColor: '#ffffff',
                            '&:hover': {
                              borderColor: '#94a3b8',
                              backgroundColor: '#f8fafc',
                            },
                          }}
                        >
                          Notes
                        </Button>
                      </Box>

                      {/* Right: Complete Status button + More Options Menu */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                        {isConfirmed && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<Check sx={{ fontSize: 13 }} />}
                            onClick={() => handleToggleComplete(apt)}
                            sx={{
                              height: 28,
                              px: 1.3,
                              backgroundColor: '#16a34a',
                              color: '#ffffff',
                              textTransform: 'none',
                              fontWeight: 700,
                              fontSize: '0.72rem',
                              borderRadius: 1.5,
                              boxShadow: 'none',
                              '&:hover': {
                                backgroundColor: '#15803d',
                                boxShadow: 'none',
                              },
                            }}
                          >
                            Complete
                          </Button>
                        )}

                        <Tooltip title="More options">
                          <IconButton
                            size="small"
                            onClick={(e) => handleOpenActionMenu(e, apt)}
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: 1.5,
                              border: '1px solid #e2e8f0',
                              color: '#64748b',
                              '&:hover': {
                                backgroundColor: '#f1f5f9',
                                borderColor: '#cbd5e1',
                                color: '#0f172a',
                              },
                            }}
                          >
                            <MoreVert sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          /* Table View */
          <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.76rem', color: '#475569' }}>Ref Token</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.76rem', color: '#475569' }}>Patient</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.76rem', color: '#475569' }}>Attending Physician</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.76rem', color: '#475569' }}>Schedule & Room</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.76rem', color: '#475569' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.76rem', color: '#475569' }}>Clinical Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAppointments.map((apt) => (
                  <TableRow key={apt.id} hover>
                    <TableCell sx={{ fontWeight: 700, color: THEME_COLOR, fontSize: '0.8rem' }}>
                      {apt.bookingRef}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a' }}>
                        {apt.patientName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
                        {apt.patientAge}y • {apt.patientGender} • {apt.patientPhone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem', color: '#0f172a' }}>
                        {apt.doctorName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: THEME_COLOR, fontWeight: 600, fontSize: '0.72rem' }}>
                        {apt.doctorSpecialty}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                        {apt.date} ({apt.timeSlot})
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
                        {apt.chamberRoom || 'OPD Block'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={apt.status}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          backgroundColor: apt.status === 'Completed' ? '#dcfce7' : apt.status === 'Cancelled' ? '#fee2e2' : '#e0f2fe',
                          color: apt.status === 'Completed' ? '#15803d' : apt.status === 'Cancelled' ? '#b91c1c' : '#0369a1',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setSlipApt(apt)}
                          sx={{ textTransform: 'none', fontSize: '0.72rem', fontWeight: 600, borderRadius: 1.5, borderColor: '#cbd5e1', color: '#1e293b', py: 0.2, px: 1 }}
                        >
                          Slip
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setNotesApt(apt)}
                          sx={{ textTransform: 'none', fontSize: '0.72rem', fontWeight: 600, borderRadius: 1.5, borderColor: '#cbd5e1', color: '#475569', py: 0.2, px: 1 }}
                        >
                          Notes
                        </Button>
                        <IconButton
                          size="small"
                          onClick={(e) => handleOpenActionMenu(e, apt)}
                          sx={{ width: 26, height: 26, borderRadius: 1.5, border: '1px solid #e2e8f0', color: '#64748b' }}
                        >
                          <MoreVert sx={{ fontSize: 15 }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Container>

      {/* Action Overflow Menu for Appointments */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleCloseActionMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              borderRadius: 2,
              border: '1px solid #e2e8f0',
              minWidth: 200,
              py: 0.5,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.06)',
            },
          },
        }}
      >
        {actionMenuApt && (actionMenuApt.status === 'Confirmed' || actionMenuApt.status === 'Rescheduled') && (
          <MenuItem
            onClick={() => {
              if (actionMenuApt) handleStartReschedule(actionMenuApt);
              handleCloseActionMenu();
            }}
            sx={{ fontSize: '0.8rem', fontWeight: 600, gap: 1.2, py: 0.8 }}
          >
            <EditCalendar sx={{ fontSize: 16, color: '#0284c7' }} />
            Reschedule Shift / Date
          </MenuItem>
        )}

        {actionMenuApt && (actionMenuApt.status === 'Confirmed' || actionMenuApt.status === 'Rescheduled') && (
          <MenuItem
            onClick={() => {
              if (actionMenuApt) handlePromptCancel(actionMenuApt);
              handleCloseActionMenu();
            }}
            sx={{ fontSize: '0.8rem', fontWeight: 600, gap: 1.2, py: 0.8, color: '#dc2626' }}
          >
            <Cancel sx={{ fontSize: 16, color: '#dc2626' }} />
            Cancel Appointment
          </MenuItem>
        )}

        {actionMenuApt && (actionMenuApt.status === 'Completed' || actionMenuApt.status === 'Cancelled') && (
          <MenuItem
            onClick={() => {
              if (actionMenuApt) handleReopenAppointment(actionMenuApt);
              handleCloseActionMenu();
            }}
            sx={{ fontSize: '0.8rem', fontWeight: 600, gap: 1.2, py: 0.8, color: '#16a34a' }}
          >
            <Refresh sx={{ fontSize: 16, color: '#16a34a' }} />
            Reopen to Active Queue
          </MenuItem>
        )}

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={() => {
            if (actionMenuApt) setSlipApt(actionMenuApt);
            handleCloseActionMenu();
          }}
          sx={{ fontSize: '0.8rem', fontWeight: 600, gap: 1.2, py: 0.8 }}
        >
          <Print sx={{ fontSize: 16, color: '#64748b' }} />
          Print OPD Clinical Slip
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (actionMenuApt) setNotesApt(actionMenuApt);
            handleCloseActionMenu();
          }}
          sx={{ fontSize: '0.8rem', fontWeight: 600, gap: 1.2, py: 0.8 }}
        >
          <NoteAlt sx={{ fontSize: 16, color: '#64748b' }} />
          Clinical Chart Notes
        </MenuItem>
      </Menu>

      {/* Reschedule Dialog */}
      <Dialog
        open={!!rescheduleAptId}
        onClose={() => setRescheduleAptId(null)}
        maxWidth="xs"
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
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 2.5,
            borderBottom: '1px solid #f1f5f9',
            backgroundColor: '#ffffff',
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              backgroundColor: 'rgba(2, 132, 199, 0.1)',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EditCalendar sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: '"SF Pro Display", sans-serif',
                fontWeight: 600,
                fontSize: '18px',
                color: '#0f172a',
                lineHeight: 1.25,
              }}
            >
              Reschedule Consultation
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '13px' }}>
              Select a new appointment slot
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, p: 3 }}>
          <Box>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', mb: 0.75 }}>
              New Consultation Date
            </Typography>
            <TextField
              fullWidth
              type="date"
              size="small"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', mb: 0.75 }}>
              New Time Slot
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. 11:30 AM"
              value={newTimeSlot}
              onChange={(e) => setNewTimeSlot(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', gap: 1.5 }}>
          <Button
            onClick={() => setRescheduleAptId(null)}
            variant="outlined"
            sx={{
              color: '#475569',
              borderColor: '#cbd5e1',
              borderRadius: '8px',
              px: 2,
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
            onClick={() => rescheduleAptId && handleSaveReschedule(rescheduleAptId)}
            sx={{
              backgroundColor: THEME_COLOR,
              color: '#ffffff',
              fontWeight: 600,
              borderRadius: '8px',
              px: 2.5,
              py: 0.8,
              boxShadow: '0 4px 12px rgba(183, 3, 2, 0.25)',
              '&:hover': {
                backgroundColor: '#900201',
                boxShadow: '0 6px 16px rgba(183, 3, 2, 0.35)',
              },
            }}
          >
            Save New Schedule
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        maxWidth="xs"
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
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 2.5,
            borderBottom: '1px solid #f1f5f9',
            backgroundColor: '#ffffff',
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Cancel sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: '"SF Pro Display", sans-serif',
                fontWeight: 600,
                fontSize: '18px',
                color: '#0f172a',
                lineHeight: 1.25,
              }}
            >
              Cancel Appointment
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '13px' }}>
              Ref: {selectedForCancel?.bookingRef}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
          <Typography sx={{ color: '#475569', fontSize: '14.5px', lineHeight: 1.5 }}>
            Confirm cancellation of appointment for patient <strong>{selectedForCancel?.patientName}</strong>.
          </Typography>
          <Box>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', mb: 0.75 }}>
              Cancellation Reason (Optional)
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. Patient requested schedule change"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', gap: 1.5 }}>
          <Button
            onClick={() => setCancelDialogOpen(false)}
            variant="outlined"
            sx={{
              color: '#475569',
              borderColor: '#cbd5e1',
              borderRadius: '8px',
              px: 2,
              '&:hover': {
                borderColor: '#94a3b8',
                backgroundColor: '#f1f5f9',
              },
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmCancel}
            sx={{
              fontWeight: 600,
              borderRadius: '8px',
              px: 2.5,
              py: 0.8,
            }}
          >
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clinical Slip Modal */}
      <ClinicalSlipModal open={!!slipApt} appointment={slipApt} onClose={() => setSlipApt(null)} />

      {/* Clinical Notes Dialog */}
      <ClinicalNotesDialog
        open={!!notesApt}
        appointment={notesApt}
        onClose={() => setNotesApt(null)}
        onSaveNotes={handleSaveNotes}
      />

      {/* Walk-in Triage Modal */}
      {onAddWalkIn && (
        <QuickTriageWalkInModal
          open={walkInOpen}
          onClose={() => setWalkInOpen(false)}
          onSaveWalkIn={onAddWalkIn}
        />
      )}
    </Box>
  );
};

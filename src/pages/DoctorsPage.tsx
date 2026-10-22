import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  Rating,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Checkbox,
  FormGroup,
  Divider,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Search,
  MedicalServices,
  Verified,
  LocationOn,
  CalendarMonth,
  Schedule,
  AddCircleOutlined,
  DeleteOutlined,
  AccessTime,
  MeetingRoom,
  Close,
  EventNote,
  CheckCircle,
  Person,
  PersonAddAlt1,
  School,
  AttachMoney,
  WorkHistory,
  Check,
  AutoAwesome,
  LocalHospital,
} from '@mui/icons-material';
import { Doctor, Specialty, DoctorSittingSchedule } from '../types';
import { THEME_COLOR } from '../theme/theme';

interface DoctorsPageProps {
  doctors: Doctor[];
  specialties: Specialty[];
  selectedSpecialty: string;
  onSelectSpecialty: (specialty: string) => void;
  onBookDoctor: (doctor: Doctor) => void;
  onViewDoctorDetails: (doctor: Doctor) => void;
  onViewDoctorAppointments?: (doctor: Doctor) => void;
  onAddDoctor?: (doctor: Omit<Doctor, 'id' | 'rating' | 'reviewCount'>) => void;
  onRemoveDoctor?: (id: string) => void;
  onUpdateSittingSchedule?: (doctorId: string, schedule: DoctorSittingSchedule) => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AVATAR_PRESETS = [
  { id: 'p1', label: 'Male Clinician 1', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400' },
  { id: 'p2', label: 'Female Clinician 1', url: 'https://images.unsplash.com/photo-1594824813620-bf1258679f18?auto=format&fit=crop&q=80&w=400' },
  { id: 'p3', label: 'Male Clinician 2', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400' },
  { id: 'p4', label: 'Female Clinician 2', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400' },
];

export const DoctorsPage: React.FC<DoctorsPageProps> = ({
  doctors,
  specialties,
  selectedSpecialty,
  onSelectSpecialty,
  onBookDoctor,
  onViewDoctorDetails,
  onViewDoctorAppointments,
  onAddDoctor,
  onRemoveDoctor,
  onUpdateSittingSchedule,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'fee'>('rating');

  // Add Doctor Modal state
  const [addDoctorOpen, setAddDoctorOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState(specialties[0]?.title || 'Cardiology');
  const [newDocQualification, setNewDocQualification] = useState('');
  const [newDocExp, setNewDocExp] = useState(10);
  const [newDocFee, setNewDocFee] = useState(150);
  const [newDocChamber, setNewDocChamber] = useState('Chamber 205, Main OPD Block');
  const [newDocAbout, setNewDocAbout] = useState('');
  const [newDocDays, setNewDocDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [newDocShiftMorning, setNewDocShiftMorning] = useState('09:00 AM - 01:00 PM');
  const [newDocShiftEvening, setNewDocShiftEvening] = useState('03:00 PM - 06:30 PM');
  const [newDocAvatar, setNewDocAvatar] = useState(AVATAR_PRESETS[0].url);
  const [addError, setAddError] = useState('');

  const toggleNewDocDay = (day: string) => {
    if (newDocDays.includes(day)) {
      if (newDocDays.length > 1) {
        setNewDocDays(newDocDays.filter((d) => d !== day));
      }
    } else {
      setNewDocDays([...newDocDays, day]);
    }
  };

  const applyDayPreset = (preset: 'weekdays' | 'mon-sat' | 'all') => {
    if (preset === 'weekdays') {
      setNewDocDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    } else if (preset === 'mon-sat') {
      setNewDocDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
    } else {
      setNewDocDays(DAYS_OF_WEEK);
    }
  };

  // Manage Doctor Sitting Schedule Modal state
  const [scheduleDoctor, setScheduleDoctor] = useState<Doctor | null>(null);
  const [scheduleDays, setScheduleDays] = useState<string[]>([]);
  const [shiftMorning, setShiftMorning] = useState('09:00 AM - 01:00 PM');
  const [shiftEvening, setShiftEvening] = useState('03:00 PM - 06:30 PM');
  const [roomChamber, setRoomChamber] = useState('');
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(20);
  const [isActive, setIsActive] = useState(true);

  // Delete doctor confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtering
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.about.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.hospitalLocation && doc.hospitalLocation.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSpecialty =
      selectedSpecialty === 'All' || doc.specialty.toLowerCase() === selectedSpecialty.toLowerCase();

    return matchesSearch && matchesSpecialty;
  });

  // Sorting
  filteredDoctors.sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
    if (sortBy === 'fee') return a.consultationFee - b.consultationFee;
    return 0;
  });

  const handleOpenAddDoctor = () => {
    setNewDocName('');
    setNewDocSpecialty(specialties[0]?.title || 'Cardiology');
    setNewDocQualification('MD, Board Certified Clinician');
    setNewDocExp(10);
    setNewDocFee(150);
    setNewDocChamber('Chamber 205, Main OPD Block');
    setNewDocAbout('');
    setNewDocDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    setNewDocShiftMorning('09:00 AM - 01:00 PM');
    setNewDocShiftEvening('03:00 PM - 06:30 PM');
    setNewDocAvatar(AVATAR_PRESETS[0].url);
    setAddError('');
    setAddDoctorOpen(true);
  };

  const handleSaveNewDoctor = () => {
    if (!newDocName.trim()) {
      setAddError('Please enter the doctor’s full name (e.g., Dr. Robert Chen, MD)');
      return;
    }
    if (!newDocSpecialty.trim()) {
      setAddError('Please select a clinical specialty department');
      return;
    }

    if (onAddDoctor) {
      onAddDoctor({
        name: newDocName.trim(),
        specialty: newDocSpecialty.trim(),
        department: `${newDocSpecialty.trim()} Department`,
        qualification: newDocQualification.trim() || 'MD, Board Certified Clinician',
        experienceYears: Number(newDocExp) || 5,
        consultationFee: Number(newDocFee) || 120,
        about:
          newDocAbout.trim() ||
          `Senior specialist in ${newDocSpecialty.trim()} providing comprehensive OPD consultations, clinical evaluations, and treatment plans.`,
        availableDays: newDocDays.length > 0 ? newDocDays : ['Monday', 'Wednesday', 'Friday'],
        availableSlots: ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'],
        languages: ['English'],
        hospitalLocation: newDocChamber.trim() || 'Main OPD Block',
        avatar: newDocAvatar,
        sittingSchedule: {
          days: newDocDays.length > 0 ? newDocDays : ['Monday', 'Wednesday', 'Friday'],
          shiftMorning: newDocShiftMorning,
          shiftEvening: newDocShiftEvening,
          roomChamber: newDocChamber.trim() || 'Main OPD Block',
          slotDurationMinutes: 20,
          maxPatientsPerSlot: 1,
          isActive: true,
        },
      });
    }

    setAddDoctorOpen(false);
  };

  const handleOpenScheduleModal = (doc: Doctor) => {
    setScheduleDoctor(doc);
    const existing = doc.sittingSchedule || {
      days: doc.availableDays || ['Monday', 'Wednesday', 'Friday'],
      shiftMorning: '09:00 AM - 01:00 PM',
      shiftEvening: '03:00 PM - 06:00 PM',
      roomChamber: doc.hospitalLocation || 'Chamber 201, OPD Block',
      slotDurationMinutes: 20,
      maxPatientsPerSlot: 1,
      isActive: true,
    };
    setScheduleDays(existing.days);
    setShiftMorning(existing.shiftMorning || '09:00 AM - 01:00 PM');
    setShiftEvening(existing.shiftEvening || '03:00 PM - 06:00 PM');
    setRoomChamber(existing.roomChamber || doc.hospitalLocation);
    setSlotDurationMinutes(existing.slotDurationMinutes || 20);
    setIsActive(existing.isActive !== undefined ? existing.isActive : true);
  };

  const handleSaveSchedule = () => {
    if (scheduleDoctor && onUpdateSittingSchedule) {
      onUpdateSittingSchedule(scheduleDoctor.id, {
        days: scheduleDays,
        shiftMorning,
        shiftEvening,
        roomChamber: roomChamber || scheduleDoctor.hospitalLocation,
        slotDurationMinutes,
        maxPatientsPerSlot: 1,
        isActive,
      });
    }
    setScheduleDoctor(null);
  };

  const toggleScheduleDay = (day: string) => {
    setScheduleDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <Box id="hospital-doctors-page" sx={{ py: { xs: 3, md: 4 }, backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        {/* Header Strip with Add Doctor Action */}
        <Box sx={{ mb: 3.5, display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Chip
                label="HOSPITAL MEDICAL FACULTY"
                size="small"
                sx={{
                  backgroundColor: 'rgba(183, 3, 2, 0.08)',
                  color: THEME_COLOR,
                  fontWeight: 800,
                  fontSize: '0.68rem',
                  borderRadius: '9999px',
                }}
              />
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                Doctor Directory & OPD Sitting Roster
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', fontSize: { xs: '1.5rem', sm: '1.85rem' }, letterSpacing: '-0.02em' }}>
              Hospital Doctors & Sitting Schedules
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.86rem', maxWidth: 740 }}>
              Manage clinic doctors, configure sitting timings, assign OPD chamber rooms, and review doctor-wise appointment queues across hospital departments.
            </Typography>
          </Box>

          {onAddDoctor && (
            <Button
              id="add-doctor-btn"
              variant="contained"
              startIcon={<AddCircleOutlined />}
              onClick={handleOpenAddDoctor}
              sx={{
                backgroundColor: THEME_COLOR,
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: '9999px',
                fontSize: '0.82rem',
                px: 2.5,
                py: 0.9,
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#900201' },
              }}
            >
              Add Hospital Doctor
            </Button>
          )}
        </Box>

        {/* Consistent Tailwind doctor directory filters */}
        <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative min-w-0 flex-1 md:flex-[1.5]">
              <Search sx={{ fontSize: 19 }} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                aria-label="Search doctors"
                placeholder="Search doctor by name, specialty, or OPD chamber..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 w-full rounded-full border border-slate-200 bg-white py-2 pl-11 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
            <div className="relative min-w-0 flex-1">
              <select
                aria-label="Filter doctors by specialty"
                value={selectedSpecialty}
                onChange={(e) => onSelectSpecialty(e.target.value)}
                className="h-11 w-full appearance-none rounded-full border border-slate-200 bg-white py-2 pl-5 pr-12 text-sm text-slate-800 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              >
                <option value="All">All Specialties ({doctors.length} Doctors)</option>
                {specialties.map((spec) => <option key={spec.id} value={spec.title}>{spec.title}</option>)}
              </select>
            </div>
            <div className="relative min-w-0 flex-1">
              <select
                aria-label="Sort doctors"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="h-11 w-full appearance-none rounded-full border border-slate-200 bg-white py-2 pl-5 pr-12 text-sm text-slate-800 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              >
                <option value="rating">Highest Rated (★ 4.9+)</option>
                <option value="experience">Experience (Years)</option>
                <option value="fee">Consultation Fee</option>
              </select>
            </div>
          </div>

          {/* Quick Specialty Filter Chips */}
          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #f1f5f9', display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
            <Chip
              label="All Specialties"
              size="small"
              onClick={() => onSelectSpecialty('All')}
              sx={{
                fontWeight: 700,
                fontSize: '0.72rem',
                backgroundColor: selectedSpecialty === 'All' ? THEME_COLOR : '#f1f5f9',
                color: selectedSpecialty === 'All' ? '#ffffff' : '#475569',
              }}
            />
            {specialties.slice(0, 7).map((spec) => {
              const isSelected = selectedSpecialty.toLowerCase() === spec.title.toLowerCase();
              return (
                <Chip
                  key={spec.id}
                  label={spec.title}
                  size="small"
                  onClick={() => onSelectSpecialty(spec.title)}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    backgroundColor: isSelected ? THEME_COLOR : '#ffffff',
                    color: isSelected ? '#ffffff' : '#475569',
                    border: '1px solid #e2e8f0',
                  }}
                />
              );
            })}
          </Box>
        </div>

        {/* Results Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569', fontSize: '0.82rem' }}>
            Hospital Medical Staff: <strong>{filteredDoctors.length}</strong> active practitioners
          </Typography>
          {(searchTerm || selectedSpecialty !== 'All') && (
            <Button
              size="small"
              onClick={() => {
                setSearchTerm('');
                onSelectSpecialty('All');
              }}
              sx={{ color: THEME_COLOR, fontWeight: 700, fontSize: '0.78rem', textTransform: 'none' }}
            >
              Clear Filters
            </Button>
          )}
        </Box>

        {/* Doctor Cards Grid */}
        {filteredDoctors.length === 0 ? (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              border: '1px dashed #cbd5e1',
              backgroundColor: '#ffffff',
            }}
          >
            <MedicalServices sx={{ fontSize: 44, color: '#94a3b8', mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5, fontSize: '1.05rem' }}>
              No Doctors Found Matching Query
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5, fontSize: '0.82rem' }}>
              Try clearing search terms or select another clinical specialty.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSearchTerm('');
                onSelectSpecialty('All');
              }}
              sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '9999px' }}
            >
              Show All Doctors
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredDoctors.map((doc) => {
              const schedule = doc.sittingSchedule;
              return (
                <Grid size={{ xs: 12, md: 6 }} key={doc.id}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                        borderColor: '#cbd5e1',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Top Row: Avatar, Name, Specialty, Actions */}
                      <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                        <Avatar
                          src={doc.avatar}
                          alt={doc.name}
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 2.5,
                            border: '1px solid #e2e8f0',
                          }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.98rem' }}>
                                {doc.name}
                              </Typography>
                              <Verified sx={{ color: '#0284c7', fontSize: 16 }} />
                            </Box>
                            {onRemoveDoctor && (
                              <Tooltip title="Remove Doctor from Directory">
                                <IconButton
                                  size="small"
                                  onClick={() => setDeleteConfirmId(doc.id)}
                                  sx={{ color: '#94a3b8', '&:hover': { color: '#dc2626' } }}
                                >
                                  <DeleteOutlined fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3, mb: 0.5 }}>
                            <Chip
                              label={doc.specialty}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(183, 3, 2, 0.08)',
                                color: THEME_COLOR,
                                fontWeight: 700,
                                height: 20,
                                fontSize: '0.7rem',
                              }}
                            />
                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.78rem' }}>
                              {doc.qualification}
                            </Typography>
                          </Box>

                          <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                            {doc.experienceYears}+ yrs clinical practice • Fee: <strong style={{ color: '#16a34a' }}>${doc.consultationFee}</strong>
                          </Typography>
                        </Box>
                      </Box>

                      {/* OPD Chamber & Sitting Timing Box */}
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          mb: 1.5,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.6 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: '#0f172a' }}>
                            <MeetingRoom sx={{ fontSize: 16, color: THEME_COLOR }} />
                            <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.78rem' }}>
                              {schedule?.roomChamber || doc.hospitalLocation}
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            onClick={() => handleOpenScheduleModal(doc)}
                            sx={{
                              fontSize: '0.7rem',
                              textTransform: 'none',
                              fontWeight: 700,
                              p: 0,
                              minWidth: 'auto',
                              color: '#0284c7',
                            }}
                          >
                            Edit Sitting Hours
                          </Button>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: '#475569', mb: 0.6 }}>
                          <AccessTime sx={{ fontSize: 14, color: '#64748b' }} />
                          <Typography variant="caption" sx={{ fontSize: '0.74rem' }}>
                            <strong>Shift:</strong> {schedule?.shiftMorning || '09:00 AM - 01:00 PM'}
                            {schedule?.shiftEvening ? ` & ${schedule.shiftEvening}` : ''} ({schedule?.slotDurationMinutes || 20}m slots)
                          </Typography>
                        </Box>

                        {/* Sitting Days */}
                        <Box sx={{ display: 'flex', gap: 0.4, flexWrap: 'wrap' }}>
                          {DAYS_OF_WEEK.map((day) => {
                            const active = (schedule?.days || doc.availableDays || []).includes(day);
                            return (
                              <Chip
                                key={day}
                                label={day.substring(0, 3)}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: '0.62rem',
                                  fontWeight: 700,
                                  backgroundColor: active ? '#e0f2fe' : '#f1f5f9',
                                  color: active ? '#0369a1' : '#94a3b8',
                                  border: active ? '1px solid #bae6fd' : 'none',
                                }}
                              />
                            );
                          })}
                        </Box>
                      </Paper>

                      {/* Bio Summary */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#475569',
                          fontSize: '0.8rem',
                          lineHeight: 1.45,
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {doc.about}
                      </Typography>

                      {/* Action Bar */}
                      <Box sx={{ mt: 'auto', display: 'flex', gap: 1, pt: 1.5, borderTop: '1px solid #f1f5f9' }}>
                        {onViewDoctorAppointments && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EventNote sx={{ fontSize: 15 }} />}
                            onClick={() => onViewDoctorAppointments(doc)}
                            sx={{
                              flex: 1,
                              fontWeight: 700,
                              fontSize: '0.76rem',
                              textTransform: 'none',
                              borderRadius: '9999px',
                              borderColor: '#cbd5e1',
                              color: '#1e293b',
                            }}
                          >
                            Doctor Roster
                          </Button>
                        )}

                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => onViewDoctorDetails(doc)}
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.76rem',
                            textTransform: 'none',
                            borderRadius: '9999px',
                            borderColor: '#cbd5e1',
                            color: '#475569',
                          }}
                        >
                          Bio
                        </Button>

                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CalendarMonth sx={{ fontSize: 15 }} />}
                          onClick={() => onBookDoctor(doc)}
                          sx={{
                            backgroundColor: THEME_COLOR,
                            fontWeight: 700,
                            fontSize: '0.76rem',
                            textTransform: 'none',
                            borderRadius: '9999px',
                            boxShadow: 'none',
                            px: 2,
                            '&:hover': { backgroundColor: '#900201' },
                          }}
                        >
                          Book OPD
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* Add Hospital Doctor Dialog */}
      <Dialog
        open={addDoctorOpen}
        onClose={() => setAddDoctorOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            className: 'faculty-onboarding-dialog',
            sx: {
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.15)',
            },
          },
        }}
      >
        {/* Modal Header */}
        <DialogTitle
          sx={{
            p: 2.5,
            borderBottom: '1px solid #f1f5f9',
            backgroundColor: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: 'rgba(183, 3, 2, 0.08)',
                color: THEME_COLOR,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <PersonAddAlt1 sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', lineHeight: 1.2 }}>
                Add Doctor to Hospital Faculty
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block', mt: 0.2 }}>
                Register a specialist consultant to the hospital OPD directory, chamber schedule, and patient booking roster
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label="FACULTY ONBOARDING"
              size="small"
              sx={{
                height: 22,
                fontWeight: 800,
                fontSize: '0.64rem',
                letterSpacing: '0.03em',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                borderRadius: 1,
              }}
            />
            <IconButton onClick={() => setAddDoctorOpen(false)} size="small" sx={{ color: '#64748b' }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        {/* Modal Body */}
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, backgroundColor: '#f8fafc' }}>
          {addError && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.82rem', fontWeight: 600 }}>
              {addError}
            </Alert>
          )}

          <Grid container spacing={2.5}>
            {/* Left Column: Structured Form Fields */}
            <Grid size={{ xs: 12, md: 7.5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Section 1: Physician Identity & Specialty */}
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.5 }}>
                    <MedicalServices sx={{ fontSize: 16, color: THEME_COLOR }} />
                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: '#334155', letterSpacing: '0.03em', fontSize: '0.72rem' }}>
                      1. Physician Identity & Department
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                    <Typography component="label" sx={{ display: 'block', mb: 0.75, fontSize: 13, fontWeight: 500, color: '#475569' }}>Doctor Full Name</Typography>
                    <Typography component="label" sx={{ display: 'block', mb: 0.75, fontSize: 13, fontWeight: 500, color: '#475569' }}>Qualifications</Typography>
                    <Typography component="label" sx={{ display: 'block', mb: 0.75, fontSize: 13, fontWeight: 500, color: '#475569' }}>OPD Chamber Room</Typography>
                    <Typography component="label" sx={{ display: 'block', mb: 0.75, fontSize: 13, fontWeight: 500, color: '#475569' }}>Consultation Fee ($)</Typography>
                    <Typography component="label" sx={{ display: 'block', mb: 0.75, fontSize: 13, fontWeight: 500, color: '#475569' }}>Experience (Years)</Typography>
                    <Typography component="label" sx={{ display: 'block', mb: 0.75, fontSize: 13, fontWeight: 500, color: '#475569' }}>Morning Shift</Typography>
                    <Typography component="label" sx={{ display: 'block', mb: 0.75, fontSize: 13, fontWeight: 500, color: '#475569' }}>Evening Shift</Typography>
                    <Typography component="label" sx={{ display: 'block', mb: 0.75, fontSize: 13, fontWeight: 500, color: '#475569' }}>Clinical Profile Summary</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      inputProps={{ "aria-label": "Doctor Full Name" }}
                      placeholder="e.g. Dr. Robert Chen, MD"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      helperText="Include academic title (Dr.) and postgraduate medical degree"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person sx={{ fontSize: 18, color: '#94a3b8' }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />

                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth size="small">
                          <Typography component="label" sx={{ display: "block", mb: 0.75, fontSize: 13, fontWeight: 500, color: "#475569" }}>Specialty Department</Typography>
                          <Select
                            inputProps={{ "aria-label": "Specialty Department" }}
                            value={newDocSpecialty}
                            onChange={(e) => setNewDocSpecialty(e.target.value)}
                            startAdornment={
                              <InputAdornment position="start">
                                <MedicalServices sx={{ fontSize: 17, color: THEME_COLOR }} />
                              </InputAdornment>
                            }
                          >
                            {specialties.map((spec) => (
                              <MenuItem key={spec.id} value={spec.title}>
                                {spec.title}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          size="small"
                          inputProps={{ "aria-label": "Qualifications" }}
                          placeholder="e.g. MD, DM, FACC"
                          value={newDocQualification}
                          onChange={(e) => setNewDocQualification(e.target.value)}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <School sx={{ fontSize: 18, color: '#94a3b8' }} />
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>

                {/* Section 2: OPD Facility & Consultation Fee */}
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.5 }}>
                    <MeetingRoom sx={{ fontSize: 16, color: '#0284c7' }} />
                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: '#334155', letterSpacing: '0.03em', fontSize: '0.72rem' }}>
                      2. OPD Facility & Consultation Fee
                    </Typography>
                  </Box>

                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <TextField
                        fullWidth
                        size="small"
                        inputProps={{ "aria-label": "OPD Chamber Room" }}
                        placeholder="e.g. Chamber 205, Main Block"
                        value={newDocChamber}
                        onChange={(e) => setNewDocChamber(e.target.value)}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <MeetingRoom sx={{ fontSize: 17, color: '#0284c7' }} />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 3.5 }}>
                      <TextField
                        fullWidth
                        type="number"
                        size="small"
                        inputProps={{ "aria-label": "Consultation Fee ($)" }}
                        value={newDocFee}
                        onChange={(e) => setNewDocFee(Number(e.target.value))}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <AttachMoney sx={{ fontSize: 17, color: '#16a34a' }} />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 3.5 }}>
                      <TextField
                        fullWidth
                        type="number"
                        size="small"
                        inputProps={{ "aria-label": "Experience (Years)" }}
                        value={newDocExp}
                        onChange={(e) => setNewDocExp(Number(e.target.value))}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <WorkHistory sx={{ fontSize: 16, color: '#94a3b8' }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                                  yrs
                                </Typography>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Section 3: OPD Sitting Schedule & Shifts */}
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <Schedule sx={{ fontSize: 16, color: '#d97706' }} />
                      <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: '#334155', letterSpacing: '0.03em', fontSize: '0.72rem' }}>
                        3. OPD Sitting Days & Shift Schedule
                      </Typography>
                    </Box>

                    {/* Quick Preset Buttons */}
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Button
                        size="small"
                        onClick={() => applyDayPreset('weekdays')}
                        sx={{ fontSize: '0.64rem', textTransform: 'none', py: 0.2, px: 0.8, color: '#475569', backgroundColor: '#f1f5f9', borderRadius: 9999 }}
                      >
                        Mon-Fri
                      </Button>
                      <Button
                        size="small"
                        onClick={() => applyDayPreset('mon-sat')}
                        sx={{ fontSize: '0.64rem', textTransform: 'none', py: 0.2, px: 0.8, color: '#475569', backgroundColor: '#f1f5f9', borderRadius: 9999 }}
                      >
                        Mon-Sat
                      </Button>
                      <Button
                        size="small"
                        onClick={() => applyDayPreset('all')}
                        sx={{ fontSize: '0.64rem', textTransform: 'none', py: 0.2, px: 0.8, color: '#475569', backgroundColor: '#f1f5f9', borderRadius: 9999 }}
                      >
                        All 7 Days
                      </Button>
                    </Box>
                  </Box>

                  {/* Day selection pills */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 1.8 }}>
                    {DAYS_OF_WEEK.map((day) => {
                      const selected = newDocDays.includes(day);
                      return (
                        <Chip
                          key={day}
                          label={day.substring(0, 3)}
                          onClick={() => toggleNewDocDay(day)}
                          size="small"
                          sx={{
                            borderRadius: '9999px',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                            backgroundColor: selected ? THEME_COLOR : '#f1f5f9',
                            color: selected ? '#ffffff' : '#64748b',
                            border: selected ? 'none' : '1px solid #e2e8f0',
                            '&:hover': {
                              backgroundColor: selected ? '#900201' : '#e2e8f0',
                            },
                          }}
                        />
                      );
                    })}
                  </Box>

                  {/* Shift Timings */}
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        inputProps={{ "aria-label": "Morning Shift" }}
                        value={newDocShiftMorning}
                        onChange={(e) => setNewDocShiftMorning(e.target.value)}
                        placeholder="09:00 AM - 01:00 PM"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <AccessTime sx={{ fontSize: 16, color: '#94a3b8' }} />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        inputProps={{ "aria-label": "Evening Shift" }}
                        value={newDocShiftEvening}
                        onChange={(e) => setNewDocShiftEvening(e.target.value)}
                        placeholder="03:00 PM - 06:30 PM"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <AccessTime sx={{ fontSize: 16, color: '#94a3b8' }} />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Section 4: Clinical Profile Summary */}
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.2 }}>
                    <Verified sx={{ fontSize: 16, color: '#16a34a' }} />
                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: '#334155', letterSpacing: '0.03em', fontSize: '0.72rem' }}>
                      4. Clinical Profile Summary & Special Interests
                    </Typography>
                  </Box>

                  <TextField
                    fullWidth
                    multiline
                    rows={2.5}
                    size="small"
                    inputProps={{ "aria-label": "Clinical Profile Summary" }}
                    placeholder="Clinical interests, sub-specialty focus, diagnostic procedures, fellowship achievements..."
                    value={newDocAbout}
                    onChange={(e) => setNewDocAbout(e.target.value)}
                    helperText="Summarizes clinical focus for OPD appointments and department referrals"
                  />
                </Paper>
              </Box>
            </Grid>

            {/* Right Column: Live Doctor Faculty Card Preview */}
            <Grid size={{ xs: 12, md: 4.5 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.2,
                  borderRadius: 2.5,
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  position: 'sticky',
                  top: 16,
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.8 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <AutoAwesome sx={{ fontSize: 16, color: THEME_COLOR }} />
                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', fontSize: '0.72rem', letterSpacing: '0.03em' }}>
                      Live Faculty Preview
                    </Typography>
                  </Box>
                  <Chip
                    label="DIRECTORY CARD"
                    size="small"
                    sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800, backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}
                  />
                </Box>

                {/* Clinician Portrait Selector */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 0.8, fontSize: '0.68rem' }}>
                    Select Faculty Portrait Photo:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {AVATAR_PRESETS.map((preset) => {
                      const isSelected = newDocAvatar === preset.url;
                      return (
                        <Avatar
                          key={preset.id}
                          src={preset.url}
                          onClick={() => setNewDocAvatar(preset.url)}
                          sx={{
                            width: 38,
                            height: 38,
                            cursor: 'pointer',
                            border: isSelected ? `2px solid ${THEME_COLOR}` : '2px solid transparent',
                            transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                            transition: 'all 0.15s ease',
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>

                {/* Simulated Doctor Card */}
                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#f8fafc', border: '1px solid #edf2f7' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Avatar
                      src={newDocAvatar}
                      sx={{
                        width: 48,
                        height: 48,
                        border: '2px solid #ffffff',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                      }}
                    />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="subtitle2" noWrap sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>
                        {newDocName || 'Dr. Robert Chen, MD'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mt: 0.3 }}>
                        <Chip
                          label={newDocSpecialty || 'Cardiology'}
                          size="small"
                          sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700, backgroundColor: 'rgba(183, 3, 2, 0.08)', color: THEME_COLOR }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="caption" noWrap sx={{ color: '#475569', fontWeight: 600, display: 'block', mb: 1.2, fontSize: '0.72rem' }}>
                    {newDocQualification || 'MD, Board Certified Clinician'}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <MeetingRoom sx={{ fontSize: 14, color: '#0284c7' }} />
                      <Typography variant="caption" noWrap sx={{ color: '#334155', fontWeight: 600, fontSize: '0.72rem' }}>
                        {newDocChamber || 'Chamber 205, Main Block'}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#16a34a', fontSize: '0.76rem' }}>
                      ${newDocFee} / visit
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.2 }}>
                    <WorkHistory sx={{ fontSize: 14, color: '#64748b' }} />
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
                      {newDocExp} years clinical experience
                    </Typography>
                  </Box>

                  {/* Sitting Days Preview */}
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 0.5, fontSize: '0.66rem' }}>
                      OPD Sitting Days:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4 }}>
                      {DAYS_OF_WEEK.map((day) => {
                        const active = newDocDays.includes(day);
                        return (
                          <Chip
                            key={day}
                            label={day.substring(0, 3)}
                            size="small"
                            sx={{
                              height: 17,
                              fontSize: '0.6rem',
                              fontWeight: 700,
                              backgroundColor: active ? '#e0f2fe' : '#f1f5f9',
                              color: active ? '#0369a1' : '#94a3b8',
                              border: active ? '1px solid #bae6fd' : 'none',
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                </Box>

                {/* Instant Sync Notice */}
                <Box sx={{ mt: 2, p: 1.2, borderRadius: 1.5, backgroundColor: '#f8fafc', border: '1px solid #edf2f7' }}>
                  <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 0.6, lineHeight: 1.35 }}>
                    <Verified sx={{ fontSize: 15, color: '#16a34a', flexShrink: 0 }} />
                    Instantly syncs with OPD appointment triage, specialty lists, and booking forms.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        {/* Modal Actions */}
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: '1px solid #f1f5f9',
            backgroundColor: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <LocalHospital sx={{ fontSize: 16, color: THEME_COLOR }} />
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              Hospital OPD Administration Console
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={() => setAddDoctorOpen(false)}
              variant="outlined"
              sx={{
                color: '#475569',
                borderColor: '#cbd5e1',
                borderRadius: '9999px',
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
              variant="contained"
              onClick={handleSaveNewDoctor}
              startIcon={<Check sx={{ fontSize: 16 }} />}
              sx={{
                backgroundColor: THEME_COLOR,
                color: '#ffffff',
                fontWeight: 600,
                borderRadius: '9999px',
                px: 3,
                py: 0.9,
                boxShadow: '0 4px 12px rgba(183, 3, 2, 0.25)',
                '&:hover': {
                  backgroundColor: '#900201',
                  boxShadow: '0 6px 16px rgba(183, 3, 2, 0.35)',
                },
              }}
            >
              Register Doctor to Faculty
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Manage Doctor Sitting Timing Modal */}
      <Dialog
        open={!!scheduleDoctor}
        onClose={() => setScheduleDoctor(null)}
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
              <CalendarMonth sx={{ fontSize: 24 }} />
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
                Configure Sitting Schedule
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '13px' }}>
                {scheduleDoctor?.name} • {scheduleDoctor?.specialty}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={() => setScheduleDoctor(null)}
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
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, p: 3 }}>
          {/* Days selector */}
          <Box>
            <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '14px', mb: 1 }}>
              1. Sitting Days in Hospital OPD
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {DAYS_OF_WEEK.map((day) => {
                const checked = scheduleDays.includes(day);
                return (
                  <Chip
                    key={day}
                    label={day}
                    onClick={() => toggleScheduleDay(day)}
                    color={checked ? 'primary' : 'default'}
                    variant={checked ? 'filled' : 'outlined'}
                    sx={{ fontWeight: 600, fontSize: '0.8rem', borderRadius: '8px' }}
                  />
                );
              })}
            </Box>
          </Box>

          <Divider />

          {/* Shift Hours & Chamber */}
          <Box>
            <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '14px', mb: 1.5 }}>
              2. Shift Timings & Chamber Assignment
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Morning OPD Shift"
                  placeholder="e.g. 09:00 AM - 01:00 PM"
                  value={shiftMorning}
                  onChange={(e) => setShiftMorning(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Evening OPD Shift"
                  placeholder="e.g. 03:00 PM - 07:00 PM"
                  value={shiftEvening}
                  onChange={(e) => setShiftEvening(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Assigned Chamber / Room"
                  placeholder="e.g. Chamber 402, Heart Institute"
                  value={roomChamber}
                  onChange={(e) => setRoomChamber(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="slot-duration-label">Slot Duration</InputLabel>
                  <Select
                    labelId="slot-duration-label"
                    value={slotDurationMinutes}
                    label="Slot Duration"
                    onChange={(e) => setSlotDurationMinutes(Number(e.target.value))}
                  >
                    <MenuItem value={15}>15 Minutes / Consultation</MenuItem>
                    <MenuItem value={20}>20 Minutes / Consultation</MenuItem>
                    <MenuItem value={30}>30 Minutes / Consultation</MenuItem>
                    <MenuItem value={45}>45 Minutes / Consultation</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <FormControlLabel
            control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} color="success" />}
            label={<Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>Doctor Active on Sitting Duty</Typography>}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', gap: 1.5 }}>
          <Button
            onClick={() => setScheduleDoctor(null)}
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
            variant="contained"
            onClick={handleSaveSchedule}
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
            Save Sitting Schedule
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
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
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DeleteOutlined sx={{ fontSize: 20 }} />
          </Box>
          <Typography
            sx={{
              fontFamily: '"SF Pro Display", sans-serif',
              fontWeight: 600,
              fontSize: '18px',
              color: '#0f172a',
            }}
          >
            Remove Doctor from Faculty
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 2.5 }}>
          <Typography sx={{ color: '#475569', fontSize: '14.5px', lineHeight: 1.5 }}>
            Are you sure you want to remove this physician from the clinical faculty list?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', gap: 1.2 }}>
          <Button
            onClick={() => setDeleteConfirmId(null)}
            variant="outlined"
            sx={{
              color: '#64748b',
              borderColor: '#cbd5e1',
              borderRadius: '8px',
              px: 2,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (deleteConfirmId && onRemoveDoctor) {
                onRemoveDoctor(deleteConfirmId);
              }
              setDeleteConfirmId(null);
            }}
            sx={{
              fontWeight: 600,
              borderRadius: '8px',
              px: 2.5,
              py: 0.8,
            }}
          >
            Confirm Removal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme/theme';
import { authSession } from './features/auth';

// Custom Hooks
import { useHospitalManagement } from './hooks/useHospitalManagement';
import { useAppointments } from './hooks/useAppointments';
import { useVitals } from './hooks/useVitals';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { NotificationSnackbar } from './components/common/NotificationSnackbar';

// Dedicated Page Views
import { HomePage } from './pages/HomePage';
import { BlogPage } from './pages/BlogPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { VitalsPage } from './pages/VitalsPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { SpecialtiesPage } from './pages/SpecialtiesPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { LoginPage } from './pages/LoginPage';
import { AppointmentFormBuilderPage } from './pages/AppointmentFormBuilderPage';

// Dashboard Panel Layout
import { DashboardLayout } from './components/dashboard/DashboardLayout';

// Modals & Dialogs
import { BookAppointmentModal } from './components/appointments/BookAppointmentModal';
import { AddVitalsDialog } from './components/vitals/AddVitalsDialog';
import { DoctorDetailsModal } from './components/doctors/DoctorDetailsModal';
import { Doctor, Appointment } from './types';

export default function App() {
  // Page State
  const [currentPage, setCurrentPage] = useState<
    'home' | 'doctors' | 'vitals' | 'appointments' | 'specialties' | 'emergency' | 'login' | 'form-builder' | 'blog' | 'newsroom'
  >('home');

  // Active User session (hospital administrator logged in by default)
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string } | null>(() => {
    return authSession.getUser() as { name: string; role: string } | null;
  });

  // Hospital Dynamic Information Management Hook
  const {
    specialties,
    doctors,
    formConfig,
    addSpecialty,
    removeSpecialty,
    addDoctor,
    removeDoctor,
    updateDoctorSittingTiming,
    setFormMode,
    addFormField,
    removeFormField,
    updateFormField,
    resetFormToDefaults,
    getFieldsForDoctor,
  } = useHospitalManagement();

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [doctorFilterForAppointments, setDoctorFilterForAppointments] = useState<string>('All');

  const {
    appointments,
    upcomingAppointments,
    bookAppointment,
    cancelAppointment,
    updateAppointmentStatus,
    rescheduleAppointment,
  } = useAppointments();

  const {
    vitals,
    latestVital,
    addVital,
    deleteVital,
  } = useVitals();

  // Modals state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingSpecialty, setBookingSpecialty] = useState<string>('All');
  const [addVitalsOpen, setAddVitalsOpen] = useState(false);
  const [doctorDetailsOpen, setDoctorDetailsOpen] = useState(false);
  const [activeDoctorForDetails, setActiveDoctorForDetails] = useState<Doctor | null>(null);

  // Sync hash routing if present safely
  useEffect(() => {
    const handleHashChange = () => {
      try {
        const hash = window.location.hash ? window.location.hash.replace(/^#/, '').toLowerCase() : '';
        const validPages = ['home', 'doctors', 'vitals', 'appointments', 'specialties', 'emergency', 'login', 'form-builder', 'blog', 'newsroom'];
        
        // Protect admin routes
        const protectedPages = ['vitals', 'appointments', 'form-builder'];
        
        if (protectedPages.includes(hash) && !currentUser) {
           setCurrentPage('login');
           return;
        }

        if (hash === 'login' && currentUser) {
          setCurrentPage('appointments');
          window.history.replaceState(null, '', window.location.pathname + window.location.search + '#appointments');
          return;
        }

        if (validPages.includes(hash)) {
          setCurrentPage(hash as any);
        } else if (hash === 'home' || hash === '') {
          setCurrentPage('home');
        }
      } catch (e) {
        console.warn('Hash routing error:', e);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser]);

  const handleNavigate = (page: string) => {
    const validPages = ['home', 'doctors', 'vitals', 'appointments', 'specialties', 'emergency', 'login', 'form-builder', 'blog', 'newsroom'];
    const protectedPages = ['vitals', 'appointments', 'form-builder'];

    if (protectedPages.includes(page) && !currentUser) {
      setCurrentPage('login');
      window.location.hash = 'login';
      return;
    }
    
    const target = page === 'login' && currentUser ? 'appointments' : validPages.includes(page) ? (page as any) : 'home';
    setCurrentPage(target);
    try {
      if (target !== 'home') {
        window.location.hash = target;
      } else if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch (e) {
      // Ignore URL manipulation restrictions in sandboxed iframes
    }
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      // Ignore smooth scroll restrictions
    }
  };

  // Notifications
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'warning' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = (message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  // Handlers
  const handleOpenBooking = (doctor?: Doctor, specialty?: string) => {
    setBookingDoctor(doctor || null);
    setBookingSpecialty(specialty || 'All');
    setBookingOpen(true);
  };

  const handleSelectSpecialtyFromHome = (specialtyTitle: string) => {
    setSelectedSpecialty(specialtyTitle);
    handleNavigate('doctors');
  };

  const handleBookingSuccess = (newApt: Appointment) => {
    bookAppointment(newApt);
    showToast(`Appointment registered for ${newApt.patientName} with ${newApt.doctorName} (Ref: ${newApt.bookingRef})!`);
  };

  const handleViewDoctorDetails = (doc: Doctor) => {
    setActiveDoctorForDetails(doc);
    setDoctorDetailsOpen(true);
  };

  const handleViewDoctorAppointments = (doc: Doctor) => {
    setDoctorFilterForAppointments(doc.id);
    handleNavigate('appointments');
    showToast(`Displaying appointments for ${doc.name}`, 'info');
  };

  const handleAddVitalSuccess = (vitalData: any) => {
    const created = addVital(vitalData);
    showToast(`Vitals logged: BP ${created.bloodPressureSystolic}/${created.bloodPressureDiastolic}, Pulse ${created.heartRate} bpm`);
  };

  const handleLoginSuccess = (user: any) => {
    if (!user) {
      showToast('Login failed: No user data received.', 'error');
      return;
    }
    setCurrentUser(user);
    try {
      authSession.saveAppUser(user);
    } catch (e) {}
    showToast(`Welcome back, ${user.name || 'Admin'}!`, 'success');
    // Navigate directly: handleNavigate would still see the pre-login currentUser in this render.
    setCurrentPage('appointments');
    window.location.hash = 'appointments';
  };

  const handleLogout = () => {
    authSession.clear();
    setCurrentUser(null);
    showToast('Logged out of hospital administrator panel.', 'info');
    // Avoid the stale authenticated state in handleNavigate during this render.
    setCurrentPage('login');
    window.location.hash = 'login';
  };

  const renderPageContent = () => (
    <>
      {currentPage === 'home' && (
        <HomePage
          doctors={doctors}
          specialties={specialties}
          selectedSpecialty={selectedSpecialty}
          onSelectSpecialty={handleSelectSpecialtyFromHome}
          latestVital={latestVital}
          onOpenBooking={handleOpenBooking}
          onOpenVitalsPage={() => handleNavigate('vitals')}
          onOpenAddVitals={() => setAddVitalsOpen(true)}
          onViewDoctorDetails={handleViewDoctorDetails}
          onNavigatePage={handleNavigate}
        />
      )}

      {(currentPage === 'blog' || currentPage === 'newsroom') && <BlogPage />}

      {currentPage === 'doctors' && (
        <DoctorsPage
          doctors={doctors}
          specialties={specialties}
          selectedSpecialty={selectedSpecialty}
          onSelectSpecialty={setSelectedSpecialty}
          onBookDoctor={(doc) => handleOpenBooking(doc, doc.specialty)}
          onViewDoctorDetails={handleViewDoctorDetails}
          onViewDoctorAppointments={handleViewDoctorAppointments}
          // Only show admin features if logged in
          onAddDoctor={currentUser ? (newDoc) => {
            addDoctor(newDoc);
            showToast(`Dr. ${newDoc.name} registered into clinical faculty!`, 'success');
          } : undefined}
          onRemoveDoctor={currentUser ? (id) => {
            removeDoctor(id);
            showToast('Physician profile removed from clinic roster.', 'info');
          } : undefined}
          onUpdateSittingSchedule={currentUser ? (id, sched) => {
            updateDoctorSittingTiming(id, sched);
            showToast('Doctor sitting timings and chamber updated successfully!', 'success');
          } : undefined}
        />
      )}

      {currentPage === 'specialties' && (
        <SpecialtiesPage
          specialties={specialties}
          onSelectSpecialty={(spec) => {
            setSelectedSpecialty(spec);
            handleNavigate('doctors');
          }}
          onBookWithSpecialty={(spec) => handleOpenBooking(undefined, spec)}
          // Only show admin features if logged in
          onAddSpecialty={currentUser ? (newSpec) => {
            addSpecialty(newSpec);
            showToast(`Clinical department "${newSpec.title}" added to hospital wings!`, 'success');
          } : undefined}
          onRemoveSpecialty={currentUser ? (id) => {
            removeSpecialty(id);
            showToast('Clinical specialty removed.', 'info');
          } : undefined}
        />
      )}

      {currentUser && currentPage === 'form-builder' && (
        <AppointmentFormBuilderPage
          doctors={doctors}
          formConfig={formConfig}
          onSetFormMode={(mode) => {
            setFormMode(mode);
            showToast(`Form mode updated to: ${mode.toUpperCase()}`, 'success');
          }}
          onAddFormField={(target, field) => {
            addFormField(target, field);
            showToast(`Field "${field.label}" added to ${target === 'global' ? 'Global Form' : 'Doctor-Specific Form'}!`, 'success');
          }}
          onRemoveFormField={(target, fieldId) => {
            removeFormField(target, fieldId);
            showToast('Form field removed.', 'info');
          }}
          onUpdateFormField={(target, fieldId, updates) => {
            updateFormField(target, fieldId, updates);
            showToast('Form field updated.', 'success');
          }}
          onResetDefaults={() => {
            resetFormToDefaults();
            showToast('Dynamic form reset to hospital baseline questions.', 'info');
          }}
          onTestBooking={() => handleOpenBooking()}
        />
      )}

      {currentUser && currentPage === 'appointments' && (
        <AppointmentsPage
          appointments={appointments}
          doctors={doctors}
          initialDoctorId={doctorFilterForAppointments}
          onCancelAppointment={(id, reason) => {
            cancelAppointment(id, reason);
            showToast('Consultation cancelled.', 'info');
          }}
          onRescheduleAppointment={(id, newDate, newTimeSlot) => {
            rescheduleAppointment(id, newDate, newTimeSlot);
            showToast(`Consultation rescheduled to ${newDate} (${newTimeSlot})`);
          }}
          onUpdateStatus={(id, status, notes) => {
            updateAppointmentStatus(id, status, notes);
            showToast(`Patient consultation marked as ${status}.`, 'success');
          }}
          onAddWalkIn={(data) => {
            bookAppointment(data);
            showToast(`Patient ${data.patientName} admitted to queue!`, 'success');
          }}
          onOpenNewBooking={(doc) => handleOpenBooking(doc, doc?.specialty)}
        />
      )}

      {currentUser && currentPage === 'vitals' && (
        <VitalsPage
          vitals={vitals}
          latestVital={latestVital}
          onOpenAddVitals={() => setAddVitalsOpen(true)}
          onDeleteVital={(id) => {
            deleteVital(id);
            showToast('Vital entry deleted.', 'info');
          }}
        />
      )}

      {currentPage === 'emergency' && (
        <EmergencyPage onOpenBooking={() => handleOpenBooking()} />
      )}

      {currentPage === 'login' && (
        <LoginPage
          currentUser={currentUser}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {currentUser ? (
        /* Hospital / Clinic Dashboard Layout (Website Header/Footer Hidden, Common Header & Sub-Navbar Active) */
        <DashboardLayout
          currentUser={currentUser}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          appointmentsCount={upcomingAppointments.length}
        >
          {renderPageContent()}
        </DashboardLayout>
      ) : (
        /* Public Non-Logged In State */
        <Box sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: currentPage === 'home' ? '#fffaf9' : '#faf7f6',
          // One continuous decorative circle behind BOTH the navbar and hero.
          // Fixed-radius circle centered 100px outside the right edge, 180px below the top.
          // A single radial gradient spans the header and hero without any clipping seam.
          backgroundImage: currentPage === 'home'
            ? 'radial-gradient(circle 290px at calc(100% + 100px) 180px, rgba(183, 3, 2, 0.075) 0 99.8%, transparent 100%)'
            : 'none',
          backgroundRepeat: 'no-repeat',
        }}>
          <Navbar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onOpenLogin={() => handleNavigate('login')}
            user={currentUser}
          />

          <Box component="main" sx={{ flexGrow: 1 }}>
            {renderPageContent()}
          </Box>

          {currentPage !== 'login' && (
            <Footer
              onOpenBooking={() => handleOpenBooking()}
              onNavigate={handleNavigate}
            />
          )}
        </Box>
      )}

      {/* Dynamic Hospital Intake Booking Modal */}
      <BookAppointmentModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        doctors={doctors}
        initialDoctor={bookingDoctor}
        initialSpecialty={bookingSpecialty}
        onBookingSuccess={handleBookingSuccess}
        getFieldsForDoctor={getFieldsForDoctor}
      />

      <AddVitalsDialog
        open={addVitalsOpen}
        onClose={() => setAddVitalsOpen(false)}
        onAddVital={handleAddVitalSuccess}
      />

      <DoctorDetailsModal
        doctor={activeDoctorForDetails}
        open={doctorDetailsOpen}
        onClose={() => setDoctorDetailsOpen(false)}
        onBookAppointment={(doc) => {
          handleOpenBooking(doc, doc.specialty);
        }}
      />

      {/* Notification Toast */}
      <NotificationSnackbar
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </ThemeProvider>
  );
}

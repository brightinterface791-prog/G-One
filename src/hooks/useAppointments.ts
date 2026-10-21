import { useState, useEffect, useCallback } from 'react';
import { appointmentService } from '../services/appointmentService';
import { Appointment } from '../types';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadAppointments = useCallback(() => {
    setIsLoading(true);
    const data = appointmentService.getAppointments();
    setAppointments(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const bookAppointment = useCallback(
    (data: Omit<Appointment, 'id' | 'createdAt' | 'bookingRef' | 'status'>): Appointment => {
      const created = appointmentService.createAppointment(data);
      loadAppointments();
      return created;
    },
    [loadAppointments]
  );

  const cancelAppointment = useCallback(
    (id: string, reason?: string) => {
      appointmentService.updateAppointmentStatus(id, 'Cancelled', reason);
      loadAppointments();
    },
    [loadAppointments]
  );

  const updateAppointmentStatus = useCallback(
    (id: string, status: Appointment['status'], reasonOrNotes?: string) => {
      appointmentService.updateAppointmentStatus(id, status, reasonOrNotes);
      loadAppointments();
    },
    [loadAppointments]
  );

  const rescheduleAppointment = useCallback(
    (id: string, newDate: string, newTimeSlot: string) => {
      appointmentService.rescheduleAppointment(id, newDate, newTimeSlot);
      loadAppointments();
    },
    [loadAppointments]
  );

  const deleteAppointment = useCallback(
    (id: string) => {
      appointmentService.deleteAppointment(id);
      loadAppointments();
    },
    [loadAppointments]
  );

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'Confirmed' || apt.status === 'Rescheduled'
  );

  const pastAppointments = appointments.filter(
    (apt) => apt.status === 'Completed' || apt.status === 'Cancelled'
  );

  return {
    appointments,
    upcomingAppointments,
    pastAppointments,
    isLoading,
    bookAppointment,
    cancelAppointment,
    updateAppointmentStatus,
    rescheduleAppointment,
    deleteAppointment,
    refreshAppointments: loadAppointments,
  };
}

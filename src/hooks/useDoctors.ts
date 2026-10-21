import { useState, useMemo } from 'react';
import { doctorService } from '../services/doctorService';
import { Doctor, Specialty } from '../types';

export function useDoctors() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const specialties: Specialty[] = useMemo(() => {
    return doctorService.getSpecialties();
  }, []);

  const doctors: Doctor[] = useMemo(() => {
    return doctorService.filterDoctors({
      specialty: selectedSpecialty,
      search: searchQuery,
    });
  }, [selectedSpecialty, searchQuery]);

  return {
    doctors,
    specialties,
    selectedSpecialty,
    setSelectedSpecialty,
    searchQuery,
    setSearchQuery,
    selectedDoctor,
    setSelectedDoctor,
    getDoctorById: doctorService.getDoctorById,
  };
}

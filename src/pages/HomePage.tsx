import React from 'react';
import { Box } from '@mui/material';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryDoctorsShowcase } from '../components/home/CategoryDoctorsShowcase';
import { SpecialtiesSection } from '../components/home/SpecialtiesSection';
import { FeaturedDoctorsSection } from '../components/home/FeaturedDoctorsSection';
import { EmergencyCareSection } from '../components/home/EmergencyCareSection';
import { HealthArticlesSection } from '../components/home/HealthArticlesSection';
import { PatientReviewsSection } from '../components/home/PatientReviewsSection';
import { Doctor, Specialty, VitalRecord } from '../types';

interface HomePageProps {
  doctors: Doctor[];
  specialties: Specialty[];
  selectedSpecialty: string;
  onSelectSpecialty: (specialty: string) => void;
  latestVital: VitalRecord | null;
  onOpenBooking: (doctor?: Doctor, specialty?: string) => void;
  onOpenVitalsPage: () => void;
  onOpenAddVitals: () => void;
  onViewDoctorDetails: (doc: Doctor) => void;
  onNavigatePage: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  doctors,
  specialties,
  selectedSpecialty,
  onSelectSpecialty,
  latestVital,
  onOpenBooking,
  onOpenVitalsPage,
  onOpenAddVitals,
  onViewDoctorDetails,
  onNavigatePage,
}) => {
  return (
    <Box id="home-page" sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <HeroSection
        onOpenBooking={() => onOpenBooking()}
        onOpenVitals={onOpenVitalsPage}
        onSearchDoctors={(query) => {
          onNavigatePage('doctors');
        }}
      />

      {/* Categories & Top Specialist Doctors (Row with View More) */}
      <CategoryDoctorsShowcase
        doctors={doctors}
        specialties={specialties}
        selectedCategory={selectedSpecialty}
        onSelectCategory={onSelectSpecialty}
        onBookDoctor={(doc) => onOpenBooking(doc, doc.specialty)}
        onViewDoctorDetails={onViewDoctorDetails}
        onViewAllDoctors={() => onNavigatePage('doctors')}
      />

      {/* Specialties Showcase */}
      <SpecialtiesSection
        specialties={specialties}
        selectedSpecialty={selectedSpecialty}
        onSelectSpecialty={(spec) => {
          onSelectSpecialty(spec);
          onNavigatePage('doctors');
        }}
        onBookWithSpecialty={(spec) => {
          onOpenBooking(undefined, spec);
        }}
        onViewAllSpecialties={() => onNavigatePage('specialties')}
      />

      {/* Featured Doctors Directory */}
      <FeaturedDoctorsSection
        doctors={doctors}
        selectedSpecialty={selectedSpecialty}
        onSelectSpecialty={onSelectSpecialty}
        onBookDoctor={(doc) => onOpenBooking(doc, doc.specialty)}
        onViewDoctorDetails={onViewDoctorDetails}
        onViewAllDoctors={() => onNavigatePage('doctors')}
      />

      {/* 24/7 Emergency Care Section */}
      <EmergencyCareSection
        onOpenBooking={() => onNavigatePage('emergency')}
      />

      {/* Health Articles & Insights */}
      <HealthArticlesSection />

      {/* Patient Reviews & Accreditations */}
      <PatientReviewsSection />
    </Box>
  );
};

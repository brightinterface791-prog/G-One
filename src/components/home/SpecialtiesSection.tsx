import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Chip,
} from '@mui/material';
import {
  Favorite,
  Psychology,
  ChildCare,
  AccessibilityNew,
  Spa,
  MedicalServices,
  Air,
  Visibility,
  ArrowForward,
  ChevronRight,
} from '@mui/icons-material';
import { Specialty } from '../../types';
import { THEME_COLOR } from '../../theme/theme';

interface SpecialtiesSectionProps {
  specialties: Specialty[];
  selectedSpecialty: string;
  onSelectSpecialty: (specialtyName: string) => void;
  onBookWithSpecialty: (specialtyName: string) => void;
  onViewAllSpecialties?: () => void;
}

export const SpecialtiesSection: React.FC<SpecialtiesSectionProps> = ({
  specialties,
  selectedSpecialty,
  onSelectSpecialty,
  onBookWithSpecialty,
  onViewAllSpecialties,
}) => {
  const getIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'cardiology':
        return <Favorite sx={{ fontSize: 28, color: THEME_COLOR }} />;
      case 'neurology':
        return <Psychology sx={{ fontSize: 28, color: '#0e7490' }} />;
      case 'pediatrics':
        return <ChildCare sx={{ fontSize: 28, color: '#d97706' }} />;
      case 'orthopedics':
        return <AccessibilityNew sx={{ fontSize: 28, color: '#16a34a' }} />;
      case 'dermatology':
        return <Spa sx={{ fontSize: 28, color: '#ec4899' }} />;
      case 'general medicine':
        return <MedicalServices sx={{ fontSize: 28, color: '#0284c7' }} />;
      case 'pulmonology':
        return <Air sx={{ fontSize: 28, color: '#6366f1' }} />;
      case 'ophthalmology':
        return <Visibility sx={{ fontSize: 28, color: '#8b5cf6' }} />;
      default:
        return <MedicalServices sx={{ fontSize: 28, color: THEME_COLOR }} />;
    }
  };

  // Strictly show 3 categories in a single row
  const displaySpecialties = specialties.slice(0, 3);

  return (
    <Box
      id="specialties-section"
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        {/* Left-Aligned Section Header (Matches other sections) */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            mb: 4,
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: THEME_COLOR,
                }}
              />
              <Typography
                variant="overline"
                sx={{
                  color: THEME_COLOR,
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  fontSize: '0.75rem',
                }}
              >
                CENTERS OF CLINICAL EXCELLENCE
              </Typography>
            </Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.15rem', md: '2.4rem' },
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Multi-Specialty Care Departments
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#64748b',
                mt: 0.8,
                fontSize: { xs: '0.92rem', md: '1rem' },
                maxWidth: 650,
              }}
            >
              Choose from leading departments staffed by fellowship-trained doctors with cutting-edge diagnostics.
            </Typography>
          </Box>

          {/* Header Link */}
          {onViewAllSpecialties && (
            <Box
              id="specialties-header-explore-link"
              onClick={onViewAllSpecialties}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.6,
                cursor: 'pointer',
                userSelect: 'none',
                color: THEME_COLOR,
                pb: 0.3,
                borderBottom: '1.5px solid transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#8b0000',
                  borderBottomColor: '#8b0000',
                  transform: 'translateX(2px)',
                  '& .specialties-header-arrow': {
                    transform: 'translateX(3px)',
                  },
                },
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '0.92rem' }}>
                Explore All Departments
              </Typography>
              <ChevronRight className="specialties-header-arrow" sx={{ fontSize: 18, transition: 'transform 0.2s ease' }} />
            </Box>
          )}
        </Box>

        {/* 3 Categories in 1 Single Row */}
        <Grid container spacing={3}>
          {displaySpecialties.map((spec) => {
            const isSelected = selectedSpecialty.toLowerCase() === spec.title.toLowerCase();

            return (
              <Grid size={{ xs: 12, md: 4 }} key={spec.id}>
                <Paper
                  elevation={0}
                  onClick={() => onSelectSpecialty(spec.title)}
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: '16px',
                    backgroundColor: '#f8fafc',
                    border: isSelected ? `2px solid ${THEME_COLOR}` : '1px solid #e2e8f0',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isSelected ? '0 8px 24px rgba(183, 3, 2, 0.12)' : 'none',
                    '&:hover': {
                      borderColor: 'rgba(183, 3, 2, 0.4)',
                      backgroundColor: '#ffffff',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.07)',
                    },
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        width: 54,
                        height: 54,
                        borderRadius: '12px',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                      }}
                    >
                      {getIcon(spec.title)}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>
                        {spec.title}
                      </Typography>
                      <Chip
                        label={`${spec.doctorCount} Doctors`}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: '#ffffff',
                          color: '#475569',
                          border: '1px solid #e2e8f0',
                        }}
                      />
                    </Box>

                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2.2, lineHeight: 1.55, minHeight: 44, fontSize: '0.84rem' }}>
                      {spec.description}
                    </Typography>

                    {/* Common conditions pills */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2 }}>
                      {spec.commonConditions.slice(0, 3).map((cond, i) => (
                        <Chip
                          key={i}
                          label={cond}
                          size="small"
                          sx={{
                            backgroundColor: '#ffffff',
                            color: '#334155',
                            fontSize: '0.72rem',
                            height: 24,
                            border: '1px solid #e2e8f0',
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ pt: 1.5, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookWithSpecialty(spec.title);
                      }}
                      sx={{ fontWeight: 700, p: 0, textTransform: 'none', fontSize: '0.84rem', '&:hover': { background: 'transparent' } }}
                      endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                    >
                      Book Visit
                    </Button>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.74rem' }}>
                      OPD Available
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {/* Bottom Explore Link */}
        {onViewAllSpecialties && (
          <Box
            id="specialties-bottom-explore-container"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 4.5,
              pt: 1,
            }}
          >
            <Box
              id="specialties-bottom-explore-link"
              onClick={onViewAllSpecialties}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.8,
                cursor: 'pointer',
                userSelect: 'none',
                color: THEME_COLOR,
                pb: 0.4,
                borderBottom: '1.5px solid transparent',
                transition: 'all 0.25s ease',
                '&:hover': {
                  color: '#8b0000',
                  borderBottomColor: '#8b0000',
                  transform: 'translateX(2px)',
                  '& .specialties-bottom-explore-icon': {
                    transform: 'translateX(4px)',
                  },
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '0.94rem',
                  lineHeight: 1.2,
                }}
              >
                Explore All 8+ Medical Departments
              </Typography>
              <ArrowForward
                className="specialties-bottom-explore-icon"
                sx={{
                  fontSize: 18,
                  transition: 'transform 0.2s ease',
                }}
              />
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Chip,
  Avatar,
} from '@mui/material';
import {
  EventAvailable,
  Star,
  WorkOutlined,
  CalendarToday,
  ArrowForward,
  ChevronRight,
  Verified,
} from '@mui/icons-material';
import { Doctor } from '../../types';
import { THEME_COLOR } from '../../theme/theme';

interface FeaturedDoctorsSectionProps {
  doctors: Doctor[];
  selectedSpecialty: string;
  onSelectSpecialty: (specialty: string) => void;
  onBookDoctor: (doctor: Doctor) => void;
  onViewDoctorDetails: (doctor: Doctor) => void;
  onViewAllDoctors?: () => void;
}

export const FeaturedDoctorsSection: React.FC<FeaturedDoctorsSectionProps> = ({
  doctors,
  selectedSpecialty,
  onSelectSpecialty,
  onBookDoctor,
  onViewDoctorDetails,
  onViewAllDoctors,
}) => {
  // Show top 3 senior specialists
  const seniorSpecialists = doctors
    .filter((doc) => doc.experienceYears >= 15 || doc.rating >= 4.9)
    .slice(0, 3);

  // Fallback to first 3 doctors if filter returns less
  const displayDoctors = seniorSpecialists.length >= 3 ? seniorSpecialists : doctors.slice(0, 3);

  return (
    <Box
      id="senior-specialists-section"
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: '#f7f5f4',
        borderBottom: 'none',
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        {/* Header */}
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
                DISTINGUISHED CLINICAL FACULTY
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
              Consult With Senior Specialists
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
              Schedule direct consultations with board-certified department heads and leading medical authorities.
            </Typography>
          </Box>

          {/* Header Link */}
          {onViewAllDoctors && (
            <Box
              id="senior-docs-top-explore-link"
              onClick={onViewAllDoctors}
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
                  '& .senior-header-arrow': {
                    transform: 'translateX(3px)',
                  },
                },
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '0.92rem' }}>
                Explore Senior Directory
              </Typography>
              <ChevronRight className="senior-header-arrow" sx={{ fontSize: 18, transition: 'transform 0.2s ease' }} />
            </Box>
          )}
        </Box>

        {/* 3 Doctors Grid */}
        <Grid container spacing={3}>
          {displayDoctors.map((doc) => (
            <Grid size={{ xs: 12, md: 4 }} key={doc.id}>
              <Paper
                id={`senior-doctor-card-${doc.id}`}
                elevation={0}
                sx={{
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  backgroundColor: '#ffffff',
                  p: 3,
                  transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  '&:hover': {
                    borderColor: 'rgba(183, 3, 2, 0.35)',
                    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.08)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                {/* Doctor Avatar, Specialty & Name */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    src={doc.avatar}
                    alt={doc.name}
                    sx={{
                      width: 68,
                      height: 68,
                      borderRadius: '14px',
                      border: '2px solid #f1f5f9',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Chip
                      label={doc.specialty}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(183, 3, 2, 0.08)',
                        color: THEME_COLOR,
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        height: 22,
                        mb: 0.5,
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: '#0f172a',
                        lineHeight: 1.25,
                        fontSize: '1rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={doc.name}
                    >
                      {doc.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#64748b',
                        display: 'block',
                        fontWeight: 500,
                        fontSize: '0.76rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {doc.department}
                    </Typography>
                  </Box>
                </Box>

                {/* Rating and Experience Badges */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1.1,
                    px: 1.4,
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    mb: 1.8,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Star sx={{ color: '#eab308', fontSize: 17 }} />
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.82rem' }}>
                      {doc.rating}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.74rem' }}>
                      ({doc.reviewCount} reviews)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#475569' }}>
                    <WorkOutlined sx={{ fontSize: 15, color: '#64748b' }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.78rem' }}>
                      {doc.experienceYears}+ Yrs Exp
                    </Typography>
                  </Box>
                </Box>

                {/* Bio snippet */}
                <Typography
                  variant="body2"
                  sx={{
                    color: '#475569',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    mb: 2,
                    minHeight: 38,
                  }}
                >
                  {doc.about}
                </Typography>

                {/* Next Available snippet */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.8,
                    mb: 2.2,
                    p: 1,
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <CalendarToday sx={{ fontSize: 14, color: THEME_COLOR }} />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: '#475569',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Next Available: <strong>{doc.availableDays[0]}</strong>
                  </Typography>
                </Box>

                {/* Direct Action Button: Book Appointment only */}
                <Box sx={{ mt: 'auto', pt: 1.5, borderTop: '1px solid #f1f5f9' }}>
                  <Button
                    id={`senior-doc-book-btn-${doc.id}`}
                    variant="contained"
                    fullWidth
                    size="medium"
                    startIcon={<EventAvailable sx={{ fontSize: 16 }} />}
                    onClick={() => onBookDoctor(doc)}
                    sx={{
                      py: 0.9,
                      px: 2,
                      fontSize: '0.84rem',
                      backgroundColor: THEME_COLOR,
                      color: '#ffffff',
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: '9999px',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: '#950201',
                        boxShadow: '0 4px 12px rgba(183, 3, 2, 0.25)',
                      },
                    }}
                  >
                    Book Appointment
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Bottom Explore Link */}
        {onViewAllDoctors && (
          <Box
            id="senior-doctors-bottom-explore-container"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 4.5,
              pt: 1,
            }}
          >
            <Box
              id="senior-doctors-bottom-explore-link"
              onClick={onViewAllDoctors}
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
                  '& .senior-bottom-explore-icon': {
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
                Explore All Senior Consultants & Specialists
              </Typography>
              <ArrowForward
                className="senior-bottom-explore-icon"
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


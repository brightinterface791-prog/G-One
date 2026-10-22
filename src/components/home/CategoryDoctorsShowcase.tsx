import React, { useState } from 'react';
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
  ArrowForward,
  WorkOutlined,
  CalendarToday,
  ChevronRight,
} from '@mui/icons-material';
import { Doctor, Specialty } from '../../types';
import { THEME_COLOR } from '../../theme/theme';

interface CategoryDoctorsShowcaseProps {
  doctors: Doctor[];
  specialties: Specialty[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onBookDoctor: (doctor: Doctor) => void;
  onViewDoctorDetails: (doctor: Doctor) => void;
  onViewAllDoctors: () => void;
}

export const CategoryDoctorsShowcase: React.FC<CategoryDoctorsShowcaseProps> = ({
  doctors,
  specialties,
  selectedCategory,
  onSelectCategory,
  onBookDoctor,
  onViewDoctorDetails,
  onViewAllDoctors,
}) => {
  const [activeTab, setActiveTab] = useState<string>(selectedCategory || 'All');

  const categories = [
    { id: 'All', label: 'All Specialists', count: doctors.length },
    { id: 'Cardiology', label: 'Cardiology', count: doctors.filter((d) => d.specialty === 'Cardiology').length },
    { id: 'Neurology', label: 'Neurology', count: doctors.filter((d) => d.specialty === 'Neurology').length },
    { id: 'Pediatrics', label: 'Pediatrics', count: doctors.filter((d) => d.specialty === 'Pediatrics').length },
    { id: 'Orthopedics', label: 'Orthopedics', count: doctors.filter((d) => d.specialty === 'Orthopedics').length },
    { id: 'General Medicine', label: 'General Medicine', count: doctors.filter((d) => d.specialty === 'General Medicine').length },
    { id: 'Dermatology', label: 'Dermatology', count: doctors.filter((d) => d.specialty === 'Dermatology').length },
  ];

  const handleCategoryClick = (catId: string) => {
    setActiveTab(catId);
    onSelectCategory(catId);
  };

  // Filter doctors according to category and slice top 3 doctors for row display
  const filteredDoctors = activeTab === 'All'
    ? doctors.slice(0, 3)
    : doctors.filter((d) => d.specialty.toLowerCase() === activeTab.toLowerCase()).slice(0, 3);

  return (
    <Box
      id="category-specialists-section"
      sx={{
        py: { xs: 5, md: 7 },
        backgroundColor: '#ffffff',
        borderBottom: 'none',
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        {/* Section Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            mb: 3.5,
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
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  fontSize: '0.75rem',
                }}
              >
                SPECIALIST CLINICAL DIRECTORY
              </Typography>
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.65rem', sm: '2rem', md: '2.35rem' },
                fontWeight: 600,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Top Specialist Doctors by Department
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#64748b',
                mt: 0.8,
                fontSize: { xs: '0.9rem', md: '1rem' },
              }}
            >
              Select a clinical category to view top verified consultants and book same-day appointments.
            </Typography>
          </Box>

          {/* Pure Text Link (No rectangle box) */}
          <Box
            id="header-view-all-docs-link"
            onClick={onViewAllDoctors}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.8,
              cursor: 'pointer',
              userSelect: 'none',
              color: THEME_COLOR,
              transition: 'all 0.2s ease',
              pb: 0.3,
              borderBottom: '1.5px solid transparent',
              '&:hover': {
                color: '#8b0000',
                borderBottomColor: '#8b0000',
                transform: 'translateX(2px)',
                '& .header-link-icon': {
                  transform: 'translateX(3px)',
                },
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '0.92rem',
                lineHeight: 1.2,
              }}
            >
              Explore All 45+ Specialists
            </Typography>
            <ChevronRight
              className="header-link-icon"
              sx={{ fontSize: 18, transition: 'transform 0.2s ease' }}
            />
          </Box>
        </Box>

        {/* Category Pills Selector Bar */}
        <Box
          id="category-pills-bar"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            overflowX: 'auto',
            pb: 2,
            mb: 3.5,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {categories.map((cat) => {
            const isSelected = activeTab === cat.id;
            return (
              <Box
                key={cat.id}
                id={`category-pill-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleCategoryClick(cat.id)}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2.2,
                  py: 1,
                  borderRadius: '30px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  fontSize: '0.86rem',
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected ? THEME_COLOR : '#f8fafc',
                  color: isSelected ? '#ffffff' : '#334155',
                  border: isSelected ? `1px solid ${THEME_COLOR}` : '1px solid #e2e8f0',
                  boxShadow: isSelected ? '0 4px 12px rgba(183, 3, 2, 0.25)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': {
                    backgroundColor: isSelected ? THEME_COLOR : '#f1f5f9',
                    borderColor: isSelected ? THEME_COLOR : '#cbd5e1',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <span>{cat.label}</span>
                <Typography
                  component="span"
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    px: 0.8,
                    py: 0.1,
                    borderRadius: '10px',
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#e2e8f0',
                    color: isSelected ? '#ffffff' : '#64748b',
                  }}
                >
                  {cat.count}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Top 2 to 3 Doctors Row */}
        <Grid container spacing={3}>
          {filteredDoctors.map((doc) => (
            <Grid
              key={doc.id}
              size={{
                xs: 12,
                sm: filteredDoctors.length === 2 ? 6 : 6,
                md: filteredDoctors.length === 2 ? 6 : 4,
              }}
            >
              <Paper
                id={`doctor-card-${doc.id}`}
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  p: 2.5,
                  transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  '&:hover': {
                    borderColor: 'rgba(183, 3, 2, 0.35)',
                    boxShadow: '0 10px 24px rgba(0, 0, 0, 0.07)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                {/* Doctor Avatar & Rating Header */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.6, mb: 1.8 }}>
                  <Avatar
                    src={doc.avatar}
                    alt={doc.name}
                    sx={{
                      width: 62,
                      height: 62,
                      borderRadius: '12px',
                      border: '2px solid #f1f5f9',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
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
                        fontWeight: 600,
                        fontSize: '0.68rem',
                        height: 20,
                        mb: 0.4,
                      }}
                    />
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: '#0f172a',
                        fontSize: '0.96rem',
                        lineHeight: 1.25,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={doc.name}
                    >
                      {doc.name}
                    </Typography>
                  </Box>
                </Box>

                {/* Credentials & Department */}
                <Typography
                  variant="caption"
                  sx={{
                    color: '#64748b',
                    fontSize: '0.76rem',
                    fontWeight: 500,
                    mb: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.3,
                  }}
                  title={doc.qualification}
                >
                  {doc.qualification}
                </Typography>

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
                    mb: 1.6,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Star sx={{ color: '#eab308', fontSize: 17 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.82rem' }}>
                      {doc.rating}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.74rem' }}>
                      ({doc.reviewCount})
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: '#475569' }}>
                    <WorkOutlined sx={{ fontSize: 15, color: '#64748b' }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.78rem' }}>
                      {doc.experienceYears}+ Yrs Exp
                    </Typography>
                  </Box>
                </Box>

                {/* Availability snippet */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.8,
                    mb: 2.2,
                    color: '#334155',
                  }}
                >
                  <CalendarToday sx={{ fontSize: 14, color: THEME_COLOR }} />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.75rem',
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

                {/* Action Button: Book Appointment only */}
                <Box
                  sx={{
                    mt: 'auto',
                    pt: 1.6,
                    borderTop: '1px solid #f1f5f9',
                  }}
                >
                  <Button
                    id={`doc-row-book-btn-${doc.id}`}
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
                      fontWeight: 600,
                      borderRadius: '8px',
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

        {/* View More Link at the bottom of the section (Pure Text Link - No rectangle box) */}
        <Box
          id="category-doctors-view-more-container"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4,
            pt: 1,
          }}
        >
          <Box
            id="bottom-view-more-specialists-link"
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
                '& .view-more-icon': {
                  transform: 'translateX(4px)',
                },
              },
            }}
          >
            <Typography
              className="view-more-text"
              sx={{
                fontWeight: 600,
                fontSize: '0.94rem',
                lineHeight: 1.2,
              }}
            >
              View More Specialists & Full Directory
            </Typography>
            <ArrowForward
              className="view-more-icon"
              sx={{
                fontSize: 18,
                transition: 'transform 0.2s ease',
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

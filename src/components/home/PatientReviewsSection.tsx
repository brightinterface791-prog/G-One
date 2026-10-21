import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Rating,
  Avatar,
  Chip,
} from '@mui/material';
import { FormatQuote, Verified } from '@mui/icons-material';
import { THEME_COLOR } from '../../theme/theme';

export const PatientReviewsSection: React.FC = () => {
  const reviews = [
    {
      id: 'rev-1',
      name: 'Jennifer K.',
      treatment: 'Cardiology Consultation',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      comment: 'Booking with Dr. Sarah Jenkins through G-One Health Care was seamless. The ability to log my blood pressure vitals directly and have her review them during the consultation was phenomenal.',
      date: 'Visited Aug 2026',
    },
    {
      id: 'rev-2',
      name: 'David R.',
      treatment: 'Orthopedics & Sports Rehab',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      comment: 'Dr. Sterling diagnosed my torn meniscus within minutes of imaging. The clinic was impeccably clean, wait time was under 10 minutes, and the staff was remarkably caring.',
      date: 'Visited Jul 2026',
    },
    {
      id: 'rev-3',
      name: 'Ananya Patel',
      treatment: 'Pediatric Care for Infant',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      comment: 'Dr. Rostova is the gentlest pediatrician we have ever met. The clinic portal kept all vaccine reminders and infant growth vitals neatly organized.',
      date: 'Visited Aug 2026',
    },
  ];

  return (
    <Box
      id="patient-reviews-section"
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        <Box sx={{ textAlign: 'center', mb: 5, maxWidth: 850, mx: 'auto' }}>
          <Chip
            label="PATIENT EXPERIENCES"
            size="small"
            sx={{
              backgroundColor: 'rgba(183, 3, 2, 0.08)',
              color: THEME_COLOR,
              fontWeight: 700,
              fontSize: '0.75rem',
              mb: 1.5,
            }}
          />
          <Typography variant="h2" sx={{ fontSize: { xs: '1.875rem', md: '2.25rem' }, fontWeight: 800, color: '#0f172a', mb: 1 }}>
            Trusted by Thousands of Families
          </Typography>
          <Typography variant="body1" sx={{ color: '#475569' }}>
            Real reviews from patients who received specialized consultations and vitals tracking.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {reviews.map((rev) => (
            <Grid size={{ xs: 12, md: 4 }} key={rev.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Rating value={rev.rating} readOnly size="small" />
                    <FormatQuote sx={{ color: 'rgba(183, 3, 2, 0.2)', fontSize: 32 }} />
                  </Box>

                  <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.7, mb: 3, fontStyle: 'italic' }}>
                    "{rev.comment}"
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 2, borderTop: '1px solid #f1f5f9' }}>
                  <Avatar src={rev.avatar} alt={rev.name} sx={{ width: 44, height: 44, borderRadius: 2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                        {rev.name}
                      </Typography>
                      <Verified sx={{ color: '#16a34a', fontSize: 16 }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      {rev.treatment} • {rev.date}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

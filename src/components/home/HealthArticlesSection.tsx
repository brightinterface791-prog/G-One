import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import { AccessTime, ArrowForward, MenuBook } from '@mui/icons-material';
import { THEME_COLOR } from '../../theme/theme';

export const HealthArticlesSection: React.FC = () => {
  const articles = [
    {
      id: 'art-1',
      title: 'Understanding Blood Pressure Stages: How to Read Systolic & Diastolic Numbers',
      category: 'Cardiovascular Health',
      readTime: '4 min read',
      author: 'Dr. Sarah Jenkins, MD',
      date: 'Aug 18, 2026',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=500',
      summary: 'Learn what elevated vs stage-1 hypertension metrics mean and how routine home vitals logging prevents cardiovascular events.',
    },
    {
      id: 'art-2',
      title: 'Resting Heart Rate vs Exercise Pulse: What Your Rhythm Tells About Your Longevity',
      category: 'Preventive Medicine',
      readTime: '5 min read',
      author: 'Dr. Marcus Vance, MD',
      date: 'Aug 15, 2026',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=500',
      summary: 'A complete clinical breakdown of baseline bradycardia, normal resting ranges, and when to consult a specialist.',
    },
    {
      id: 'art-3',
      title: 'Glycemic Spikes vs Fasting Blood Sugar: Daily Habits for Metabolic Equilibrium',
      category: 'Endocrinology',
      readTime: '6 min read',
      author: 'Dr. Priya Sharma, MBBS',
      date: 'Aug 12, 2026',
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=500',
      summary: 'Simple nutritional strategies and timing tips to maintain healthy glucose levels without extreme dietary restriction.',
    },
  ];

  return (
    <Box
      id="health-articles-section"
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: '#ffffff',
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Chip
              label="HEALTH EDUCATION & PREVENTIVE WELLNESS"
              size="small"
              sx={{
                backgroundColor: 'rgba(183, 3, 2, 0.08)',
                color: THEME_COLOR,
                fontWeight: 700,
                fontSize: '0.75rem',
                mb: 1.5,
              }}
            />
            <Typography variant="h2" sx={{ fontSize: { xs: '1.875rem', md: '2.25rem' }, fontWeight: 800, color: '#0f172a' }}>
              Doctor-Reviewed Health Guides
            </Typography>
            <Typography variant="body1" sx={{ color: '#475569', mt: 0.5 }}>
              Expert medical insights to help you understand your vitals and live healthier.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {articles.map((art) => (
            <Grid size={{ xs: 12, md: 4 }} key={art.id}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
                  },
                }}
              >
                <Box
                  component="img"
                  src={art.image}
                  alt={art.title}
                  sx={{
                    width: '100%',
                    height: 190,
                    objectFit: 'cover',
                  }}
                />

                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Chip
                      label={art.category}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(14, 116, 144, 0.1)',
                        color: '#0e7490',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        height: 22,
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b', fontSize: '0.75rem' }}>
                      <AccessTime sx={{ fontSize: 14 }} />
                      <span>{art.readTime}</span>
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.3, mb: 1.5 }}>
                    {art.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#475569', mb: 2, lineHeight: 1.6, flexGrow: 1 }}>
                    {art.summary}
                  </Typography>

                  <Box sx={{ pt: 2, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                      By {art.author}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      {art.date}
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

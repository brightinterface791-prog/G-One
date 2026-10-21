import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Favorite,
  Psychology,
  ChildCare,
  AccessibilityNew,
  LocalHospital,
  Face,
  Visibility,
  Medication,
  CalendarMonth,
  AddCircleOutlined,
  DeleteOutlined,
  Close,
  Domain,
} from '@mui/icons-material';
import { Specialty } from '../types';
import { THEME_COLOR } from '../theme/theme';

interface SpecialtiesPageProps {
  specialties: Specialty[];
  onSelectSpecialty: (specialtyTitle: string) => void;
  onBookWithSpecialty: (specialtyTitle: string) => void;
  onAddSpecialty?: (newSpec: Omit<Specialty, 'id' | 'doctorCount'>) => void;
  onRemoveSpecialty?: (id: string) => void;
}

export const SpecialtiesPage: React.FC<SpecialtiesPageProps> = ({
  specialties,
  onSelectSpecialty,
  onBookWithSpecialty,
  onAddSpecialty,
  onRemoveSpecialty,
}) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [conditionsStr, setConditionsStr] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const getSpecialtyIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'cardiology':
      case 'heart':
        return <Favorite sx={{ fontSize: 26 }} />;
      case 'neurology':
      case 'brain':
        return <Psychology sx={{ fontSize: 26 }} />;
      case 'pediatrics':
      case 'child':
        return <ChildCare sx={{ fontSize: 26 }} />;
      case 'orthopedics':
      case 'bone':
        return <AccessibilityNew sx={{ fontSize: 26 }} />;
      case 'dermatology':
      case 'skin':
        return <Face sx={{ fontSize: 26 }} />;
      case 'ophthalmology':
      case 'eye':
        return <Visibility sx={{ fontSize: 26 }} />;
      default:
        return <LocalHospital sx={{ fontSize: 26 }} />;
    }
  };

  const handleOpenAdd = () => {
    setTitle('');
    setDepartment('');
    setDescription('');
    setConditionsStr('');
    setErrorMsg('');
    setAddModalOpen(true);
  };

  const handleSaveSpecialty = () => {
    if (!title.trim()) {
      setErrorMsg('Specialty name is required');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Clinical description is required');
      return;
    }

    const commonConditions = conditionsStr
      ? conditionsStr.split(',').map((s) => s.trim()).filter(Boolean)
      : ['General Consultation', 'Preventive Care'];

    if (onAddSpecialty) {
      onAddSpecialty({
        title: title.trim(),
        department: department.trim() || `${title.trim()} Division`,
        description: description.trim(),
        iconName: 'general',
        commonConditions,
      });
    }

    setAddModalOpen(false);
  };

  return (
    <Box id="hospital-specialties-page" sx={{ py: { xs: 3, md: 4 }, backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        {/* Header Strip with Action Button */}
        <Box sx={{ mb: 3.5, display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Chip
                label="CLINICAL DEPARTMENTS"
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
                Hospital & Clinic Master Setup
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', fontSize: { xs: '1.5rem', sm: '1.85rem' }, letterSpacing: '-0.02em' }}>
              Hospital Medical Specialties & Wings
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.86rem', maxWidth: 720 }}>
              Manage clinical departments, surgical wings, and outpatient specialties. Add or remove specialties dynamically as clinical services expand.
            </Typography>
          </Box>

          {onAddSpecialty && (
            <Button
              id="add-specialty-btn"
              variant="contained"
              startIcon={<AddCircleOutlined />}
              onClick={handleOpenAdd}
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
              Add Hospital Specialty
            </Button>
          )}
        </Box>

        {/* Department Grid */}
        <Grid container spacing={3}>
          {specialties.map((spec) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={spec.id}>
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
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  {/* Icon, Doctor Count & Delete */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2.5,
                        backgroundColor: 'rgba(183, 3, 2, 0.08)',
                        color: THEME_COLOR,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {getSpecialtyIcon(spec.iconName)}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={`${spec.doctorCount} Doctors`}
                        size="small"
                        sx={{ fontWeight: 700, backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.72rem' }}
                      />
                      {onRemoveSpecialty && (
                        <Tooltip title="Remove Department">
                          <IconButton
                            size="small"
                            onClick={() => setDeleteConfirmId(spec.id)}
                            sx={{ color: '#94a3b8', '&:hover': { color: '#dc2626' } }}
                          >
                            <DeleteOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>

                  {/* Title & Description */}
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', mb: 0.5 }}>
                    {spec.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 700, mb: 1.5, display: 'block' }}>
                    {spec.department}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5, fontSize: '0.84rem', lineHeight: 1.55, flexGrow: 1 }}>
                    {spec.description}
                  </Typography>

                  {/* Conditions Treated */}
                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="caption" sx={{ color: '#475569', fontWeight: 700, display: 'block', mb: 0.8, fontSize: '0.72rem' }}>
                      Clinical Scope & Treated Conditions:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                      {spec.commonConditions.map((cond) => (
                        <Chip
                          key={cond}
                          label={cond}
                          size="small"
                          sx={{
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.68rem',
                            color: '#334155',
                            height: 22,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* CTAs */}
                  <Box sx={{ display: 'flex', gap: 1.2, pt: 2, borderTop: '1px solid #f1f5f9' }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      onClick={() => onSelectSpecialty(spec.title)}
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        textTransform: 'none',
                        borderRadius: '9999px',
                        borderColor: '#cbd5e1',
                        color: '#334155',
                      }}
                    >
                      View Doctors
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      startIcon={<CalendarMonth sx={{ fontSize: '15px !important' }} />}
                      onClick={() => onBookWithSpecialty(spec.title)}
                      sx={{
                        backgroundColor: THEME_COLOR,
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        textTransform: 'none',
                        borderRadius: '9999px',
                        boxShadow: 'none',
                        '&:hover': { backgroundColor: '#900201' },
                      }}
                    >
                      Book Visit
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Add Specialty Dialog */}
      <Dialog
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
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
              <Domain sx={{ fontSize: 24 }} />
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
                Add Hospital Specialty / Department
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '13px' }}>
                Expand the medical directory with specialized clinical care divisions
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={() => setAddModalOpen(false)}
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
          {errorMsg && <Alert severity="error" sx={{ borderRadius: '10px' }}>{errorMsg}</Alert>}

          <Box>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', mb: 0.75 }}>
              Specialty Name <Box component="span" sx={{ color: THEME_COLOR, fontWeight: 700 }}>*</Box>
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. Gastroenterology & Hepatology"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Box>

          <Box>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', mb: 0.75 }}>
              Hospital Division / Wing (Optional)
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. Digestive Health Institute (Wing C)"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </Box>

          <Box>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', mb: 0.75 }}>
              Clinical Description <Box component="span" sx={{ color: THEME_COLOR, fontWeight: 700 }}>*</Box>
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Describe clinical care, specialized diagnostics, and surgical offerings..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>

          <Box>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', mb: 0.75 }}>
              Common Conditions Treated (Comma-separated)
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. Acid Reflux, Fatty Liver, IBS, Endoscopy, Crohn's"
              value={conditionsStr}
              onChange={(e) => setConditionsStr(e.target.value)}
              helperText="Separate each condition with a comma"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', gap: 1.5 }}>
          <Button
            onClick={() => setAddModalOpen(false)}
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
            onClick={handleSaveSpecialty}
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
            Create Specialty
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
            Confirm Specialty Removal
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 2.5 }}>
          <Typography sx={{ color: '#475569', fontSize: '14.5px', lineHeight: 1.5 }}>
            Are you sure you want to remove this specialty from the hospital directory? This action will remove the department listing from public search.
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
              if (deleteConfirmId && onRemoveSpecialty) {
                onRemoveSpecialty(deleteConfirmId);
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
            Delete Department
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

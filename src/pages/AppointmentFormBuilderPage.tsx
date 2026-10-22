import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  IconButton,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  Tooltip,
  RadioGroup,
  Radio,
  Checkbox,
  FormGroup,
} from '@mui/material';
import {
  DynamicForm,
  AddCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  Public,
  PersonOutlined,
  Preview,
  CheckCircle,
  HelpOutlined,
  FormatListBulleted,
  ShortText,
  Subject,
  Numbers,
  RadioButtonChecked,
  CheckBoxOutlined,
  ArrowForward,
  Close,
} from '@mui/icons-material';
import { Doctor, DynamicFormField, FormFieldType } from '../types';
import { THEME_COLOR } from '../theme/theme';

interface AppointmentFormBuilderPageProps {
  doctors: Doctor[];
  formConfig: {
    mode: 'global' | 'doctor-wise';
    globalFields: DynamicFormField[];
    doctorSpecificFields: Record<string, DynamicFormField[]>;
  };
  onSetFormMode: (mode: 'global' | 'doctor-wise') => void;
  onAddFormField: (target: 'global' | string, field: Omit<DynamicFormField, 'id'>) => void;
  onRemoveFormField: (target: 'global' | string, fieldId: string) => void;
  onUpdateFormField: (target: 'global' | string, fieldId: string, updates: Partial<DynamicFormField>) => void;
  onResetDefaults?: () => void;
  onTestBooking?: () => void;
}

export const AppointmentFormBuilderPage: React.FC<AppointmentFormBuilderPageProps> = ({
  doctors,
  formConfig,
  onSetFormMode,
  onAddFormField,
  onRemoveFormField,
  onUpdateFormField,
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || '');
  const [addFieldModalOpen, setAddFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<DynamicFormField | null>(null);

  // Field edit form state
  const [label, setLabel] = useState('');
  const [type, setType] = useState<FormFieldType>('text');
  const [required, setRequired] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [helperText, setHelperText] = useState('');
  const [optionsStr, setOptionsStr] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Live preview test form state
  const [previewValues, setPreviewValues] = useState<Record<string, any>>({});
  const [previewSubmitted, setPreviewSubmitted] = useState(false);

  const currentScope = formConfig.mode === 'global' ? 'global' : selectedDoctorId;
  const activeDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  const currentFields: DynamicFormField[] =
    formConfig.mode === 'global'
      ? formConfig.globalFields
      : formConfig.doctorSpecificFields[selectedDoctorId] || [];

  const handleOpenAddModal = () => {
    setEditingField(null);
    setLabel('');
    setType('text');
    setRequired(false);
    setPlaceholder('');
    setHelperText('');
    setOptionsStr('');
    setErrorMsg('');
    setAddFieldModalOpen(true);
  };

  const handleOpenEditModal = (field: DynamicFormField) => {
    setEditingField(field);
    setLabel(field.label);
    setType(field.type);
    setRequired(field.required);
    setPlaceholder(field.placeholder || '');
    setHelperText(field.helperText || '');
    setOptionsStr(field.options ? field.options.join(', ') : '');
    setErrorMsg('');
    setAddFieldModalOpen(true);
  };

  const handleSaveField = () => {
    if (!label.trim()) {
      setErrorMsg('Field label is required');
      return;
    }

    const options =
      type === 'select' || type === 'radio'
        ? optionsStr
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;

    if ((type === 'select' || type === 'radio') && (!options || options.length < 2)) {
      setErrorMsg('Please specify at least 2 comma-separated options for choice fields');
      return;
    }

    if (editingField) {
      onUpdateFormField(currentScope, editingField.id, {
        label: label.trim(),
        type,
        required,
        placeholder: placeholder.trim() || undefined,
        helperText: helperText.trim() || undefined,
        options,
      });
    } else {
      onAddFormField(currentScope, {
        label: label.trim(),
        type,
        required,
        placeholder: placeholder.trim() || undefined,
        helperText: helperText.trim() || undefined,
        options,
      });
    }

    setAddFieldModalOpen(false);
  };

  const getFieldIcon = (fieldType: FormFieldType) => {
    switch (fieldType) {
      case 'text':
        return <ShortText sx={{ fontSize: 18, color: '#3b82f6' }} />;
      case 'textarea':
        return <Subject sx={{ fontSize: 18, color: '#8b5cf6' }} />;
      case 'number':
        return <Numbers sx={{ fontSize: 18, color: '#10b981' }} />;
      case 'select':
        return <FormatListBulleted sx={{ fontSize: 18, color: '#f59e0b' }} />;
      case 'radio':
        return <RadioButtonChecked sx={{ fontSize: 18, color: '#ef4444' }} />;
      case 'checkbox':
        return <CheckBoxOutlined sx={{ fontSize: 18, color: '#06b6d4' }} />;
    }
  };

  return (
    <Box id="dynamic-form-builder-page" sx={{ py: { xs: 3, md: 4 }, backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        {/* Header Strip */}
        <Box sx={{ mb: 3.5, display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Chip
                label="HOSPITAL FORM ARCHITECTURE"
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
                Dynamic Intake Engine
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', fontSize: { xs: '1.5rem', sm: '1.85rem' }, letterSpacing: '-0.02em' }}>
              Dynamic Appointment Form Designer
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.86rem', maxWidth: 760 }}>
              Design dynamic clinical intake questionnaires. Switch between a <strong>Global Hospital-wide Form</strong> or configure custom <strong>Doctor-wise Appointment Forms</strong> per clinical department.
            </Typography>
          </Box>

          {/* Form Mode Toggle Buttons */}
          <Paper
            elevation={0}
            sx={{
              p: 0.6,
              borderRadius: '9999px',
              border: '1.5px solid #cbd5e1',
              backgroundColor: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Button
              id="mode-global-btn"
              size="small"
              variant={formConfig.mode === 'global' ? 'contained' : 'text'}
              startIcon={<Public sx={{ fontSize: 16 }} />}
              onClick={() => onSetFormMode('global')}
              sx={{
                borderRadius: '9999px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                px: 2,
                py: 0.6,
                backgroundColor: formConfig.mode === 'global' ? THEME_COLOR : 'transparent',
                color: formConfig.mode === 'global' ? '#ffffff' : '#475569',
                '&:hover': {
                  backgroundColor: formConfig.mode === 'global' ? '#900201' : '#f1f5f9',
                },
              }}
            >
              Global Form ({formConfig.globalFields.length} Fields)
            </Button>

            <Button
              id="mode-doctor-wise-btn"
              size="small"
              variant={formConfig.mode === 'doctor-wise' ? 'contained' : 'text'}
              startIcon={<PersonOutlined sx={{ fontSize: 16 }} />}
              onClick={() => onSetFormMode('doctor-wise')}
              sx={{
                borderRadius: '9999px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                px: 2,
                py: 0.6,
                backgroundColor: formConfig.mode === 'doctor-wise' ? THEME_COLOR : 'transparent',
                color: formConfig.mode === 'doctor-wise' ? '#ffffff' : '#475569',
                '&:hover': {
                  backgroundColor: formConfig.mode === 'doctor-wise' ? '#900201' : '#f1f5f9',
                },
              }}
            >
              Doctor-Wise Form
            </Button>
          </Paper>
        </Box>

        {/* Doctor selector bar (when Doctor-wise is active) */}
        {formConfig.mode === 'doctor-wise' && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 3,
              backgroundColor: '#ffffff',
              border: '1.5px solid #e2e8f0',
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, width: { xs: '100%', sm: 'auto' } }}>
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 320 } }}>
                <Select
                  value={selectedDoctorId}
                  inputProps={{ "aria-label": "Select Doctor to Customize" }}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                >
                  {doctors.map((doc) => (
                    <MenuItem key={doc.id} value={doc.id}>
                      {doc.name} — {doc.specialty} ({formConfig.doctorSpecificFields[doc.id]?.length || 0} custom fields)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={`Custom Form for ${activeDoctor.name}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(2, 132, 199, 0.1)',
                  color: '#0369a1',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                }}
              />
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  formConfig.globalFields.forEach((gf) => {
                    const exists = (formConfig.doctorSpecificFields[selectedDoctorId] || []).some((f) => f.label === gf.label);
                    if (!exists) {
                      onAddFormField(selectedDoctorId, {
                        label: gf.label,
                        type: gf.type,
                        required: gf.required,
                        placeholder: gf.placeholder,
                        helperText: gf.helperText,
                        options: gf.options,
                      });
                    }
                  });
                }}
                sx={{
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: '9999px',
                }}
              >
                Copy Global Fields
              </Button>
            </Box>
          </Paper>
        )}

        <Grid container spacing={3}>
          {/* Left Column: Form Fields List & Manager */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 3.5,
                border: '1.5px solid #e2e8f0',
                backgroundColor: '#ffffff',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>
                    {formConfig.mode === 'global' ? 'Global Appointment Questions' : `Specific Questions: ${activeDoctor.name}`}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    {currentFields.length} active custom fields configured
                  </Typography>
                </Box>

                <Button
                  id="add-form-field-btn"
                  variant="contained"
                  size="small"
                  startIcon={<AddCircleOutlined />}
                  onClick={handleOpenAddModal}
                  sx={{
                    backgroundColor: THEME_COLOR,
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    px: 2,
                    boxShadow: 'none',
                    '&:hover': { backgroundColor: '#900201' },
                  }}
                >
                  Add Question Field
                </Button>
              </Box>

              {currentFields.length === 0 ? (
                <Box
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 2.5,
                    border: '1px dashed #cbd5e1',
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <DynamicForm sx={{ fontSize: 40, color: '#94a3b8', mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                    No Custom Fields Configured
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.82rem', mb: 2 }}>
                    {formConfig.mode === 'global'
                      ? 'Add global clinical intake questions for all patients booking any doctor.'
                      : `No custom fields set for ${activeDoctor.name}. The system will default to the global form questions.`}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddCircleOutlined />}
                    onClick={handleOpenAddModal}
                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '9999px', borderColor: THEME_COLOR, color: THEME_COLOR }}
                  >
                    Add First Field
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {currentFields.map((field, idx) => (
                    <Box
                      key={field.id}
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#f8fafc',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          borderColor: '#cbd5e1',
                          backgroundColor: '#ffffff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: 1.5,
                              backgroundColor: '#ffffff',
                              border: '1px solid #e2e8f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              mt: 0.2,
                            }}
                          >
                            {getFieldIcon(field.type)}
                          </Box>

                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.3 }}>
                              <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>
                                {idx + 1}. {field.label}
                              </Typography>
                              {field.required ? (
                                <Chip label="Required" size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, backgroundColor: '#fee2e2', color: '#dc2626' }} />
                              ) : (
                                <Chip label="Optional" size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, backgroundColor: '#e2e8f0', color: '#475569' }} />
                              )}
                              <Chip
                                label={field.type.toUpperCase()}
                                size="small"
                                sx={{ height: 20, fontSize: '0.62rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#334155' }}
                              />
                            </Box>

                            {field.placeholder && (
                              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>
                                Placeholder: "{field.placeholder}"
                              </Typography>
                            )}

                            {field.helperText && (
                              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem', fontStyle: 'italic' }}>
                                Helper: {field.helperText}
                              </Typography>
                            )}

                            {field.options && field.options.length > 0 && (
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.8 }}>
                                {field.options.map((opt) => (
                                  <Chip key={opt} label={opt} size="small" sx={{ height: 18, fontSize: '0.65rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1' }} />
                                ))}
                              </Box>
                            )}
                          </Box>
                        </Box>

                        {/* Action buttons */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Tooltip title="Edit Field Definition">
                            <IconButton size="small" onClick={() => handleOpenEditModal(field)} sx={{ color: '#475569' }}>
                              <EditOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Field">
                            <IconButton size="small" onClick={() => onRemoveFormField(currentScope, field.id)} sx={{ color: '#dc2626' }}>
                              <DeleteOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right Column: Live Form Interactive Preview */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 3.5,
                border: '1.5px solid #e2e8f0',
                backgroundColor: '#ffffff',
                position: 'sticky',
                top: 130,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Preview sx={{ color: THEME_COLOR, fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                  Live Patient Booking Preview
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
                This is exactly what patients or hospital receptionists see when scheduling appointments with{' '}
                <strong>{formConfig.mode === 'global' ? 'any doctor (Global)' : activeDoctor.name}</strong>.
              </Typography>

              <Divider sx={{ mb: 2.5 }} />

              {/* Standard Fixed Patient Info Preview */}
              <Box sx={{ p: 1.5, backgroundColor: '#f8fafc', borderRadius: 2, mb: 2.5, border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', mb: 1 }}>
                  1. Base Patient Demographics (System Standard)
                </Typography>
                <Grid container spacing={1}>
                  <Grid size={6}>
                    <TextField fullWidth size="small" label="Patient Name" disabled defaultValue="Alex Rivera" sx={{ backgroundColor: '#ffffff' }} />
                  </Grid>
                  <Grid size={6}>
                    <TextField fullWidth size="small" label="Phone" disabled defaultValue="+1 (555) 234-5678" sx={{ backgroundColor: '#ffffff' }} />
                  </Grid>
                </Grid>
              </Box>

              {/* Dynamic Custom Fields Section */}
              <Typography variant="caption" sx={{ fontWeight: 800, color: THEME_COLOR, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', mb: 1.5 }}>
                2. Dynamic Questions ({formConfig.mode === 'global' ? 'Global Hospital Form' : `Doctor-Specific: ${activeDoctor.name}`})
              </Typography>

              {currentFields.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic', py: 2, textAlign: 'center' }}>
                  No dynamic fields to preview. Add fields on the left.
                </Typography>
              ) : (
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {currentFields.map((f) => (
                    <Box key={f.id}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.82rem', mb: 0.5 }}>
                        {f.label} {f.required && <span style={{ color: '#dc2626' }}>*</span>}
                      </Typography>

                      {f.type === 'text' && (
                        <TextField
                          fullWidth
                          size="small"
                          placeholder={f.placeholder}
                          value={previewValues[f.id] || ''}
                          onChange={(e) => setPreviewValues({ ...previewValues, [f.id]: e.target.value })}
                          helperText={f.helperText}
                        />
                      )}

                      {f.type === 'textarea' && (
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          size="small"
                          placeholder={f.placeholder}
                          value={previewValues[f.id] || ''}
                          onChange={(e) => setPreviewValues({ ...previewValues, [f.id]: e.target.value })}
                          helperText={f.helperText}
                        />
                      )}

                      {f.type === 'number' && (
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          placeholder={f.placeholder}
                          value={previewValues[f.id] || ''}
                          onChange={(e) => setPreviewValues({ ...previewValues, [f.id]: e.target.value })}
                          helperText={f.helperText}
                        />
                      )}

                      {f.type === 'select' && (
                        <FormControl fullWidth size="small">
                          <Select
                            value={previewValues[f.id] || ''}
                            onChange={(e) => setPreviewValues({ ...previewValues, [f.id]: e.target.value })}
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              <em>{f.placeholder || 'Select an option...'}</em>
                            </MenuItem>
                            {(f.options || []).map((opt) => (
                              <MenuItem key={opt} value={opt}>
                                {opt}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}

                      {f.type === 'radio' && (
                        <RadioGroup
                          value={previewValues[f.id] || ''}
                          onChange={(e) => setPreviewValues({ ...previewValues, [f.id]: e.target.value })}
                        >
                          {(f.options || []).map((opt) => (
                            <FormControlLabel
                              key={opt}
                              value={opt}
                              control={<Radio />}
                              label={opt}
                            />
                          ))}
                        </RadioGroup>
                      )}

                      {f.type === 'checkbox' && (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={!!previewValues[f.id]}
                              onChange={(e) => setPreviewValues({ ...previewValues, [f.id]: e.target.checked })}
                            />
                          }
                          label={f.placeholder || 'I confirm this clinical statement'}
                        />
                      )}
                    </Box>
                  ))}

                  <Box sx={{ mt: 1 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="medium"
                      onClick={() => setPreviewSubmitted(true)}
                      sx={{
                        backgroundColor: THEME_COLOR,
                        textTransform: 'none',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        borderRadius: '9999px',
                        py: 1,
                        '&:hover': { backgroundColor: '#900201' },
                      }}
                    >
                      Simulate Booking Submission
                    </Button>
                  </Box>

                  {previewSubmitted && (
                    <Alert
                      severity="success"
                      icon={<CheckCircle fontSize="small" />}
                      onClose={() => setPreviewSubmitted(false)}
                      sx={{ fontSize: '0.8rem', mt: 1 }}
                    >
                      Dynamic responses captured successfully! Data attaches to the consultation slip and medical chart.
                    </Alert>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Add / Edit Form Field Dialog */}
      <Dialog
        open={addFieldModalOpen}
        onClose={() => setAddFieldModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              overflow: 'hidden',
            },
          },
        }}
      >
        {/* Attractive Dialog Header */}
        <DialogTitle
          sx={{
            p: 2.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f1f5f9',
            backgroundColor: '#ffffff',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                backgroundColor: 'rgba(183, 3, 2, 0.08)',
                color: THEME_COLOR,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DynamicForm sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: '"SF Pro Display", sans-serif',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#0f172a',
                  lineHeight: 1.25,
                }}
              >
                {editingField ? 'Edit Question Field' : 'Add Dynamic Question Field'}
              </Typography>
              <Typography sx={{ fontSize: '13px', color: '#64748b', mt: 0.25 }}>
                Configure question prompt, response format, and clinical guidance
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={() => setAddFieldModalOpen(false)}
            size="small"
            sx={{
              color: '#94a3b8',
              borderRadius: '9999px',
              '&:hover': { backgroundColor: '#f1f5f9', color: '#0f172a' },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, p: 3 }}>
          {errorMsg && (
            <Alert severity="error" sx={{ borderRadius: '10px' }}>
              {errorMsg}
            </Alert>
          )}

          {/* Field Question / Label */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                Field Question / Clinical Prompt{' '}
                <Box component="span" sx={{ color: THEME_COLOR, fontWeight: 700 }}>
                  *
                </Box>
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#94a3b8' }}>Visible to patient</Typography>
            </Box>
            <TextField
              fullWidth
              placeholder="e.g. Do you have prior diagnostic reports or imaging?"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <HelpOutlined sx={{ color: '#94a3b8', fontSize: 20, mr: 1 }} />,
                },
              }}
            />
          </Box>

          {/* Response Format & Mandatory Requirement in balanced grid */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', mb: 0.75 }}>
                Field Input Type
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value as FormFieldType)}
                >
                  <MenuItem value="text">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ShortText sx={{ fontSize: 18, color: '#64748b' }} />
                      <Typography sx={{ fontSize: '14px' }}>Short Text (Single line)</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="textarea">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Subject sx={{ fontSize: 18, color: '#64748b' }} />
                      <Typography sx={{ fontSize: '14px' }}>Long Text (Paragraph)</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="number">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Numbers sx={{ fontSize: 18, color: '#64748b' }} />
                      <Typography sx={{ fontSize: '14px' }}>Number Input</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="select">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FormatListBulleted sx={{ fontSize: 18, color: '#64748b' }} />
                      <Typography sx={{ fontSize: '14px' }}>Dropdown Menu Select</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="radio">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <RadioButtonChecked sx={{ fontSize: 18, color: '#64748b' }} />
                      <Typography sx={{ fontSize: '14px' }}>Radio Choice (Single)</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="checkbox">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckBoxOutlined sx={{ fontSize: 18, color: '#64748b' }} />
                      <Typography sx={{ fontSize: '14px' }}>Checkbox (Acknowledge)</Typography>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', mb: 0.75 }}>
                Requirement Status
              </Typography>
              <Box
                sx={{
                  p: 1.25,
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: required ? 'rgba(183, 3, 2, 0.3)' : '#e2e8f0',
                  backgroundColor: required ? 'rgba(183, 3, 2, 0.04)' : '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '46px',
                  transition: 'all 0.2s ease',
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}>
                    Mandatory / Required
                  </Typography>
                  <Typography sx={{ fontSize: '11px', color: required ? THEME_COLOR : '#64748b', fontWeight: 500 }}>
                    {required ? 'Patient response required' : 'Optional for patient'}
                  </Typography>
                </Box>
                <Switch
                  checked={required}
                  onChange={(e) => setRequired(e.target.checked)}
                  color="error"
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>

          {/* Options for Select or Radio */}
          {(type === 'select' || type === 'radio') && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                  Options List (Comma-separated){' '}
                  <Box component="span" sx={{ color: THEME_COLOR, fontWeight: 700 }}>
                    *
                  </Box>
                </Typography>
                <Typography sx={{ fontSize: '12px', color: '#64748b' }}>Separate by comma</Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="e.g. Yes - Available, No - Needs Test, Not Sure"
                value={optionsStr}
                onChange={(e) => setOptionsStr(e.target.value)}
                helperText="Provide each selectable choice separated by a comma"
              />
              {/* Option Chips Live Preview */}
              {optionsStr.trim() && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
                  {optionsStr
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((opt, idx) => (
                      <Chip
                        key={idx}
                        label={opt}
                        size="small"
                        sx={{
                          backgroundColor: '#f1f5f9',
                          color: '#334155',
                          fontWeight: 500,
                          fontSize: '12px',
                        }}
                      />
                    ))}
                </Box>
              )}
            </Box>
          )}

          {/* Placeholder Text */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                Placeholder Text (Optional)
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#94a3b8' }}>Input hint</Typography>
            </Box>
            <TextField
              fullWidth
              placeholder="e.g. Briefly describe symptoms or findings..."
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
            />
          </Box>

          {/* Helper Subtext / Clinical Instruction */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                Helper Subtext / Clinical Instruction (Optional)
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#94a3b8' }}>Guidance note</Typography>
            </Box>
            <TextField
              fullWidth
              placeholder="e.g. Bring previous ultrasound or lab sheet if done"
              value={helperText}
              onChange={(e) => setHelperText(e.target.value)}
            />
          </Box>

          {/* Interactive Live Preview Box */}
          <Box
            sx={{
              p: 2,
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              border: '1.5px dashed #cbd5e1',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
              <Preview sx={{ fontSize: 16, color: '#64748b' }} />
              <Typography
                sx={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Live Patient View Preview
              </Typography>
            </Box>
            <Box sx={{ backgroundColor: '#ffffff', p: 2, borderRadius: '9999px', border: '1px solid #e2e8f0' }}>
              <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a', mb: 0.5 }}>
                {label || 'Sample Question Label'}
                {required && (
                  <Box component="span" sx={{ color: THEME_COLOR, ml: 0.5 }}>
                    *
                  </Box>
                )}
              </Typography>
              {type === 'text' && (
                <TextField
                  fullWidth
                  size="small"
                  disabled
                  placeholder={placeholder || 'Patient enters short response...'}
                  helperText={helperText || undefined}
                />
              )}
              {type === 'textarea' && (
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  disabled
                  placeholder={placeholder || 'Patient enters detailed response...'}
                  helperText={helperText || undefined}
                />
              )}
              {type === 'number' && (
                <TextField
                  fullWidth
                  size="small"
                  disabled
                  placeholder={placeholder || '0'}
                  helperText={helperText || undefined}
                />
              )}
              {type === 'select' && (
                <FormControl fullWidth size="small" disabled>
                  <Select value="" displayEmpty>
                    <MenuItem value="">
                      <em>{placeholder || 'Select choice...'}</em>
                    </MenuItem>
                  </Select>
                </FormControl>
              )}
              {type === 'radio' && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControlLabel control={<Radio size="small" disabled />} label="Option 1" />
                  <FormControlLabel control={<Radio size="small" disabled />} label="Option 2" />
                </Box>
              )}
              {type === 'checkbox' && (
                <FormControlLabel
                  control={<Checkbox size="small" disabled />}
                  label={placeholder || 'I acknowledge and confirm this clinical item'}
                />
              )}
              {helperText && (
                <Typography sx={{ fontSize: '11px', color: '#64748b', mt: 0.5 }}>
                  {helperText}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2.5,
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1.5,
          }}
        >
          <Button
            onClick={() => setAddFieldModalOpen(false)}
            variant="outlined"
            sx={{
              color: '#475569',
              borderColor: '#cbd5e1',
              borderRadius: '9999px',
              px: 2.5,
              py: 1,
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
            onClick={handleSaveField}
            sx={{
              backgroundColor: THEME_COLOR,
              color: '#ffffff',
              fontWeight: 600,
              borderRadius: '9999px',
              px: 3,
              py: 1,
              boxShadow: '0 4px 12px rgba(183, 3, 2, 0.25)',
              '&:hover': {
                backgroundColor: '#900201',
                boxShadow: '0 6px 16px rgba(183, 3, 2, 0.35)',
              },
            }}
          >
            {editingField ? 'Save Changes' : 'Add Question to Form'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

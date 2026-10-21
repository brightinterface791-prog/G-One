import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Theme Primary color specified by user: #b70302
export const THEME_COLOR = '#b70302';

const FONT_DISPLAY = '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const FONT_TEXT = '"Inter", "SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

let theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: THEME_COLOR,
      light: '#df3837',
      dark: '#820000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0e7490', // Deep healthcare cyan/teal
      light: '#38bdf8',
      dark: '#155e75',
      contrastText: '#ffffff',
    },
    error: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#991b1b',
    },
    warning: {
      main: '#d97706',
      light: '#f59e0b',
      dark: '#b45309',
    },
    info: {
      main: '#0284c7',
      light: '#38bdf8',
      dark: '#0369a1',
    },
    success: {
      main: '#16a34a',
      light: '#22c55e',
      dark: '#15803d',
    },
    background: {
      default: '#faf7f6',
      paper: '#ffffff',
    },
    text: {
      primary: '#262123',
      secondary: '#756d70',
      disabled: '#94a3b8',
    },
    divider: '#f0e4e2',
  },
  typography: {
    fontFamily: FONT_TEXT,
    // Large heading: SF Pro Display, 48–64px, 600
    h1: {
      fontFamily: FONT_DISPLAY,
      fontSize: '42px',
      fontWeight: 600,
      lineHeight: 1.15,
      letterSpacing: '-0.025em',
      color: '#0f172a',
    },
    // Section heading: 32–40px, 600
    h2: {
      fontFamily: FONT_DISPLAY,
      fontSize: '30px',
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
      color: '#0f172a',
    },
    h3: {
      fontFamily: FONT_DISPLAY,
      fontSize: '26px',
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: '-0.015em',
      color: '#0f172a',
    },
    // Subheading: 20–24px, 500
    h4: {
      fontFamily: FONT_DISPLAY,
      fontSize: '15px',
      fontWeight: 500,
      lineHeight: 1.35,
      letterSpacing: '-0.01em',
      color: '#0f172a',
    },
    h5: {
      fontFamily: FONT_DISPLAY,
      fontSize: '19px',
      fontWeight: 500,
      lineHeight: 1.4,
      color: '#0f172a',
    },
    h6: {
      fontFamily: FONT_DISPLAY,
      fontSize: '15px',
      fontWeight: 500,
      lineHeight: 1.4,
      color: '#0f172a',
    },
    subtitle1: {
      fontFamily: FONT_DISPLAY,
      fontSize: '15px',
      fontWeight: 500,
      lineHeight: 1.45,
      color: '#334155',
    },
    subtitle2: {
      fontFamily: FONT_DISPLAY,
      fontSize: '15px',
      fontWeight: 500,
      lineHeight: 1.45,
      color: '#334155',
    },
    // Body: 16–18px, 400
    body1: {
      fontFamily: FONT_TEXT,
      fontSize: '15px',
      fontWeight: 400,
      lineHeight: 1.6,
      color: '#334155',
    },
    body2: {
      fontFamily: FONT_TEXT,
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.55,
      color: '#475569',
    },
    // Button: 16–17px, 500
    button: {
      fontFamily: FONT_DISPLAY,
      fontSize: '14px',
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '-0.01em',
    },
    // Small/helper text: 13–14px
    caption: {
      fontFamily: FONT_TEXT,
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.45,
      color: '#64748b',
    },
    overline: {
      fontFamily: FONT_TEXT,
      fontSize: '13px',
      fontWeight: 500,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontFamily: FONT_TEXT,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        body: {
          fontFamily: FONT_TEXT,
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: 1.55,
          color: '#0f172a',
        },
        'input, textarea, select': {
          fontFamily: `${FONT_TEXT} !important`,
          fontSize: '16px !important',
          fontWeight: '400 !important',
        },
        '::placeholder': {
          fontFamily: `${FONT_TEXT} !important`,
          fontSize: '16px !important',
          fontWeight: '400 !important',
          color: '#94a3b8 !important',
          opacity: '1 !important',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: FONT_DISPLAY,
          fontSize: '16px',
          fontWeight: 500,
          borderRadius: 8,
          padding: '9px 18px',
          boxShadow: 'none',
          textTransform: 'none',
          letterSpacing: '-0.01em',
          transition: 'all 0.15s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(183, 3, 2, 0.16)',
          },
        },
        contained: {
          backgroundColor: THEME_COLOR,
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#900201',
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: '#cbd5e1',
          color: '#1e293b',
          '&:hover': {
            borderColor: THEME_COLOR,
            backgroundColor: 'rgba(183, 3, 2, 0.04)',
            color: THEME_COLOR,
          },
        },
        sizeSmall: {
          fontSize: '15px',
          padding: '5px 13px',
          borderRadius: 6,
        },
        sizeLarge: {
          fontSize: '17px',
          padding: '12px 24px',
          borderRadius: 8,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: FONT_TEXT,
          fontSize: '16px',
          fontWeight: 400,
          color: '#0f172a',
        },
        input: {
          fontFamily: FONT_TEXT,
          fontSize: '16px',
          fontWeight: 400,
          '&::placeholder': {
            fontFamily: FONT_TEXT,
            fontSize: '16px',
            fontWeight: 400,
            color: '#94a3b8',
            opacity: 1,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
        InputLabelProps: { shrink: true },
      },
      styleOverrides: {
        root: {
          minWidth: 0,
          // Reserve equal label space so adjacent search, select and text fields align.
          paddingTop: 24,
          '& .MuiInputLabel-root': {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: 'none',
            maxWidth: '100%',
            fontSize: '13px',
            fontWeight: 500,
            lineHeight: '18px',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: '16px',
          fontWeight: 400,
          minHeight: 48,
          backgroundColor: '#ffffff',
          '&.Mui-disabled': { backgroundColor: '#f7f5f4' },
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          '& fieldset': {
            borderColor: '#e8dddc',
            borderWidth: '1px',
          },
          '&:hover fieldset': {
            borderColor: '#94a3b8',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#64748b',
            borderWidth: '1.5px',
          },
          '&.Mui-focused': {
            boxShadow: '0 0 0 4px rgba(100, 116, 139, 0.10)',
          },
          '&.Mui-error fieldset': {
            borderColor: '#dc2626',
          },
          '&.Mui-error.Mui-focused': {
            boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.12)',
          },
        },
        input: {
          fontFamily: FONT_TEXT,
          fontSize: '16px',
          fontWeight: 400,
          padding: '11px 14px',
          '&::placeholder': {
            fontFamily: FONT_TEXT,
            fontSize: '16px',
            fontWeight: 400,
            color: '#94a3b8',
            opacity: 1,
          },
        },
        sizeSmall: {
          '& .MuiOutlinedInput-input': {
            padding: '9px 13px',
          },
        },
        multiline: {
          padding: '11px 14px',
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: 1.5,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: FONT_TEXT,
          fontSize: '13px',
          fontWeight: 500,
          color: '#64748b',
          '&.Mui-focused': { color: '#475569' },
          '&.Mui-error': { color: '#dc2626' },
        },
        shrink: {
          fontSize: '13px',
          fontWeight: 500,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontFamily: FONT_TEXT,
          fontSize: '13.5px',
          fontWeight: 400,
          color: '#64748b',
          marginTop: '4px',
          '&.Mui-error': {
            color: '#dc2626',
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontFamily: FONT_DISPLAY,
          fontSize: '14px',
          fontWeight: 500,
          color: '#334155',
          marginBottom: '4px',
          '&.Mui-focused': {
            color: THEME_COLOR,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: '16px',
          fontWeight: 400,
          backgroundColor: '#ffffff',
        },
        select: {
          fontFamily: FONT_TEXT,
          fontSize: '16px',
          fontWeight: 400,
          padding: '11px 14px',
          display: 'flex',
          alignItems: 'center',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: FONT_TEXT,
          fontSize: '16px',
          fontWeight: 400,
          padding: '10px 16px',
          borderRadius: 6,
          margin: '2px 4px',
          '&:hover': {
            backgroundColor: '#f8fafc',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(183, 3, 2, 0.08)',
            color: THEME_COLOR,
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'rgba(183, 3, 2, 0.12)',
            },
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#94a3b8',
          padding: '7px',
          '&.Mui-checked': {
            color: THEME_COLOR,
          },
          '&:hover': {
            backgroundColor: 'rgba(183, 3, 2, 0.05)',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#94a3b8',
          borderRadius: 5,
          padding: '7px',
          '&.Mui-checked': {
            color: THEME_COLOR,
          },
          '&:hover': {
            backgroundColor: 'rgba(183, 3, 2, 0.05)',
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontFamily: FONT_TEXT,
          fontSize: '16px',
          fontWeight: 400,
          color: '#1e293b',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: THEME_COLOR,
            '& + .MuiSwitch-track': {
              backgroundColor: THEME_COLOR,
              opacity: 0.7,
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#ffffff',
          boxShadow: '0 6px 24px rgba(64, 28, 28, 0.045)',
          border: '1px solid #f0e4e2',
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: FONT_TEXT,
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(226, 232, 240, 0.8)',
          overflow: 'hidden',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: FONT_DISPLAY,
          fontSize: '20px',
          fontWeight: 600,
          color: '#0f172a',
          padding: '20px 24px 18px',
          borderBottom: '1px solid #f1f5f9',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '24px !important',
          color: '#334155',
          fontFamily: FONT_TEXT,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #f1f5f9',
          gap: '12px',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;

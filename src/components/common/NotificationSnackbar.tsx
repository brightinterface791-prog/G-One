import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface NotificationSnackbarProps {
  open: boolean;
  message: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
  onClose: () => void;
}

export const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({
  open,
  message,
  severity = 'success',
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%', fontWeight: 600, borderRadius: 2 }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

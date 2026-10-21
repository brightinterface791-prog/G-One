import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Refresh, LocalHospital } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught component error:', error, errorInfo);
  }

  public handleReset = () => {
    window.location.hash = '';
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '14px',
                backgroundColor: '#b70302',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                mx: 'auto',
                mb: 2,
              }}
            >
              <LocalHospital sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
              G-One Health Care
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
              The application encountered a temporary view state issue. Click below to return to the Home page.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Refresh />}
              onClick={this.handleReset}
              sx={{ py: 1, px: 3, fontWeight: 700, borderRadius: 2 }}
            >
              Reload Home Page
            </Button>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

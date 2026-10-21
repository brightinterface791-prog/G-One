import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { Shield, Circle } from '@mui/icons-material';
import { THEME_COLOR } from '../../theme/theme';

export const PanelFooter: React.FC = () => {
  return (
    <Box
      id="panel-single-row-footer"
      component="footer"
      sx={{
        height: 46,
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        px: { xs: 2, sm: 3, md: 4 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        overflowX: 'auto',
        fontSize: '0.78rem',
        color: '#64748b',
        zIndex: 100,
      }}
    >
      {/* Left: Copyright */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
          © 2026 <strong>G-One Health Hospital</strong> Admin & Clinical Management System.
        </Typography>
      </Box>

      {/* Center: System Status Indicator */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: 0.8,
          flexShrink: 0,
        }}
      >
        <Circle sx={{ fontSize: 8, color: '#16a34a' }} />
        <Typography variant="caption" sx={{ color: '#15803d', fontWeight: 700 }}>
          HIPAA & HL7 Secure
        </Typography>
        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
          •
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
          Clinical Server v2.4.0 (Live)
        </Typography>
      </Box>

      {/* Right: Support Contact */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
          Clinical Helpdesk: <span style={{ color: THEME_COLOR, fontWeight: 700 }}>+1 (800) 466-3432</span>
        </Typography>
      </Box>
    </Box>
  );
};

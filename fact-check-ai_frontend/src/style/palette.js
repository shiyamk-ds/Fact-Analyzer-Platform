import { extendTheme } from '@mui/joy';

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        // Primary - Truth blue - for main actions and verification elements
        primary: {
          50: '#edf8ff',
          100: '#d6edff',
          200: '#b0dcff',
          300: '#7ac5ff',
          400: '#3ea5ff',
          500: '#1a85ff',
          600: '#0067e6',
          700: '#0051ba',
          800: '#004298',
          900: '#00397e',
        },
        // Secondary - Critical purple - for analysis features
        secondary: {
          50: '#f5f3ff',
          100: '#ede8ff',
          200: '#dbd0ff',
          300: '#c3abff',
          400: '#a57cff',
          500: '#8a4eff',
          600: '#7a2df7',
          700: '#6c1fe4',
          800: '#591db8',
          900: '#481c94',
        },
        // Success - Verified green - for confirmed true content
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Warning - Caution amber - for potentially misleading content
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Danger - Misinformation red - for confirmed false content
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Neutral - Editorial gray - for content and UI elements
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // Special insight color - for investigation elements
        insight: {
          50: '#f0f7ff',
          100: '#e0eeff',
          200: '#c1d9ff',
          300: '#96beff',
          400: '#6c9cff',
          500: '#4d74fc',
          600: '#3b54f3',
          700: '#3342de',
          800: '#2b35b1',
          900: '#27318c',
        },
        // Background for light mode
        background: {
          body: '#f8fafc',
          surface: '#ffffff',
          level1: '#f1f5f9',
          level2: '#e2e8f0',
          level3: '#cbd5e1',
          tooltip: '#27272a',
        },
      },
    },
    dark: {
      palette: {
        // Primary - Truth blue - for main actions and verification elements
        primary: {
          50: '#e6f1ff',
          100: '#c0d8ff',
          200: '#93b8ff',
          300: '#6098ff',
          400: '#4080ff',
          500: '#3366ff',
          600: '#2e5ce6',
          700: '#2047b9',
          800: '#193894',
          900: '#142c70',
        },
        // Secondary - Critical purple - for analysis features
        secondary: {
          50: '#f5f3ff',
          100: '#ede9ff',
          200: '#d5caff',
          300: '#b49dff',
          400: '#9370ff',
          500: '#7c4dff',
          600: '#6e32e4',
          700: '#5a1dbf',
          800: '#4a1ba0',
          900: '#3d1a82',
        },
        // Success - Verified green - for confirmed true content
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Warning - Caution amber - for potentially misleading content
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Danger - Misinformation red - for confirmed false content
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Neutral - Editorial gray - for content and UI elements
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // Special insight color - for investigation elements
        insight: {
          50: '#f0f7ff',
          100: '#e0eeff',
          200: '#c1d9ff',
          300: '#96beff',
          400: '#6c9cff',
          500: '#4d74fc',
          600: '#3b54f3',
          700: '#3342de',
          800: '#2b35b1',
          900: '#27318c',
        },
        // Background for dark mode
        background: {
          body: '#0f172a',
          surface: '#1e293b',
          level1: '#293548',
          level2: '#334155',
          level3: '#475569',
          tooltip: '#f8fafc',
        },
      },
    },
  },
  components: {
    // Alert styling
    JoyAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          borderRadius: '8px',
          ...(ownerState.color === 'success' && {
            backgroundColor: 'var(--joy-palette-success-100)',
            color: 'var(--joy-palette-success-700)',
          }),
          ...(ownerState.color === 'danger' && {
            backgroundColor: 'var(--joy-palette-danger-100)',
            color: 'var(--joy-palette-danger-700)',
          }),
          ...(ownerState.color === 'warning' && {
            backgroundColor: 'var(--joy-palette-warning-100)',
            color: 'var(--joy-palette-warning-700)',
          }),
          ...(ownerState.color === 'primary' && {
            backgroundColor: 'var(--joy-palette-primary-100)',
            color: 'var(--joy-palette-primary-700)',
          }),
        }),
      },
    },
    // Snackbar styling
    JoySnackbar: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          backgroundColor: 'var(--joy-palette-neutral-800)',
          color: 'var(--joy-palette-neutral-50)',
        },
      },
    },
    // Button styling
    JoyButton: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          borderRadius: '8px',
          fontWeight: 600,
          transition: 'all 0.2s ease',
          ...(ownerState.size === 'md' && {
            padding: '8px 16px',
          }),
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
          },
          ...(ownerState.variant === 'solid' && {
            '&:active': {
              transform: 'translateY(0)',
              boxShadow: 'none',
            },
          }),
          // Special styles for "verify" buttons
          ...(ownerState.color === 'success' && {
            '&:hover': {
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
            },
          }),
          // Special styles for "flag" buttons
          ...(ownerState.color === 'danger' && {
            '&:hover': {
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
            },
          }),
        }),
      },
      defaultProps: {
        disableRipple: true,
      },
    },
    // Input styling
    JoyInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          transition: 'all 0.2s',
          '&:focus-within': {
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15)',
          },
        },
      },
    },
    // Form control styling
    JoyFormControl: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
        },
      },
    },
    // Sheet (Card) styling
    JoySheet: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          borderRadius: '12px',
          boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          ...(ownerState.variant === 'outlined' && {
            borderWidth: '1px',
          }),
          // News article card
          ...(ownerState.variant === 'outlined' && ownerState.className === 'article-card' && {
            '&:hover': {
              boxShadow: theme.vars.shadow.md,
              transform: 'translateY(-3px)',
            },
          }),
          // Analysis card
          ...(ownerState.variant === 'soft' && ownerState.className === 'analysis-card' && {
            borderLeft: `4px solid ${theme.vars.palette.primary[500]}`,
          }),
          // Warning card
          ...(ownerState.variant === 'soft' && ownerState.className === 'warning-card' && {
            borderLeft: `4px solid ${theme.vars.palette.warning[500]}`,
          }),
          // Fact-check card
          ...(ownerState.variant === 'soft' && ownerState.className === 'factcheck-card' && {
            borderLeft: `4px solid ${theme.vars.palette.secondary[500]}`,
          }),
        }),
      },
    },
    // Typography styling
    JoyTypography: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          // Main headline
          ...(ownerState.level === 'h1' && {
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            marginBottom: '1rem',
          }),
          // Section headline
          ...(ownerState.level === 'h2' && {
            fontSize: '2rem',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            marginBottom: '0.75rem',
          }),
          // Article title
          ...(ownerState.level === 'h3' && {
            fontSize: '1.5rem',
            fontWeight: 700,
            letterSpacing: '-0.015em',
            marginBottom: '0.5rem',
          }),
          // Card title
          ...(ownerState.level === 'h4' && {
            fontSize: '1.25rem',
            fontWeight: 600,
            marginBottom: '0.375rem',
          }),
          // Content heading
          ...(ownerState.level === 'h5' && {
            fontSize: '1.125rem',
            fontWeight: 600,
            marginBottom: '0.25rem',
          }),
          // Body text
          ...(ownerState.level === 'body1' && {
            fontSize: '1rem',
            lineHeight: 1.6,
            marginBottom: '1rem',
          }),
          // Secondary text
          ...(ownerState.level === 'body2' && {
            fontSize: '0.875rem',
            lineHeight: 1.5,
            color: theme.vars.palette.neutral[600],
          }),
          // Attribution/source text
          ...(ownerState.level === 'body3' && {
            fontSize: '0.75rem',
            color: theme.vars.palette.neutral[500],
          }),
          // Special - Truth rating
          ...(ownerState.className === 'truth-rating-high' && {
            color: theme.vars.palette.success[600],
            fontWeight: 700,
          }),
          ...(ownerState.className === 'truth-rating-medium' && {
            color: theme.vars.palette.warning[600],
            fontWeight: 700,
          }),
          ...(ownerState.className === 'truth-rating-low' && {
            color: theme.vars.palette.danger[600],
            fontWeight: 700,
          }),
        }),
      },
    },
    // Chip styling for tags
    JoyChip: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          borderRadius: '6px',
          fontWeight: 500,
          // Source reliability indicators
          ...(ownerState.className === 'source-reliable' && {
            backgroundColor: theme.vars.palette.success[100],
            color: theme.vars.palette.success[700],
          }),
          ...(ownerState.className === 'source-questionable' && {
            backgroundColor: theme.vars.palette.warning[100],
            color: theme.vars.palette.warning[700],
          }),
          ...(ownerState.className === 'source-unreliable' && {
            backgroundColor: theme.vars.palette.danger[100],
            color: theme.vars.palette.danger[700],
          }),
          // Topic tags
          ...(ownerState.className === 'topic-tag' && {
            backgroundColor: theme.vars.palette.primary[100],
            color: theme.vars.palette.primary[700],
          }),
        }),
      },
    },
    // Divider styling
    JoyDivider: {
      styleOverrides: {
        root: {
          marginTop: '1.5rem',
          marginBottom: '1.5rem',
        },
      },
    },
    // Select styling
    JoySelect: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    // Circular Progress styling
    JoyCircularProgress: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.size === 'sm' && {
            '--CircularProgress-size': '24px',
            '--CircularProgress-trackThickness': '2px',
            '--CircularProgress-progressThickness': '2px',
          }),
        }),
      },
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
  },
  shadow: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
});

export default theme;
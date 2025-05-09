import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

// Crea un tema personalizado
const theme = createTheme({
    palette: {
        primary: {
            main: '#1e3a8a', // azul oscuro
            light: '#4364b8',
            dark: '#14275d',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ff6600', // naranja
            light: '#ff8533',
            dark: '#cc5200',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 700,
        },
        h3: {
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
                containedPrimary: {
                    boxShadow: '0 4px 6px rgba(30, 58, 138, 0.2)',
                },
                containedSecondary: {
                    boxShadow: '0 4px 6px rgba(255, 102, 0, 0.2)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                },
            },
        },
    },
});

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>
);

reportWebVitals();
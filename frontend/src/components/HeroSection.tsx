// frontend/src/components/HeroSection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Container,
} from '@mui/material';

const HeroSection = () => {
    const navigate = useNavigate();

    const handleBrowseMovies = () => {
        // Navegar a la sección de películas o desplazarse suavemente si ya estamos en la página principal
        const moviesSection = document.getElementById('peliculas');
        if (moviesSection) {
            moviesSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/#peliculas');
        }
    };

    return (
        <Box
            sx={{
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop")',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                color: 'white',
                textAlign: 'center',
                py: { xs: 6, md: 12 },
            }}
        >
            <Container maxWidth="xl">
                <Typography
                    variant="h2"
                    component="h1"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                        fontSize: { xs: '2rem', md: '3rem' },
                        mb: 3
                    }}
                >
                    CineReservas
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        maxWidth: '800px',
                        mx: 'auto',
                        mb: 4,
                        fontSize: { xs: '1rem', md: '1.25rem' }
                    }}
                >
                    Reserva tus entradas para las mejores películas de forma rápida y sencilla.
                    Selecciona tu función, elige tus asientos y disfruta del mejor cine.
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={handleBrowseMovies}
                    sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: '50px',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: (theme) => theme.shadows[4],
                        },
                        transition: 'all 0.3s',
                    }}
                >
                    Ver Cartelera
                </Button>
            </Container>
        </Box>
    );
};

export default HeroSection;
// frontend/src/components/HeroSection.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Container,
    Fade,
    useTheme,
    alpha,
} from '@mui/material';
import AvailableFunctions from './AvailableFunctions';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';

// Array de imágenes de fondo para el slider
const backgroundImages = [
    'https://images.unsplash.com/photo-1485095329183-d0797cdc5676?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2250&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=2079&auto=format&fit=crop',
];

const HeroSection = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [fadeIn, setFadeIn] = useState(true);

    // Efecto para cambiar la imagen de fondo cada 5 segundos
    useEffect(() => {
        const intervalId = setInterval(() => {
            setFadeIn(false);
            setTimeout(() => {
                setCurrentImageIndex((prevIndex) =>
                    prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
                );
                setFadeIn(true);
            }, 500); // Esperar a que termine el fade-out
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

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
        <>
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: { xs: '70vh', md: '85vh' },
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white',
                }}
            >
                {/* Fondo con efecto de parallax y overlay */}
                <Fade in={fadeIn} timeout={1000}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: `linear-gradient(to bottom, ${alpha(theme.palette.common.black, 0.8)}, ${alpha(theme.palette.common.black, 0.6)}), url(${backgroundImages[currentImageIndex]})`,
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundAttachment: 'fixed',
                            zIndex: -1,
                            transition: 'transform 8s ease-out',
                            transform: 'scale(1.1)',
                        }}
                    />
                </Fade>

                {/* Contenido principal */}
                <Container maxWidth="xl">
                    <Box
                        sx={{
                            maxWidth: { xs: '100%', md: '60%' },
                            mb: { xs: 8, md: 0 },
                            position: 'relative',
                            zIndex: 2,
                        }}
                    >
                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <LocalMoviesIcon sx={{ fontSize: { xs: 40, md: 50 }, mr: 2, color: theme.palette.secondary.main }} />
                            <Typography
                                variant="h1"
                                component="h1"
                                fontWeight="900"
                                sx={{
                                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                CineReservas
                            </Typography>
                        </Box>

                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 400,
                                mb: 4,
                                textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
                                maxWidth: '800px',
                                lineHeight: 1.5,
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
                                fontSize: '1.1rem',
                                boxShadow: '0 8px 16px rgba(255, 102, 0, 0.3)',
                                '&:hover': {
                                    transform: 'translateY(-3px) scale(1.05)',
                                    boxShadow: '0 12px 20px rgba(255, 102, 0, 0.4)',
                                },
                                transition: 'all 0.3s',
                            }}
                        >
                            Ver Cartelera
                        </Button>
                    </Box>
                </Container>

                {/* Efecto de overlay en la parte inferior para transición suave */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '100px',
                        background: 'linear-gradient(to top, rgba(248, 250, 252, 1), rgba(248, 250, 252, 0))',
                        zIndex: 1,
                    }}
                />
            </Box>

            {/* Sección de Funciones Disponibles con efecto de elevación */}
            <Container
                maxWidth="xl"
                sx={{
                    mt: { xs: -6, md: -8 },
                    mb: 6,
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                <Box
                    sx={{
                        transform: 'translateY(0)',
                        transition: 'transform 0.5s',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                        },
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                        borderRadius: theme.shape.borderRadius,
                    }}
                >
                    <AvailableFunctions />
                </Box>
            </Container>
        </>
    );
};

export default HeroSection;
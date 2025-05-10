// frontend/src/components/MovieList.tsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid as MuiGrid,
    CircularProgress
} from '@mui/material';
import MovieCard from './MovieCard';
import { useReservation } from '../context/ReservationContext';

// Crear un componente Grid personalizado para evitar errores de tipado
const Grid = (props: any) => <MuiGrid {...props} />;

const movieDirectors: Record<string, string> = {
    'Aventuras Cósmicas': 'Ana Martínez',
    'El Misterio del Bosque': 'Carlos López',
    'Amor en París': 'María González',
    'Superhéroes Unidos': 'Roberto Sánchez',
    'Risas Aseguradas': 'Laura Rodríguez',
    'Terror en la Oscuridad': 'Daniel Murillo',
    'Mundos Paralelos': 'Gabriela Torres',
    'El Código Secreto': 'Pablo Moreno',
    'Fantasía Medieval': 'Elena Castro',
    'La Gran Aventura': 'Luis Ramírez',
    'Lazos Eternos': 'Marina Suárez',
    'Melodías del Corazón': 'Alejandro Méndez'
};

const MovieList = () => {
    const { movies, fetchMovies } = useReservation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMovies = async () => {
            setLoading(true);
            await fetchMovies();
            setLoading(false);
        };

        loadMovies();
    }, [fetchMovies]);

    return (
        <Box
            sx={{
                py: 6,
                bgcolor: 'background.default'
            }}
            id="peliculas"
        >
            <Container maxWidth="xl">
                <Typography
                    variant="h3"
                    component="h2"
                    color="primary"
                    gutterBottom
                    sx={{
                        position: 'relative',
                        display: 'inline-block',
                        fontWeight: 'bold',
                        mb: 4,
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            width: '50%',
                            height: '4px',
                            bottom: '-10px',
                            left: 0,
                            bgcolor: 'secondary.main',
                        }
                    }}
                >
                    Películas en Cartelera
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {movies.map((movie) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                key={movie.id}
                            >
                                <MovieCard
                                    id={movie.id}
                                    title={movie.name}
                                    duration={`${movie.lengthMinutes} minutos`}
                                    genre={movie.genre}
                                    director={movieDirectors[movie.name] || 'Director'}
                                    image={`/api/placeholder/400/300`}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default MovieList;
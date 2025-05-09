import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid as MuiGrid,
} from '@mui/material';
import MovieCard from './MovieCard';

// Crear un componente Grid personalizado para evitar errores de tipado
const Grid = (props: any) => <MuiGrid {...props} />;

// Datos de muestra para películas
const movies = [
    {
        id: 1,
        title: 'Aventuras Cósmicas',
        duration: '120 minutos',
        genre: 'Ciencia Ficción',
        director: 'Ana Martínez',
        image: '/api/placeholder/400/300'
    },
    {
        id: 2,
        title: 'El Misterio del Bosque',
        duration: '95 minutos',
        genre: 'Suspense',
        director: 'Carlos López',
        image: '/api/placeholder/400/300'
    },
    {
        id: 3,
        title: 'Amor en París',
        duration: '110 minutos',
        genre: 'Romance',
        director: 'María González',
        image: '/api/placeholder/400/300'
    },
    {
        id: 4,
        title: 'Superhéroes Unidos',
        duration: '140 minutos',
        genre: 'Acción',
        director: 'Roberto Sánchez',
        image: '/api/placeholder/400/300'
    },
    {
        id: 5,
        title: 'Risas Aseguradas',
        duration: '90 minutos',
        genre: 'Comedia',
        director: 'Laura Rodríguez',
        image: '/api/placeholder/400/300'
    },
    {
        id: 6,
        title: 'El Gran Tesoro',
        duration: '115 minutos',
        genre: 'Aventura',
        director: 'Daniel Pérez',
        image: '/api/placeholder/400/300'
    }
];

const MovieList = () => {
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

                <Grid container spacing={4}>
                    {movies.map((movie) => (
                        <Grid item xs={12} sm={6} md={4} key={movie.id}>
                            <MovieCard
                                title={movie.title}
                                duration={movie.duration}
                                genre={movie.genre}
                                director={movie.director}
                                image={movie.image}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default MovieList;
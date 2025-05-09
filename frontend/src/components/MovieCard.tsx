// frontend/src/components/MovieCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Box,
    Stack,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

interface MovieCardProps {
    id: number;
    title: string;
    duration: string;
    genre: string;
    director: string;
    image: string;
}

const MovieCard = ({ id, title, duration, genre, director, image }: MovieCardProps) => {
    const navigate = useNavigate();

    const handleReserveClick = () => {
        navigate(`/movie/${id}`);
    };

    // Mapa de imágenes según el género para proporcionar imágenes relevantes
    const genreImages: Record<string, string> = {
        'SCIENCE_FICTION': 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1200&h=400&auto=format&fit=crop', // Futurista
        'THRILLER': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&h=400&auto=format&fit=crop', // Suspenso
        'ROMANCE': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&h=400&auto=format&fit=crop', // Pareja
        'ACTION': 'https://images.unsplash.com/photo-1540224871915-bc8ffb782bdf?q=80&w=1200&h=400&auto=format&fit=crop', // Explosión
        'COMEDY': 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?q=80&w=1200&h=400&auto=format&fit=crop', // Risa
        'HORROR': 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1200&h=400&auto=format&fit=crop', // Oscuro
        'DRAMA': 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?q=80&w=1200&h=400&auto=format&fit=crop', // Teatro
        'FANTASY': 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?q=80&w=1200&h=400&auto=format&fit=crop', // Dragón
        'ADVENTURE': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&h=400&auto=format&fit=crop', // Montañas
    };

    // Determinar la imagen basada en el género, o usar una predeterminada
    const movieImage = genre && genreImages[genre] ? genreImages[genre] : image;

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: (theme) => theme.shadows[8],
                }
            }}
        >
            <CardMedia
                component="img"
                height="300"
                image={movieImage}
                alt={title}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                    {title}
                </Typography>
                <Stack spacing={1} sx={{ mb: 2 }}>
                    <Typography variant="body2"><strong>Duración:</strong> {duration}</Typography>
                    <Typography variant="body2"><strong>Género:</strong> {genre.replace('_', ' ')}</Typography>
                    <Typography variant="body2"><strong>Director:</strong> {director}</Typography>
                </Stack>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ConfirmationNumberIcon />}
                    fullWidth
                    onClick={handleReserveClick}
                >
                    Reservar
                </Button>
            </CardContent>
        </Card>
    );
};

export default MovieCard;
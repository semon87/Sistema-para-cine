import React from 'react';
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
    title: string;
    duration: string;
    genre: string;
    director: string;
    image: string;
}

const MovieCard = ({ title, duration, genre, director, image }: MovieCardProps) => {
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
                image={image || '/api/placeholder/400/300'}
                alt={title}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                    {title}
                </Typography>
                <Stack spacing={1} sx={{ mb: 2 }}>
                    <Typography variant="body2"><strong>Duración:</strong> {duration}</Typography>
                    <Typography variant="body2"><strong>Género:</strong> {genre}</Typography>
                    <Typography variant="body2"><strong>Director:</strong> {director}</Typography>
                </Stack>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ConfirmationNumberIcon />}
                    fullWidth
                >
                    Reservar
                </Button>
            </CardContent>
        </Card>
    );
};

export default MovieCard;
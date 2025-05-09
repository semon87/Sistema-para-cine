import React, { useState } from 'react';
import {
    Box,
    Container,
    Grid as MuiGrid,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Chip,
    Button,
    Divider,
    Stack,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';

// Crear un componente Grid personalizado para evitar errores de tipado
const Grid = (props: any) => <MuiGrid {...props} />;

// Simular la respuesta de la API
const movieData = {
    id: 1,
    title: "Aventuras Cósmicas",
    posterImage: "/api/placeholder/500/750",
    backdropImage: "/api/placeholder/1200/400",
    duration: 120,
    releaseDate: "2025-04-15",
    genre: "Ciencia Ficción",
    director: "Ana Martínez",
    cast: ["Carlos Hernández", "Laura García", "Miguel López", "Sofía Rodríguez"],
    synopsis: "En un futuro lejano, un grupo de exploradores debe viajar más allá de nuestra galaxia para descubrir si la humanidad tiene un futuro entre las estrellas. Mientras la Tierra se vuelve cada vez más inhabitable, el equipo enfrenta desafíos inimaginables en su misión para encontrar un nuevo hogar para la especie humana.",
    rating: 4.5,
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
};

// Simular horarios de funciones
const showtimes = [
    { id: 1, time: "14:30", room: "Sala 1 - Normal" },
    { id: 2, time: "17:00", room: "Sala 2 - 3D" },
    { id: 3, time: "19:30", room: "Sala 3 - VIP" },
    { id: 4, time: "22:00", room: "Sala 1 - Normal" },
];

const MovieDetail = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [quantity, setQuantity] = useState(1);

    const handleTimeSelection = (time: string, room: string) => {
        setSelectedTime(time);
        setSelectedRoom(room);
    };

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(parseInt(event.target.value));
    };

    return (
        <Box>
            {/* Banner de película */}
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: '200px', md: '400px' },
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${movieData.backdropImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    mb: 6
                }}
            >
                <Container maxWidth="xl" sx={{ height: '100%', position: 'relative' }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: { xs: '20px', md: '-80px' },
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: { xs: 'center', md: 'flex-end' },
                            width: '100%',
                            px: 2
                        }}
                    >
                        <Box
                            component="img"
                            src={movieData.posterImage}
                            alt={movieData.title}
                            sx={{
                                width: { xs: '150px', md: '230px' },
                                height: { xs: '225px', md: '345px' },
                                borderRadius: 2,
                                boxShadow: 3,
                                mb: { xs: 2, md: 0 },
                                mr: { md: 4 }
                            }}
                        />
                        <Box
                            sx={{
                                color: 'white',
                                textAlign: { xs: 'center', md: 'left' },
                            }}
                        >
                            <Typography
                                variant="h3"
                                component="h1"
                                fontWeight="bold"
                                sx={{
                                    textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
                                    fontSize: { xs: '1.75rem', md: '2.5rem' }
                                }}
                            >
                                {movieData.title}
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                justifyContent={{ xs: 'center', md: 'flex-start' }}
                                sx={{ my: 2 }}
                            >
                                <Chip
                                    label={movieData.genre}
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        fontWeight: 'medium'
                                    }}
                                    size="small"
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    <Typography variant="body2">
                                        {movieData.duration} minutos
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarMonthIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    <Typography variant="body2">
                                        {new Date(movieData.releaseDate).toLocaleDateString('es-ES')}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mb: 8, mt: { xs: 10, md: 12 } }}>
                <Grid container spacing={4}>
                    {/* Columna de información */}
                    <Grid item xs={12} md={8}>
                        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                            Sinopsis
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {movieData.synopsis}
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                            Reparto
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {movieData.cast.map((actor, index) => (
                                <Chip
                                    key={index}
                                    label={actor}
                                    variant="outlined"
                                    sx={{ mb: 1 }}
                                />
                            ))}
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                            Detalles
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                    <strong>Director:</strong> {movieData.director}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                    <strong>Género:</strong> {movieData.genre}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                    <strong>Duración:</strong> {movieData.duration} minutos
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                    <strong>Estreno:</strong> {new Date(movieData.releaseDate).toLocaleDateString('es-ES')}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Columna de reserva */}
                    <Grid item xs={12} md={4}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                position: 'sticky',
                                top: '20px',
                            }}
                        >
                            <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                                Reservar Entradas
                            </Typography>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Selecciona una fecha:
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                    <DatePicker
                                        value={selectedDate}
                                        onChange={(newDate) => setSelectedDate(newDate)}
                                        format="dd/MM/yyyy"
                                        sx={{ width: '100%' }}
                                    />
                                </LocalizationProvider>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Horarios disponibles:
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 1,
                                        mt: 1
                                    }}
                                >
                                    {showtimes.map((show) => (
                                        <Button
                                            key={show.id}
                                            variant={selectedTime === show.time ? "contained" : "outlined"}
                                            color="primary"
                                            size="small"
                                            onClick={() => handleTimeSelection(show.time, show.room)}
                                            sx={{ minWidth: '80px' }}
                                        >
                                            {show.time}
                                        </Button>
                                    ))}
                                </Box>
                                {selectedTime && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {selectedRoom}
                                    </Typography>
                                )}
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    label="Cantidad de Entradas"
                                    type="number"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    InputProps={{ inputProps: { min: 1, max: 10 } }}
                                    fullWidth
                                    size="small"
                                />
                            </Box>

                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                fullWidth
                                startIcon={<AirlineSeatReclineNormalIcon />}
                                disabled={!selectedTime}
                                sx={{ mt: 2 }}
                            >
                                Seleccionar Butacas
                            </Button>

                            <Box sx={{ mt: 3, bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    • Las reservas son válidas hasta 15 minutos antes de la función.
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    • Recuerda presentar tu código de reserva en la taquilla.
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default MovieDetail;
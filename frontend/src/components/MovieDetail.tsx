// frontend/src/components/MovieDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Grid as MuiGrid,
    Typography,
    //Card,
    //CardMedia,
    //CardContent,
    Chip,
    Button,
    Divider,
    Stack,
    Paper,
    //FormControl,
    //InputLabel,
    //Select,
    //MenuItem,
    //FormHelperText,
    TextField,
    CircularProgress,
    Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import { useReservation } from '../context/ReservationContext';

// Crear un componente Grid personalizado para evitar errores de tipado
const Grid = (props: any) => <MuiGrid {...props} />;

// Generar URL de la imagen según el género
const getImageForGenre = (genre: string): string => {
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

    return genreImages[genre] || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&h=400&auto=format&fit=crop'; // Imagen genérica
};

// Generar poster URL según el género
const getPosterForGenre = (genre: string): string => {
    const genrePosters: Record<string, string> = {
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

    return genrePosters[genre] || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&h=400&auto=format&fit=crop'; // Imagen genérica
};

// Datos simulados de directores y elenco
const movieData = {
    directors: {
        1: 'Ana Martínez',
        2: 'Carlos López',
        3: 'María González',
        4: 'Roberto Sánchez',
        5: 'Laura Rodríguez',
        6: 'Daniel Murillo'
    },
    casts: {
        1: ["Carlos Hernández", "Laura García", "Miguel López", "Sofía Rodríguez"],
        2: ["Javier Moreno", "Elena Ruiz", "Pedro Martínez", "Carla Sánchez"],
        3: ["Antonio Díaz", "Isabel López", "Marcos Silva", "Lucía Fernández"],
        4: ["David Torres", "Carmen Molina", "Alejandro Vega", "Paula Campos"],
        5: ["Manuel Herrera", "Victoria Jiménez", "Francisco Ortiz", "Natalia Castro"],
        6: ["Raúl Navarro", "Diana Fuentes", "José Vargas", "Gloria Mendoza"]
    }
};

const MovieDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const movieId = id ? parseInt(id) : 0;

    const {
        movies,
        billboards,
        fetchMovies,
        fetchBillboards,
        selectMovie,
        selectBillboard
    } = useReservation();

    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedBillboardId, setSelectedBillboardId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            // Cargar películas si no están cargadas
            if (movies.length === 0) {
                await fetchMovies();
            }

            // Cargar cartelera para la fecha actual
            if (selectedDate) {
                const dateString = selectedDate.toISOString().split('T')[0];
                await fetchBillboards(dateString);
            }

            setLoading(false);
        };

        loadData();
    }, [fetchMovies, fetchBillboards, movies.length, selectedDate]);

    // Encontrar la película seleccionada
    const movie = movies.find(m => m.id === movieId);

    // Efecto para seleccionar la película actual en el contexto
    useEffect(() => {
        if (movie) {
            selectMovie(movie);
        }
    }, [movie, selectMovie]);

    // Filtrar la cartelera para la película actual
    const movieBillboards = billboards.filter(b => b.movieId === movieId);

    const handleDateChange = async (date: Date | null) => {
        setSelectedDate(date);
        setSelectedTime('');
        setSelectedBillboardId(null);

        if (date) {
            const dateString = date.toISOString().split('T')[0];
            await fetchBillboards(dateString);
        }
    };

    const handleTimeSelection = (billboardId: number, time: string) => {
        setSelectedTime(time);
        setSelectedBillboardId(billboardId);

        // Buscar y seleccionar la cartelera en el contexto
        const selected = billboards.find(b => b.id === billboardId);
        if (selected) {
            selectBillboard(selected);
        }
    };

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(parseInt(event.target.value));
    };

    const handleSelectSeats = () => {
        if (selectedBillboardId) {
            navigate(`/select-seats/${selectedBillboardId}`);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!movie) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">Película no encontrada</Alert>
            </Container>
        );
    }

    const backdropImage = getImageForGenre(movie.genre);
    const posterImage = getPosterForGenre(movie.genre);
    const director = movieData.directors[movieId as keyof typeof movieData.directors] || 'Director Desconocido';
    const cast = movieData.casts[movieId as keyof typeof movieData.casts] || [];

    return (
        <Box>
            {/* Banner de película */}
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: '200px', md: '400px' },
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${backdropImage})`,
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
                            src={posterImage}
                            alt={movie.name}
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
                                {movie.name}
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                justifyContent={{ xs: 'center', md: 'flex-start' }}
                                sx={{ my: 2 }}
                            >
                                <Chip
                                    label={movie.genre.replace('_', ' ')}
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
                                        {movie.lengthMinutes} minutos
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarMonthIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    <Typography variant="body2">
                                        Estreno 2025
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
                            {movie.genre === 'SCIENCE_FICTION' &&
                                "En un futuro lejano, un grupo de exploradores debe viajar más allá de nuestra galaxia para descubrir si la humanidad tiene un futuro entre las estrellas. Mientras la Tierra se vuelve cada vez más inhabitable, el equipo enfrenta desafíos inimaginables en su misión para encontrar un nuevo hogar para la especie humana."}
                            {movie.genre === 'THRILLER' &&
                                "Un detective atormentado por su pasado debe enfrentarse a sus propios demonios mientras persigue a un asesino en serie que deja pistas misteriosas en cada escena del crimen. A medida que la investigación avanza, descubre que el caso está relacionado con un oscuro secreto de su propia vida."}
                            {movie.genre === 'ROMANCE' &&
                                "Dos desconocidos de mundos diferentes se encuentran por casualidad en las calles de París y pasan un fin de semana mágico explorando la ciudad del amor. A pesar de saber que su tiempo juntos es limitado, forjan una conexión que podría cambiar sus vidas para siempre."}
                            {movie.genre === 'ACTION' &&
                                "Un ex agente de fuerzas especiales es arrastrado de vuelta al mundo del que intentaba escapar cuando su familia es amenazada por una poderosa organización criminal. Con el tiempo en su contra, deberá utilizar todas sus habilidades para enfrentar a enemigos implacables y proteger a quienes ama."}
                            {movie.genre === 'COMEDY' &&
                                "Un grupo de amigos que no se ha reunido en años decide hacer un viaje para recuperar su juventud, pero nada sale según lo planeado. Entre situaciones hilarantes y malentendidos, descubrirán que algunas amistades son para toda la vida, sin importar cuánto tiempo haya pasado."}
                            {movie.genre === 'HORROR' &&
                                "Tras mudarse a una antigua casa en las afueras, una familia comienza a experimentar perturbadores fenómenos paranormales. Lo que parecía ser el hogar de sus sueños se convierte en una pesadilla cuando descubren los oscuros secretos que esconden sus paredes y el terrible destino de sus anteriores habitantes."}
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                            Reparto
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {cast.map((actor, index) => (
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
                                    <strong>Director:</strong> {director}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                    <strong>Género:</strong> {movie.genre.replace('_', ' ')}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                    <strong>Duración:</strong> {movie.lengthMinutes} minutos
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                    <strong>Clasificación:</strong> {movie.allowedAge}+
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
                                        onChange={handleDateChange}
                                        format="dd/MM/yyyy"
                                        sx={{ width: '100%' }}
                                    />
                                </LocalizationProvider>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Horarios disponibles:
                                </Typography>

                                {movieBillboards.length > 0 ? (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 1,
                                            mt: 1
                                        }}
                                    >
                                        {movieBillboards.map((billboard) => (
                                            <Button
                                                key={billboard.id}
                                                variant={selectedBillboardId === billboard.id ? "contained" : "outlined"}
                                                color="primary"
                                                size="small"
                                                onClick={() => handleTimeSelection(billboard.id, billboard.startTime)}
                                                sx={{ minWidth: '80px' }}
                                            >
                                                {billboard.startTime}
                                            </Button>
                                        ))}
                                    </Box>
                                ) : (
                                    <Alert severity="info" sx={{ mt: 1 }}>
                                        No hay funciones disponibles para esta fecha
                                    </Alert>
                                )}

                                {selectedTime && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {billboards.find(b => b.id === selectedBillboardId)?.roomName}
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
                                disabled={!selectedBillboardId}
                                onClick={handleSelectSeats}
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
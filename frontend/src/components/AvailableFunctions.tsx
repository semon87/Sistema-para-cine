// frontend/src/components/AvailableFunctions.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Grid as MuiGrid,
    Divider,
    useTheme,
    alpha,
    Zoom,
    Fade,
    Paper,
    IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useReservation } from '../context/ReservationContext';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import TheatersIcon from '@mui/icons-material/Theaters';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';

// Crear un componente Grid personalizado para evitar errores de tipado
const Grid = (props: any) => <MuiGrid {...props} />;

const AvailableFunctions = ({ movieId }: { movieId?: number }) => {
    const navigate = useNavigate();
    const { rooms, movies, billboards, fetchBillboards } = useReservation();
    const theme = useTheme();

    // Estados
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [filteredBillboards, setFilteredBillboards] = useState<any[]>([]);
    const [animateSearchButton, setAnimateSearchButton] = useState(false);

    // Obtener los horarios disponibles para la película/sala/fecha seleccionada
    useEffect(() => {
        if (selectedDate) {
            const dateString = selectedDate.toISOString().split('T')[0];
            fetchBillboards(dateString);
        }
    }, [selectedDate, fetchBillboards]);

    // Filtrar carteleras cuando cambien los filtros
    useEffect(() => {
        if (billboards.length === 0) return;

        let filtered = [...billboards];

        // Filtrar por película si se proporciona un movieId
        if (movieId) {
            filtered = filtered.filter(billboard => billboard.movieId === movieId);
        }

        // Filtrar por fecha
        if (selectedDate) {
            const dateString = selectedDate.toISOString().split('T')[0];
            filtered = filtered.filter(billboard => billboard.date === dateString);
        }

        // Filtrar por sala
        if (selectedRoom) {
            filtered = filtered.filter(billboard => billboard.roomId === selectedRoom);
        }

        setFilteredBillboards(filtered);

        // Extraer los horarios disponibles
        const times = filtered.map(billboard => billboard.startTime);
        // Usar Array.from en lugar de spread operator con Set para evitar problemas de TS
        setAvailableTimes(Array.from(new Set(times)).sort());

        // Resetear el horario seleccionado si ya no está disponible
        if (selectedTime && !times.includes(selectedTime)) {
            setSelectedTime('');
        }
    }, [billboards, selectedDate, selectedRoom, movieId, selectedTime]);

    // Comprobamos si hay selecciones válidas para activar la animación del botón
    useEffect(() => {
        if (selectedTime) {
            setAnimateSearchButton(true);
            const timer = setTimeout(() => setAnimateSearchButton(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [selectedTime]);

    // Manejadores de eventos
    const handleRoomChange = (event: any) => {
        setSelectedRoom(event.target.value);
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    const handleTimeChange = (event: any) => {
        setSelectedTime(event.target.value);
    };

    const handleSearch = () => {
        // Encontrar la cartelera que coincide con todos los filtros
        const billboard = filteredBillboards.find(billboard =>
            (!selectedRoom || billboard.roomId === selectedRoom) &&
            billboard.startTime === selectedTime
        );

        if (billboard) {
            // Navegar a la página de detalles de la película o selección de asientos
            navigate(`/movie/${billboard.movieId}`);
        }
    };

    // Obtener el título de la película si se proporciona un movieId
    const movieTitle = movieId
        ? movies.find(movie => movie.id === movieId)?.name || "Película"
        : "una película";

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Card
                sx={{
                    borderRadius: '20px',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.95)})`,
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 20px 80px rgba(0, 0, 0, 0.12), 0 10px 30px rgba(0, 0, 0, 0.08)',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    overflow: 'visible',
                    position: 'relative',
                }}
            >
                {/* Decoración de fondo */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -30,
                        left: -30,
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        opacity: 0.1,
                        zIndex: 0,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -20,
                        right: -20,
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: `linear-gradient(225deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                        opacity: 0.1,
                        zIndex: 0,
                    }}
                />

                <CardContent sx={{ position: 'relative', zIndex: 1, p: { xs: 3, md: 4 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                borderRadius: '50%',
                                p: 1.5,
                                mr: 2,
                            }}
                        >
                            <TravelExploreIcon fontSize="large" />
                        </Box>
                        <Typography
                            variant="h4"
                            component="h2"
                            fontWeight="800"
                            sx={{
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Funciones Disponibles
                        </Typography>
                    </Box>

                    <Divider
                        sx={{
                            mb: 4,
                            borderColor: alpha(theme.palette.primary.main, 0.1),
                            '&::before, &::after': {
                                borderColor: alpha(theme.palette.primary.main, 0.1),
                            }
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                px: 2,
                                color: alpha(theme.palette.text.primary, 0.7),
                                fontStyle: 'italic'
                            }}
                        >
                            Encuentra tu función ideal
                        </Typography>
                    </Divider>

                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary
                            }}
                        >
                            Selecciona una función para {movieTitle === "Película" ? "una película" : `"${movieTitle}"`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Personaliza tu experiencia eligiendo sala, fecha y horario para disfrutar al máximo de tu película favorita.
                        </Typography>
                    </Box>

                    <Grid container spacing={3} sx={{ mt: 0 }}>
                        <Grid item xs={12} sm={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 0.5,
                                    borderRadius: 2,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, color: theme.palette.primary.main }}>
                                    <TheatersIcon />
                                </Box>
                                <FormControl fullWidth>
                                    <InputLabel id="room-select-label" sx={{ ml: 2 }}>Sala</InputLabel>
                                    <Select
                                        labelId="room-select-label"
                                        id="room-select"
                                        value={selectedRoom || ''}
                                        label="Sala"
                                        onChange={handleRoomChange}
                                        sx={{
                                            pl: 2,
                                            '& .MuiSelect-select': {
                                                py: 1.5
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: theme.palette.primary.main,
                                            },
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>Seleccionar Sala</em>
                                        </MenuItem>
                                        {rooms.map(room => (
                                            <MenuItem key={room.id} value={room.id}>
                                                {room.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 0.5,
                                    borderRadius: 2,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, color: theme.palette.primary.main }}>
                                    <CalendarMonthIcon />
                                </Box>
                                <DatePicker
                                    label="Fecha"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    format="dd/MM/yyyy"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            sx: {
                                                pl: 2,
                                                '& .MuiInputBase-root': {
                                                    py: 0.5
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    border: 'none'
                                                }
                                            }
                                        }
                                    }}
                                />
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 0.5,
                                    borderRadius: 2,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, color: theme.palette.primary.main }}>
                                    <AccessTimeIcon />
                                </Box>
                                <FormControl fullWidth>
                                    <InputLabel id="time-select-label" sx={{ ml: 2 }}>Horario</InputLabel>
                                    <Select
                                        labelId="time-select-label"
                                        id="time-select"
                                        value={selectedTime}
                                        label="Horario"
                                        onChange={handleTimeChange}
                                        disabled={availableTimes.length === 0}
                                        sx={{
                                            pl: 2,
                                            '& .MuiSelect-select': {
                                                py: 1.5
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: theme.palette.primary.main,
                                            },
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>Seleccionar Horario</em>
                                        </MenuItem>
                                        {availableTimes.map(time => (
                                            <MenuItem key={time} value={time}>
                                                {time}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Zoom in={!!selectedTime} timeout={500}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={!selectedTime}
                                    onClick={handleSearch}
                                    sx={{
                                        py: 1.5,
                                        mt: 1,
                                        borderRadius: 3,
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        boxShadow: animateSearchButton
                                            ? `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`
                                            : `0 6px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.5)}`,
                                        },
                                        '&:active': {
                                            transform: 'translateY(1px)',
                                        },
                                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                    }}
                                    startIcon={
                                        <Box
                                            sx={{
                                                bgcolor: alpha('#fff', 0.2),
                                                borderRadius: '50%',
                                                p: 0.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <SearchIcon />
                                        </Box>
                                    }
                                >
                                    Buscar Funciones
                                </Button>
                            </Zoom>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </LocalizationProvider>
    );
};

export default AvailableFunctions;
import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Alert,
    Snackbar,
    Chip,
    Divider
} from '@mui/material';
import {
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField
} from './common/MuiComponents';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Cancel as CancelIcon,
    Event as EventIcon,
    AccessTime as AccessTimeIcon,
    Movie as MovieIcon,
    TheaterComedy as TheaterIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

// Tipos para los datos
interface Movie {
    id: number;
    name: string;
    genre: string;
    allowedAge: number;
    lengthMinutes: number;
}

interface Room {
    id: number;
    name: string;
    number: number;
}

interface Billboard {
    id: number;
    date: Date;
    startTime: string;
    endTime: string;
    movieId: number;
    movieName: string;
    roomId: number;
    roomName: string;
    status: boolean;
}

const AdminCartelera = () => {
    // Estados
    const [movies, setMovies] = useState<Movie[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [billboards, setBillboards] = useState<Billboard[]>([]);
    const [filteredBillboards, setFilteredBillboards] = useState<Billboard[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [filterDate, setFilterDate] = useState<Date | null>(new Date());
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: '',
        message: '',
        id: 0
    });
    const [currentBillboard, setCurrentBillboard] = useState<Billboard>({
        id: 0,
        date: new Date(),
        startTime: '18:00',
        endTime: '20:00',
        movieId: 0,
        movieName: '',
        roomId: 0,
        roomName: '',
        status: true
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    // Simular carga de datos (en una aplicación real, esto sería una llamada a la API)
    useEffect(() => {
        // Simular películas
        const mockMovies: Movie[] = [
            { id: 1, name: 'Aventuras Cósmicas', genre: 'SCIENCE_FICTION', allowedAge: 12, lengthMinutes: 120 },
            { id: 2, name: 'El Misterio del Bosque', genre: 'THRILLER', allowedAge: 16, lengthMinutes: 95 },
            { id: 3, name: 'Amor en París', genre: 'ROMANCE', allowedAge: 12, lengthMinutes: 110 },
            { id: 4, name: 'Superhéroes Unidos', genre: 'ACTION', allowedAge: 12, lengthMinutes: 140 },
            { id: 5, name: 'Risas Aseguradas', genre: 'COMEDY', allowedAge: 7, lengthMinutes: 90 },
            { id: 6, name: 'Terror en la Oscuridad', genre: 'HORROR', allowedAge: 18, lengthMinutes: 105 },
        ];
        setMovies(mockMovies);

        // Simular salas
        const mockRooms: Room[] = [
            { id: 1, name: 'Sala Normal', number: 1 },
            { id: 2, name: 'Sala 3D', number: 2 },
            { id: 3, name: 'Sala VIP', number: 3 },
        ];
        setRooms(mockRooms);

        // Simular cartelera
        const mockBillboards: Billboard[] = [];
        const today = new Date();

        // Generar carteleras para los próximos 7 días
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);

            // Varias funciones por día
            mockRooms.forEach(room => {
                mockMovies.slice(0, 3).forEach((movie, index) => {
                    // Horas de inicio para diferentes funciones
                    const startTimes = ['14:30', '17:00', '19:30', '22:00'];
                    const startTime = startTimes[index % startTimes.length];

                    // Calcular hora de fin basada en la duración de la película
                    const [hours, minutes] = startTime.split(':').map(Number);
                    const endHour = hours + Math.floor((minutes + movie.lengthMinutes) / 60);
                    const endMinute = (minutes + movie.lengthMinutes) % 60;
                    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

                    mockBillboards.push({
                        id: mockBillboards.length + 1,
                        date: new Date(date),
                        startTime,
                        endTime,
                        movieId: movie.id,
                        movieName: movie.name,
                        roomId: room.id,
                        roomName: room.name,
                        status: Math.random() > 0.05 // 5% de carteleras canceladas
                    });
                });
            });
        }

        setBillboards(mockBillboards);
    }, []);

    // Filtrar carteleras por fecha
    useEffect(() => {
        if (filterDate) {
            const filtered = billboards.filter(billboard => {
                const billboardDate = new Date(billboard.date);
                return billboardDate.setHours(0, 0, 0, 0) === new Date(filterDate).setHours(0, 0, 0, 0);
            });
            setFilteredBillboards(filtered);
        } else {
            setFilteredBillboards(billboards);
        }
    }, [billboards, filterDate]);

    // Handlers
    const handleOpenDialog = (billboard?: Billboard) => {
        if (billboard) {
            setCurrentBillboard(billboard);
            setIsEditing(true);
        } else {
            setCurrentBillboard({
                id: 0,
                date: filterDate || new Date(),
                startTime: '18:00',
                endTime: '20:00',
                movieId: 0,
                movieName: '',
                roomId: 0,
                roomName: '',
                status: true
            });
            setIsEditing(false);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleMovieChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const movieId = event.target.value as number;
        const selectedMovie = movies.find(m => m.id === movieId);

        if (selectedMovie && currentBillboard.startTime) {
            // Calcular hora de fin basada en la duración de la película
            const [hours, minutes] = currentBillboard.startTime.split(':').map(Number);
            const endHour = hours + Math.floor((minutes + selectedMovie.lengthMinutes) / 60);
            const endMinute = (minutes + selectedMovie.lengthMinutes) % 60;
            const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

            setCurrentBillboard({
                ...currentBillboard,
                movieId,
                movieName: selectedMovie.name,
                endTime
            });
        } else {
            setCurrentBillboard({
                ...currentBillboard,
                movieId,
                movieName: selectedMovie?.name || ''
            });
        }
    };

    const handleRoomChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const roomId = event.target.value as number;
        const selectedRoom = rooms.find(r => r.id === roomId);

        setCurrentBillboard({
            ...currentBillboard,
            roomId,
            roomName: selectedRoom?.name || ''
        });
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setCurrentBillboard({
                ...currentBillboard,
                date
            });
        }
    };

    const handleStartTimeChange = (value: string) => {
        const selectedMovie = movies.find(m => m.id === currentBillboard.movieId);
        let endTime = currentBillboard.endTime;

        if (selectedMovie) {
            // Calcular hora de fin basada en la duración de la película
            const [hours, minutes] = value.split(':').map(Number);
            const endHour = hours + Math.floor((minutes + selectedMovie.lengthMinutes) / 60);
            const endMinute = (minutes + selectedMovie.lengthMinutes) % 60;
            endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        }

        setCurrentBillboard({
            ...currentBillboard,
            startTime: value,
            endTime
        });
    };

    const handleEndTimeChange = (value: string) => {
        setCurrentBillboard({
            ...currentBillboard,
            endTime: value
        });
    };

    const handleSubmit = () => {
        // En una aplicación real, aquí haríamos una llamada a la API
        if (isEditing) {
            // Actualizar cartelera existente
            setBillboards(billboards.map(billboard =>
                billboard.id === currentBillboard.id ? currentBillboard : billboard
            ));
            setSnackbar({
                open: true,
                message: 'Cartelera actualizada correctamente',
                severity: 'success'
            });
        } else {
            // Crear nueva cartelera
            const newBillboard = {
                ...currentBillboard,
                id: Math.max(...billboards.map(b => b.id), 0) + 1
            };
            setBillboards([...billboards, newBillboard]);
            setSnackbar({
                open: true,
                message: 'Cartelera creada correctamente',
                severity: 'success'
            });
        }
        handleCloseDialog();
    };

    const handleDelete = (id: number) => {
        // En una aplicación real, aquí haríamos una llamada a la API
        setBillboards(billboards.filter(billboard => billboard.id !== id));
        setSnackbar({
            open: true,
            message: 'Cartelera eliminada correctamente',
            severity: 'success'
        });
    };

    const handleOpenConfirmDialog = (id: number, action: 'delete' | 'cancel') => {
        const title = action === 'delete' ? 'Eliminar Cartelera' : 'Cancelar Función';
        const message = action === 'delete'
            ? '¿Está seguro de que desea eliminar esta cartelera? Esta acción no se puede deshacer.'
            : '¿Está seguro de que desea cancelar esta función? Se cancelarán todas las reservas asociadas.';

        setConfirmDialog({
            open: true,
            title,
            message,
            id
        });
    };

    const handleCloseConfirmDialog = () => {
        setConfirmDialog({
            ...confirmDialog,
            open: false
        });
    };

    const handleConfirmAction = () => {
        // Determinar si es eliminar o cancelar
        const billboardToModify = billboards.find(b => b.id === confirmDialog.id);

        if (billboardToModify) {
            if (confirmDialog.title.includes('Eliminar')) {
                handleDelete(confirmDialog.id);
            } else {
                // Cancelar función
                setBillboards(billboards.map(billboard => {
                    if (billboard.id === confirmDialog.id) {
                        return { ...billboard, status: false };
                    }
                    return billboard;
                }));
                setSnackbar({
                    open: true,
                    message: 'Función cancelada correctamente',
                    severity: 'success'
                });
            }
        }

        handleCloseConfirmDialog();
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Administración de Cartelera
                </Typography>

                {/* Filtro y Botón Agregar */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <DatePicker
                                    label="Filtrar por Fecha"
                                    value={filterDate}
                                    onChange={(newDate) => setFilterDate(newDate)}
                                    format="dd/MM/yyyy"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            variant: 'outlined'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpenDialog()}
                                    fullWidth
                                >
                                    Agregar Nueva Función
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Información de la Fecha */}
                {filterDate && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Funciones para el {formatDate(filterDate)}
                        </Typography>
                        <Divider />
                    </Box>
                )}

                {/* Tabla de Cartelera */}
                {filteredBillboards.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Película</TableCell>
                                    <TableCell>Sala</TableCell>
                                    <TableCell>Horario</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredBillboards.map((billboard) => (
                                    <TableRow key={billboard.id} sx={{
                                        backgroundColor: billboard.status ? 'inherit' : 'rgba(239, 83, 80, 0.1)'
                                    }}>
                                        <TableCell>{billboard.id}</TableCell>
                                        <TableCell>{billboard.movieName}</TableCell>
                                        <TableCell>{billboard.roomName}</TableCell>
                                        <TableCell>{`${billboard.startTime} - ${billboard.endTime}`}</TableCell>
                                        <TableCell>
                                            {billboard.status ? (
                                                <Chip label="Activa" color="success" size="small" />
                                            ) : (
                                                <Chip label="Cancelada" color="error" size="small" />
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpenDialog(billboard)}
                                                disabled={!billboard.status}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleOpenConfirmDialog(billboard.id, 'delete')}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                            {billboard.status && (
                                                <IconButton
                                                    color="warning"
                                                    onClick={() => handleOpenConfirmDialog(billboard.id, 'cancel')}
                                                >
                                                    <CancelIcon />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        No hay funciones programadas para esta fecha
                    </Alert>
                )}

                {/* Formulario de Cartelera */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle>{isEditing ? 'Editar Función' : 'Agregar Función'}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={6}>
                                <DatePicker
                                    label="Fecha"
                                    value={currentBillboard.date}
                                    onChange={handleDateChange}
                                    format="dd/MM/yyyy"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            variant: 'outlined'
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="movie-select-label">Película</InputLabel>
                                    <Select
                                        labelId="movie-select-label"
                                        value={currentBillboard.movieId || ''}
                                        label="Película"
                                        onChange={handleMovieChange}
                                    >
                                        <MenuItem value="">
                                            <em>Seleccione una película</em>
                                        </MenuItem>
                                        {movies.map((movie) => (
                                            <MenuItem key={movie.id} value={movie.id}>
                                                {movie.name} ({movie.lengthMinutes} min.)
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="room-select-label">Sala</InputLabel>
                                    <Select
                                        labelId="room-select-label"
                                        value={currentBillboard.roomId || ''}
                                        label="Sala"
                                        onChange={handleRoomChange}
                                    >
                                        <MenuItem value="">
                                            <em>Seleccione una sala</em>
                                        </MenuItem>
                                        {rooms.map((room) => (
                                            <MenuItem key={room.id} value={room.id}>
                                                {room.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Hora de Inicio"
                                            type="time"
                                            value={currentBillboard.startTime}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleStartTimeChange(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            inputProps={{ step: 300 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Hora de Fin"
                                            type="time"
                                            value={currentBillboard.endTime}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEndTimeChange(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            inputProps={{ step: 300 }}
                                            disabled={!!currentBillboard.movieId}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            {currentBillboard.movieId && currentBillboard.roomId && (
                                <Grid item xs={12}>
                                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <MovieIcon sx={{ color: 'primary.main', mr: 1 }} />
                                                    <Typography variant="body2">
                                                        <strong>Película:</strong> {movies.find(m => m.id === currentBillboard.movieId)?.name}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <TheaterIcon sx={{ color: 'primary.main', mr: 1 }} />
                                                    <Typography variant="body2">
                                                        <strong>Sala:</strong> {rooms.find(r => r.id === currentBillboard.roomId)?.name}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EventIcon sx={{ color: 'primary.main', mr: 1 }} />
                                                    <Typography variant="body2">
                                                        <strong>Fecha:</strong> {formatDate(currentBillboard.date)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <AccessTimeIcon sx={{ color: 'primary.main', mr: 1 }} />
                                                    <Typography variant="body2">
                                                        <strong>Horario:</strong> {currentBillboard.startTime} - {currentBillboard.endTime}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="inherit">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            color="primary"
                            variant="contained"
                            disabled={!currentBillboard.movieId || !currentBillboard.roomId}
                        >
                            {isEditing ? 'Actualizar' : 'Crear'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Diálogo de Confirmación */}
                <Dialog open={confirmDialog.open} onClose={handleCloseConfirmDialog}>
                    <DialogTitle>{confirmDialog.title}</DialogTitle>
                    <DialogContent>
                        <Typography>{confirmDialog.message}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseConfirmDialog} color="inherit">
                            Cancelar
                        </Button>
                        <Button onClick={handleConfirmAction} color="error" variant="contained">
                            Confirmar
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Notificación */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </LocalizationProvider>
    );
};

export default AdminCartelera;
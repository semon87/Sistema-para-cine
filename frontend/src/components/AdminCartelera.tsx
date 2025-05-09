// frontend/src/components/AdminCartelera.tsx
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
    Divider,
    CircularProgress
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
import { useReservation } from '../context/ReservationContext';

const AdminCartelera = () => {
    // Estados del contexto
    const {
        movies,
        rooms,
        billboards,
        fetchMovies,
        fetchRooms,
        fetchBillboards
    } = useReservation();

    // Estados locales
    const [filteredBillboards, setFilteredBillboards] = useState(billboards);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [filterDate, setFilterDate] = useState<Date | null>(new Date());
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: '',
        message: '',
        id: 0
    });
    const [currentBillboard, setCurrentBillboard] = useState({
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
    const [loading, setLoading] = useState(true);

    // Cargar datos iniciales
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            // Cargar películas si no están cargadas
            if (movies.length === 0) {
                await fetchMovies();
            }

            // Cargar salas si no están cargadas
            if (rooms.length === 0) {
                await fetchRooms();
            }

            // Cargar cartelera para la fecha actual
            if (filterDate) {
                const dateString = filterDate.toISOString().split('T')[0];
                await fetchBillboards(dateString);
            }

            setLoading(false);
        };

        loadData();
    }, [fetchMovies, fetchRooms, fetchBillboards, movies.length, rooms.length]);

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
    const handleOpenDialog = (billboard?: any) => {
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

    const handleMovieChange = (event: any) => {
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

    const handleRoomChange = (event: any) => {
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

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
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

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentBillboard({
            ...currentBillboard,
            endTime: e.target.value
        });
    };

    const handleFilterDateChange = async (date: Date | null) => {
        setFilterDate(date);
        if (date) {
            const dateString = date.toISOString().split('T')[0];
            await fetchBillboards(dateString);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            // Convertir Date a string ISO (YYYY-MM-DD)
            const formattedBillboard = {
                ...currentBillboard,
                date: currentBillboard.date instanceof Date
                    ? currentBillboard.date.toISOString().split('T')[0]
                    : currentBillboard.date
            };

            const message = isEditing ? 'Cartelera actualizada correctamente' : 'Cartelera creada correctamente';

            if (isEditing) {
                // Actualizar cartelera existente
                const updated = billboards.map(billboard =>
                    billboard.id === formattedBillboard.id ? formattedBillboard : billboard
                );

                setFilteredBillboards(updated.filter(billboard => {
                    const billboardDate = new Date(billboard.date);
                    return filterDate && billboardDate.setHours(0, 0, 0, 0) === new Date(filterDate).setHours(0, 0, 0, 0);
                }));
            } else {
                // Crear nueva cartelera
                const newId = Math.max(...billboards.map(b => b.id), 0) + 1;
                const newBillboard = { ...formattedBillboard, id: newId };

                const updated = [...billboards, newBillboard];

                setFilteredBillboards(updated.filter(billboard => {
                    const billboardDate = new Date(billboard.date);
                    return filterDate && billboardDate.setHours(0, 0, 0, 0) === new Date(filterDate).setHours(0, 0, 0, 0);
                }));
            }

            setSnackbar({
                open: true,
                message,
                severity: 'success'
            });

            handleCloseDialog();
        } catch (error) {
            console.error('Error al guardar la cartelera:', error);
            setSnackbar({
                open: true,
                message: 'Error al guardar la cartelera',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = (id: number) => {
        // En una aplicación real, aquí se enviaría la eliminación a la API
        const updated = billboards.filter(billboard => billboard.id !== id);

        // Actualizar la lista filtrada
        setFilteredBillboards(updated.filter(billboard => {
            const billboardDate = new Date(billboard.date);
            return filterDate && billboardDate.setHours(0, 0, 0, 0) === new Date(filterDate).setHours(0, 0, 0, 0);
        }));

        setSnackbar({
            open: true,
            message: 'Cartelera eliminada correctamente',
            severity: 'success'
        });
    };

    const handleCancelBillboard = (id: number) => {
        // En una aplicación real, aquí se enviaría la cancelación a la API
        const updated = billboards.map(billboard => {
            if (billboard.id === id) {
                return { ...billboard, status: false };
            }
            return billboard;
        });

        // Actualizar la lista filtrada
        setFilteredBillboards(updated.filter(billboard => {
            const billboardDate = new Date(billboard.date);
            return filterDate && billboardDate.setHours(0, 0, 0, 0) === new Date(filterDate).setHours(0, 0, 0, 0);
        }));

        setSnackbar({
            open: true,
            message: 'Función cancelada correctamente',
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
        if (confirmDialog.title.includes('Eliminar')) {
            handleDelete(confirmDialog.id);
        } else {
            handleCancelBillboard(confirmDialog.id);
        }

        handleCloseConfirmDialog();
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const formatDate = (date: Date | string) => {
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
                                    onChange={handleFilterDateChange}
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

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
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
                    </>
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
                                            onChange={handleStartTimeChange}
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
                                            onChange={handleEndTimeChange}
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
                            disabled={!currentBillboard.movieId || !currentBillboard.roomId || loading}
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
                        <Button
                            onClick={handleConfirmAction}
                            color="error"
                            variant="contained"
                            disabled={loading}
                        >
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
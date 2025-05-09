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
    List,
    ListItem,
    ListItemText,
    ListItemIcon
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
    Visibility as VisibilityIcon,
    Cancel as CancelIcon,
    Event as EventIcon,
    AccessTime as AccessTimeIcon,
    Movie as MovieIcon,
    TheaterComedy as TheaterIcon,
    Person as PersonIcon,
    ConfirmationNumber as TicketIcon,
    Search as SearchIcon,
    FilterAlt as FilterIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

// Tipos para los datos
interface Customer {
    id: number;
    name: string;
    lastname: string;
    documentNumber: string;
    email: string;
    phoneNumber: string;
}

interface Reservation {
    id: number;
    date: Date;
    customerId: number;
    customerName: string;
    seatId: number;
    seatLabel: string;
    billboardId: number;
    movieName: string;
    roomName: string;
    status: boolean;
}

const ReservationList = () => {
    // Estados
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: '',
        message: '',
        id: 0
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    const [filters, setFilters] = useState({
        movie: '',
        status: 'all',
        startDate: null as Date | null,
        endDate: null as Date | null,
        customer: ''
    });
    const [openFilterDialog, setOpenFilterDialog] = useState(false);

    // Simular carga de datos (en una aplicación real, esto sería una llamada a la API)
    useEffect(() => {
        // Simular reservas
        const mockReservations: Reservation[] = [];
        const mockCustomers: Customer[] = [
            { id: 1, name: 'Juan', lastname: 'Pérez', documentNumber: '123456789', email: 'juan@example.com', phoneNumber: '555-123-4567' },
            { id: 2, name: 'María', lastname: 'González', documentNumber: '987654321', email: 'maria@example.com', phoneNumber: '555-987-6543' },
            { id: 3, name: 'Carlos', lastname: 'Rodríguez', documentNumber: '456789123', email: 'carlos@example.com', phoneNumber: '555-456-7891' },
        ];
        const mockMovies = ['Aventuras Cósmicas', 'El Misterio del Bosque', 'Amor en París', 'Superhéroes Unidos', 'Risas Aseguradas'];
        const mockRooms = ['Sala 1 - Normal', 'Sala 2 - 3D', 'Sala 3 - VIP'];

        // Generar 20 reservas de ejemplo
        for (let i = 1; i <= 20; i++) {
            // Fecha aleatoria en los últimos 14 días
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 14));

            // Cliente aleatorio
            const customer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];

            // Película aleatoria
            const movie = mockMovies[Math.floor(Math.random() * mockMovies.length)];

            // Sala aleatoria
            const room = mockRooms[Math.floor(Math.random() * mockRooms.length)];

            // Fila (A-F) y número de asiento (1-10) aleatorios
            const row = String.fromCharCode(65 + Math.floor(Math.random() * 6));
            const seatNumber = Math.floor(Math.random() * 10) + 1;

            mockReservations.push({
                id: i,
                date: date,
                customerId: customer.id,
                customerName: `${customer.name} ${customer.lastname}`,
                seatId: (row.charCodeAt(0) - 65) * 10 + seatNumber,
                seatLabel: `${row}${seatNumber}`,
                billboardId: Math.floor(Math.random() * 100) + 1,
                movieName: movie,
                roomName: room,
                status: Math.random() > 0.2 // 20% de reservas canceladas
            });
        }

        setReservations(mockReservations);
        setFilteredReservations(mockReservations);
    }, []);

    // Aplicar filtros
    const applyFilters = () => {
        let filtered = [...reservations];

        // Filtro por película
        if (filters.movie) {
            filtered = filtered.filter(reservation =>
                reservation.movieName.toLowerCase().includes(filters.movie.toLowerCase())
            );
        }

        // Filtro por estado
        if (filters.status !== 'all') {
            const isActive = filters.status === 'active';
            filtered = filtered.filter(reservation => reservation.status === isActive);
        }

        // Filtro por fecha de inicio
        if (filters.startDate) {
            filtered = filtered.filter(reservation =>
                new Date(reservation.date) >= new Date(filters.startDate!)
            );
        }

        // Filtro por fecha de fin
        if (filters.endDate) {
            filtered = filtered.filter(reservation =>
                new Date(reservation.date) <= new Date(filters.endDate!)
            );
        }

        // Filtro por cliente
        if (filters.customer) {
            filtered = filtered.filter(reservation =>
                reservation.customerName.toLowerCase().includes(filters.customer.toLowerCase())
            );
        }

        setFilteredReservations(filtered);
        setOpenFilterDialog(false);
    };

    // Resetear filtros
    const resetFilters = () => {
        setFilters({
            movie: '',
            status: 'all',
            startDate: null,
            endDate: null,
            customer: ''
        });
        setFilteredReservations(reservations);
        setOpenFilterDialog(false);
    };

    // Handlers
    const handleOpenDetailDialog = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setOpenDetailDialog(true);
    };

    const handleCloseDetailDialog = () => {
        setOpenDetailDialog(false);
    };

    const handleOpenCancelDialog = (id: number) => {
        setConfirmDialog({
            open: true,
            title: 'Cancelar Reserva',
            message: '¿Está seguro de que desea cancelar esta reserva? Esta acción no se puede deshacer.',
            id
        });
    };

    const handleCloseCancelDialog = () => {
        setConfirmDialog({
            ...confirmDialog,
            open: false
        });
    };

    const handleConfirmCancel = () => {
        // En una aplicación real, aquí haríamos una llamada a la API
        setReservations(reservations.map(reservation => {
            if (reservation.id === confirmDialog.id) {
                return { ...reservation, status: false };
            }
            return reservation;
        }));

        // También actualizar las reservas filtradas
        setFilteredReservations(filteredReservations.map(reservation => {
            if (reservation.id === confirmDialog.id) {
                return { ...reservation, status: false };
            }
            return reservation;
        }));

        setSnackbar({
            open: true,
            message: 'Reserva cancelada correctamente',
            severity: 'success'
        });

        handleCloseCancelDialog();
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1">
                        Lista de Reservas
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<FilterIcon />}
                        onClick={() => setOpenFilterDialog(true)}
                    >
                        Filtros
                    </Button>
                </Box>

                {/* Tabla de Reservas */}
                {filteredReservations.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Fecha</TableCell>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Película</TableCell>
                                    <TableCell>Sala</TableCell>
                                    <TableCell>Butaca</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredReservations.map((reservation) => (
                                    <TableRow key={reservation.id} sx={{
                                        backgroundColor: reservation.status ? 'inherit' : 'rgba(239, 83, 80, 0.1)'
                                    }}>
                                        <TableCell>{reservation.id}</TableCell>
                                        <TableCell>{formatDate(reservation.date)}</TableCell>
                                        <TableCell>{reservation.customerName}</TableCell>
                                        <TableCell>{reservation.movieName}</TableCell>
                                        <TableCell>{reservation.roomName}</TableCell>
                                        <TableCell>{reservation.seatLabel}</TableCell>
                                        <TableCell>
                                            {reservation.status ? (
                                                <Chip label="Activa" color="success" size="small" />
                                            ) : (
                                                <Chip label="Cancelada" color="error" size="small" />
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton color="primary" onClick={() => handleOpenDetailDialog(reservation)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                            {reservation.status && (
                                                <IconButton color="error" onClick={() => handleOpenCancelDialog(reservation.id)}>
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
                    <Alert severity="info">
                        No se encontraron reservas con los criterios seleccionados
                    </Alert>
                )}

                {/* Diálogo de Detalles */}
                <Dialog open={openDetailDialog} onClose={handleCloseDetailDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        Detalles de la Reserva #{selectedReservation?.id}
                        <Box sx={{ position: 'absolute', right: 16, top: 12 }}>
                            {selectedReservation?.status ? (
                                <Chip label="Activa" color="success" size="small" />
                            ) : (
                                <Chip label="Cancelada" color="error" size="small" />
                            )}
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        {selectedReservation && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Película y Función
                                </Typography>
                                <List dense>
                                    <ListItem>
                                        <ListItemIcon>
                                            <MovieIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Película"
                                            secondary={selectedReservation.movieName}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <TheaterIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Sala"
                                            secondary={selectedReservation.roomName}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <EventIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Fecha de Reserva"
                                            secondary={formatDate(selectedReservation.date)}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <TicketIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Butaca"
                                            secondary={selectedReservation.seatLabel}
                                        />
                                    </ListItem>
                                </List>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="h6" gutterBottom color="primary">
                                    Cliente
                                </Typography>
                                <List dense>
                                    <ListItem>
                                        <ListItemIcon>
                                            <PersonIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Nombre"
                                            secondary={selectedReservation.customerName}
                                        />
                                    </ListItem>
                                </List>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDetailDialog} color="inherit">
                            Cerrar
                        </Button>
                        {selectedReservation?.status && (
                            <Button
                                color="error"
                                variant="contained"
                                onClick={() => {
                                    handleCloseDetailDialog();
                                    handleOpenCancelDialog(selectedReservation.id);
                                }}
                            >
                                Cancelar Reserva
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>

                {/* Diálogo de Filtros */}
                <Dialog open={openFilterDialog} onClose={() => setOpenFilterDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Filtrar Reservas</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Película"
                                    value={filters.movie}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, movie: e.target.value })}
                                    placeholder="Nombre de la película"
                                    InputProps={{
                                        startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Cliente"
                                    value={filters.customer}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, customer: e.target.value })}
                                    placeholder="Nombre del cliente"
                                    InputProps={{
                                        startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="status-select-label">Estado</InputLabel>
                                    <Select
                                        labelId="status-select-label"
                                        value={filters.status}
                                        label="Estado"
                                        onChange={(e: React.ChangeEvent<{ value: unknown }>) => setFilters({ ...filters, status: e.target.value as string })}
                                    >
                                        <MenuItem value="all">Todos</MenuItem>
                                        <MenuItem value="active">Activas</MenuItem>
                                        <MenuItem value="cancelled">Canceladas</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="Fecha Desde"
                                    value={filters.startDate}
                                    onChange={(date) => setFilters({ ...filters, startDate: date })}
                                    format="dd/MM/yyyy"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            variant: 'outlined'
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="Fecha Hasta"
                                    value={filters.endDate}
                                    onChange={(date) => setFilters({ ...filters, endDate: date })}
                                    format="dd/MM/yyyy"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            variant: 'outlined'
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={resetFilters} color="inherit">
                            Limpiar Filtros
                        </Button>
                        <Button onClick={applyFilters} color="primary" variant="contained">
                            Aplicar Filtros
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

export default ReservationList;


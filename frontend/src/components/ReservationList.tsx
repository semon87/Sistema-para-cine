// frontend/src/components/ReservationList.tsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    //Card,
    //CardContent,
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
    TablePagination,
    Paper,
    IconButton,
    Alert,
    Snackbar,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
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
    Visibility as VisibilityIcon,
    Cancel as CancelIcon,
    Event as EventIcon,
    //AccessTime as AccessTimeIcon,
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
import { useReservation } from '../context/ReservationContext';

const ReservationList = () => {
    // Estados
    const { bookings, fetchBookings, cancelBooking } = useReservation();
    const [filteredBookings, setFilteredBookings] = useState(bookings);
    const [selectedReservation, setSelectedReservation] = useState<any | null>(null);
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
    const [loading, setLoading] = useState(true);

    // Estado para paginación
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Cargar reservas al inicio
    useEffect(() => {
        const loadBookings = async () => {
            setLoading(true);
            await fetchBookings();
            setLoading(false);
        };

        loadBookings();
    }, [fetchBookings]);

    // Actualizar las reservas filtradas cuando cambien las reservas o los filtros
    useEffect(() => {
        setFilteredBookings(bookings);
    }, [bookings]);

    // Aplicar filtros
    const applyFilters = () => {
        let filtered = [...bookings];

        // Filtro por película
        if (filters.movie) {
            filtered = filtered.filter(booking =>
                booking.movieName.toLowerCase().includes(filters.movie.toLowerCase())
            );
        }

        // Filtro por estado
        if (filters.status !== 'all') {
            const isActive = filters.status === 'active';
            filtered = filtered.filter(booking => booking.status === isActive);
        }

        // Filtro por fecha de inicio
        if (filters.startDate) {
            filtered = filtered.filter(booking => {
                const bookingDate = new Date(booking.date);
                const startDate = new Date(filters.startDate!);
                return bookingDate >= startDate;
            });
        }

        // Filtro por fecha de fin
        if (filters.endDate) {
            filtered = filtered.filter(booking => {
                const bookingDate = new Date(booking.date);
                const endDate = new Date(filters.endDate!);
                return bookingDate <= endDate;
            });
        }

        // Filtro por cliente
        if (filters.customer) {
            filtered = filtered.filter(booking =>
                booking.customerName.toLowerCase().includes(filters.customer.toLowerCase())
            );
        }

        setFilteredBookings(filtered);
        setOpenFilterDialog(false);
        setPage(0); // Resetear a la primera página cuando se aplican filtros
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
        setFilteredBookings(bookings);
        setOpenFilterDialog(false);
        setPage(0); // Resetear a la primera página
    };

    // Handlers para paginación
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Obtener las reservas para la página actual
    const currentPageBookings = filteredBookings.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // Handlers
    const handleOpenDetailDialog = (reservation: any) => {
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

    const handleConfirmCancel = async () => {
        try {
            setLoading(true);
            await cancelBooking(confirmDialog.id);

            setSnackbar({
                open: true,
                message: 'Reserva cancelada correctamente',
                severity: 'success'
            });

            handleCloseCancelDialog();
        } catch (error) {
            console.error('Error al cancelar la reserva:', error);
            setSnackbar({
                open: true,
                message: 'Error al cancelar la reserva',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const formatDate = (date: string) => {
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

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {/* Tabla de Reservas */}
                        {filteredBookings.length > 0 ? (
                            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                <TableContainer>
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
                                            {currentPageBookings.map((booking) => (
                                                <TableRow key={booking.id} sx={{
                                                    backgroundColor: booking.status ? 'inherit' : 'rgba(239, 83, 80, 0.1)'
                                                }}>
                                                    <TableCell>{booking.id}</TableCell>
                                                    <TableCell>{formatDate(booking.date)}</TableCell>
                                                    <TableCell>{booking.customerName}</TableCell>
                                                    <TableCell>{booking.movieName}</TableCell>
                                                    <TableCell>{booking.roomName}</TableCell>
                                                    <TableCell>{booking.seatLabel}</TableCell>
                                                    <TableCell>
                                                        {booking.status ? (
                                                            <Chip label="Activa" color="success" size="small" />
                                                        ) : (
                                                            <Chip label="Cancelada" color="error" size="small" />
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <IconButton color="primary" onClick={() => handleOpenDetailDialog(booking)}>
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                        {booking.status && (
                                                            <IconButton color="error" onClick={() => handleOpenCancelDialog(booking.id)}>
                                                                <CancelIcon />
                                                            </IconButton>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={filteredBookings.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    labelRowsPerPage="Filas por página"
                                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                                />
                            </Paper>
                        ) : (
                            <Alert severity="info">
                                No se encontraron reservas con los criterios seleccionados
                            </Alert>
                        )}
                    </>
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
                                        onChange={(e: any) => setFilters({ ...filters, status: e.target.value })}
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

                {/* Diálogo de Confirmación */}
                <Dialog open={confirmDialog.open} onClose={handleCloseCancelDialog}>
                    <DialogTitle>{confirmDialog.title}</DialogTitle>
                    <DialogContent>
                        <Typography>{confirmDialog.message}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseCancelDialog} color="inherit">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleConfirmCancel}
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

export default ReservationList;
// frontend/src/components/SeatSelection.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Grid as MuiGrid,
    Button,
    Container,
    Stack,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Snackbar,
    CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import WeekendIcon from '@mui/icons-material/Weekend';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Person from '@mui/icons-material/Person';
import { useReservation } from '../context/ReservationContext';

// Crear un componente Grid personalizado para evitar errores de tipado
const Grid = (props: any) => <MuiGrid {...props} />;

// Definir tipo para el status
type SeatStatus = 'available' | 'selected' | 'occupied';

// Interfaz para las props de Seat
interface SeatProps {
    status: SeatStatus;
    children?: React.ReactNode;
    onClick?: () => void;
    elevation?: number;
    sx?: any;
}

// Componente estilizado para asientos con manejo explícito de la prop status
const Seat = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'status',
})<{ status?: SeatStatus }>(({ theme, status }) => ({
    width: '35px',
    height: '35px',
    margin: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: status === 'occupied' ? 'not-allowed' : 'pointer',
    color:
        status === 'selected'
            ? theme.palette.common.white
            : status === 'occupied'
                ? theme.palette.grey[500]
                : theme.palette.grey[700],
    backgroundColor:
        status === 'selected'
            ? theme.palette.primary.main
            : status === 'occupied'
                ? theme.palette.grey[300]
                : theme.palette.common.white,
    transition: 'all 0.2s',
    '&:hover': {
        transform: status !== 'occupied' ? 'scale(1.05)' : 'none',
        backgroundColor:
            status === 'selected'
                ? theme.palette.primary.dark
                : status === 'available'
                    ? theme.palette.primary.light
                    : theme.palette.grey[300],
    },
}));

// Tipo para los asientos
interface SeatData {
    id: number;
    row: string;
    number: number;
    status: SeatStatus;
}

// Interfaz para el cliente
interface CustomerForm {
    name: string;
    lastname: string;
    email: string;
    documentNumber: string;
    phoneNumber: string;
    age: number;
}

const SeatSelection = () => {
    const { billboardId } = useParams<{ billboardId: string }>();
    const navigate = useNavigate();

    const {
        seats,
        selectedBillboard,
        selectedSeats,
        toggleSeatSelection,
        fetchSeats,
        createBooking,
        fetchBookings,
        currentCustomer,
        setCustomer
    } = useReservation();

    const [seatMap, setSeatMap] = useState<SeatData[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [customerForm, setCustomerForm] = useState<CustomerForm>({
        name: '',
        lastname: '',
        email: '',
        documentNumber: '',
        phoneNumber: '',
        age: 18
    });
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof CustomerForm, string | undefined>>>({});
    const [loading, setLoading] = useState(true);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    // Efecto para cargar los asientos cuando cambia el ID de la cartelera
    useEffect(() => {
        const loadSeats = async () => {
            setLoading(true);
            if (billboardId && selectedBillboard?.roomId) {
                await fetchSeats(selectedBillboard.roomId);
            }
            setLoading(false);
        };

        loadSeats();
    }, [billboardId, selectedBillboard, fetchSeats]);

    // Convertir los asientos del contexto al formato que necesitamos
    useEffect(() => {
        if (seats.length > 0) {
            const mappedSeats: SeatData[] = seats.map(seat => {
                let status: SeatStatus = 'available';

                if (!seat.status) {
                    status = 'occupied';
                } else if (selectedSeats.includes(seat.id)) {
                    status = 'selected';
                }

                return {
                    id: seat.id,
                    row: String.fromCharCode(64 + seat.rowNumber),
                    number: seat.number,
                    status
                };
            });

            setSeatMap(mappedSeats);
        }
    }, [seats, selectedSeats]);

    // Manejar clic en un asiento
    const handleSeatClick = (seatId: number) => {
        // Solo permitir seleccionar si no está ocupado
        const seat = seatMap.find(s => s.id === seatId);
        if (seat && seat.status !== 'occupied') {
            toggleSeatSelection(seatId);
        }
    };

    // Agrupar asientos por fila
    const seatsByRow = seatMap.reduce((acc, seat) => {
        if (!acc[seat.row]) {
            acc[seat.row] = [];
        }
        acc[seat.row].push(seat);
        return acc;
    }, {} as Record<string, SeatData[]>);

    // Abre el diálogo para los datos del cliente
    const handleConfirmSelection = () => {
        if (selectedSeats.length === 0) {
            setSnackbar({
                open: true,
                message: 'Selecciona al menos un asiento para continuar',
                severity: 'error'
            });
            return;
        }

        // Si ya hay un cliente seleccionado, usa sus datos
        if (currentCustomer) {
            setCustomerForm({
                name: currentCustomer.name,
                lastname: currentCustomer.lastname,
                email: currentCustomer.email || '',
                documentNumber: currentCustomer.documentNumber,
                phoneNumber: currentCustomer.phoneNumber || '',
                age: currentCustomer.age
            });
        }

        setOpenDialog(true);
    };

    // Cierra el diálogo
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // Maneja los cambios en el formulario
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomerForm({
            ...customerForm,
            [name]: name === 'age' ? parseInt(value, 10) || 0 : value
        });
    };

    // Valida el formulario
    const validateForm = (): boolean => {
        const errors: Partial<Record<keyof CustomerForm, string | undefined>> = {};

        if (!customerForm.name.trim()) {
            errors.name = 'El nombre es requerido';
        }

        if (!customerForm.lastname.trim()) {
            errors.lastname = 'El apellido es requerido';
        }

        if (!customerForm.documentNumber.trim()) {
            errors.documentNumber = 'El número de documento es requerido';
        }

        if (customerForm.email && !/\S+@\S+\.\S+/.test(customerForm.email)) {
            errors.email = 'El email no es válido';
        }

        if (!customerForm.age || customerForm.age < 1) {
            errors.age = 'La edad debe ser mayor a 0';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Envía el formulario
    const handleSubmitForm = async () => {
        if (!validateForm()) {
            return;
        }

        if (!billboardId || !selectedBillboard) {
            setSnackbar({
                open: true,
                message: 'No se ha seleccionado una función',
                severity: 'error'
            });
            return;
        }

        try {
            setLoading(true);

            // Guardar o actualizar el cliente
            const customerData = {
                id: currentCustomer?.id || 1, // En una aplicación real, se generaría un ID
                name: customerForm.name,
                lastname: customerForm.lastname,
                documentNumber: customerForm.documentNumber,
                email: customerForm.email,
                phoneNumber: customerForm.phoneNumber,
                age: customerForm.age
            };

            // Establecer cliente en el contexto
            setCustomer(customerData);

            // Crear las reservas
            await createBooking(Number(billboardId), selectedSeats, customerData.id);

            // Actualizar la lista de reservas - esto es crítico para que aparezcan en la lista de reservas
            await fetchBookings();

            setBookingSuccess(true);
            setSnackbar({
                open: true,
                message: 'Reserva completada con éxito',
                severity: 'success'
            });

            // Cerrar el diálogo
            setOpenDialog(false);

        } catch (error) {
            console.error('Error al crear la reserva:', error);
            setSnackbar({
                open: true,
                message: 'Error al crear la reserva',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Redirige a la lista de reservas
    const handleGoToReservations = () => {
        navigate('/reservations');
    };

    // Cierra el snackbar
    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom align="center" fontWeight="bold">
                Selección de Butacas
            </Typography>

            {bookingSuccess ? (
                <Paper sx={{ p: 4, textAlign: 'center', mb: 4 }}>
                    <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        ¡Reserva Completada con Éxito!
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Tu reserva ha sido registrada correctamente. Puedes ver los detalles en tu lista de reservas.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGoToReservations}
                        sx={{ mt: 2 }}
                    >
                        Ver Mis Reservas
                    </Button>
                </Paper>
            ) : (
                <>
                    {/* Información de la película */}
                    {selectedBillboard && (
                        <Paper sx={{ p: 3, mb: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                {selectedBillboard.movieName}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="body2">
                                        <strong>Fecha:</strong> {new Date(selectedBillboard.date).toLocaleDateString('es-ES')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="body2">
                                        <strong>Hora:</strong> {selectedBillboard.startTime}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="body2">
                                        <strong>Sala:</strong> {selectedBillboard.roomName}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    )}

                    {/* Pantalla */}
                    <Box
                        sx={{
                            width: '80%',
                            height: '30px',
                            bgcolor: 'grey.300',
                            mx: 'auto',
                            mb: 5,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            typography: 'caption',
                            color: 'grey.700',
                            transform: 'perspective(500px) rotateX(-10deg)',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                        }}
                    >
                        PANTALLA
                    </Box>

                    {/* Leyenda */}
                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                        sx={{ mb: 4 }}
                    >
                        <Box display="flex" alignItems="center">
                            <Seat status="available" sx={{ cursor: 'default', '&:hover': { transform: 'none' } }}>
                                <WeekendIcon fontSize="small" />
                            </Seat>
                            <Typography variant="caption" sx={{ ml: 1 }}>Disponible</Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <Seat status="selected" sx={{ cursor: 'default', '&:hover': { transform: 'none', bgcolor: (theme) => theme.palette.primary.main } }}>
                                <WeekendIcon fontSize="small" />
                            </Seat>
                            <Typography variant="caption" sx={{ ml: 1 }}>Seleccionado</Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <Seat status="occupied" sx={{ cursor: 'default', '&:hover': { transform: 'none' } }}>
                                <WeekendIcon fontSize="small" />
                            </Seat>
                            <Typography variant="caption" sx={{ ml: 1 }}>Ocupado</Typography>
                        </Box>
                    </Stack>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {/* Asientos por fila */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {Object.keys(seatsByRow).sort().map(row => (
                                    <Box key={row} sx={{ display: 'flex', mb: 1, alignItems: 'center' }}>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                width: '24px',
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                color: 'grey.600'
                                            }}
                                        >
                                            {row}
                                        </Typography>
                                        <Box sx={{ display: 'flex' }}>
                                            {seatsByRow[row].sort((a, b) => a.number - b.number).map(seat => (
                                                <Seat
                                                    key={seat.id}
                                                    status={seat.status}
                                                    onClick={() => handleSeatClick(seat.id)}
                                                    elevation={seat.status === 'selected' ? 4 : 1}
                                                >
                                                    <Typography variant="caption">{seat.number}</Typography>
                                                </Seat>
                                            ))}
                                        </Box>
                                    </Box>
                                ))}
                            </Box>

                            {/* Resumen de selección */}
                            <Paper sx={{ mt: 5, p: 3, borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Asientos seleccionados:
                                </Typography>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                    {selectedSeats.length > 0 ? (
                                        seatMap
                                            .filter(seat => seat.status === 'selected')
                                            .map(seat => (
                                                <Chip
                                                    key={seat.id}
                                                    label={`${seat.row}${seat.number}`}
                                                    color="primary"
                                                    size="small"
                                                    onDelete={() => handleSeatClick(seat.id)}
                                                />
                                            ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Ningún asiento seleccionado
                                        </Typography>
                                    )}
                                </Box>

                                <Box sx={{ textAlign: 'right' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={selectedSeats.length === 0}
                                        endIcon={<CheckCircleIcon />}
                                        onClick={handleConfirmSelection}
                                    >
                                        Confirmar Selección
                                    </Button>
                                </Box>
                            </Paper>
                        </>
                    )}
                </>
            )}

            {/* Diálogo de Datos del Cliente */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Datos del Cliente</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                name="name"
                                value={customerForm.name}
                                onChange={handleFormChange}
                                error={!!formErrors.name}
                                helperText={formErrors.name}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Apellido"
                                name="lastname"
                                value={customerForm.lastname}
                                onChange={handleFormChange}
                                error={!!formErrors.lastname}
                                helperText={formErrors.lastname}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Número de Documento"
                                name="documentNumber"
                                value={customerForm.documentNumber}
                                onChange={handleFormChange}
                                error={!!formErrors.documentNumber}
                                helperText={formErrors.documentNumber}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Edad"
                                name="age"
                                type="number"
                                value={customerForm.age}
                                onChange={handleFormChange}
                                error={!!formErrors.age}
                                helperText={formErrors.age}
                                InputProps={{ inputProps: { min: 1 } }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={customerForm.email}
                                onChange={handleFormChange}
                                error={!!formErrors.email}
                                helperText={formErrors.email}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Teléfono"
                                name="phoneNumber"
                                value={customerForm.phoneNumber}
                                onChange={handleFormChange}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Resumen de la reserva:
                        </Typography>
                        <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
                            <Typography variant="body2">
                                <strong>Película:</strong> {selectedBillboard?.movieName}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Función:</strong> {selectedBillboard ? `${new Date(selectedBillboard.date).toLocaleDateString('es-ES')} - ${selectedBillboard.startTime}` : ''}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Sala:</strong> {selectedBillboard?.roomName}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Asientos:</strong> {seatMap
                                .filter(seat => seat.status === 'selected')
                                .map(seat => `${seat.row}${seat.number}`)
                                .join(', ')}
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmitForm}
                        color="primary"
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <Person />}
                    >
                        Completar Reserva
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar para notificaciones */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default SeatSelection;
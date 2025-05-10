// frontend/src/components/AdminButaca.tsx
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
    EventSeat as EventSeatIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { useReservation } from '../context/ReservationContext';

// Interfaz para butaca
interface SeatForm {
    id: number;
    number: number;
    rowNumber: number;
    roomId: number;
    roomName: string;
    status: boolean;
}

const AdminButaca = () => {
    // Estados del contexto
    const { rooms, seats, fetchRooms, fetchSeats } = useReservation();

    // Estados locales
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSeat, setCurrentSeat] = useState<SeatForm>({
        id: 0,
        number: 0,
        rowNumber: 0,
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
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: '',
        message: '',
        id: 0,
        action: '' as 'delete' | 'toggle'
    });

    // Cargar salas al iniciar
    useEffect(() => {
        const loadRooms = async () => {
            setLoading(true);
            if (rooms.length === 0) {
                await fetchRooms();
            }
            setLoading(false);
        };

        loadRooms();
    }, [fetchRooms, rooms.length]);

    // Cargar asientos cuando cambia la sala seleccionada
    useEffect(() => {
        const loadSeats = async () => {
            if (selectedRoom) {
                setLoading(true);
                await fetchSeats(selectedRoom);
                setLoading(false);
            }
        };

        loadSeats();
    }, [selectedRoom, fetchSeats]);

    // Handlers
    const handleRoomChange = (event: any) => {
        setSelectedRoom(event.target.value as number);
    };

    const handleOpenDialog = (seat?: any) => {
        if (seat) {
            setCurrentSeat({
                id: seat.id,
                number: seat.number,
                rowNumber: seat.rowNumber,
                roomId: seat.roomId,
                roomName: seat.roomName,
                status: seat.status
            });
            setIsEditing(true);
        } else {
            setCurrentSeat({
                id: 0,
                number: 0,
                rowNumber: 0,
                roomId: selectedRoom || 0,
                roomName: rooms.find(r => r.id === selectedRoom)?.name || '',
                status: true
            });
            setIsEditing(false);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentSeat({
            ...currentSeat,
            [name]: name === 'number' || name === 'rowNumber' ? parseInt(value) : value
        });
    };

    const handleRoomSelectionChange = (event: any) => {
        const roomId = event.target.value as number;
        const selectedRoom = rooms.find(r => r.id === roomId);

        setCurrentSeat({
            ...currentSeat,
            roomId,
            roomName: selectedRoom?.name || ''
        });
    };

    const handleOpenConfirmDialog = (id: number, action: 'delete' | 'toggle') => {
        const title = action === 'delete' ? 'Eliminar Butaca' : 'Cambiar Estado de Butaca';
        const message = action === 'delete'
            ? '¿Está seguro de que desea eliminar esta butaca? Esta acción no se puede deshacer.'
            : '¿Está seguro de que desea cambiar el estado de esta butaca?';

        setConfirmDialog({
            open: true,
            title,
            message,
            id,
            action
        });
    };

    const handleCloseConfirmDialog = () => {
        setConfirmDialog({
            ...confirmDialog,
            open: false
        });
    };

    const handleConfirmAction = () => {
        if (confirmDialog.action === 'delete') {
            handleDelete(confirmDialog.id);
        } else {
            handleToggleStatus(confirmDialog.id);
        }
        handleCloseConfirmDialog();
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            // Agregar validaciones básicas
            if (currentSeat.number <= 0 || currentSeat.rowNumber <= 0 || !currentSeat.roomId) {
                setSnackbar({
                    open: true,
                    message: 'Por favor, complete todos los campos correctamente',
                    severity: 'error'
                });
                setLoading(false);
                return;
            }

            // En una aplicación real, aquí se enviaría la información a la API
            const message = isEditing
                ? 'Butaca actualizada correctamente'
                : 'Butaca creada correctamente';

            // Simulamos la actualización local
            if (isEditing) {
                // Actualizar butaca existente
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const updatedSeats = seats.map(seat =>
                    seat.id === currentSeat.id
                        ? {
                            ...seat,
                            number: currentSeat.number,
                            rowNumber: currentSeat.rowNumber,
                            roomId: currentSeat.roomId
                        }
                        : seat
                );
                // En un caso real, aquí se enviaría la actualización al servidor y luego se refrescarían los datos
            } else {
                // Crear nueva butaca
                const newId = seats.length > 0 ? Math.max(...seats.map(s => s.id)) + 1 : 1;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const newSeat = {
                    ...currentSeat,
                    id: newId
                };
                // En un caso real, aquí se enviaría la nueva butaca al servidor y luego se refrescarían los datos
            }

            // Simular retardo de red y refrescar datos
            await new Promise(resolve => setTimeout(resolve, 500));
            await fetchSeats(currentSeat.roomId);

            setSnackbar({
                open: true,
                message,
                severity: 'success'
            });

            handleCloseDialog();
        } catch (error) {
            console.error('Error al guardar la butaca:', error);
            setSnackbar({
                open: true,
                message: 'Error al guardar la butaca',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            setLoading(true);

            // En una aplicación real, aquí se enviaría la eliminación a la API
            // Simulamos eliminación local
            const seatToDelete = seats.find(seat => seat.id === id);

            if (!seatToDelete) {
                throw new Error('Butaca no encontrada');
            }

            // Simulamos retardo de red
            await new Promise(resolve => setTimeout(resolve, 500));

            // Recargar los asientos (en una app real, esto se haría después de la respuesta exitosa de la API)
            await fetchSeats(selectedRoom!);

            setSnackbar({
                open: true,
                message: 'Butaca eliminada correctamente',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error al eliminar la butaca:', error);
            setSnackbar({
                open: true,
                message: 'Error al eliminar la butaca',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id: number) => {
        try {
            setLoading(true);

            // En una aplicación real, aquí se enviaría la actualización a la API
            const targetSeat = seats.find(seat => seat.id === id);

            if (!targetSeat) {
                throw new Error('Butaca no encontrada');
            }

            const newStatus = !targetSeat.status;
            const action = newStatus ? 'habilitada' : 'deshabilitada';

            // Simulamos la actualización local
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const updatedSeats = seats.map(seat =>
                seat.id === id ? { ...seat, status: newStatus } : seat
            );

            // Simulamos retardo de red
            await new Promise(resolve => setTimeout(resolve, 500));

            // Recargar los asientos (en una app real, esto se haría después de la respuesta exitosa de la API)
            await fetchSeats(selectedRoom!);

            setSnackbar({
                open: true,
                message: `Butaca ${action} correctamente`,
                severity: 'success'
            });
        } catch (error) {
            console.error('Error al cambiar el estado de la butaca:', error);
            setSnackbar({
                open: true,
                message: 'Error al cambiar el estado de la butaca',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Administración de Butacas
            </Typography>

            {/* Selección de Sala */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="room-select-label">Seleccionar Sala</InputLabel>
                                <Select
                                    labelId="room-select-label"
                                    id="room-select"
                                    value={selectedRoom || ''}
                                    label="Seleccionar Sala"
                                    onChange={handleRoomChange}
                                >
                                    <MenuItem value="">
                                        <em>Seleccione una sala</em>
                                    </MenuItem>
                                    {rooms.map((room) => (
                                        <MenuItem key={room.id} value={room.id}>
                                            {room.name} (Sala {room.number})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog()}
                                disabled={!selectedRoom}
                                fullWidth
                            >
                                Agregar Nueva Butaca
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* Tabla de Butacas */}
                    {selectedRoom ? (
                        seats.length > 0 ? (
                            <TableContainer component={Paper} sx={{ mb: 4 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Fila</TableCell>
                                            <TableCell>Número</TableCell>
                                            <TableCell>Sala</TableCell>
                                            <TableCell>Estado</TableCell>
                                            <TableCell align="center">Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {seats.map((seat) => (
                                            <TableRow key={seat.id}>
                                                <TableCell>{seat.id}</TableCell>
                                                <TableCell>{String.fromCharCode(64 + seat.rowNumber)}</TableCell>
                                                <TableCell>{seat.number}</TableCell>
                                                <TableCell>{selectedRoom}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        {seat.status ? (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                                                                <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
                                                                Activa
                                                            </Box>
                                                        ) : (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                                                                <CancelIcon fontSize="small" sx={{ mr: 1 }} />
                                                                Inactiva
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton color="primary" onClick={() => handleOpenDialog(seat)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton color="error" onClick={() => handleOpenConfirmDialog(seat.id, 'delete')}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        color={seat.status ? "warning" : "success"}
                                                        onClick={() => handleOpenConfirmDialog(seat.id, 'toggle')}
                                                    >
                                                        <EventSeatIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                No hay butacas registradas para esta sala
                            </Alert>
                        )
                    ) : (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            Seleccione una sala para ver sus butacas
                        </Alert>
                    )}
                </>
            )}

            {/* Formulario de Butaca */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? 'Editar Butaca' : 'Agregar Butaca'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Número de Butaca"
                                name="number"
                                type="number"
                                value={currentSeat.number}
                                onChange={handleInputChange}
                                InputProps={{ inputProps: { min: 1 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Número de Fila"
                                name="rowNumber"
                                type="number"
                                value={currentSeat.rowNumber}
                                onChange={handleInputChange}
                                InputProps={{ inputProps: { min: 1 } }}
                                helperText={`Fila ${String.fromCharCode(64 + (currentSeat.rowNumber || 0))}`}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="seat-room-label">Sala</InputLabel>
                                <Select
                                    labelId="seat-room-label"
                                    name="roomId"
                                    value={currentSeat.roomId || ''}
                                    label="Sala"
                                    onChange={handleRoomSelectionChange}
                                >
                                    {rooms.map((room) => (
                                        <MenuItem key={room.id} value={room.id}>
                                            {room.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
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
                        disabled={
                            !currentSeat.number ||
                            !currentSeat.rowNumber ||
                            !currentSeat.roomId ||
                            loading
                        }
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
    );
};

export default AdminButaca;
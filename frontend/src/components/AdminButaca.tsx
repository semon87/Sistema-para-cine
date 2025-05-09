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

// Tipos para los datos
interface Room {
    id: number;
    name: string;
    number: number;
}

interface Seat {
    id: number;
    number: number;
    rowNumber: number;
    roomId: number;
    roomName: string;
    status: boolean;
}

const AdminButaca = () => {
    // Estados
    const [rooms, setRooms] = useState<Room[]>([]);
    const [seats, setSeats] = useState<Seat[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSeat, setCurrentSeat] = useState<Seat>({
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

    // Simular carga de datos (en una aplicación real, esto sería una llamada a la API)
    useEffect(() => {
        // Simular salas
        const mockRooms: Room[] = [
            { id: 1, name: 'Sala Normal', number: 1 },
            { id: 2, name: 'Sala 3D', number: 2 },
            { id: 3, name: 'Sala VIP', number: 3 },
        ];
        setRooms(mockRooms);
    }, []);

    // Cargar asientos cuando cambia la sala seleccionada
    useEffect(() => {
        if (selectedRoom) {
            // Simular carga de asientos para la sala seleccionada
            const mockSeats: Seat[] = [];

            // Generar filas A-F
            const rows = ['A', 'B', 'C', 'D', 'E', 'F'];

            // Número de asientos por fila (depende de la sala)
            const seatsPerRow = selectedRoom === 3 ? 8 : 10;

            rows.forEach((row, rowIndex) => {
                for (let i = 1; i <= seatsPerRow; i++) {
                    mockSeats.push({
                        id: (rowIndex * seatsPerRow) + i,
                        number: i,
                        rowNumber: rowIndex + 1,
                        roomId: selectedRoom,
                        roomName: rooms.find(r => r.id === selectedRoom)?.name || '',
                        status: Math.random() > 0.1 // 10% de asientos deshabilitados
                    });
                }
            });

            setSeats(mockSeats);
        }
    }, [selectedRoom, rooms]);

    // Handlers
    const handleRoomChange = (event: any) => {
        setSelectedRoom(event.target.value as number);
    };

    const handleOpenDialog = (seat?: Seat) => {
        if (seat) {
            setCurrentSeat(seat);
            setIsEditing(true);
        } else {
            setCurrentSeat({
                id: 0,
                number: 0,
                rowNumber: 0,
                roomId: selectedRoom || 0,
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentSeat({
            ...currentSeat,
            [name]: name === 'number' || name === 'rowNumber' ? parseInt(value) : value
        });
    };

    const handleSubmit = () => {
        // En una aplicación real, aquí haríamos una llamada a la API
        if (isEditing) {
            // Actualizar asiento existente
            setSeats(seats.map(seat => seat.id === currentSeat.id ? currentSeat : seat));
            setSnackbar({
                open: true,
                message: 'Butaca actualizada correctamente',
                severity: 'success'
            });
        } else {
            // Crear nuevo asiento
            const newSeat = {
                ...currentSeat,
                id: Math.max(...seats.map(s => s.id), 0) + 1,
                roomName: rooms.find(r => r.id === currentSeat.roomId)?.name || ''
            };
            setSeats([...seats, newSeat]);
            setSnackbar({
                open: true,
                message: 'Butaca creada correctamente',
                severity: 'success'
            });
        }
        handleCloseDialog();
    };

    const handleDelete = (id: number) => {
        // En una aplicación real, aquí haríamos una llamada a la API
        setSeats(seats.filter(seat => seat.id !== id));
        setSnackbar({
            open: true,
            message: 'Butaca eliminada correctamente',
            severity: 'success'
        });
    };

    const handleToggleStatus = (id: number) => {
        // En una aplicación real, aquí haríamos una llamada a la API
        setSeats(seats.map(seat => {
            if (seat.id === id) {
                return { ...seat, status: !seat.status };
            }
            return seat;
        }));

        // Determinar si se está habilitando o deshabilitando
        const targetSeat = seats.find(seat => seat.id === id);
        const action = targetSeat?.status ? 'deshabilitada' : 'habilitada';

        setSnackbar({
            open: true,
            message: `Butaca ${action} correctamente`,
            severity: 'success'
        });
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

            {/* Tabla de Butacas */}
            {selectedRoom ? (
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
                                    <TableCell>{seat.roomName}</TableCell>
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
                                        <IconButton color="error" onClick={() => handleDelete(seat.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton
                                            color={seat.status ? "warning" : "success"}
                                            onClick={() => handleToggleStatus(seat.id)}
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
                    Seleccione una sala para ver sus butacas
                </Alert>
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
                                    onChange={(e: any) => setCurrentSeat({
                                        ...currentSeat,
                                        roomId: e.target.value as number
                                    })}
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
                    <Button onClick={handleSubmit} color="primary" variant="contained">
                        {isEditing ? 'Actualizar' : 'Crear'}
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
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid as MuiGrid,
    Button,
    Container,
    Stack,
    Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import WeekendIcon from '@mui/icons-material/Weekend';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
    id: string;
    row: string;
    number: number;
    status: SeatStatus;
}

const SeatSelection = () => {
    // Generar datos de ejemplo para asientos
    const generateSeats = () => {
        const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
        const seatsPerRow = 10;
        const seats: SeatData[] = [];

        rows.forEach(row => {
            for (let i = 1; i <= seatsPerRow; i++) {
                // Asignar aleatoriamente algunos asientos como ocupados
                const isOccupied = Math.random() < 0.2;
                seats.push({
                    id: `${row}${i}`,
                    row,
                    number: i,
                    status: isOccupied ? 'occupied' : 'available',
                });
            }
        });

        return seats;
    };

    const [seats, setSeats] = useState<SeatData[]>(generateSeats());
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    // Manejar clic en un asiento
    const handleSeatClick = (seatId: string) => {
        const updatedSeats = seats.map(seat => {
            if (seat.id === seatId && seat.status !== 'occupied') {
                const newStatus: SeatStatus = seat.status === 'available' ? 'selected' : 'available';

                // Actualizar la lista de asientos seleccionados
                if (newStatus === 'selected') {
                    setSelectedSeats([...selectedSeats, seatId]);
                } else {
                    setSelectedSeats(selectedSeats.filter(id => id !== seatId));
                }

                return { ...seat, status: newStatus };
            }
            return seat;
        });

        setSeats(updatedSeats);
    };

    // Agrupar asientos por fila
    const seatsByRow = seats.reduce((acc, seat) => {
        if (!acc[seat.row]) {
            acc[seat.row] = [];
        }
        acc[seat.row].push(seat);
        return acc;
    }, {} as Record<string, SeatData[]>);

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom align="center" fontWeight="bold">
                Selección de Butacas
            </Typography>

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

            {/* Asientos por fila */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {Object.keys(seatsByRow).map(row => (
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
                            {seatsByRow[row].map(seat => (
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
                        selectedSeats.map(seatId => (
                            <Chip
                                key={seatId}
                                label={seatId}
                                color="primary"
                                size="small"
                                onDelete={() => handleSeatClick(seatId)}
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
                    >
                        Confirmar Selección
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default SeatSelection;
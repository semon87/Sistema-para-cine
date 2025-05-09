// frontend/src/context/ReservationContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

// Interfaces
export interface Movie {
    id: number;
    name: string;
    genre: string;
    allowedAge: number;
    lengthMinutes: number;
}

export interface Room {
    id: number;
    name: string;
    number: number;
}

export interface Seat {
    id: number;
    number: number;
    rowNumber: number;
    roomId: number;
    status: boolean;
}

export interface Billboard {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    movieId: number;
    movieName: string;
    roomId: number;
    roomName: string;
    status: boolean; // Agregar esta propiedad
}

export interface Customer {
    id: number;
    name: string;
    lastname: string;
    documentNumber: string;
    email: string;
    phoneNumber: string;
    age: number;
}

export interface Booking {
    id: number;
    date: string;
    customerId: number;
    customerName: string;
    seatId: number;
    seatLabel: string;
    billboardId: number;
    movieName: string;
    roomName: string;
    status: boolean;
}

// Estado del contexto
interface ReservationContextState {
    // Datos
    movies: Movie[];
    rooms: Room[];
    billboards: Billboard[];
    seats: Seat[];
    bookings: Booking[];
    selectedMovie: Movie | null;
    selectedBillboard: Billboard | null;
    selectedSeats: number[];
    currentCustomer: Customer | null;

    // Funciones
    fetchMovies: () => Promise<void>;
    fetchRooms: () => Promise<void>;
    fetchBillboards: (date?: string) => Promise<void>;
    fetchSeats: (roomId: number) => Promise<void>;
    fetchBookings: (customerId?: number) => Promise<void>;
    selectMovie: (movie: Movie | null) => void;
    selectBillboard: (billboard: Billboard | null) => void;
    toggleSeatSelection: (seatId: number) => void;
    setCustomer: (customer: Customer | null) => void;
    createBooking: (billboardId: number, seatIds: number[], customerId: number) => Promise<number>;
    cancelBooking: (bookingId: number) => Promise<void>;
}

// Crear contexto con un valor inicial
const ReservationContext = createContext<ReservationContextState | undefined>(undefined);

// Props para el proveedor del contexto
interface ReservationProviderProps {
    children: ReactNode;
}

// Proveedor del contexto
export const ReservationProvider: React.FC<ReservationProviderProps> = ({ children }) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [billboards, setBillboards] = useState<Billboard[]>([]);
    const [seats, setSeats] = useState<Seat[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [selectedBillboard, setSelectedBillboard] = useState<Billboard | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

    // Función para cargar películas
    const fetchMovies = useCallback(async (): Promise<void> => {
        // En una aplicación real, esto sería una llamada a la API
        const mockMovies: Movie[] = [
            { id: 1, name: 'Aventuras Cósmicas', genre: 'SCIENCE_FICTION', allowedAge: 12, lengthMinutes: 120 },
            { id: 2, name: 'El Misterio del Bosque', genre: 'THRILLER', allowedAge: 16, lengthMinutes: 95 },
            { id: 3, name: 'Amor en París', genre: 'ROMANCE', allowedAge: 12, lengthMinutes: 110 },
            { id: 4, name: 'Superhéroes Unidos', genre: 'ACTION', allowedAge: 12, lengthMinutes: 140 },
            { id: 5, name: 'Risas Aseguradas', genre: 'COMEDY', allowedAge: 7, lengthMinutes: 90 },
            { id: 6, name: 'Terror en la Oscuridad', genre: 'HORROR', allowedAge: 18, lengthMinutes: 105 },
        ];

        // Simulamos un retardo de red
        await new Promise(resolve => setTimeout(resolve, 500));

        setMovies(mockMovies);
    }, []);

    // Función para cargar salas
    const fetchRooms = useCallback(async (): Promise<void> => {
        // En una aplicación real, esto sería una llamada a la API
        const mockRooms: Room[] = [
            { id: 1, name: 'Sala Normal', number: 1 },
            { id: 2, name: 'Sala 3D', number: 2 },
            { id: 3, name: 'Sala VIP', number: 3 },
        ];

        // Simulamos un retardo de red
        await new Promise(resolve => setTimeout(resolve, 300));

        setRooms(mockRooms);
    }, []);

    // Función para cargar cartelera
    const fetchBillboards = useCallback(async (date?: string): Promise<void> => {
        // En una aplicación real, esto sería una llamada a la API con la fecha como parámetro
        const today = date ? new Date(date) : new Date();

        const mockBillboards: Billboard[] = [];
        const movieIds = [1, 2, 3, 4, 5, 6];
        const roomIds = [1, 2, 3];

        // Generar carteleras para la fecha especificada
        for (let i = 0; i < 8; i++) {
            const movieId = movieIds[i % movieIds.length];
            const roomId = roomIds[i % roomIds.length];
            const movieName = movies.find(m => m.id === movieId)?.name || `Película ${movieId}`;
            const roomName = rooms.find(r => r.id === roomId)?.name || `Sala ${roomId}`;

            // Diferentes horarios
            const startTimes = ['14:30', '17:00', '19:30', '22:00'];
            const startTime = startTimes[i % startTimes.length];

            // Calcular hora de fin (estimada)
            const lengthMinutes = movies.find(m => m.id === movieId)?.lengthMinutes || 120;
            const [hours, minutes] = startTime.split(':').map(Number);
            const endHour = hours + Math.floor((minutes + lengthMinutes) / 60);
            const endMinute = (minutes + lengthMinutes) % 60;
            const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

            mockBillboards.push({
                id: i + 1,
                date: today.toISOString().split('T')[0],
                startTime,
                endTime,
                movieId,
                movieName,
                roomId,
                roomName,
                status: true // Agregar esta propiedad
            });
        }

        // Simulamos un retardo de red
        await new Promise(resolve => setTimeout(resolve, 600));

        setBillboards(mockBillboards);
    }, [movies, rooms]);

    // Función para cargar butacas
    const fetchSeats = useCallback(async (roomId: number): Promise<void> => {
        // En una aplicación real, esto sería una llamada a la API
        const mockSeats: Seat[] = [];

        // Generar filas A-F (1-6) y columnas 1-10
        for (let row = 1; row <= 6; row++) {
            for (let col = 1; col <= 10; col++) {
                mockSeats.push({
                    id: (row - 1) * 10 + col,
                    number: col,
                    rowNumber: row,
                    roomId,
                    status: Math.random() > 0.2 // 20% de asientos ocupados
                });
            }
        }

        // Simulamos un retardo de red
        await new Promise(resolve => setTimeout(resolve, 400));

        setSeats(mockSeats);
    }, []);

    // Función para cargar reservas
    const fetchBookings = useCallback(async (customerId?: number): Promise<void> => {
        // En una aplicación real, esto sería una llamada a la API
        const mockBookings: Booking[] = [];

        // Generar algunas reservas de ejemplo
        for (let i = 1; i <= 10; i++) {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 10));

            const mockCustomerId = customerId || (Math.floor(Math.random() * 3) + 1);
            const mockCustomerName = ['Juan Pérez', 'María González', 'Carlos Rodríguez'][mockCustomerId - 1];

            const mockMovieId = Math.floor(Math.random() * 6) + 1;
            const mockMovieName = movies.find(m => m.id === mockMovieId)?.name || 'Película Desconocida';

            const mockRoomId = Math.floor(Math.random() * 3) + 1;
            const mockRoomName = rooms.find(r => r.id === mockRoomId)?.name || 'Sala Desconocida';

            // Generar una letra de fila (A-F) y un número de asiento (1-10)
            const rowLetter = String.fromCharCode(65 + Math.floor(Math.random() * 6));
            const seatNumber = Math.floor(Math.random() * 10) + 1;

            mockBookings.push({
                id: i,
                date: date.toISOString().split('T')[0],
                customerId: mockCustomerId,
                customerName: mockCustomerName,
                seatId: (rowLetter.charCodeAt(0) - 65) * 10 + seatNumber,
                seatLabel: `${rowLetter}${seatNumber}`,
                billboardId: Math.floor(Math.random() * 8) + 1,
                movieName: mockMovieName,
                roomName: mockRoomName,
                status: Math.random() > 0.2 // 20% de reservas canceladas
            });
        }

        // Simulamos un retardo de red
        await new Promise(resolve => setTimeout(resolve, 500));

        setBookings(mockBookings);
    }, [movies, rooms]);

    // Función para seleccionar una película
    const selectMovie = useCallback((movie: Movie | null) => {
        setSelectedMovie(movie);
        setSelectedBillboard(null); // Reinicia la selección de cartelera
        setSelectedSeats([]); // Reinicia la selección de asientos
    }, []);

    // Función para seleccionar una cartelera
    const selectBillboard = useCallback((billboard: Billboard | null) => {
        setSelectedBillboard(billboard);
        setSelectedSeats([]); // Reinicia la selección de asientos
    }, []);

    // Función para alternar la selección de un asiento
    const toggleSeatSelection = useCallback((seatId: number) => {
        setSelectedSeats(prevSelectedSeats => {
            if (prevSelectedSeats.includes(seatId)) {
                return prevSelectedSeats.filter(id => id !== seatId);
            } else {
                return [...prevSelectedSeats, seatId];
            }
        });
    }, []);

    // Función para establecer el cliente actual
    const setCustomer = useCallback((customer: Customer | null) => {
        setCurrentCustomer(customer);
    }, []);

    // Función para crear una reserva
    const createBooking = useCallback(async (billboardId: number, seatIds: number[], customerId: number): Promise<number> => {
        // En una aplicación real, esto sería una llamada a la API
        const newBookings: Booking[] = [];

        const billboard = billboards.find(b => b.id === billboardId);
        let bookingId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) : 0;

        for (const seatId of seatIds) {
            bookingId++;
            const seat = seats.find(s => s.id === seatId);

            if (billboard && seat) {
                const rowLetter = String.fromCharCode(64 + seat.rowNumber);

                const newBooking: Booking = {
                    id: bookingId,
                    date: new Date().toISOString().split('T')[0],
                    customerId,
                    customerName: currentCustomer ? `${currentCustomer.name} ${currentCustomer.lastname}` : 'Cliente',
                    seatId,
                    seatLabel: `${rowLetter}${seat.number}`,
                    billboardId,
                    movieName: billboard.movieName,
                    roomName: billboard.roomName,
                    status: true
                };

                newBookings.push(newBooking);
            }
        }

        // Simulamos un retardo de red
        await new Promise(resolve => setTimeout(resolve, 800));

        // Actualizar el estado
        setBookings(prevBookings => [...prevBookings, ...newBookings]);

        // Actualizar el estado de los asientos
        setSeats(prevSeats =>
            prevSeats.map(seat =>
                seatIds.includes(seat.id) ? { ...seat, status: false } : seat
            )
        );

        // Devolver el ID de la última reserva creada (útil si se crea solo una)
        return bookingId;
    }, [billboards, bookings, seats, currentCustomer]);

    // Función para cancelar una reserva
    const cancelBooking = useCallback(async (bookingId: number): Promise<void> => {
        // En una aplicación real, esto sería una llamada a la API
        const booking = bookings.find(b => b.id === bookingId);

        // Simulamos un retardo de red
        await new Promise(resolve => setTimeout(resolve, 600));

        if (booking) {
            // Actualizar el estado de la reserva
            setBookings(prevBookings =>
                prevBookings.map(b =>
                    b.id === bookingId ? { ...b, status: false } : b
                )
            );

            // Actualizar el estado del asiento
            setSeats(prevSeats =>
                prevSeats.map(seat =>
                    seat.id === booking.seatId ? { ...seat, status: true } : seat
                )
            );
        }
    }, [bookings]);

    // Cargar datos iniciales
    useEffect(() => {
        fetchMovies();
        fetchRooms();
    }, [fetchMovies, fetchRooms]);

    // Valor del contexto
    const contextValue: ReservationContextState = {
        movies,
        rooms,
        billboards,
        seats,
        bookings,
        selectedMovie,
        selectedBillboard,
        selectedSeats,
        currentCustomer,
        fetchMovies,
        fetchRooms,
        fetchBillboards,
        fetchSeats,
        fetchBookings,
        selectMovie,
        selectBillboard,
        toggleSeatSelection,
        setCustomer,
        createBooking,
        cancelBooking
    };

    return (
        <ReservationContext.Provider value={contextValue}>
            {children}
        </ReservationContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useReservation = () => {
    const context = useContext(ReservationContext);
    if (context === undefined) {
        throw new Error('useReservation debe ser usado dentro de un ReservationProvider');
    }
    return context;
};
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

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
}

export interface Customer {
    id: number;
    name: string;
    lastname: string;
    documentNumber: string;
    email: string;
    phoneNumber: string;
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

    // Cargar datos de ejemplo al iniciar
    useEffect(() => {
        fetchMovies();
    }, []);

    // Función para cargar películas
    const fetchMovies = async (): Promise<void> => {
        // En una aplicación real, esto sería una llamada a la API
        const mockMovies: Movie[] = [
            { id: 1, name: 'Aventuras Cósmicas', genre: 'SCIENCE_FICTION', allowedAge: 12, lengthMinutes: 120 },
            { id: 2, name: 'El Misterio del Bosque', genre: 'THRILLER', allowedAge: 16, lengthMinutes: 95 },
            { id: 3, name: 'Amor en París', genre: 'ROMANCE', allowedAge: 12, lengthMinutes: 110 },
            { id: 4, name: 'Superhéroes Unidos', genre: 'ACTION', allowedAge: 12, lengthMinutes: 140 },
            { id: 5, name: 'Risas Aseguradas', genre: 'COMEDY', allowedAge: 7, lengthMinutes: 90 },
            { id: 6, name: 'Terror en la Oscuridad', genre: 'HORROR', allowedAge: 18, lengthMinutes: 105 },
        ];
        setMovies(mockMovies);

        // También cargar las salas
        const mockRooms: Room[] = [
            { id: 1, name: 'Sala Normal', number: 1 },
            { id: 2, name: 'Sala 3D', number: 2 },
            { id: 3, name: 'Sala VIP', number: 3 },
        ];
        setRooms(mockRooms);
    };

    // Función para cargar cartelera
    const fetchBillboards = async (date?: string): Promise<void> => {
        // En una aplicación real, esto sería una llamada a la API con la fecha como parámetro
        const today = date ? new Date(date) : new Date();

        const mockBillboards: Billboard[] = [];
        const movieIds = movies.map(m => m.id);
        const roomIds = rooms.map(r => r.id);

        // Generar carteleras para la fecha especificada
        for (let i = 0; i < 8; i++) {
            const movieId = movieIds[i % movieIds.length];
            const roomId = roomIds[i % roomIds.length];
            const movie = movies.find(m => m.id === movieId);
            const room = rooms.find(r => r.id === roomId);

            if (movie && room) {
                // Diferentes horarios
                const startTimes = ['14:30', '17:00', '19:30', '22:00'];
                const startTime = startTimes[i % startTimes.length];

                // Calcular hora de fin basada en la duración de la película
                const [hours, minutes] = startTime.split(':').map(Number);
                const endHour = hours + Math.floor((minutes + movie.lengthMinutes) / 60);
                const endMinute = (minutes + movie.lengthMinutes) % 60;
                const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

                mockBillboards.push({
                    id: i + 1,
                    date: today.toISOString().split('T')[0],
                    startTime,
                    endTime,
                    movieId: movie.id,
                    movieName: movie.name,
                    roomId: room.id,
                    roomName: room.name
                });
            }
        }

        setBillboards(mockBillboards);
    };

    // Función para cargar butacas
    const fetchSeats = async (roomId: number): Promise<void> => {
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

        setSeats(mockSeats);
    };

    // Función para cargar reservas
    const fetchBookings = async (customerId?: number): Promise<void> => {
        // En una aplicación real, esto sería una llamada a la API
        const mockBookings: Booking[] = [];

        // Generar algunas reservas de ejemplo
        for (let i = 1; i <= 10; i++) {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 10));

            const mockCustomerId = customerId || (Math.floor(Math.random() * 3) + 1);
            const mockCustomerName = ['Juan Pérez', 'María González', 'Carlos Rodríguez'][mockCustomerId - 1];

            const mockMovieName = movies[Math.floor(Math.random() * movies.length)]?.name || 'Película Desconocida';
            const mockRoomName = rooms[Math.floor(Math.random() * rooms.length)]?.name || 'Sala Desconocida';

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
                billboardId: Math.floor(Math.random() * 10) + 1,
                movieName: mockMovieName,
                roomName: mockRoomName,
                status: Math.random() > 0.2 // 20% de reservas canceladas
            });
        }

        setBookings(mockBookings);
    };

    // Función para seleccionar una película
    const selectMovie = (movie: Movie | null) => {
        setSelectedMovie(movie);
        setSelectedBillboard(null); // Reinicia la selección de cartelera
        setSelectedSeats([]); // Reinicia la selección de asientos
    };

    // Función para seleccionar una cartelera
    const selectBillboard = (billboard: Billboard | null) => {
        setSelectedBillboard(billboard);
        setSelectedSeats([]); // Reinicia la selección de asientos

        // Si se selecciona una cartelera, también carga los asientos de esa sala
        if (billboard) {
            fetchSeats(billboard.roomId);
        }
    };

    // Función para alternar la selección de un asiento
    const toggleSeatSelection = (seatId: number) => {
        setSelectedSeats(prevSelectedSeats => {
            if (prevSelectedSeats.includes(seatId)) {
                return prevSelectedSeats.filter(id => id !== seatId);
            } else {
                return [...prevSelectedSeats, seatId];
            }
        });
    };

    // Función para establecer el cliente actual
    const setCustomer = (customer: Customer | null) => {
        setCurrentCustomer(customer);
    };

    // Función para crear una reserva
    const createBooking = async (billboardId: number, seatIds: number[], customerId: number): Promise<number> => {
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
    };

    // Función para cancelar una reserva
    const cancelBooking = async (bookingId: number): Promise<void> => {
        // En una aplicación real, esto sería una llamada a la API
        const booking = bookings.find(b => b.id === bookingId);

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
    };

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
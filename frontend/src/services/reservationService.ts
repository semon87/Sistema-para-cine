import axios from 'axios';

// URL base de la API
const API_URL = 'http://localhost:8080/api';

// Interfaces
export interface MovieDto {
    id: number;
    name: string;
    genre: string;
    allowedAge: number;
    lengthMinutes: number;
    status: boolean;
}

export interface RoomDto {
    id: number;
    name: string;
    number: number;
    status: boolean;
}

export interface SeatDto {
    id: number;
    number: number;
    rowNumber: number;
    roomId: number;
    roomName: string;
    status: boolean;
}

export interface BillboardDto {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    movieId: number;
    movieName: string;
    roomId: number;
    roomName: string;
    status: boolean;
}

export interface CustomerDto {
    id: number;
    documentNumber: string;
    name: string;
    lastname: string;
    age: number;
    phoneNumber: string;
    email: string;
    status: boolean;
}

export interface BookingDto {
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

// Métodos para películas
export const getMovies = async (): Promise<MovieDto[]> => {
    try {
        const response = await axios.get(`${API_URL}/movies`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener películas:', error);
        return [];
    }
};

export const getMoviesByGenre = async (genre: string): Promise<MovieDto[]> => {
    try {
        const response = await axios.get(`${API_URL}/movies/genre/${genre}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener películas por género ${genre}:`, error);
        return [];
    }
};

// Métodos para salas
export const getRooms = async (): Promise<RoomDto[]> => {
    try {
        const response = await axios.get(`${API_URL}/rooms`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener salas:', error);
        return [];
    }
};

// Métodos para butacas
export const getSeatsByRoom = async (roomId: number): Promise<SeatDto[]> => {
    try {
        const response = await axios.get(`${API_URL}/seats/room/${roomId}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener butacas por sala ${roomId}:`, error);
        return [];
    }
};

export const disableSeat = async (seatId: number): Promise<void> => {
    try {
        await axios.put(`${API_URL}/seats/${seatId}/disable`);
    } catch (error) {
        console.error(`Error al deshabilitar butaca ${seatId}:`, error);
        throw error;
    }
};

export const enableSeat = async (seatId: number): Promise<void> => {
    try {
        await axios.put(`${API_URL}/seats/${seatId}/enable`);
    } catch (error) {
        console.error(`Error al habilitar butaca ${seatId}:`, error);
        throw error;
    }
};

// Métodos para cartelera
export const getBillboardsByDate = async (date: string): Promise<BillboardDto[]> => {
    try {
        const response = await axios.get(`${API_URL}/billboards/date/${date}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener cartelera por fecha ${date}:`, error);
        return [];
    }
};

export const getBillboardsByDateRange = async (startDate: string, endDate: string): Promise<BillboardDto[]> => {
    try {
        const response = await axios.get(
            `${API_URL}/billboards/dateRange?startDate=${startDate}&endDate=${endDate}`
        );
        return response.data;
    } catch (error) {
        console.error(`Error al obtener cartelera por rango de fechas:`, error);
        return [];
    }
};

export const getBillboardsByMovieGenre = async (genre: string, startDate: string, endDate: string): Promise<BillboardDto[]> => {
    try {
        const response = await axios.get(
            `${API_URL}/billboards/genre/${genre}/dateRange?startDate=${startDate}&endDate=${endDate}`
        );
        return response.data;
    } catch (error) {
        console.error(`Error al obtener cartelera por género:`, error);
        return [];
    }
};

export const cancelBillboard = async (billboardId: number): Promise<void> => {
    try {
        await axios.put(`${API_URL}/billboards/${billboardId}/cancel`);
    } catch (error) {
        console.error(`Error al cancelar cartelera ${billboardId}:`, error);
        throw error;
    }
};

// Métodos para clientes
export const getCustomerByDocument = async (documentNumber: string): Promise<CustomerDto> => {
    try {
        const response = await axios.get(`${API_URL}/customers/document/${documentNumber}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener cliente por documento ${documentNumber}:`, error);
        throw error;
    }
};

export const createCustomer = async (customer: Omit<CustomerDto, 'id' | 'status'>): Promise<CustomerDto> => {
    try {
        const response = await axios.post(`${API_URL}/customers`, { ...customer, status: true });
        return response.data;
    } catch (error) {
        console.error('Error al crear cliente:', error);
        throw error;
    }
};

// Métodos para reservas
export const getBookingsByCustomer = async (customerId: number): Promise<BookingDto[]> => {
    try {
        const response = await axios.get(`${API_URL}/bookings/customer/${customerId}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener reservas por cliente ${customerId}:`, error);
        return [];
    }
};

export const getBookingsByBillboard = async (billboardId: number): Promise<BookingDto[]> => {
    try {
        const response = await axios.get(`${API_URL}/bookings/billboard/${billboardId}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener reservas por cartelera ${billboardId}:`, error);
        return [];
    }
};

export const createBooking = async (booking: Omit<BookingDto, 'id' | 'date' | 'status'>): Promise<BookingDto> => {
    try {
        const response = await axios.post(`${API_URL}/bookings`, { ...booking, status: true });
        return response.data;
    } catch (error) {
        console.error('Error al crear reserva:', error);
        throw error;
    }
};

export const cancelBooking = async (bookingId: number): Promise<void> => {
    try {
        await axios.put(`${API_URL}/bookings/${bookingId}/cancel`);
    } catch (error) {
        console.error(`Error al cancelar reserva ${bookingId}:`, error);
        throw error;
    }
};
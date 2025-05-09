package com.cinereservas.api.service.impl;

import com.cinereservas.api.dto.BillboardDTO;
import com.cinereservas.api.dto.CustomerDTO;
import com.cinereservas.api.exception.CineReservasException;
import com.cinereservas.api.model.*;
import com.cinereservas.api.model.enums.MovieGenreEnum;
import com.cinereservas.api.repository.BillboardRepository;
import com.cinereservas.api.repository.BookingRepository;
import com.cinereservas.api.repository.MovieRepository;
import com.cinereservas.api.repository.RoomRepository;
import com.cinereservas.api.service.BillboardService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BillboardServiceImpl extends BaseServiceImpl<BillboardEntity, BillboardDTO> implements BillboardService {

    private final BillboardRepository billboardRepository;
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    public BillboardServiceImpl(BillboardRepository billboardRepository,
                                MovieRepository movieRepository,
                                RoomRepository roomRepository,
                                BookingRepository bookingRepository,
                                ModelMapper modelMapper) {
        super(billboardRepository, modelMapper, BillboardEntity.class, BillboardDTO.class);
        this.billboardRepository = billboardRepository;
        this.movieRepository = movieRepository;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BillboardDTO> findByDate(LocalDate date) {
        return billboardRepository.findByDateAndStatus(date, true).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BillboardDTO> findByDateRange(LocalDate startDate, LocalDate endDate) {
        return billboardRepository.findByDateBetweenAndStatus(startDate, endDate, true).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BillboardDTO> findByRoomAndDate(Integer roomId, LocalDate date) {
        RoomEntity room = roomRepository.findByIdAndStatus(roomId, true)
                .orElseThrow(() -> CineReservasException.notFound("Room not found with id: " + roomId));

        return billboardRepository.findByRoomAndDateAndStatus(room, date, true).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BillboardDTO> findByMovieAndDateRange(Integer movieId, LocalDate startDate, LocalDate endDate) {
        MovieEntity movie = movieRepository.findByIdAndStatus(movieId, true)
                .orElseThrow(() -> CineReservasException.notFound("Movie not found with id: " + movieId));

        return billboardRepository.findByMovieAndDateBetweenAndStatus(movie, startDate, endDate, true).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BillboardDTO> findByMovieGenreAndDateRange(MovieGenreEnum genre, LocalDate startDate, LocalDate endDate) {
        return billboardRepository.findByMovieGenreAndDateBetween(genre, startDate, endDate).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<Integer, Map<String, Long>> getSeatsAvailabilityByRoom(LocalDate date) {
        List<Object[]> results = billboardRepository.countAvailableAndOccupiedSeatsByRoomForDate(date);

        Map<Integer, Map<String, Long>> availability = new HashMap<>();

        for (Object[] result : results) {
            Integer roomId = (Integer) result[0];
            Long totalSeats = (Long) result[1];
            Long occupiedSeats = (Long) result[2];
            Long availableSeats = (Long) result[3];

            Map<String, Long> roomStats = new HashMap<>();
            roomStats.put("total", totalSeats);
            roomStats.put("occupied", occupiedSeats);
            roomStats.put("available", availableSeats);

            availability.put(roomId, roomStats);
        }

        return availability;
    }

    @Override
    @Transactional
    public void cancelBillboard(Integer billboardId) {
        BillboardEntity billboard = billboardRepository.findByIdAndStatus(billboardId, true)
                .orElseThrow(() -> CineReservasException.notFound("Billboard not found with id: " + billboardId));

        // Verificar que la fecha de la cartelera no sea anterior a la fecha actual
        if (billboard.getDate().isBefore(LocalDate.now())) {
            throw CineReservasException.badRequest(
                    "No se puede cancelar funciones de la cartelera con fecha anterior a la actual");
        }

        // Obtener todas las reservas de la cartelera
        List<BookingEntity> bookings = bookingRepository.findByBillboardAndStatus(billboard, true);

        // Lista para guardar los clientes afectados
        List<CustomerEntity> affectedCustomers = bookings.stream()
                .map(BookingEntity::getCustomer)
                .distinct()
                .collect(Collectors.toList());

        // Cancelar todas las reservas
        for (BookingEntity booking : bookings) {
            // Habilitar la butaca
            SeatEntity seat = booking.getSeat();
            seat.setStatus(true);

            // Cancelar la reserva
            booking.setStatus(false);
        }

        // Cancelar la cartelera
        billboard.setStatus(false);

        // Guardar los cambios
        billboardRepository.save(billboard);

        // Imprimir los clientes afectados
        System.out.println("Clientes afectados por la cancelación de la cartelera: " + billboardId);
        for (CustomerEntity customer : affectedCustomers) {
            System.out.println(String.format("- %s %s (%s)",
                    customer.getName(),
                    customer.getLastname(),
                    customer.getEmail() != null ? customer.getEmail() : customer.getPhoneNumber()));
        }
    }

    @Override
    protected BillboardDTO mapToDto(BillboardEntity entity) {
        BillboardDTO dto = modelMapper.map(entity, BillboardDTO.class);
        if (entity.getMovie() != null) {
            dto.setMovieId(entity.getMovie().getId());
            dto.setMovieName(entity.getMovie().getName());
        }
        if (entity.getRoom() != null) {
            dto.setRoomId(entity.getRoom().getId());
            dto.setRoomName(entity.getRoom().getName());
        }
        return dto;
    }

    @Override
    protected BillboardEntity mapToEntity(BillboardDTO dto) {
        BillboardEntity entity = modelMapper.map(dto, BillboardEntity.class);

        if (dto.getMovieId() != null) {
            MovieEntity movie = movieRepository.findById(dto.getMovieId())
                    .orElseThrow(() -> CineReservasException.notFound("Movie not found with id: " + dto.getMovieId()));
            entity.setMovie(movie);
        }

        if (dto.getRoomId() != null) {
            RoomEntity room = roomRepository.findById(dto.getRoomId())
                    .orElseThrow(() -> CineReservasException.notFound("Room not found with id: " + dto.getRoomId()));
            entity.setRoom(room);
        }

        return entity;
    }
}
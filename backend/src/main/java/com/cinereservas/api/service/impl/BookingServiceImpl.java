package com.cinereservas.api.service.impl;

import com.cinereservas.api.dto.BookingDTO;
import com.cinereservas.api.exception.CineReservasException;
import com.cinereservas.api.model.BillboardEntity;
import com.cinereservas.api.model.BookingEntity;
import com.cinereservas.api.model.CustomerEntity;
import com.cinereservas.api.model.SeatEntity;
import com.cinereservas.api.repository.BillboardRepository;
import com.cinereservas.api.repository.BookingRepository;
import com.cinereservas.api.repository.CustomerRepository;
import com.cinereservas.api.repository.SeatRepository;
import com.cinereservas.api.service.BookingService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl extends BaseServiceImpl<BookingEntity, BookingDTO> implements BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final SeatRepository seatRepository;
    private final BillboardRepository billboardRepository;

    public BookingServiceImpl(BookingRepository bookingRepository,
                              CustomerRepository customerRepository,
                              SeatRepository seatRepository,
                              BillboardRepository billboardRepository,
                              ModelMapper modelMapper) {
        super(bookingRepository, modelMapper, BookingEntity.class, BookingDTO.class);
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.seatRepository = seatRepository;
        this.billboardRepository = billboardRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingDTO> findByCustomerId(Integer customerId) {
        CustomerEntity customer = customerRepository.findByIdAndStatus(customerId, true)
                .orElseThrow(() -> CineReservasException.notFound("Customer not found with id: " + customerId));

        return bookingRepository.findByCustomerAndStatus(customer, true).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingDTO> findByBillboardId(Integer billboardId) {
        BillboardEntity billboard = billboardRepository.findByIdAndStatus(billboardId, true)
                .orElseThrow(() -> CineReservasException.notFound("Billboard not found with id: " + billboardId));

        return bookingRepository.findByBillboardAndStatus(billboard, true).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingDTO> findByDateRange(LocalDate startDate, LocalDate endDate) {
        return bookingRepository.findByDateBetweenAndStatus(startDate, endDate, true).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelBooking(Integer bookingId) {
        BookingEntity booking = bookingRepository.findByIdAndStatus(bookingId, true)
                .orElseThrow(() -> CineReservasException.notFound("Booking not found with id: " + bookingId));

        // Habilitar la butaca
        SeatEntity seat = booking.getSeat();
        seat.setStatus(true);
        seatRepository.save(seat);

        // Cancelar la reserva
        booking.setStatus(false);
        bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public BookingDTO save(BookingDTO dto) {
        // Verificar que la butaca esté disponible
        SeatEntity seat = seatRepository.findByIdAndStatus(dto.getSeatId(), true)
                .orElseThrow(() -> CineReservasException.notFound("Seat not found or not available with id: " + dto.getSeatId()));

        BillboardEntity billboard = billboardRepository.findByIdAndStatus(dto.getBillboardId(), true)
                .orElseThrow(() -> CineReservasException.notFound("Billboard not found with id: " + dto.getBillboardId()));

        // Verificar que la butaca no esté ya reservada para esta cartelera
        bookingRepository.findBySeatAndBillboardAndStatus(seat, billboard, true)
                .ifPresent(existingBooking -> {
                    throw CineReservasException.conflict("Seat already booked for this billboard");
                });

        // Inhabilitar la butaca
        seat.setStatus(false);
        seatRepository.save(seat);

        // Crear la reserva
        BookingEntity entity = mapToEntity(dto);
        entity.setDate(LocalDate.now());
        entity = bookingRepository.save(entity);

        return mapToDto(entity);
    }

    @Override
    protected BookingDTO mapToDto(BookingEntity entity) {
        BookingDTO dto = modelMapper.map(entity, BookingDTO.class);

        if (entity.getCustomer() != null) {
            dto.setCustomerId(entity.getCustomer().getId());
            dto.setCustomerName(entity.getCustomer().getName() + " " + entity.getCustomer().getLastname());
        }

        if (entity.getSeat() != null) {
            dto.setSeatId(entity.getSeat().getId());
            dto.setSeatLabel("Row " + entity.getSeat().getRowNumber() + ", Seat " + entity.getSeat().getNumber());
        }

        if (entity.getBillboard() != null) {
            dto.setBillboardId(entity.getBillboard().getId());

            if (entity.getBillboard().getMovie() != null) {
                dto.setMovieName(entity.getBillboard().getMovie().getName());
            }

            if (entity.getBillboard().getRoom() != null) {
                dto.setRoomName(entity.getBillboard().getRoom().getName());
            }
        }

        return dto;
    }

    @Override
    protected BookingEntity mapToEntity(BookingDTO dto) {
        BookingEntity entity = new BookingEntity();
        entity.setId(dto.getId());
        entity.setStatus(dto.getStatus());
        entity.setDate(dto.getDate() != null ? dto.getDate() : LocalDate.now());

        if (dto.getCustomerId() != null) {
            CustomerEntity customer = customerRepository.findById(dto.getCustomerId())
                    .orElseThrow(() -> CineReservasException.notFound("Customer not found with id: " + dto.getCustomerId()));
            entity.setCustomer(customer);
        }

        if (dto.getSeatId() != null) {
            SeatEntity seat = seatRepository.findById(dto.getSeatId())
                    .orElseThrow(() -> CineReservasException.notFound("Seat not found with id: " + dto.getSeatId()));
            entity.setSeat(seat);
        }

        if (dto.getBillboardId() != null) {
            BillboardEntity billboard = billboardRepository.findById(dto.getBillboardId())
                    .orElseThrow(() -> CineReservasException.notFound("Billboard not found with id: " + dto.getBillboardId()));
            entity.setBillboard(billboard);
        }

        return entity;
    }
}
package com.cinereservas.api.service;

import com.cinereservas.api.dto.BookingDTO;
import com.cinereservas.api.model.BookingEntity;

import java.time.LocalDate;
import java.util.List;

public interface BookingService extends BaseService<BookingEntity, BookingDTO> {

    List<BookingDTO> findByCustomerId(Integer customerId);

    List<BookingDTO> findByBillboardId(Integer billboardId);

    List<BookingDTO> findByDateRange(LocalDate startDate, LocalDate endDate);

    void cancelBooking(Integer bookingId);
}
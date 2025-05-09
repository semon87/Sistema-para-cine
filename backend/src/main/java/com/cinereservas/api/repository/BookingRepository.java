package com.cinereservas.api.repository;

import com.cinereservas.api.model.BillboardEntity;
import com.cinereservas.api.model.BookingEntity;
import com.cinereservas.api.model.CustomerEntity;
import com.cinereservas.api.model.SeatEntity;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends BaseRepository<BookingEntity> {

    List<BookingEntity> findByCustomerAndStatus(CustomerEntity customer, Boolean status);

    List<BookingEntity> findByBillboardAndStatus(BillboardEntity billboard, Boolean status);

    Optional<BookingEntity> findBySeatAndBillboardAndStatus(SeatEntity seat, BillboardEntity billboard, Boolean status);

    List<BookingEntity> findByDateBetweenAndStatus(LocalDate startDate, LocalDate endDate, Boolean status);
}
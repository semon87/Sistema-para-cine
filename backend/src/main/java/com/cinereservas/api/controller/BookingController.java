package com.cinereservas.api.controller;

import com.cinereservas.api.dto.BookingDTO;
import com.cinereservas.api.model.BookingEntity;
import com.cinereservas.api.service.BookingService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController extends BaseController<BookingEntity, BookingDTO> {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        super(bookingService);
        this.bookingService = bookingService;
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingDTO>> findByCustomerId(@PathVariable Integer customerId) {
        return ResponseEntity.ok(bookingService.findByCustomerId(customerId));
    }

    @GetMapping("/billboard/{billboardId}")
    public ResponseEntity<List<BookingDTO>> findByBillboardId(@PathVariable Integer billboardId) {
        return ResponseEntity.ok(bookingService.findByBillboardId(billboardId));
    }

    @GetMapping("/dateRange")
    public ResponseEntity<List<BookingDTO>> findByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(bookingService.findByDateRange(startDate, endDate));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelBooking(@PathVariable Integer id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }
}
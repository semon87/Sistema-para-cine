package com.cinereservas.api.controller;

import com.cinereservas.api.dto.BillboardDTO;
import com.cinereservas.api.model.BillboardEntity;
import com.cinereservas.api.model.enums.MovieGenreEnum;
import com.cinereservas.api.service.BillboardService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/billboards")
@CrossOrigin(origins = "*")
public class BillboardController extends BaseController<BillboardEntity, BillboardDTO> {

    private final BillboardService billboardService;

    public BillboardController(BillboardService billboardService) {
        super(billboardService);
        this.billboardService = billboardService;
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<BillboardDTO>> findByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(billboardService.findByDate(date));
    }

    @GetMapping("/dateRange")
    public ResponseEntity<List<BillboardDTO>> findByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(billboardService.findByDateRange(startDate, endDate));
    }

    @GetMapping("/room/{roomId}/date/{date}")
    public ResponseEntity<List<BillboardDTO>> findByRoomAndDate(
            @PathVariable Integer roomId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(billboardService.findByRoomAndDate(roomId, date));
    }

    @GetMapping("/movie/{movieId}/dateRange")
    public ResponseEntity<List<BillboardDTO>> findByMovieAndDateRange(
            @PathVariable Integer movieId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(billboardService.findByMovieAndDateRange(movieId, startDate, endDate));
    }

    @GetMapping("/genre/{genre}/dateRange")
    public ResponseEntity<List<BillboardDTO>> findByMovieGenreAndDateRange(
            @PathVariable MovieGenreEnum genre,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(billboardService.findByMovieGenreAndDateRange(genre, startDate, endDate));
    }

    @GetMapping("/seatsAvailability/date/{date}")
    public ResponseEntity<Map<Integer, Map<String, Long>>> getSeatsAvailabilityByRoom(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(billboardService.getSeatsAvailabilityByRoom(date));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelBillboard(@PathVariable Integer id) {
        billboardService.cancelBillboard(id);
        return ResponseEntity.noContent().build();
    }
}
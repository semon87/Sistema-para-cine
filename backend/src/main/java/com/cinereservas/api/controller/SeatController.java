package com.cinereservas.api.controller;

import com.cinereservas.api.dto.SeatDTO;
import com.cinereservas.api.model.SeatEntity;
import com.cinereservas.api.service.SeatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin(origins = "*")
public class SeatController extends BaseController<SeatEntity, SeatDTO> {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        super(seatService);
        this.seatService = seatService;
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<SeatDTO>> findByRoomId(@PathVariable Integer roomId) {
        return ResponseEntity.ok(seatService.findByRoomId(roomId));
    }

    @GetMapping("/room/{roomId}/position")
    public ResponseEntity<SeatDTO> findByRoomAndPosition(
            @PathVariable Integer roomId,
            @RequestParam Short number,
            @RequestParam Short rowNumber) {
        return ResponseEntity.ok(seatService.findByRoomAndPosition(roomId, number, rowNumber));
    }

    @PutMapping("/{id}/disable")
    public ResponseEntity<Void> disableSeat(@PathVariable Integer id) {
        seatService.disableSeat(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/enable")
    public ResponseEntity<Void> enableSeat(@PathVariable Integer id) {
        seatService.enableSeat(id);
        return ResponseEntity.noContent().build();
    }
}
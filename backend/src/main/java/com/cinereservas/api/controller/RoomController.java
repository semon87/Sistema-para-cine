package com.cinereservas.api.controller;

import com.cinereservas.api.dto.RoomDTO;
import com.cinereservas.api.model.RoomEntity;
import com.cinereservas.api.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController extends BaseController<RoomEntity, RoomDTO> {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        super(roomService);
        this.roomService = roomService;
    }

    @GetMapping("/number/{number}")
    public ResponseEntity<RoomDTO> findByNumber(@PathVariable Short number) {
        return ResponseEntity.ok(roomService.findByNumber(number));
    }
}
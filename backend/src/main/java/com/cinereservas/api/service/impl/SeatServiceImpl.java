package com.cinereservas.api.service.impl;

import com.cinereservas.api.dto.SeatDTO;
import com.cinereservas.api.exception.CineReservasException;
import com.cinereservas.api.model.RoomEntity;
import com.cinereservas.api.model.SeatEntity;
import com.cinereservas.api.repository.RoomRepository;
import com.cinereservas.api.repository.SeatRepository;
import com.cinereservas.api.service.SeatService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatServiceImpl extends BaseServiceImpl<SeatEntity, SeatDTO> implements SeatService {

    private final SeatRepository seatRepository;
    private final RoomRepository roomRepository;

    public SeatServiceImpl(SeatRepository seatRepository, RoomRepository roomRepository, ModelMapper modelMapper) {
        super(seatRepository, modelMapper, SeatEntity.class, SeatDTO.class);
        this.seatRepository = seatRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SeatDTO> findByRoomId(Integer roomId) {
        RoomEntity room = roomRepository.findByIdAndStatus(roomId, true)
                .orElseThrow(() -> CineReservasException.notFound("Room not found with id: " + roomId));

        return seatRepository.findByRoomAndStatus(room, true).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SeatDTO findByRoomAndPosition(Integer roomId, Short number, Short rowNumber) {
        RoomEntity room = roomRepository.findByIdAndStatus(roomId, true)
                .orElseThrow(() -> CineReservasException.notFound("Room not found with id: " + roomId));

        SeatEntity seat = seatRepository.findByRoomAndNumberAndRowNumberAndStatus(room, number, rowNumber, true)
                .orElseThrow(() -> CineReservasException.notFound(
                        "Seat not found with number: " + number + " and row: " + rowNumber + " in room: " + roomId));

        return mapToDto(seat);
    }

    @Override
    @Transactional
    public void disableSeat(Integer seatId) {
        SeatEntity seat = seatRepository.findByIdAndStatus(seatId, true)
                .orElseThrow(() -> CineReservasException.notFound("Seat not found with id: " + seatId));

        seat.setStatus(false);
        seatRepository.save(seat);
    }

    @Override
    @Transactional
    public void enableSeat(Integer seatId) {
        SeatEntity seat = seatRepository.findById(seatId)
                .orElseThrow(() -> CineReservasException.notFound("Seat not found with id: " + seatId));

        seat.setStatus(true);
        seatRepository.save(seat);
    }

    @Override
    protected SeatDTO mapToDto(SeatEntity entity) {
        SeatDTO dto = modelMapper.map(entity, SeatDTO.class);
        if (entity.getRoom() != null) {
            dto.setRoomId(entity.getRoom().getId());
            dto.setRoomName(entity.getRoom().getName());
        }
        return dto;
    }

    @Override
    protected SeatEntity mapToEntity(SeatDTO dto) {
        SeatEntity entity = modelMapper.map(dto, SeatEntity.class);
        if (dto.getRoomId() != null) {
            RoomEntity room = roomRepository.findById(dto.getRoomId())
                    .orElseThrow(() -> CineReservasException.notFound("Room not found with id: " + dto.getRoomId()));
            entity.setRoom(room);
        }
        return entity;
    }
}
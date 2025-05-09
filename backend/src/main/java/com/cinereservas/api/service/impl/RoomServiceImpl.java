package com.cinereservas.api.service.impl;

import com.cinereservas.api.dto.RoomDTO;
import com.cinereservas.api.exception.CineReservasException;
import com.cinereservas.api.model.RoomEntity;
import com.cinereservas.api.repository.RoomRepository;
import com.cinereservas.api.service.RoomService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoomServiceImpl extends BaseServiceImpl<RoomEntity, RoomDTO> implements RoomService {

    private final RoomRepository roomRepository;

    public RoomServiceImpl(RoomRepository roomRepository, ModelMapper modelMapper) {
        super(roomRepository, modelMapper, RoomEntity.class, RoomDTO.class);
        this.roomRepository = roomRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public RoomDTO findByNumber(Short number) {
        RoomEntity room = roomRepository.findByNumberAndStatus(number, true)
                .orElseThrow(() -> CineReservasException.notFound("Room not found with number: " + number));
        return mapToDto(room);
    }
}
package com.cinereservas.api.service;

import com.cinereservas.api.dto.SeatDTO;
import com.cinereservas.api.model.SeatEntity;

import java.util.List;

public interface SeatService extends BaseService<SeatEntity, SeatDTO> {

    List<SeatDTO> findByRoomId(Integer roomId);

    SeatDTO findByRoomAndPosition(Integer roomId, Short number, Short rowNumber);

    void disableSeat(Integer seatId);

    void enableSeat(Integer seatId);
}
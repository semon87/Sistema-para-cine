package com.cinereservas.api.service;

import com.cinereservas.api.dto.RoomDTO;
import com.cinereservas.api.model.RoomEntity;

public interface RoomService extends BaseService<RoomEntity, RoomDTO> {

    RoomDTO findByNumber(Short number);
}
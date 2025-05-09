package com.cinereservas.api.repository;

import com.cinereservas.api.model.RoomEntity;
import com.cinereservas.api.model.SeatEntity;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends BaseRepository<SeatEntity> {

    List<SeatEntity> findByRoomAndStatus(RoomEntity room, Boolean status);

    Optional<SeatEntity> findByRoomAndNumberAndRowNumberAndStatus(RoomEntity room, Short number, Short rowNumber, Boolean status);
}
package com.cinereservas.api.repository;

import com.cinereservas.api.model.RoomEntity;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomRepository extends BaseRepository<RoomEntity> {

    Optional<RoomEntity> findByNumberAndStatus(Short number, Boolean status);
}
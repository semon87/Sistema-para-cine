package com.cinereservas.api.service;

import com.cinereservas.api.dto.BillboardDTO;
import com.cinereservas.api.model.BillboardEntity;
import com.cinereservas.api.model.enums.MovieGenreEnum;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface BillboardService extends BaseService<BillboardEntity, BillboardDTO> {

    List<BillboardDTO> findByDate(LocalDate date);

    List<BillboardDTO> findByDateRange(LocalDate startDate, LocalDate endDate);

    List<BillboardDTO> findByRoomAndDate(Integer roomId, LocalDate date);

    List<BillboardDTO> findByMovieAndDateRange(Integer movieId, LocalDate startDate, LocalDate endDate);

    List<BillboardDTO> findByMovieGenreAndDateRange(MovieGenreEnum genre, LocalDate startDate, LocalDate endDate);

    Map<Integer, Map<String, Long>> getSeatsAvailabilityByRoom(LocalDate date);

    void cancelBillboard(Integer billboardId);
}
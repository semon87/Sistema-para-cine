package com.cinereservas.api.repository;

import com.cinereservas.api.model.BillboardEntity;
import com.cinereservas.api.model.MovieEntity;
import com.cinereservas.api.model.RoomEntity;
import com.cinereservas.api.model.enums.MovieGenreEnum;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BillboardRepository extends BaseRepository<BillboardEntity> {

    List<BillboardEntity> findByDateAndStatus(LocalDate date, Boolean status);

    List<BillboardEntity> findByDateBetweenAndStatus(LocalDate startDate, LocalDate endDate, Boolean status);

    List<BillboardEntity> findByRoomAndDateAndStatus(RoomEntity room, LocalDate date, Boolean status);

    List<BillboardEntity> findByMovieAndDateBetweenAndStatus(MovieEntity movie, LocalDate startDate, LocalDate endDate, Boolean status);

    // Query para obtener las reservas de películas de terror en un rango de fechas
    @Query("SELECT b FROM BillboardEntity b WHERE b.movie.genre = :genre AND b.date BETWEEN :startDate AND :endDate AND b.status = true")
    List<BillboardEntity> findByMovieGenreAndDateBetween(MovieGenreEnum genre, LocalDate startDate, LocalDate endDate);

    // Query para obtener el número de butacas disponibles y ocupadas por sala en la cartelera del día actual
    @Query("SELECT b.room.id, " +
            "COUNT(s) as totalSeats, " +
            "COUNT(bk) as occupiedSeats, " +
            "(COUNT(s) - COUNT(bk)) as availableSeats " +
            "FROM BillboardEntity b " +
            "JOIN b.room r " +
            "JOIN r.seats s " +
            "LEFT JOIN BookingEntity bk ON bk.seat = s AND bk.billboard = b " +
            "WHERE b.date = :date AND b.status = true AND r.status = true AND s.status = true " +
            "GROUP BY b.room.id")
    List<Object[]> countAvailableAndOccupiedSeatsByRoomForDate(LocalDate date);
}
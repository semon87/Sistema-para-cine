package com.cinereservas.api.repository;

import com.cinereservas.api.model.MovieEntity;
import com.cinereservas.api.model.enums.MovieGenreEnum;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends BaseRepository<MovieEntity> {

    List<MovieEntity> findByGenreAndStatus(MovieGenreEnum genre, Boolean status);
}
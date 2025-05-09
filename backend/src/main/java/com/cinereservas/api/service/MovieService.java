package com.cinereservas.api.service;

import com.cinereservas.api.dto.MovieDTO;
import com.cinereservas.api.model.MovieEntity;
import com.cinereservas.api.model.enums.MovieGenreEnum;

import java.util.List;

public interface MovieService extends BaseService<MovieEntity, MovieDTO> {

    List<MovieDTO> findByGenre(MovieGenreEnum genre);
}
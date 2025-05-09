package com.cinereservas.api.service.impl;

import com.cinereservas.api.dto.MovieDTO;
import com.cinereservas.api.model.MovieEntity;
import com.cinereservas.api.model.enums.MovieGenreEnum;
import com.cinereservas.api.repository.MovieRepository;
import com.cinereservas.api.service.MovieService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovieServiceImpl extends BaseServiceImpl<MovieEntity, MovieDTO> implements MovieService {

    private final MovieRepository movieRepository;

    public MovieServiceImpl(MovieRepository movieRepository, ModelMapper modelMapper) {
        super(movieRepository, modelMapper, MovieEntity.class, MovieDTO.class);
        this.movieRepository = movieRepository;
    }

    @Override
    public List<MovieDTO> findByGenre(MovieGenreEnum genre) {
        return movieRepository.findByGenreAndStatus(genre, true).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
}
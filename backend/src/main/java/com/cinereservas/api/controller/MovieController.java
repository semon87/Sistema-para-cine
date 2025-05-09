package com.cinereservas.api.controller;

import com.cinereservas.api.dto.MovieDTO;
import com.cinereservas.api.model.MovieEntity;
import com.cinereservas.api.model.enums.MovieGenreEnum;
import com.cinereservas.api.service.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "*")
public class MovieController extends BaseController<MovieEntity, MovieDTO> {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        super(movieService);
        this.movieService = movieService;
    }

    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<MovieDTO>> findByGenre(@PathVariable MovieGenreEnum genre) {
        return ResponseEntity.ok(movieService.findByGenre(genre));
    }
}
package com.cinereservas.api.model;

import com.cinereservas.api.model.enums.MovieGenreEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "movies")
@Getter
@Setter
public class MovieEntity extends BaseEntity {

    @NotNull
    @Column(name = "name", length = 100)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "genre", length = 50)
    private MovieGenreEnum genre;

    @NotNull
    @Column(name = "allowed_age")
    private Short allowedAge;

    @NotNull
    @Column(name = "length_minutes")
    private Short lengthMinutes;
}
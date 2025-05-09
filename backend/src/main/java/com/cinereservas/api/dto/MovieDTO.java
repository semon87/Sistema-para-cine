package com.cinereservas.api.dto;

import com.cinereservas.api.model.enums.MovieGenreEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MovieDTO extends BaseDTO {

    private String name;
    private MovieGenreEnum genre;
    private Short allowedAge;
    private Short lengthMinutes;
}
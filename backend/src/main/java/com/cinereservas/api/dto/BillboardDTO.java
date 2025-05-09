package com.cinereservas.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class BillboardDTO extends BaseDTO {

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer movieId;
    private String movieName;
    private Integer roomId;
    private String roomName;
}
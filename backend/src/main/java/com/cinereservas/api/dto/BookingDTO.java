package com.cinereservas.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class BookingDTO extends BaseDTO {

    private LocalDate date;
    private Integer customerId;
    private String customerName;
    private Integer seatId;
    private String seatLabel;
    private Integer billboardId;
    private String movieName;
    private String roomName;
}
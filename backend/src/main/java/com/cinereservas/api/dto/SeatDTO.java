package com.cinereservas.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class SeatDTO extends BaseDTO {

    private Short number;
    private Short rowNumber;
    private Integer roomId;
    private String roomName;
}
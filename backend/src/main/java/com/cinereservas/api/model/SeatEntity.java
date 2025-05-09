package com.cinereservas.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "seats")
@Getter
@Setter
public class SeatEntity extends BaseEntity {

    @NotNull
    @Column(name = "number")
    private Short number;

    @NotNull
    @Column(name = "row_number")
    private Short rowNumber;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private RoomEntity room;
}
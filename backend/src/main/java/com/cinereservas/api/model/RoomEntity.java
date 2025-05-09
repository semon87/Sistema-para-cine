package com.cinereservas.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "rooms")
@Getter
@Setter
public class RoomEntity extends BaseEntity {

    @NotNull
    @Column(name = "name", length = 50)
    private String name;

    @NotNull
    @Column(name = "number")
    private Short number;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    private List<SeatEntity> seats;
}
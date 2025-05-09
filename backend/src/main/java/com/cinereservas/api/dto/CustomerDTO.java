package com.cinereservas.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CustomerDTO extends BaseDTO {

    private String documentNumber;
    private String name;
    private String lastname;
    private Short age;
    private String phoneNumber;
    private String email;
}
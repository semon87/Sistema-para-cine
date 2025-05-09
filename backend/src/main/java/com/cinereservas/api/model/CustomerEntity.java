package com.cinereservas.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "customers", indexes = {
        @Index(name = "idx_document_number", columnList = "document_number", unique = true)
})
@Getter
@Setter
public class CustomerEntity extends BaseEntity {

    @NotNull
    @Column(name = "document_number", length = 20, unique = true)
    private String documentNumber;

    @NotNull
    @Column(name = "name", length = 30)
    private String name;

    @NotNull
    @Column(name = "lastname", length = 30)
    private String lastname;

    @NotNull
    @Column(name = "age")
    private Short age;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "email", length = 100)
    private String email;
}
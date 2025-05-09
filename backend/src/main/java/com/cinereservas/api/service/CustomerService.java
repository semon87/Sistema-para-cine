package com.cinereservas.api.service;

import com.cinereservas.api.dto.CustomerDTO;
import com.cinereservas.api.model.CustomerEntity;

import java.util.Optional;

public interface CustomerService extends BaseService<CustomerEntity, CustomerDTO> {

    CustomerDTO findByDocumentNumber(String documentNumber);

    Optional<CustomerDTO> findByEmail(String email);
}
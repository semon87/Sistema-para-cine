package com.cinereservas.api.repository;

import com.cinereservas.api.model.CustomerEntity;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends BaseRepository<CustomerEntity> {

    Optional<CustomerEntity> findByDocumentNumberAndStatus(String documentNumber, Boolean status);

    Optional<CustomerEntity> findByEmailAndStatus(String email, Boolean status);
}
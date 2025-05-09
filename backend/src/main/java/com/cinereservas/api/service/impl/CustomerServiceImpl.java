package com.cinereservas.api.service.impl;

import com.cinereservas.api.dto.CustomerDTO;
import com.cinereservas.api.exception.CineReservasException;
import com.cinereservas.api.model.CustomerEntity;
import com.cinereservas.api.repository.CustomerRepository;
import com.cinereservas.api.service.CustomerService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CustomerServiceImpl extends BaseServiceImpl<CustomerEntity, CustomerDTO> implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository, ModelMapper modelMapper) {
        super(customerRepository, modelMapper, CustomerEntity.class, CustomerDTO.class);
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerDTO findByDocumentNumber(String documentNumber) {
        CustomerEntity customer = customerRepository.findByDocumentNumberAndStatus(documentNumber, true)
                .orElseThrow(() -> CineReservasException.notFound("Customer not found with document number: " + documentNumber));
        return mapToDto(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CustomerDTO> findByEmail(String email) {
        return customerRepository.findByEmailAndStatus(email, true)
                .map(this::mapToDto);
    }

    @Override
    @Transactional
    public CustomerDTO save(CustomerDTO dto) {
        // Verificar que no exista otro cliente con el mismo número de documento
        customerRepository.findByDocumentNumberAndStatus(dto.getDocumentNumber(), true)
                .ifPresent(existingCustomer -> {
                    throw CineReservasException.conflict("A customer with document number " + dto.getDocumentNumber() + " already exists");
                });

        // Verificar que no exista otro cliente con el mismo email (si se proporciona)
        if (dto.getEmail() != null && !dto.getEmail().isEmpty()) {
            customerRepository.findByEmailAndStatus(dto.getEmail(), true)
                    .ifPresent(existingCustomer -> {
                        throw CineReservasException.conflict("A customer with email " + dto.getEmail() + " already exists");
                    });
        }

        CustomerEntity entity = mapToEntity(dto);
        entity = customerRepository.save(entity);
        return mapToDto(entity);
    }
}
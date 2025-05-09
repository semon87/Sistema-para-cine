package com.cinereservas.api.controller;

import com.cinereservas.api.dto.CustomerDTO;
import com.cinereservas.api.exception.CineReservasException;
import com.cinereservas.api.model.CustomerEntity;
import com.cinereservas.api.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController extends BaseController<CustomerEntity, CustomerDTO> {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        super(customerService);
        this.customerService = customerService;
    }

    @GetMapping("/document/{documentNumber}")
    public ResponseEntity<CustomerDTO> findByDocumentNumber(@PathVariable String documentNumber) {
        return ResponseEntity.ok(customerService.findByDocumentNumber(documentNumber));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<CustomerDTO> findByEmail(@PathVariable String email) {
        return ResponseEntity.ok(customerService.findByEmail(email)
                .orElseThrow(() -> CineReservasException.notFound("Customer not found with email: " + email)));
    }
}
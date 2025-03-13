package com.callcastlecare.api.controller;

import com.callcastlecare.api.dto.AddressDto;
import com.callcastlecare.api.dto.CustomerDto;
import com.callcastlecare.api.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<CustomerDto> createCustomer(@Valid @RequestBody CustomerDto customerDto) {
        return new ResponseEntity<>(customerService.createCustomer(customerDto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<CustomerDto> getCustomerByEmail(@PathVariable String email) {
        return ResponseEntity.ok(customerService.getCustomerByEmail(email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDto> updateCustomer(@PathVariable Long id, @Valid @RequestBody CustomerDto customerDto) {
        return ResponseEntity.ok(customerService.updateCustomer(id, customerDto));
    }

    @PostMapping("/{customerId}/addresses")
    public ResponseEntity<AddressDto> addAddress(@PathVariable Long customerId, @Valid @RequestBody AddressDto addressDto) {
        return new ResponseEntity<>(customerService.addAddress(customerId, addressDto), HttpStatus.CREATED);
    }

    @GetMapping("/{customerId}/addresses")
    public ResponseEntity<List<AddressDto>> getAddressesByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(customerService.getAddressesByCustomerId(customerId));
    }

    @DeleteMapping("/{customerId}/addresses/{addressId}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long customerId, @PathVariable Long addressId) {
        customerService.deleteAddress(customerId, addressId);
        return ResponseEntity.noContent().build();
    }
}

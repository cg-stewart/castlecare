package com.callcastlecare.api.service;

import com.callcastlecare.api.dto.AddressDto;
import com.callcastlecare.api.dto.CustomerDto;
import com.callcastlecare.api.model.Address;
import com.callcastlecare.api.model.Customer;
import com.callcastlecare.api.repository.AddressRepository;
import com.callcastlecare.api.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {
    
    private final CustomerRepository customerRepository;
    private final AddressRepository addressRepository;
    
    @Transactional
    public CustomerDto createCustomer(CustomerDto customerDto) {
        if (customerRepository.existsByEmail(customerDto.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        
        Customer customer = new Customer();
        customer.setFirstName(customerDto.getFirstName());
        customer.setLastName(customerDto.getLastName());
        customer.setEmail(customerDto.getEmail());
        customer.setPhone(customerDto.getPhone());
        
        Customer savedCustomer = customerRepository.save(customer);
        
        List<Address> addresses = customerDto.getAddresses().stream()
                .map(addressDto -> {
                    Address address = new Address();
                    address.setStreet(addressDto.getStreet());
                    address.setCity(addressDto.getCity());
                    address.setState(addressDto.getState());
                    address.setZip(addressDto.getZip());
                    address.setCustomer(savedCustomer);
                    return address;
                })
                .collect(Collectors.toList());
        
        addressRepository.saveAll(addresses);
        savedCustomer.setAddresses(addresses);
        
        return mapToDto(savedCustomer);
    }
    
    @Cacheable(value = "customers", key = "#id")
    @Transactional(readOnly = true)
    public CustomerDto getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + id));
        return mapToDto(customer);
    }
    
    @Cacheable(value = "customers", key = "#email")
    @Transactional(readOnly = true)
    public CustomerDto getCustomerByEmail(String email) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with email: " + email));
        return mapToDto(customer);
    }
    
    @Transactional(readOnly = true)
    public List<CustomerDto> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @CacheEvict(value = "customers", key = "#id")
    @Transactional
    public CustomerDto updateCustomer(Long id, CustomerDto customerDto) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + id));
        
        customer.setFirstName(customerDto.getFirstName());
        customer.setLastName(customerDto.getLastName());
        customer.setPhone(customerDto.getPhone());
        
        // Handle email update separately to check for duplicates
        if (!customer.getEmail().equals(customerDto.getEmail())) {
            if (customerRepository.existsByEmail(customerDto.getEmail())) {
                throw new IllegalArgumentException("Email already in use");
            }
            customer.setEmail(customerDto.getEmail());
        }
        
        Customer updatedCustomer = customerRepository.save(customer);
        return mapToDto(updatedCustomer);
    }
    
    @Transactional
    public AddressDto addAddress(Long customerId, AddressDto addressDto) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + customerId));
        
        Address address = new Address();
        address.setStreet(addressDto.getStreet());
        address.setCity(addressDto.getCity());
        address.setState(addressDto.getState());
        address.setZip(addressDto.getZip());
        address.setCustomer(customer);
        
        Address savedAddress = addressRepository.save(address);
        
        return AddressDto.builder()
                .id(savedAddress.getId())
                .street(savedAddress.getStreet())
                .city(savedAddress.getCity())
                .state(savedAddress.getState())
                .zip(savedAddress.getZip())
                .build();
    }
    
    @Transactional(readOnly = true)
    public List<AddressDto> getAddressesByCustomerId(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + customerId));
        
        return customer.getAddresses().stream()
                .map(address -> AddressDto.builder()
                        .id(address.getId())
                        .street(address.getStreet())
                        .city(address.getCity())
                        .state(address.getState())
                        .zip(address.getZip())
                        .build())
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteAddress(Long customerId, Long addressId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + customerId));
        
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new IllegalArgumentException("Address not found with id: " + addressId));
        
        if (!address.getCustomer().getId().equals(customer.getId())) {
            throw new IllegalArgumentException("Address does not belong to customer");
        }
        
        addressRepository.delete(address);
    }
    
    private CustomerDto mapToDto(Customer customer) {
        List<AddressDto> addressDtos = customer.getAddresses().stream()
                .map(address -> AddressDto.builder()
                        .id(address.getId())
                        .street(address.getStreet())
                        .city(address.getCity())
                        .state(address.getState())
                        .zip(address.getZip())
                        .build())
                .collect(Collectors.toList());
        
        return CustomerDto.builder()
                .id(customer.getId())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .addresses(addressDtos)
                .createdAt(customer.getCreatedAt())
                .build();
    }
}

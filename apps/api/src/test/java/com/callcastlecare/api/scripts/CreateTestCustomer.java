package com.callcastlecare.api.scripts;

import com.callcastlecare.api.dto.CustomerDto;
import com.callcastlecare.api.dto.AddressDto;
import com.callcastlecare.api.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Profile;

@SpringBootApplication
@ComponentScan("com.callcastlecare.api")
@Profile("local")
public class CreateTestCustomer {

    @Autowired
    private CustomerService customerService;

    public static void main(String[] args) {
        SpringApplication.run(CreateTestCustomer.class, args);
    }

    @Bean
    public CommandLineRunner createTestData() {
        return args -> {
            // Create test customer
            CustomerDto customer = CustomerDto.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .phone("555-123-4567")
                .build();
            
            CustomerDto savedCustomer = customerService.createCustomer(customer);
            System.out.println("Created test customer with ID: " + savedCustomer.getId());
            
            // Add address for the customer
            AddressDto address = AddressDto.builder()
                .street("123 Main St")
                .city("Anytown")
                .state("CA")
                .zip("12345")
                .isPrimary(true)
                .build();
                
            AddressDto savedAddress = customerService.addAddress(savedCustomer.getId(), address);
            System.out.println("Added address with ID: " + savedAddress.getId());
        };
    }
}

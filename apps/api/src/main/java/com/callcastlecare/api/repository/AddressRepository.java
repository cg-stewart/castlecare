package com.callcastlecare.api.repository;

import com.callcastlecare.api.model.Address;
import com.callcastlecare.api.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByCustomer(Customer customer);
    List<Address> findByCustomerId(Long customerId);
}

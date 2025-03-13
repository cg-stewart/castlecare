package com.callcastlecare.api.service;

import com.callcastlecare.api.model.Customer;
import com.callcastlecare.api.model.Order;
import com.callcastlecare.api.model.Worker;
import com.callcastlecare.api.repository.CustomerRepository;
import com.callcastlecare.api.repository.OrderRepository;
import com.callcastlecare.api.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

/**
 * Service for security-related operations and permission checks.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SecurityService {

    private final CustomerRepository customerRepository;
    private final WorkerRepository workerRepository;
    private final OrderRepository orderRepository;

    /**
     * Check if the authenticated user is the owner of a customer account.
     *
     * @param customerId the customer ID
     * @param authentication the current authentication
     * @return true if the user is the owner of the customer account
     */
    @Transactional(readOnly = true)
    public boolean isCustomerOwner(Long customerId, Authentication authentication) {
        if (authentication == null) {
            return false;
        }

        String email = extractEmailFromToken(authentication);
        if (email == null) {
            return false;
        }

        Optional<Customer> customer = customerRepository.findById(customerId);
        return customer.isPresent() && customer.get().getEmail().equals(email);
    }

    /**
     * Check if the authenticated user is the owner of a worker account.
     *
     * @param workerId the worker ID
     * @param authentication the current authentication
     * @return true if the user is the owner of the worker account
     */
    @Transactional(readOnly = true)
    public boolean isWorkerOwner(Long workerId, Authentication authentication) {
        if (authentication == null) {
            return false;
        }

        String email = extractEmailFromToken(authentication);
        if (email == null) {
            return false;
        }

        Optional<Worker> worker = workerRepository.findById(workerId);
        return worker.isPresent() && worker.get().getEmail().equals(email);
    }

    /**
     * Check if the authenticated user's email matches the worker's email.
     *
     * @param email the worker email
     * @param authentication the current authentication
     * @return true if the user's email matches the worker's email
     */
    @Transactional(readOnly = true)
    public boolean isWorkerEmail(String email, Authentication authentication) {
        if (authentication == null) {
            return false;
        }

        String userEmail = extractEmailFromToken(authentication);
        return userEmail != null && userEmail.equals(email);
    }

    /**
     * Check if the authenticated user is a participant in an order.
     *
     * @param orderId the order ID
     * @param authentication the current authentication
     * @return true if the user is a participant in the order
     */
    @Transactional(readOnly = true)
    public boolean isOrderParticipant(Long orderId, Authentication authentication) {
        if (authentication == null) {
            return false;
        }

        String email = extractEmailFromToken(authentication);
        if (email == null) {
            return false;
        }

        Optional<Order> order = orderRepository.findById(orderId);
        if (order.isEmpty()) {
            return false;
        }

        // Check if user is the customer
        if (order.get().getCustomer().getEmail().equals(email)) {
            return true;
        }

        // Check if user is the worker
        return order.get().getWorker() != null && order.get().getWorker().getEmail().equals(email);
    }

    /**
     * Check if the authenticated user is the owner of an order.
     *
     * @param orderId the order ID
     * @param authentication the current authentication
     * @return true if the user is the owner of the order
     */
    @Transactional(readOnly = true)
    public boolean isOrderOwner(Long orderId, Authentication authentication) {
        if (authentication == null) {
            return false;
        }

        String email = extractEmailFromToken(authentication);
        if (email == null) {
            return false;
        }

        Optional<Order> order = orderRepository.findById(orderId);
        if (order.isEmpty()) {
            return false;
        }

        // Check if user is the customer
        return order.get().getCustomer().getEmail().equals(email);
    }

    /**
     * Check if the authenticated user is the worker assigned to an order.
     *
     * @param orderId the order ID
     * @param authentication the current authentication
     * @return true if the user is the worker assigned to the order
     */
    @Transactional(readOnly = true)
    public boolean isWorkerForOrder(Long orderId, Authentication authentication) {
        if (authentication == null) {
            return false;
        }

        String email = extractEmailFromToken(authentication);
        if (email == null) {
            return false;
        }

        Optional<Order> order = orderRepository.findById(orderId);
        if (order.isEmpty() || order.get().getWorker() == null) {
            return false;
        }

        // Check if user is the worker
        return order.get().getWorker().getEmail().equals(email);
    }

    /**
     * Extract email from JWT token.
     *
     * @param authentication the current authentication
     * @return the email from the token, or null if not found
     */
    private String extractEmailFromToken(Authentication authentication) {
        try {
            if (authentication.getPrincipal() instanceof Jwt jwt) {
                Map<String, Object> claims = jwt.getClaims();
                
                // Try to get email from different possible claim names
                if (claims.containsKey("email")) {
                    return (String) claims.get("email");
                } else if (claims.containsKey("cognito:username")) {
                    return (String) claims.get("cognito:username");
                } else if (claims.containsKey("preferred_username")) {
                    return (String) claims.get("preferred_username");
                } else if (claims.containsKey("sub")) {
                    // Last resort, use the subject
                    return (String) claims.get("sub");
                }
            }
        } catch (Exception e) {
            log.error("Error extracting email from token", e);
        }
        return null;
    }
}

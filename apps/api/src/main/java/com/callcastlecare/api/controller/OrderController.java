package com.callcastlecare.api.controller;

import com.callcastlecare.api.dto.OrderDto;
import com.callcastlecare.api.model.Order;
import com.callcastlecare.api.service.OrderService;
import com.callcastlecare.api.service.SecurityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing orders.
 */
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    // This field is used in @PreAuthorize annotations for security expressions
    // e.g., @securityService.isOrderParticipant(#id, principal)
    private final SecurityService securityService;

    /**
     * Create a new order.
     *
     * @param orderDto the order data
     * @return the created order
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody OrderDto orderDto) {
        return new ResponseEntity<>(orderService.createOrder(orderDto), HttpStatus.CREATED);
    }

    /**
     * Get an order by ID.
     *
     * @param id the order ID
     * @return the order data
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isOrderParticipant(#id, principal)")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    /**
     * Get all orders for a customer.
     *
     * @param customerId the customer ID
     * @return list of orders for the customer
     */
    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isCustomerOwner(#customerId, principal)")
    public ResponseEntity<List<OrderDto>> getOrdersByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(orderService.getOrdersByCustomerId(customerId));
    }

    /**
     * Get all orders assigned to a worker.
     *
     * @param workerId the worker ID
     * @return list of orders assigned to the worker
     */
    @GetMapping("/worker/{workerId}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isWorkerOwner(#workerId, principal)")
    public ResponseEntity<List<OrderDto>> getOrdersByWorkerId(@PathVariable Long workerId) {
        return ResponseEntity.ok(orderService.getOrdersByWorkerId(workerId));
    }

    /**
     * Get orders by status.
     *
     * @param status the order status
     * @return list of orders with the specified status
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getOrdersByStatus(@PathVariable Order.OrderStatus status) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status));
    }

    /**
     * Update order status.
     *
     * @param id the order ID
     * @param status the new status
     * @param workerId the worker ID (optional, required for ACCEPTED status)
     * @return the updated order
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isOrderParticipant(#id, principal)")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long id, 
            @RequestParam Order.OrderStatus status,
            @RequestParam(required = false) Long workerId) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status, workerId));
    }

    /**
     * Add proof to an order.
     *
     * @param id the order ID
     * @param proofUrl the URL of the proof image/document
     * @return the updated order
     */
    @PatchMapping("/{id}/proof")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isWorkerForOrder(#id, principal)")
    public ResponseEntity<OrderDto> addProofToOrder(
            @PathVariable Long id, 
            @RequestParam String proofUrl) {
        return ResponseEntity.ok(orderService.addProofToOrder(id, proofUrl));
    }
}

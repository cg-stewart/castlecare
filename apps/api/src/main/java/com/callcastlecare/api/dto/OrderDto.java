package com.callcastlecare.api.dto;

import com.callcastlecare.api.model.Order;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long id;
    
    private Long customerId;
    
    private Long workerId;
    
    @NotNull(message = "Service type is required")
    private Order.ServiceType serviceType;
    
    @NotNull(message = "Pricing option is required")
    private Long pricingOptionId;
    
    @NotNull(message = "Address is required")
    private Long addressId;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    @NotNull(message = "Time slot is required")
    private LocalTime timeSlot;
    
    private BigDecimal price;
    
    private Order.BillingPeriod billingPeriod;
    
    private Order.OrderStatus status;
    
    private String proofUrl;
    
    private LocalDateTime createdAt;
}

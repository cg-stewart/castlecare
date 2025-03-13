package com.callcastlecare.api.dto;

import com.callcastlecare.api.model.Order;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingOptionDto {
    private Long id;
    
    @NotNull(message = "Service type is required")
    private Order.ServiceType serviceType;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    private String subtitle;
    
    @NotNull(message = "Price is required")
    private BigDecimal price;
    
    @NotNull(message = "Billing period is required")
    private Order.BillingPeriod billingPeriod;
    
    @Builder.Default
    private List<String> features = new ArrayList<>();
    
    @NotBlank(message = "Size range is required")
    private String sizeRange;
}

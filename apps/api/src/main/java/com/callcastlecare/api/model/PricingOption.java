package com.callcastlecare.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pricing_options")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingOption {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Order.ServiceType serviceType;
    
    @Column(nullable = false)
    private String name;
    
    private String subtitle;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Order.BillingPeriod billingPeriod;
    
    @ElementCollection
    @CollectionTable(name = "pricing_option_features", joinColumns = @JoinColumn(name = "pricing_option_id"))
    @Column(name = "feature")
    @Builder.Default
    private List<String> features = new ArrayList<>();
    
    @Column(name = "size_range", nullable = false)
    private String sizeRange;
}

package com.callcastlecare.api.controller;

import com.callcastlecare.api.dto.PricingOptionDto;
import com.callcastlecare.api.model.Order;
import com.callcastlecare.api.service.PricingOptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing pricing options.
 */
@RestController
@RequestMapping("/api/v1/pricing-options")
@RequiredArgsConstructor
public class PricingOptionController {

    private final PricingOptionService pricingOptionService;

    /**
     * Create a new pricing option (admin only).
     *
     * @param pricingOptionDto the pricing option data
     * @return the created pricing option
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PricingOptionDto> createPricingOption(@Valid @RequestBody PricingOptionDto pricingOptionDto) {
        return new ResponseEntity<>(pricingOptionService.createPricingOption(pricingOptionDto), HttpStatus.CREATED);
    }

    /**
     * Get a pricing option by ID.
     *
     * @param id the pricing option ID
     * @return the pricing option data
     */
    @GetMapping("/{id}")
    public ResponseEntity<PricingOptionDto> getPricingOptionById(@PathVariable Long id) {
        return ResponseEntity.ok(pricingOptionService.getPricingOptionById(id));
    }

    /**
     * Update a pricing option (admin only).
     *
     * @param id the pricing option ID
     * @param pricingOptionDto the updated pricing option data
     * @return the updated pricing option
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PricingOptionDto> updatePricingOption(
            @PathVariable Long id, 
            @Valid @RequestBody PricingOptionDto pricingOptionDto) {
        return ResponseEntity.ok(pricingOptionService.updatePricingOption(id, pricingOptionDto));
    }

    /**
     * Get pricing options by service type.
     *
     * @param serviceType the service type
     * @return list of pricing options for the service type
     */
    @GetMapping("/service-type/{serviceType}")
    public ResponseEntity<List<PricingOptionDto>> getPricingOptionsByServiceType(
            @PathVariable Order.ServiceType serviceType) {
        return ResponseEntity.ok(pricingOptionService.getPricingOptionsByServiceType(serviceType));
    }

    /**
     * Get pricing options by service type and billing period.
     *
     * @param serviceType the service type
     * @param billingPeriod the billing period
     * @return list of pricing options for the service type and billing period
     */
    @GetMapping("/service-type/{serviceType}/billing-period/{billingPeriod}")
    public ResponseEntity<List<PricingOptionDto>> getPricingOptionsByServiceTypeAndBillingPeriod(
            @PathVariable Order.ServiceType serviceType,
            @PathVariable Order.BillingPeriod billingPeriod) {
        return ResponseEntity.ok(pricingOptionService.getPricingOptionsByServiceTypeAndBillingPeriod(
                serviceType, billingPeriod));
    }
}

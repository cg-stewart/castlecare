package com.callcastlecare.api.service;

import com.callcastlecare.api.dto.PricingOptionDto;
import com.callcastlecare.api.model.Order;
import com.callcastlecare.api.model.PricingOption;
import com.callcastlecare.api.repository.PricingOptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PricingOptionService {
    
    private final PricingOptionRepository pricingOptionRepository;
    
    @Transactional
    public PricingOptionDto createPricingOption(PricingOptionDto pricingOptionDto) {
        PricingOption pricingOption = new PricingOption();
        pricingOption.setServiceType(pricingOptionDto.getServiceType());
        pricingOption.setName(pricingOptionDto.getName());
        pricingOption.setSubtitle(pricingOptionDto.getSubtitle());
        pricingOption.setPrice(pricingOptionDto.getPrice());
        pricingOption.setBillingPeriod(pricingOptionDto.getBillingPeriod());
        pricingOption.setFeatures(pricingOptionDto.getFeatures());
        pricingOption.setSizeRange(pricingOptionDto.getSizeRange());
        
        PricingOption savedPricingOption = pricingOptionRepository.save(pricingOption);
        return mapToDto(savedPricingOption);
    }
    
    @Cacheable(value = "pricingOptions", key = "#id")
    @Transactional(readOnly = true)
    public PricingOptionDto getPricingOptionById(Long id) {
        PricingOption pricingOption = pricingOptionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pricing option not found with id: " + id));
        return mapToDto(pricingOption);
    }
    
    @Cacheable(value = "pricingOptionsByServiceType", key = "#serviceType")
    @Transactional(readOnly = true)
    public List<PricingOptionDto> getPricingOptionsByServiceType(Order.ServiceType serviceType) {
        return pricingOptionRepository.findByServiceType(serviceType).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Cacheable(value = "pricingOptionsByServiceTypeAndBillingPeriod", key = "#serviceType + '-' + #billingPeriod")
    @Transactional(readOnly = true)
    public List<PricingOptionDto> getPricingOptionsByServiceTypeAndBillingPeriod(
            Order.ServiceType serviceType, Order.BillingPeriod billingPeriod) {
        return pricingOptionRepository.findByServiceTypeAndBillingPeriod(serviceType, billingPeriod).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @CacheEvict(value = {"pricingOptions", "pricingOptionsByServiceType", "pricingOptionsByServiceTypeAndBillingPeriod"}, allEntries = true)
    @Transactional
    public PricingOptionDto updatePricingOption(Long id, PricingOptionDto pricingOptionDto) {
        PricingOption pricingOption = pricingOptionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pricing option not found with id: " + id));
        
        pricingOption.setName(pricingOptionDto.getName());
        pricingOption.setSubtitle(pricingOptionDto.getSubtitle());
        pricingOption.setPrice(pricingOptionDto.getPrice());
        pricingOption.setFeatures(pricingOptionDto.getFeatures());
        pricingOption.setSizeRange(pricingOptionDto.getSizeRange());
        
        PricingOption updatedPricingOption = pricingOptionRepository.save(pricingOption);
        return mapToDto(updatedPricingOption);
    }
    
    private PricingOptionDto mapToDto(PricingOption pricingOption) {
        return PricingOptionDto.builder()
                .id(pricingOption.getId())
                .serviceType(pricingOption.getServiceType())
                .name(pricingOption.getName())
                .subtitle(pricingOption.getSubtitle())
                .price(pricingOption.getPrice())
                .billingPeriod(pricingOption.getBillingPeriod())
                .features(pricingOption.getFeatures())
                .sizeRange(pricingOption.getSizeRange())
                .build();
    }
}

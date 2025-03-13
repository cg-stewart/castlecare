package com.callcastlecare.api.repository;

import com.callcastlecare.api.model.Order;
import com.callcastlecare.api.model.PricingOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PricingOptionRepository extends JpaRepository<PricingOption, Long> {
    List<PricingOption> findByServiceType(Order.ServiceType serviceType);
    List<PricingOption> findByServiceTypeAndBillingPeriod(Order.ServiceType serviceType, Order.BillingPeriod billingPeriod);
}

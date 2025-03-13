package com.callcastlecare.api.service;

import com.callcastlecare.api.client.ZillowClient;
import com.callcastlecare.api.dto.AddressDto;
import com.callcastlecare.api.dto.OrderDto;
import com.callcastlecare.api.model.*;
import com.callcastlecare.api.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final WorkerRepository workerRepository;
    private final PricingOptionRepository pricingOptionRepository;
    private final AddressRepository addressRepository;
    private final ZillowClient zillowClient;
    private final SqsClient sqsClient;
    
    @Value("${aws.sqs.order-queue-url}")
    private String orderQueueUrl;
    
    @Transactional
    public OrderDto createOrder(OrderDto orderDto) {
        // Validate customer exists
        Customer customer = customerRepository.findById(orderDto.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + orderDto.getCustomerId()));
        
        // Validate address exists and belongs to customer
        Address address = addressRepository.findById(orderDto.getAddressId())
                .orElseThrow(() -> new IllegalArgumentException("Address not found with id: " + orderDto.getAddressId()));
        
        if (!address.getCustomer().getId().equals(customer.getId())) {
            throw new IllegalArgumentException("Address does not belong to the customer");
        }
        
        // Validate pricing option exists
        PricingOption pricingOption = pricingOptionRepository.findById(orderDto.getPricingOptionId())
                .orElseThrow(() -> new IllegalArgumentException("Pricing option not found with id: " + orderDto.getPricingOptionId()));
        
        // Validate service type matches pricing option
        if (orderDto.getServiceType() != pricingOption.getServiceType()) {
            throw new IllegalArgumentException("Service type does not match pricing option");
        }
        
        // Get property size data from Zillow (living area and lot size only)
        AddressDto addressDto = AddressDto.builder()
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .zip(address.getZip())
                .build();
        
        Object[] propertySizeData = zillowClient.getPropertySizeData(addressDto);
        int livingArea = (int) propertySizeData[0];
        String lotSize = (String) propertySizeData[1];
        
        // Validate size range for pricing option
        validateSizeRange(pricingOption, livingArea, lotSize);
        
        // Create order
        Order order = new Order();
        order.setCustomer(customer);
        order.setServiceType(orderDto.getServiceType());
        order.setPricingOption(pricingOption);
        order.setAddress(address);
        order.setDate(orderDto.getDate());
        order.setTimeSlot(orderDto.getTimeSlot());
        order.setPrice(pricingOption.getPrice());
        order.setBillingPeriod(pricingOption.getBillingPeriod());
        order.setStatus(Order.OrderStatus.PENDING);
        
        Order savedOrder = orderRepository.save(order);
        
        // Send order to SQS queue
        sendOrderToQueue(savedOrder);
        
        return mapToDto(savedOrder);
    }
    
    @Cacheable(value = "orders", key = "#id")
    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + id));
        return mapToDto(order);
    }
    
    @Transactional(readOnly = true)
    public List<OrderDto> getOrdersByCustomerId(Long customerId) {
        return orderRepository.findByCustomerId(customerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<OrderDto> getOrdersByWorkerId(Long workerId) {
        return orderRepository.findByWorkerId(workerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<OrderDto> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @CacheEvict(value = "orders", key = "#id")
    @Transactional
    public OrderDto updateOrderStatus(Long id, Order.OrderStatus status, Long workerId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + id));
        
        // If status is being set to ACCEPTED, assign worker
        if (status == Order.OrderStatus.ACCEPTED && workerId != null) {
            Worker worker = workerRepository.findById(workerId)
                    .orElseThrow(() -> new IllegalArgumentException("Worker not found with id: " + workerId));
            
            // Validate worker is approved and available
            if (worker.getStatus() != Worker.WorkerStatus.APPROVED) {
                throw new IllegalStateException("Worker must be approved to accept orders");
            }
            
            if (!worker.getAvailability()) {
                throw new IllegalStateException("Worker must be available to accept orders");
            }
            
            // Validate worker has the required role for the service type
            if (!worker.getRoles().contains(order.getServiceType().toString().toLowerCase())) {
                throw new IllegalArgumentException("Worker does not have the required role for this service");
            }
            
            order.setWorker(worker);
        }
        
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        return mapToDto(updatedOrder);
    }
    
    @CacheEvict(value = "orders", key = "#id")
    @Transactional
    public OrderDto addProofToOrder(Long id, String proofUrl) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + id));
        
        // Validate order status is IN_PROGRESS
        if (order.getStatus() != Order.OrderStatus.IN_PROGRESS) {
            throw new IllegalStateException("Order must be in progress to add proof");
        }
        
        order.setProofUrl(proofUrl);
        Order updatedOrder = orderRepository.save(order);
        return mapToDto(updatedOrder);
    }
    
    private void validateSizeRange(PricingOption pricingOption, int livingArea, String lotSize) {
        // Parse size range based on service type
        switch (pricingOption.getServiceType()) {
            case LAWNCARE:
                validateLawncareSizeRange(pricingOption, lotSize);
                break;
            case LIGHTING:
                validateLightingSizeRange(pricingOption, livingArea);
                break;
            case LAUNDRY:
                // No size validation for laundry
                break;
            default:
                throw new IllegalArgumentException("Unsupported service type: " + pricingOption.getServiceType());
        }
    }
    
    private void validateLawncareSizeRange(PricingOption pricingOption, String lotSize) {
        try {
            double lotSizeAcres = 0.0;
            
            // Parse the lot size string which might be in different formats
            if (lotSize.contains("acres")) {
                lotSizeAcres = Double.parseDouble(lotSize.replace("acres", "").trim());
            } else if (lotSize.contains("acre")) {
                lotSizeAcres = Double.parseDouble(lotSize.replace("acre", "").trim());
            } else {
                // Assume it's a plain number
                lotSizeAcres = Double.parseDouble(lotSize);
            }
            
            switch (pricingOption.getSizeRange()) {
                case "0-0.5 acres":
                    if (lotSizeAcres > 0.5) {
                        throw new IllegalArgumentException("Lot size exceeds the maximum for this pricing option");
                    }
                    break;
                case "0.6-1 acre":
                    if (lotSizeAcres < 0.6 || lotSizeAcres > 1.0) {
                        throw new IllegalArgumentException("Lot size is outside the range for this pricing option");
                    }
                    break;
                case "1+ acres":
                    if (lotSizeAcres < 1.0) {
                        throw new IllegalArgumentException("Lot size is below the minimum for this pricing option");
                    }
                    break;
                default:
                    log.warn("Unknown size range for lawncare: {}", pricingOption.getSizeRange());
            }
        } catch (NumberFormatException e) {
            log.error("Error parsing lot size: {}", lotSize, e);
            throw new IllegalArgumentException("Invalid lot size format");
        }
    }
    
    private void validateLightingSizeRange(PricingOption pricingOption, int livingAreaSqFt) {
        switch (pricingOption.getSizeRange()) {
            case "Up to 1300 sq ft":
                if (livingAreaSqFt > 1300) {
                    throw new IllegalArgumentException("Living area exceeds the maximum for this pricing option");
                }
                break;
            case "1350-2449 sq ft":
                if (livingAreaSqFt < 1350 || livingAreaSqFt > 2449) {
                    throw new IllegalArgumentException("Living area is outside the range for this pricing option");
                }
                break;
            case "2450+ sq ft":
                if (livingAreaSqFt < 2450) {
                    throw new IllegalArgumentException("Living area is below the minimum for this pricing option");
                }
                break;
            default:
                log.warn("Unknown size range for lighting: {}", pricingOption.getSizeRange());
        }
    }
    
    private void sendOrderToQueue(Order order) {
        try {
            String messageBody = String.format(
                    "{\"orderId\":%d,\"customerId\":%d,\"serviceType\":\"%s\",\"status\":\"%s\"}",
                    order.getId(), order.getCustomer().getId(), order.getServiceType(), order.getStatus());
            
            SendMessageRequest sendMessageRequest = SendMessageRequest.builder()
                    .queueUrl(orderQueueUrl)
                    .messageBody(messageBody)
                    .build();
            
            sqsClient.sendMessage(sendMessageRequest);
            log.info("Order sent to SQS queue: {}", order.getId());
        } catch (Exception e) {
            log.error("Error sending order to SQS queue", e);
            // Continue processing even if SQS fails
        }
    }
    
    private OrderDto mapToDto(Order order) {
        return OrderDto.builder()
                .id(order.getId())
                .customerId(order.getCustomer().getId())
                .workerId(order.getWorker() != null ? order.getWorker().getId() : null)
                .serviceType(order.getServiceType())
                .pricingOptionId(order.getPricingOption().getId())
                .addressId(order.getAddress().getId())
                .date(order.getDate())
                .timeSlot(order.getTimeSlot())
                .price(order.getPrice())
                .billingPeriod(order.getBillingPeriod())
                .status(order.getStatus())
                .proofUrl(order.getProofUrl())
                .createdAt(order.getCreatedAt())
                .build();
    }
}

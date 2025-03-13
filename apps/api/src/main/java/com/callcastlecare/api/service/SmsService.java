package com.callcastlecare.api.service;

import com.callcastlecare.api.model.Customer;
import com.callcastlecare.api.model.Order;
import com.callcastlecare.api.model.Worker;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SmsService {

    @Value("${twilio.account-sid}")
    private String accountSid;
    
    @Value("${twilio.auth-token}")
    private String authToken;
    
    @Value("${twilio.phone-number}")
    private String twilioPhoneNumber;
    
    @Value("${twilio.enabled}")
    private boolean enabled;
    
    private boolean initialized = false;
    
    private void initTwilio() {
        if (!initialized) {
            Twilio.init(accountSid, authToken);
            initialized = true;
        }
    }
    
    public void sendOrderConfirmationToCustomer(Customer customer, Order order) {
        if (!enabled) {
            log.info("SMS service is disabled. Would have sent order confirmation to: {}", customer.getPhone());
            return;
        }
        
        try {
            initTwilio();
            
            String messageBody = String.format(
                    "CastleCare: Your %s service (Order #%d) is confirmed for %s at %s. We'll notify you when a worker is assigned.",
                    order.getServiceType().toString(),
                    order.getId(),
                    order.getDate().toString(),
                    order.getTimeSlot().toString()
            );
            
            Message message = Message.creator(
                    new PhoneNumber(customer.getPhone()),
                    new PhoneNumber(twilioPhoneNumber),
                    messageBody
            ).create();
            
            log.info("Order confirmation SMS sent to {}, message SID: {}", customer.getPhone(), message.getSid());
        } catch (Exception e) {
            log.error("Failed to send order confirmation SMS to: {}", customer.getPhone(), e);
        }
    }
    
    public void sendOrderAssignmentToWorker(Worker worker, Order order) {
        if (!enabled) {
            log.info("SMS service is disabled. Would have sent order assignment to worker: {}", worker.getPhone());
            return;
        }
        
        try {
            initTwilio();
            
            String messageBody = String.format(
                    "CastleCare: New %s job assigned! Order #%d on %s at %s. Address: %s, %s, %s %s. Open app for details.",
                    order.getServiceType().toString(),
                    order.getId(),
                    order.getDate().toString(),
                    order.getTimeSlot().toString(),
                    order.getAddress().getStreet(),
                    order.getAddress().getCity(),
                    order.getAddress().getState(),
                    order.getAddress().getZip()
            );
            
            Message message = Message.creator(
                    new PhoneNumber(worker.getPhone()),
                    new PhoneNumber(twilioPhoneNumber),
                    messageBody
            ).create();
            
            log.info("Order assignment SMS sent to worker {}, message SID: {}", worker.getPhone(), message.getSid());
        } catch (Exception e) {
            log.error("Failed to send order assignment SMS to worker: {}", worker.getPhone(), e);
        }
    }
    
    public void sendOrderStatusUpdateToCustomer(Customer customer, Order order) {
        if (!enabled) {
            log.info("SMS service is disabled. Would have sent status update to: {}", customer.getPhone());
            return;
        }
        
        try {
            initTwilio();
            
            String statusMessage = switch (order.getStatus()) {
                case ACCEPTED -> String.format(
                        "CastleCare: Your %s service (Order #%d) has been assigned to %s %s. They will arrive on %s at %s.",
                        order.getServiceType().toString(),
                        order.getId(),
                        order.getWorker().getFirstName(),
                        order.getWorker().getLastName(),
                        order.getDate().toString(),
                        order.getTimeSlot().toString()
                );
                case IN_PROGRESS -> String.format(
                        "CastleCare: Your %s service (Order #%d) is now in progress.",
                        order.getServiceType().toString(),
                        order.getId()
                );
                case COMPLETED -> String.format(
                        "CastleCare: Your %s service (Order #%d) has been completed. Thank you for choosing CastleCare!",
                        order.getServiceType().toString(),
                        order.getId()
                );
                default -> String.format(
                        "CastleCare: Your %s service (Order #%d) status has been updated to %s.",
                        order.getServiceType().toString(),
                        order.getId(),
                        order.getStatus().toString()
                );
            };
            
            Message message = Message.creator(
                    new PhoneNumber(customer.getPhone()),
                    new PhoneNumber(twilioPhoneNumber),
                    statusMessage
            ).create();
            
            log.info("Order status update SMS sent to {}, message SID: {}", customer.getPhone(), message.getSid());
        } catch (Exception e) {
            log.error("Failed to send order status update SMS to: {}", customer.getPhone(), e);
        }
    }
    
    public void sendReminderToWorker(Worker worker, Order order) {
        if (!enabled) {
            log.info("SMS service is disabled. Would have sent reminder to worker: {}", worker.getPhone());
            return;
        }
        
        try {
            initTwilio();
            
            String messageBody = String.format(
                    "CastleCare: Reminder for your %s job (Order #%d) tomorrow at %s. Address: %s, %s, %s %s.",
                    order.getServiceType().toString(),
                    order.getId(),
                    order.getTimeSlot().toString(),
                    order.getAddress().getStreet(),
                    order.getAddress().getCity(),
                    order.getAddress().getState(),
                    order.getAddress().getZip()
            );
            
            Message message = Message.creator(
                    new PhoneNumber(worker.getPhone()),
                    new PhoneNumber(twilioPhoneNumber),
                    messageBody
            ).create();
            
            log.info("Reminder SMS sent to worker {}, message SID: {}", worker.getPhone(), message.getSid());
        } catch (Exception e) {
            log.error("Failed to send reminder SMS to worker: {}", worker.getPhone(), e);
        }
    }
    
    public void sendReminderToCustomer(Customer customer, Order order) {
        if (!enabled) {
            log.info("SMS service is disabled. Would have sent reminder to customer: {}", customer.getPhone());
            return;
        }
        
        try {
            initTwilio();
            
            String messageBody = String.format(
                    "CastleCare: Reminder for your %s service (Order #%d) tomorrow at %s with %s %s.",
                    order.getServiceType().toString(),
                    order.getId(),
                    order.getTimeSlot().toString(),
                    order.getWorker().getFirstName(),
                    order.getWorker().getLastName()
            );
            
            Message message = Message.creator(
                    new PhoneNumber(customer.getPhone()),
                    new PhoneNumber(twilioPhoneNumber),
                    messageBody
            ).create();
            
            log.info("Reminder SMS sent to customer {}, message SID: {}", customer.getPhone(), message.getSid());
        } catch (Exception e) {
            log.error("Failed to send reminder SMS to customer: {}", customer.getPhone(), e);
        }
    }
}

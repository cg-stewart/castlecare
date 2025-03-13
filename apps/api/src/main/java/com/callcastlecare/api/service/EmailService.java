package com.callcastlecare.api.service;

import com.callcastlecare.api.model.Customer;
import com.callcastlecare.api.model.Order;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    private final Resend resend;
    
    @Value("${resend.from-email}")
    private String fromEmail;
    
    @Value("${resend.enabled}")
    private boolean enabled;

    public EmailService(@Value("${resend.api-key}") String apiKey) {
        this.resend = new Resend(apiKey);
    }

    public void sendOrderConfirmation(Customer customer, Order order) {
        if (!enabled) {
            log.info("Email service is disabled. Would have sent order confirmation to: {}", customer.getEmail());
            return;
        }
        
        try {
            String subject = "CastleCare Order Confirmation - #" + order.getId();
            String content = buildOrderConfirmationEmail(customer, order);
            
            CreateEmailOptions options = CreateEmailOptions.builder()
                    .from(fromEmail)
                    .to(customer.getEmail())
                    .subject(subject)
                    .html(content)
                    .build();
            
            CreateEmailResponse response = resend.emails().send(options);
            log.info("Order confirmation email sent to {}, email ID: {}", customer.getEmail(), response.getId());
        } catch (ResendException e) {
            log.error("Failed to send order confirmation email to: {}", customer.getEmail(), e);
        }
    }
    
    public void sendOrderStatusUpdate(Customer customer, Order order) {
        if (!enabled) {
            log.info("Email service is disabled. Would have sent order status update to: {}", customer.getEmail());
            return;
        }
        
        try {
            String subject = "CastleCare Order Update - #" + order.getId();
            String content = buildOrderStatusUpdateEmail(customer, order);
            
            CreateEmailOptions options = CreateEmailOptions.builder()
                    .from(fromEmail)
                    .to(customer.getEmail())
                    .subject(subject)
                    .html(content)
                    .build();
            
            CreateEmailResponse response = resend.emails().send(options);
            log.info("Order status update email sent to {}, email ID: {}", customer.getEmail(), response.getId());
        } catch (ResendException e) {
            log.error("Failed to send order status update email to: {}", customer.getEmail(), e);
        }
    }
    
    public void sendWorkerApprovalNotification(String email, String firstName) {
        if (!enabled) {
            log.info("Email service is disabled. Would have sent worker approval notification to: {}", email);
            return;
        }
        
        try {
            String subject = "Welcome to CastleCare - Your Application is Approved!";
            String content = buildWorkerApprovalEmail(firstName);
            
            CreateEmailOptions options = CreateEmailOptions.builder()
                    .from(fromEmail)
                    .to(email)
                    .subject(subject)
                    .html(content)
                    .build();
            
            CreateEmailResponse response = resend.emails().send(options);
            log.info("Worker approval email sent to {}, email ID: {}", email, response.getId());
        } catch (ResendException e) {
            log.error("Failed to send worker approval email to: {}", email, e);
        }
    }
    
    private String buildOrderConfirmationEmail(Customer customer, Order order) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #4CAF50; color: white; padding: 10px; text-align: center; }
                        .content { padding: 20px; }
                        .footer { background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Order Confirmation</h1>
                        </div>
                        <div class="content">
                            <p>Hello %s,</p>
                            <p>Thank you for choosing CastleCare! Your order has been confirmed and is being processed.</p>
                            <h2>Order Details</h2>
                            <p><strong>Order ID:</strong> #%d</p>
                            <p><strong>Service:</strong> %s</p>
                            <p><strong>Plan:</strong> %s</p>
                            <p><strong>Price:</strong> $%s</p>
                            <p><strong>Date:</strong> %s</p>
                            <p><strong>Time:</strong> %s</p>
                            <p>We'll notify you when a worker has been assigned to your order.</p>
                            <p>If you have any questions, please contact our support team.</p>
                            <p>Best regards,<br>The CastleCare Team</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2025 CastleCare. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(
                customer.getFirstName(),
                order.getId(),
                order.getServiceType().toString(),
                order.getPricingOption().getName(),
                order.getPrice().toString(),
                order.getDate().toString(),
                order.getTimeSlot().toString()
        );
    }
    
    private String buildOrderStatusUpdateEmail(Customer customer, Order order) {
        String statusMessage = switch (order.getStatus()) {
            case ACCEPTED -> "A worker has been assigned to your order and will arrive as scheduled.";
            case IN_PROGRESS -> "Your service is currently in progress.";
            case COMPLETED -> "Your service has been completed. Thank you for choosing CastleCare!";
            default -> "Your order status has been updated.";
        };
        
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #4CAF50; color: white; padding: 10px; text-align: center; }
                        .content { padding: 20px; }
                        .footer { background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Order Status Update</h1>
                        </div>
                        <div class="content">
                            <p>Hello %s,</p>
                            <p>Your order status has been updated.</p>
                            <h2>Order Details</h2>
                            <p><strong>Order ID:</strong> #%d</p>
                            <p><strong>Service:</strong> %s</p>
                            <p><strong>Status:</strong> %s</p>
                            <p>%s</p>
                            <p>If you have any questions, please contact our support team.</p>
                            <p>Best regards,<br>The CastleCare Team</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2025 CastleCare. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(
                customer.getFirstName(),
                order.getId(),
                order.getServiceType().toString(),
                order.getStatus().toString(),
                statusMessage
        );
    }
    
    private String buildWorkerApprovalEmail(String firstName) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #4CAF50; color: white; padding: 10px; text-align: center; }
                        .content { padding: 20px; }
                        .footer { background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome to CastleCare!</h1>
                        </div>
                        <div class="content">
                            <p>Hello %s,</p>
                            <p>Congratulations! Your application to join CastleCare as a service provider has been approved.</p>
                            <p>You can now log in to your worker dashboard to:</p>
                            <ul>
                                <li>Update your availability</li>
                                <li>View and accept available orders</li>
                                <li>Track your earnings</li>
                            </ul>
                            <p>Please complete your Stripe Connect account setup to ensure you can receive payments for completed services.</p>
                            <p>If you have any questions, please contact our support team.</p>
                            <p>Best regards,<br>The CastleCare Team</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2025 CastleCare. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(firstName);
    }
}

package com.callcastlecare.api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerApplicationDto {
 private String id;
    private String userId;
    
    @NotNull(message = "Account information is required")
    private AccountDto account;
    
    @NotNull(message = "Contact information is required")
    private ContactDto contact;
    
    @NotNull(message = "Role preferences are required")
    private RolesDto roles;
    
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AccountDto {
        @NotBlank(message = "Plan type is required")
        private String plan;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContactDto {
        @NotBlank(message = "Username is required")
        @Size(min = 3, message = "Username must be at least 3 characters")
        private String username;
        
        @NotBlank(message = "First name is required")
        private String firstName;
        
        @NotBlank(message = "Last name is required")
        private String lastName;
        
        @NotBlank(message = "City is required")
        private String city;
        
        @NotBlank(message = "State is required")
        private String state;
        
        @NotBlank(message = "ZIP code is required")
        @Pattern(regexp = "^\\d{5}(-\\d{4})?$", message = "Invalid ZIP code format")
        private String zip;
        
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;
        
        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^\\d{10}$", message = "Phone number must be 10 digits")
        private String phone;
        
        @NotNull(message = "Date of birth is required")
        @Past(message = "Date of birth must be in the past")
        private LocalDate dateOfBirth;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RolesDto {
        private List<String> onDemand;
        private List<String> warehouse;
    }
}

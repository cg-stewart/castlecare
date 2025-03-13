package com.callcastlecare.api.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.callcastlecare.api.config.CognitoProperties;
import com.callcastlecare.api.dto.auth.LoginRequestDto;
import com.callcastlecare.api.dto.auth.RegisterRequestDto;

import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminCreateUserRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminCreateUserResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminInitiateAuthRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminInitiateAuthResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminRespondToAuthChallengeRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminRespondToAuthChallengeResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AuthFlowType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.ChallengeNameType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CognitoIdentityProviderException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.DeliveryMediumType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.MessageActionType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.SignUpRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.SignUpResponse;

@Service
@Slf4j
public class CognitoService {

    private final CognitoIdentityProviderClient cognitoClient;
    private final CognitoProperties cognitoProperties;

    @Autowired
    public CognitoService(CognitoIdentityProviderClient cognitoClient, CognitoProperties cognitoProperties) {
        this.cognitoClient = cognitoClient;
        this.cognitoProperties = cognitoProperties;
    }

    /**
     * Register a new customer user
     * 
     * @param request The registration request
     * @return The registration response
     */
    public SignUpResponse registerCustomer(RegisterRequestDto request) {
        try {
            // Create attributes
            AttributeType emailAttr = AttributeType.builder()
                    .name("email")
                    .value(request.getEmail())
                    .build();
            
            AttributeType givenNameAttr = AttributeType.builder()
                    .name("given_name")
                    .value(request.getFirstName())
                    .build();
            
            AttributeType familyNameAttr = AttributeType.builder()
                    .name("family_name")
                    .value(request.getLastName())
                    .build();
            
            // Create sign up request
            SignUpRequest signUpRequest = SignUpRequest.builder()
                    .clientId(cognitoProperties.getCustomerAppClientId())
                    .username(request.getEmail())
                    .password(request.getPassword())
                    .userAttributes(emailAttr, givenNameAttr, familyNameAttr)
                    .build();
            
            // Sign up the user
            return cognitoClient.signUp(signUpRequest);
        } catch (CognitoIdentityProviderException e) {
            log.error("Error registering customer: {}", e.getMessage());
            throw e;
        }
    }
    
    /**
     * Register a new worker user
     * 
     * @param request The registration request
     * @return The registration response
     */
    public SignUpResponse registerWorker(RegisterRequestDto request) {
        try {
            // Create attributes
            AttributeType emailAttr = AttributeType.builder()
                    .name("email")
                    .value(request.getEmail())
                    .build();
            
            AttributeType givenNameAttr = AttributeType.builder()
                    .name("given_name")
                    .value(request.getFirstName())
                    .build();
            
            AttributeType familyNameAttr = AttributeType.builder()
                    .name("family_name")
                    .value(request.getLastName())
                    .build();
            
            AttributeType phoneNumberAttr = AttributeType.builder()
                    .name("phone_number")
                    .value(request.getPhoneNumber())
                    .build();
            
            // Create sign up request
            SignUpRequest signUpRequest = SignUpRequest.builder()
                    .clientId(cognitoProperties.getWorkerAppClientId())
                    .username(request.getEmail())
                    .password(request.getPassword())
                    .userAttributes(emailAttr, givenNameAttr, familyNameAttr, phoneNumberAttr)
                    .build();
            
            // Sign up the user
            return cognitoClient.signUp(signUpRequest);
        } catch (CognitoIdentityProviderException e) {
            log.error("Error registering worker: {}", e.getMessage());
            throw e;
        }
    }
    
    /**
     * Create a worker user directly (admin operation)
     * 
     * @param request The registration request
     * @return The admin create user response
     */
    public AdminCreateUserResponse createWorkerUser(RegisterRequestDto request) {
        try {
            // Create attributes
            AttributeType emailAttr = AttributeType.builder()
                    .name("email")
                    .value(request.getEmail())
                    .build();
            
            AttributeType givenNameAttr = AttributeType.builder()
                    .name("given_name")
                    .value(request.getFirstName())
                    .build();
            
            AttributeType familyNameAttr = AttributeType.builder()
                    .name("family_name")
                    .value(request.getLastName())
                    .build();
            
            AttributeType phoneNumberAttr = AttributeType.builder()
                    .name("phone_number")
                    .value(request.getPhoneNumber())
                    .build();
            
            // Create admin create user request
            AdminCreateUserRequest createUserRequest = AdminCreateUserRequest.builder()
                    .userPoolId(cognitoProperties.getWorkerUserPoolId())
                    .username(request.getEmail())
                    .temporaryPassword(request.getPassword())
                    .userAttributes(emailAttr, givenNameAttr, familyNameAttr, phoneNumberAttr)
                    .messageAction(MessageActionType.SUPPRESS)
                    .desiredDeliveryMediums(DeliveryMediumType.EMAIL)
                    .build();
            
            // Create the user
            return cognitoClient.adminCreateUser(createUserRequest);
        } catch (CognitoIdentityProviderException e) {
            log.error("Error creating worker user: {}", e.getMessage());
            throw e;
        }
    }
    
    /**
     * Login a user
     * 
     * @param request The login request
     * @param userType The type of user (customer or worker)
     * @return The authentication response
     */
    public AdminInitiateAuthResponse login(LoginRequestDto request, String userType) {
        try {
            // Set auth parameters
            Map<String, String> authParams = new HashMap<>();
            authParams.put("USERNAME", request.getEmail());
            authParams.put("PASSWORD", request.getPassword());
            
            // Determine user pool ID based on user type
            String userPoolId = "customer".equals(userType) 
                    ? cognitoProperties.getCustomerUserPoolId() 
                    : cognitoProperties.getWorkerUserPoolId();
                    
            // Determine client ID based on user type
            String clientId = "customer".equals(userType) 
                    ? cognitoProperties.getCustomerAppClientId() 
                    : cognitoProperties.getWorkerAppClientId();
            
            // Create auth request
            AdminInitiateAuthRequest authRequest = AdminInitiateAuthRequest.builder()
                    .authFlow(AuthFlowType.ADMIN_USER_PASSWORD_AUTH)
                    .clientId(clientId)
                    .userPoolId(userPoolId)
                    .authParameters(authParams)
                    .build();
            
            // Initiate auth
            AdminInitiateAuthResponse authResponse = cognitoClient.adminInitiateAuth(authRequest);
            
            // Handle NEW_PASSWORD_REQUIRED challenge
            if (authResponse.challengeName() == ChallengeNameType.NEW_PASSWORD_REQUIRED) {
                // Respond to the challenge
                Map<String, String> challengeResponses = new HashMap<>();
                challengeResponses.put("USERNAME", request.getEmail());
                challengeResponses.put("PASSWORD", request.getPassword());
                challengeResponses.put("NEW_PASSWORD", request.getPassword());
                
                AdminRespondToAuthChallengeRequest challengeRequest = AdminRespondToAuthChallengeRequest.builder()
                        .challengeName(ChallengeNameType.NEW_PASSWORD_REQUIRED)
                        .clientId(clientId)
                        .userPoolId(userPoolId)
                        .challengeResponses(challengeResponses)
                        .session(authResponse.session())
                        .build();
                
                AdminRespondToAuthChallengeResponse challengeResponse = cognitoClient.adminRespondToAuthChallenge(challengeRequest);
                
                // Create a new auth response with the tokens from the challenge response
                return AdminInitiateAuthResponse.builder()
                        .authenticationResult(challengeResponse.authenticationResult())
                        .build();
            }
            
            return authResponse;
        } catch (CognitoIdentityProviderException e) {
            log.error("Error logging in: {}", e.getMessage());
            throw e;
        }
    }
}

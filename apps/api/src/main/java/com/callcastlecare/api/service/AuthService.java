package com.callcastlecare.api.service;

import com.callcastlecare.api.config.CognitoProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Service for handling AWS Cognito authentication.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final CognitoIdentityProviderClient cognitoClient;
    private final CognitoProperties cognitoProperties;

    /**
     * Authenticate a user with username and password.
     *
     * @param username the username
     * @param password the password
     * @return authentication result containing tokens
     */
    public AuthenticationResultType authenticate(String username, String password) {
        try {
            Map<String, String> authParams = new HashMap<>();
            authParams.put("USERNAME", username);
            authParams.put("PASSWORD", password);

            AdminInitiateAuthRequest authRequest = AdminInitiateAuthRequest.builder()
                    .authFlow(AuthFlowType.ADMIN_USER_PASSWORD_AUTH)
                    .clientId(cognitoProperties.getAppClientId())
                    .userPoolId(cognitoProperties.getUserPoolId())
                    .authParameters(authParams)
                    .build();

            AdminInitiateAuthResponse authResponse = cognitoClient.adminInitiateAuth(authRequest);
            return authResponse.authenticationResult();
        } catch (NotAuthorizedException | UserNotFoundException e) {
            log.error("Authentication failed for user: {}", username, e);
            throw new RuntimeException("Invalid username or password");
        } catch (Exception e) {
            log.error("Error during authentication", e);
            throw new RuntimeException("Authentication error");
        }
    }

    /**
     * Register a new user in Cognito.
     *
     * @param username the username (email)
     * @param password the password
     * @param userAttributes additional user attributes
     * @return the created user's UUID
     */
    public String registerUser(String username, String password, Map<String, String> userAttributes) {
        try {
            // Convert user attributes to Cognito format
            var attributes = userAttributes.entrySet().stream()
                    .map(entry -> AttributeType.builder()
                            .name(entry.getKey())
                            .value(entry.getValue())
                            .build())
                    .toList();

            // Add email as an attribute if not already present
            if (userAttributes.get("email") == null) {
                attributes = new java.util.ArrayList<>(attributes);
                attributes.add(AttributeType.builder()
                        .name("email")
                        .value(username)
                        .build());
            }

            AdminCreateUserRequest createUserRequest = AdminCreateUserRequest.builder()
                    .userPoolId(cognitoProperties.getUserPoolId())
                    .username(username)
                    .temporaryPassword(password)
                    .userAttributes(attributes)
                    .messageAction(MessageActionType.SUPPRESS) // Don't send welcome email
                    .build();

            AdminCreateUserResponse createUserResponse = cognitoClient.adminCreateUser(createUserRequest);

            // Set the permanent password
            AdminSetUserPasswordRequest setPasswordRequest = AdminSetUserPasswordRequest.builder()
                    .userPoolId(cognitoProperties.getUserPoolId())
                    .username(username)
                    .password(password)
                    .permanent(true)
                    .build();

            cognitoClient.adminSetUserPassword(setPasswordRequest);

            return createUserResponse.user().username();
        } catch (UsernameExistsException e) {
            log.error("Username already exists: {}", username, e);
            throw new RuntimeException("Username already exists");
        } catch (Exception e) {
            log.error("Error during user registration", e);
            throw new RuntimeException("Registration error");
        }
    }

    /**
     * Refresh tokens using a refresh token.
     *
     * @param refreshToken the refresh token
     * @return new authentication result with fresh tokens
     */
    public AuthenticationResultType refreshTokens(String refreshToken) {
        try {
            Map<String, String> authParams = new HashMap<>();
            authParams.put("REFRESH_TOKEN", refreshToken);

            AdminInitiateAuthRequest refreshRequest = AdminInitiateAuthRequest.builder()
                    .authFlow(AuthFlowType.REFRESH_TOKEN_AUTH)
                    .clientId(cognitoProperties.getAppClientId())
                    .userPoolId(cognitoProperties.getUserPoolId())
                    .authParameters(authParams)
                    .build();

            AdminInitiateAuthResponse refreshResponse = cognitoClient.adminInitiateAuth(refreshRequest);
            return refreshResponse.authenticationResult();
        } catch (NotAuthorizedException e) {
            log.error("Token refresh failed", e);
            throw new RuntimeException("Invalid refresh token");
        } catch (Exception e) {
            log.error("Error during token refresh", e);
            throw new RuntimeException("Token refresh error");
        }
    }

    /**
     * Add a user to a specific group (role).
     *
     * @param username the username
     * @param groupName the group name
     */
    public void addUserToGroup(String username, String groupName) {
        try {
            AdminAddUserToGroupRequest request = AdminAddUserToGroupRequest.builder()
                    .userPoolId(cognitoProperties.getUserPoolId())
                    .username(username)
                    .groupName(groupName)
                    .build();

            cognitoClient.adminAddUserToGroup(request);
        } catch (Exception e) {
            log.error("Error adding user to group", e);
            throw new RuntimeException("Error assigning role to user");
        }
    }
}

package com.callcastlecare.api.controller;

import com.callcastlecare.api.dto.AuthRequestDto;
import com.callcastlecare.api.dto.AuthResponseDto;
import com.callcastlecare.api.dto.RegisterRequestDto;
import com.callcastlecare.api.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AuthenticationResultType;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody AuthRequestDto request) {
        AuthenticationResultType result = authService.authenticate(request.getUsername(), request.getPassword());
        
        return ResponseEntity.ok(AuthResponseDto.builder()
                .accessToken(result.accessToken())
                .refreshToken(result.refreshToken())
                .idToken(result.idToken())
                .expiresIn(result.expiresIn())
                .tokenType(result.tokenType())
                .build());
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody RegisterRequestDto request) {
        // Prepare user attributes
        Map<String, String> attributes = new HashMap<>();
        attributes.put("email", request.getEmail());
        attributes.put("given_name", request.getFirstName());
        attributes.put("family_name", request.getLastName());
        attributes.put("phone_number", request.getPhone());
        attributes.put("custom:user_type", request.getUserType());
        
        // Register the user
        String username = authService.registerUser(request.getEmail(), request.getPassword(), attributes);
        
        // Add user to appropriate group based on user type
        String groupName = "ROLE_" + request.getUserType().toUpperCase();
        authService.addUserToGroup(username, groupName);
        
        // Authenticate the user to get tokens
        AuthenticationResultType result = authService.authenticate(request.getEmail(), request.getPassword());
        
        return ResponseEntity.ok(AuthResponseDto.builder()
                .accessToken(result.accessToken())
                .refreshToken(result.refreshToken())
                .idToken(result.idToken())
                .expiresIn(result.expiresIn())
                .tokenType(result.tokenType())
                .build());
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponseDto> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        AuthenticationResultType result = authService.refreshTokens(refreshToken);
        
        return ResponseEntity.ok(AuthResponseDto.builder()
                .accessToken(result.accessToken())
                .refreshToken(refreshToken) // Keep the original refresh token
                .idToken(result.idToken())
                .expiresIn(result.expiresIn())
                .tokenType(result.tokenType())
                .build());
    }
}

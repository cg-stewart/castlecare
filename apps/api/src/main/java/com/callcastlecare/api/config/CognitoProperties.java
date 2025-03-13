package com.callcastlecare.api.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for AWS Cognito.
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "aws.cognito")
public class CognitoProperties {
    private String region;
    
    // Original pool (to maintain backward compatibility)
    private String userPoolId;
    private String appClientId;
    private String jwkUrl;
    
    // Customer pool
    private String customerUserPoolId;
    private String customerAppClientId;
    private String customerIdentityPoolId;
    
    // Worker pool
    private String workerUserPoolId;
    private String workerAppClientId;
    private String workerIdentityPoolId;
}

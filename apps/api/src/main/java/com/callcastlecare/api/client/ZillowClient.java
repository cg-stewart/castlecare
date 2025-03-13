package com.callcastlecare.api.client;

import com.callcastlecare.api.dto.AddressDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class ZillowClient {

    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;
    
    @Value("${zillow.api.key:66919cbde3mshbde07fa46d45f97p139cadjsn4f4821f6a9e3}")
    private String zillowApiKey;
    
    @Value("${zillow.api.host:zillow-com1.p.rapidapi.com}")
    private String zillowApiHost;
    
    public ZillowClient() {
        this.httpClient = new OkHttpClient.Builder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Fetches property size data from Zillow API based on the provided address
     * Only retrieves the lot size and living area (square footage) needed for service pricing
     * 
     * @param address The address to look up
     * @return Object array containing [livingArea, lotSize]
     */
    @Cacheable(value = "propertyData", key = "#address.street + '-' + #address.city + '-' + #address.state + '-' + #address.zip")
    public Object[] getPropertySizeData(AddressDto address) {
        try {
            // In a production environment, we would first search for the property by address to get the zpid
            // For demonstration, using a direct property lookup with a sample zpid
            String formattedAddress = String.format("%s, %s, %s %s", 
                address.getStreet(), address.getCity(), address.getState(), address.getZip());
            log.info("Fetching property data for address: {}", formattedAddress);
            
            // In a real implementation, this would be a search endpoint first to get the zpid
            String url = "https://zillow-com1.p.rapidapi.com/property?zpid=197832";
            
            Request request = new Request.Builder()
                    .url(url)
                    .get()
                    .addHeader("x-rapidapi-key", zillowApiKey)
                    .addHeader("x-rapidapi-host", zillowApiHost)
                    .build();
            
            try (Response response = httpClient.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    log.error("Failed to get property data from Zillow API for address: {}, status code: {}", 
                            formattedAddress, response.code());
                    return getDefaultSizeData();
                }
                
                if (response.body() == null) {
                    log.error("Empty response body from Zillow API for address: {}", formattedAddress);
                    return getDefaultSizeData();
                }
                
                String responseBody = response.body().string();
                JsonNode rootNode = objectMapper.readTree(responseBody);
                
                // Extract only the two fields we need for service pricing
                int livingArea = rootNode.path("livingArea").asInt(0);
                String lotSize = rootNode.path("resoFacts").path("lotSize").asText("0");
                
                log.info("Retrieved property data for {}: livingArea={}, lotSize={}", 
                        formattedAddress, livingArea, lotSize);
                
                return new Object[] { livingArea, lotSize };
            }
        } catch (IOException e) {
            log.error("Error fetching property data from Zillow API", e);
            return getDefaultSizeData();
        }
    }
    
    /**
     * Returns default property size data when API calls fail
     * 
     * @return Object array with default [livingArea, lotSize]
     */
    private Object[] getDefaultSizeData() {
        return new Object[] { 1800, "0.25 acres" };
    }
}

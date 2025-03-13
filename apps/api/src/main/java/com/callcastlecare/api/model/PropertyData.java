package com.callcastlecare.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyData {
    private Integer bedrooms;
    private Integer bathrooms;
    private Integer livingArea; // in sq ft
    private String lotSize; // in sq ft or acres
    private String streetAddress;
    private String city;
    private String state;
    private String zipcode;
    private Integer yearBuilt;
    private String propertyType; // e.g., TOWNHOUSE, SINGLE_FAMILY, etc.
    private Double estimatedValue; // current estimated value in USD
    
    /**
     * Returns a default property data object with reasonable values
     * Used when API calls fail or return incomplete data
     * 
     * @return A PropertyData object with default values
     */
    public static PropertyData getDefaultPropertyData() {
        return PropertyData.builder()
                .bedrooms(3)
                .bathrooms(2)
                .livingArea(1800)
                .lotSize("0.25 acres")
                .streetAddress("")
                .city("")
                .state("")
                .zipcode("")
                .yearBuilt(2000)
                .propertyType("SINGLE_FAMILY")
                .estimatedValue(350000.0)
                .build();
    }
}

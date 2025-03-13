package com.callcastlecare.api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.callcastlecare.api.dto.WorkerApplicationDto;
import com.callcastlecare.api.model.WorkerApplication;
import com.callcastlecare.api.repository.WorkerApplicationRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class WorkerApplicationService {

    private final WorkerApplicationRepository applicationRepository;
    private final RedisTestService redisService;
    private final ObjectMapper objectMapper;

    @Autowired
    public WorkerApplicationService(
            WorkerApplicationRepository applicationRepository,
            RedisTestService redisService,
            ObjectMapper objectMapper) {
        this.applicationRepository = applicationRepository;
        this.redisService = redisService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public WorkerApplicationDto createApplication(WorkerApplicationDto applicationDto) {
        // Check if there's any data in Redis for this user
        String redisKey = "application:" + applicationDto.getUserId();
        Object redisData = redisService.getValue(redisKey);
        
        // Build the entity from the DTO
        WorkerApplication application = mapToEntity(applicationDto);
        application.setStatus("PENDING");
        application.setCreatedAt(LocalDateTime.now());
        
        // Save to database
        WorkerApplication savedApplication = applicationRepository.save(application);
        
        // If we found data in Redis, we can now remove it as it's been migrated to the database
        if (redisData != null) {
            redisService.deleteValue(redisKey);
        }
        
        return mapToDto(savedApplication);
    }

    public WorkerApplicationDto getApplication(String id) {
        WorkerApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
        return mapToDto(application);
    }

    public WorkerApplicationDto getApplicationByUserId(String userId) {
        // First check Redis for any in-progress application data
        String redisKey = "application:" + userId;
        Object redisData = redisService.getValue(redisKey);
        
        if (redisData != null) {
            try {
                // If found in Redis, convert to DTO
                return objectMapper.readValue(redisData.toString(), WorkerApplicationDto.class);
            } catch (JsonProcessingException e) {
                // If error parsing, log and continue to check database
                System.err.println("Error parsing Redis data: " + e.getMessage());
            }
        }
        
        // If not in Redis or error parsing, check database
        Optional<WorkerApplication> applicationOpt = applicationRepository.findByUserId(userId);
        if (applicationOpt.isPresent()) {
            return mapToDto(applicationOpt.get());
        }
        
        // If not found anywhere, throw exception
        throw new RuntimeException("Application not found for user: " + userId);
    }

    @Transactional
    public WorkerApplicationDto updateApplicationStatus(String id, String status) {
        WorkerApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
        
        application.setStatus(status);
        application.setUpdatedAt(LocalDateTime.now());
        
        WorkerApplication updatedApplication = applicationRepository.save(application);
        return mapToDto(updatedApplication);
    }

    public List<WorkerApplicationDto> getApplicationsByStatus(String status) {
        return applicationRepository.findByStatus(status).stream()
                .map(this::mapToDto)
                .toList();
    }

    // Helper methods for mapping between entity and DTO
    private WorkerApplication mapToEntity(WorkerApplicationDto dto) {
        return WorkerApplication.builder()
                .userId(dto.getUserId())
                .plan(dto.getAccount().getPlan())
                .username(dto.getContact().getUsername())
                .firstName(dto.getContact().getFirstName())
                .lastName(dto.getContact().getLastName())
                .city(dto.getContact().getCity())
                .state(dto.getContact().getState())
                .zip(dto.getContact().getZip())
                .email(dto.getContact().getEmail())
                .phone(dto.getContact().getPhone())
                .dateOfBirth(dto.getContact().getDateOfBirth())
                .onDemandRoles(dto.getRoles().getOnDemand())
                .warehouseRoles(dto.getRoles().getWarehouse())
                .build();
    }

    private WorkerApplicationDto mapToDto(WorkerApplication entity) {
        WorkerApplicationDto dto = new WorkerApplicationDto();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUserId());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        
        // Map account
        WorkerApplicationDto.AccountDto accountDto = new WorkerApplicationDto.AccountDto();
        accountDto.setPlan(entity.getPlan());
        dto.setAccount(accountDto);
        
        // Map contact
        WorkerApplicationDto.ContactDto contactDto = new WorkerApplicationDto.ContactDto();
        contactDto.setUsername(entity.getUsername());
        contactDto.setFirstName(entity.getFirstName());
        contactDto.setLastName(entity.getLastName());
        contactDto.setCity(entity.getCity());
        contactDto.setState(entity.getState());
        contactDto.setZip(entity.getZip());
        contactDto.setEmail(entity.getEmail());
        contactDto.setPhone(entity.getPhone());
        contactDto.setDateOfBirth(entity.getDateOfBirth());
        dto.setContact(contactDto);
        
        // Map roles
        WorkerApplicationDto.RolesDto rolesDto = new WorkerApplicationDto.RolesDto();
        rolesDto.setOnDemand(entity.getOnDemandRoles());
        rolesDto.setWarehouse(entity.getWarehouseRoles());
        dto.setRoles(rolesDto);
        
        return dto;
    }
}

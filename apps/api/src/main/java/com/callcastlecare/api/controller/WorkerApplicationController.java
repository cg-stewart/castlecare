package com.callcastlecare.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.callcastlecare.api.dto.WorkerApplicationDto;
import com.callcastlecare.api.service.WorkerApplicationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/worker-applications")
public class WorkerApplicationController {

    private final WorkerApplicationService applicationService;

    @Autowired
    public WorkerApplicationController(WorkerApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<WorkerApplicationDto> createApplication(
            @Valid @RequestBody WorkerApplicationDto applicationDto) {
        WorkerApplicationDto createdApplication = applicationService.createApplication(applicationDto);
        return new ResponseEntity<>(createdApplication, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkerApplicationDto> getApplication(@PathVariable String id) {
        WorkerApplicationDto application = applicationService.getApplication(id);
        return ResponseEntity.ok(application);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<WorkerApplicationDto> getApplicationByUserId(@PathVariable String userId) {
        WorkerApplicationDto application = applicationService.getApplicationByUserId(userId);
        return ResponseEntity.ok(application);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<WorkerApplicationDto> updateApplicationStatus(
            @PathVariable String id, 
            @RequestParam String status) {
        WorkerApplicationDto updatedApplication = applicationService.updateApplicationStatus(id, status);
        return ResponseEntity.ok(updatedApplication);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<WorkerApplicationDto>> getApplicationsByStatus(@PathVariable String status) {
        List<WorkerApplicationDto> applications = applicationService.getApplicationsByStatus(status);
        return ResponseEntity.ok(applications);
    }
}

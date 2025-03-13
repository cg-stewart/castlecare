package com.callcastlecare.api.controller;

import com.callcastlecare.api.dto.WorkerDto;
import com.callcastlecare.api.model.Worker;
import com.callcastlecare.api.service.WorkerService;
import com.callcastlecare.api.service.SecurityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing workers.
 */
@RestController
@RequestMapping("/api/v1/workers")
@RequiredArgsConstructor
public class WorkerController {

    private final WorkerService workerService;
    // This field is used in @PreAuthorize annotations for security expressions
    // e.g., @securityService.isWorkerOwner(#id, principal)
    private final SecurityService securityService;

    /**
     * Create a new worker.
     *
     * @param workerDto the worker data
     * @return the created worker
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WorkerDto> createWorker(@Valid @RequestBody WorkerDto workerDto) {
        return new ResponseEntity<>(workerService.createWorker(workerDto), HttpStatus.CREATED);
    }

    /**
     * Get a worker by ID.
     *
     * @param id the worker ID
     * @return the worker data
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('WORKER', 'ADMIN') or @securityService.isWorkerOwner(#id, principal)")
    public ResponseEntity<WorkerDto> getWorkerById(@PathVariable Long id) {
        return ResponseEntity.ok(workerService.getWorkerById(id));
    }

    /**
     * Get all workers.
     *
     * @return list of all workers
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<WorkerDto>> getAllWorkers() {
        return ResponseEntity.ok(workerService.getAllWorkers());
    }

    /**
     * Update worker status.
     *
     * @param id the worker ID
     * @param status the new status
     * @return the updated worker
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WorkerDto> updateWorkerStatus(
            @PathVariable Long id, 
            @RequestParam Worker.WorkerStatus status) {
        return ResponseEntity.ok(workerService.updateWorkerStatus(id, status));
    }

    /**
     * Update worker availability.
     *
     * @param id the worker ID
     * @param available the availability status
     * @return the updated worker
     */
    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isWorkerOwner(#id, principal)")
    public ResponseEntity<WorkerDto> updateWorkerAvailability(
            @PathVariable Long id, 
            @RequestParam Boolean available) {
        return ResponseEntity.ok(workerService.updateWorkerAvailability(id, available));
    }

    /**
     * Get available workers by role.
     *
     * @param role the worker role
     * @return list of available workers with the specified role
     */
    @GetMapping("/available/{role}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<List<WorkerDto>> getAvailableWorkersByRole(@PathVariable String role) {
        return ResponseEntity.ok(workerService.getAvailableWorkersByRole(role));
    }
}

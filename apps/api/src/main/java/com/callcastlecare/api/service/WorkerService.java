package com.callcastlecare.api.service;

import com.callcastlecare.api.dto.WorkerDto;
import com.callcastlecare.api.model.Worker;
import com.callcastlecare.api.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkerService {
    
    private final WorkerRepository workerRepository;
    
    @Transactional
    public WorkerDto createWorker(WorkerDto workerDto) {
        if (workerRepository.existsByEmail(workerDto.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        
        if (workerDto.getAge() < 18) {
            throw new IllegalArgumentException("Worker must be at least 18 years old");
        }
        
        Worker worker = new Worker();
        worker.setFirstName(workerDto.getFirstName());
        worker.setLastName(workerDto.getLastName());
        worker.setAge(workerDto.getAge());
        worker.setStreet(workerDto.getStreet());
        worker.setCity(workerDto.getCity());
        worker.setState(workerDto.getState());
        worker.setZip(workerDto.getZip());
        worker.setPhone(workerDto.getPhone());
        worker.setEmail(workerDto.getEmail());
        worker.setRoles(workerDto.getRoles());
        worker.setAvailability(false); // Default to unavailable until approved
        worker.setStatus(Worker.WorkerStatus.PENDING); // Default to pending
        
        Worker savedWorker = workerRepository.save(worker);
        return mapToDto(savedWorker);
    }
    
    @Cacheable(value = "workers", key = "#id")
    @Transactional(readOnly = true)
    public WorkerDto getWorkerById(Long id) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Worker not found with id: " + id));
        return mapToDto(worker);
    }
    
    @Transactional(readOnly = true)
    public List<WorkerDto> getAllWorkers() {
        return workerRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @CacheEvict(value = "workers", key = "#id")
    @Transactional
    public WorkerDto updateWorkerStatus(Long id, Worker.WorkerStatus status) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Worker not found with id: " + id));
        
        worker.setStatus(status);
        Worker updatedWorker = workerRepository.save(worker);
        return mapToDto(updatedWorker);
    }
    
    @CacheEvict(value = "workers", key = "#id")
    @Transactional
    public WorkerDto updateWorkerAvailability(Long id, Boolean availability) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Worker not found with id: " + id));
        
        // Only approved workers can set availability
        if (worker.getStatus() != Worker.WorkerStatus.APPROVED) {
            throw new IllegalStateException("Worker must be approved to update availability");
        }
        
        worker.setAvailability(availability);
        Worker updatedWorker = workerRepository.save(worker);
        return mapToDto(updatedWorker);
    }
    
    @Transactional(readOnly = true)
    public List<WorkerDto> getAvailableWorkersByRole(String role) {
        return workerRepository.findAvailableWorkersByRole(role).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    private WorkerDto mapToDto(Worker worker) {
        return WorkerDto.builder()
                .id(worker.getId())
                .firstName(worker.getFirstName())
                .lastName(worker.getLastName())
                .age(worker.getAge())
                .street(worker.getStreet())
                .city(worker.getCity())
                .state(worker.getState())
                .zip(worker.getZip())
                .phone(worker.getPhone())
                .email(worker.getEmail())
                .roles(worker.getRoles())
                .availability(worker.getAvailability())
                .stripeConnectId(worker.getStripeConnectId())
                .status(worker.getStatus())
                .createdAt(worker.getCreatedAt())
                .build();
    }
}

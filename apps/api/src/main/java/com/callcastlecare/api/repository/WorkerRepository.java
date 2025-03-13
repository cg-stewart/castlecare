package com.callcastlecare.api.repository;

import com.callcastlecare.api.model.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {
    Optional<Worker> findByEmail(String email);
    boolean existsByEmail(String email);
    
    @Query("SELECT w FROM Worker w WHERE w.availability = true AND w.status = 'APPROVED' AND :role MEMBER OF w.roles")
    List<Worker> findAvailableWorkersByRole(String role);
}

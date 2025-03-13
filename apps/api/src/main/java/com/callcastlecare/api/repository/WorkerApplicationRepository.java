package com.callcastlecare.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.callcastlecare.api.model.WorkerApplication;

@Repository
public interface WorkerApplicationRepository extends JpaRepository<WorkerApplication, String> {
    Optional<WorkerApplication> findByUserId(String userId);
    List<WorkerApplication> findByStatus(String status);
}

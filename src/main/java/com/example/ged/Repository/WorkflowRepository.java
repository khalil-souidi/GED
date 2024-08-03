package com.example.ged.Repository;

import com.example.ged.Entities.Workflow;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkflowRepository extends JpaRepository<Workflow, Long> {
    Workflow findByDocumentId(Long documentId);
}

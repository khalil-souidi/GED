package com.example.ged.Services;

import com.example.ged.Entities.Workflow;
import com.example.ged.Repository.WorkflowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WorkflowService {
    @Autowired
    private WorkflowRepository workflowRepository;

    public Workflow getWorkflowByDocumentId(Long documentId) {
        return workflowRepository.findByDocumentId(documentId);
    }
}

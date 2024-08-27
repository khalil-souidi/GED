package com.example.ged.Services;

import com.example.ged.DTO.AuditlogDTO;
import com.example.ged.Entities.AuditLog;
import com.example.ged.Entities.Users;
import com.example.ged.Entities.Document;
import com.example.ged.Repository.AuditLogRepository;
import com.example.ged.Repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {
    @Autowired
    private AuditLogRepository auditLogRepository;
    @Autowired
    private DocumentRepository documentRepository;

    public void logAction(String action, String entity, Long entityId, String details, Users user) {
        AuditLog auditLog = new AuditLog();
        auditLog.setAction(action);
        auditLog.setEntity(entity);
        auditLog.setEntityId(entityId);
        auditLog.setDetails(details);
        auditLog.setUser(user);
        auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }

    public List<AuditLog> getAuditLogsByDocumentId(Long documentId) {
        return auditLogRepository.findByEntityId(documentId);
    }

    public AuditLog saveAuditLog(AuditLog auditLog) {
        return auditLogRepository.save(auditLog);
    }
    public List<AuditlogDTO> getAuditLogsByUserId(Long userId) {
        List<AuditLog> logs = auditLogRepository.findByUserId(userId);
        return logs.stream().map(log -> {
            AuditlogDTO dto = new AuditlogDTO();
            dto.setAction(log.getAction());
            dto.setEntity(log.getEntity());
            dto.setEntityId(log.getEntityId());
            dto.setDocumentName(getDocumentNameByEntityId(log.getEntityId()));
            dto.setDetails(log.getDetails());
            dto.setTimestamp(log.getTimestamp());
            dto.setUser(log.getUser());
            return dto;
        }).collect(Collectors.toList());
    }
    public String getDocumentNameByEntityId(Long entityId) {
        return documentRepository.findById(entityId)
                .map(Document::getNomDoc)
                .orElse("Unknown Document"); // Return a default name if the document is not found
    }
}

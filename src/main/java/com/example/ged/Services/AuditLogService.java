package com.example.ged.Services;

import com.example.ged.Entities.AuditLog;
import com.example.ged.Entities.Users;
import com.example.ged.Repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditLogService {
    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAction(String action, String entity, Long entityId, String details, Users user) {
        AuditLog auditLog = new AuditLog();
        auditLog.setAction(action);
        auditLog.setEntity(entity);
        auditLog.setEntityId(entityId);
        auditLog.setDetails(details);
        auditLog.setUser(user);
        auditLogRepository.save(auditLog);
    }
}

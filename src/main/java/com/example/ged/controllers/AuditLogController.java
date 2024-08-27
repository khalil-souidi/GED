package com.example.ged.controllers;

import com.example.ged.DTO.AuditlogDTO;
import com.example.ged.Services.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AuditlogDTO>> getAllAuditLogs() {
        List<AuditlogDTO> auditLogs = auditLogService.getAllAuditLogs()
                .stream()
                .map(log -> new AuditlogDTO(
                        log.getAction(),
                        log.getEntity(),
                        log.getEntityId(),
                        auditLogService.getDocumentNameByEntityId(log.getEntityId()),
                        log.getDetails(),
                        log.getTimestamp(),
                        log.getUser()
                )).collect(Collectors.toList());
        return ResponseEntity.ok(auditLogs);
    }

    @GetMapping("/document/{documentId}")
    public ResponseEntity<List<AuditlogDTO>> getAuditLogsByDocumentId(@PathVariable Long documentId) {
        List<AuditlogDTO> auditLogs = auditLogService.getAuditLogsByDocumentId(documentId)
                .stream()
                .map(log -> new AuditlogDTO(
                        log.getAction(),
                        log.getEntity(),
                        log.getEntityId(),
                        auditLogService.getDocumentNameByEntityId(log.getEntityId()),
                        log.getDetails(),
                        log.getTimestamp(),
                        log.getUser()
                )).collect(Collectors.toList());
        return ResponseEntity.ok(auditLogs);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AuditlogDTO>> getAuditLogsByUserId(@PathVariable Long userId) {
        List<AuditlogDTO> auditLogs = auditLogService.getAuditLogsByUserId(userId);
        return ResponseEntity.ok(auditLogs);
    }
}

package com.example.ged.controllers;

import com.example.ged.Entities.AuditLog;
import com.example.ged.Services.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAllAuditLogs() {
        List<AuditLog> auditLogs = auditLogService.getAllAuditLogs();
        return ResponseEntity.ok(auditLogs);
    }

    @GetMapping("/document/{documentId}")
    public ResponseEntity<List<AuditLog>> getAuditLogsByDocumentId(@PathVariable Long documentId) {
        List<AuditLog> auditLogs = auditLogService.getAuditLogsByDocumentId(documentId);
        return ResponseEntity.ok(auditLogs);
    }
}

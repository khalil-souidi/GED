package com.example.ged.controllers;

import com.example.ged.Entities.*;
import com.example.ged.Services.DepartmentService;
import com.example.ged.Services.DocumentService;
import com.example.ged.Services.UserService;
import com.example.ged.Services.WorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private WorkflowService workflowService;

    @Autowired
    private UserService userService;

    @GetMapping("/documents")
    public List<Document> getAllDocuments() {
        return documentService.getAllDocuments();
    }

    @GetMapping("/documents/{id}")
    public Document getDocumentById(@PathVariable Long id) {
        return documentService.getDocumentById(id);
    }

    @GetMapping("/documents/{id}/file")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
        Document document = documentService.getDocumentById(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getMetadata().getNomFichierOriginal() + "\"")
                .header(HttpHeaders.CONTENT_TYPE, document.getMetadata().getTypeFichier())
                .body(document.getMetadata().getFichier());
    }

    @PostMapping("/documents")
    public Document createDocument(
            @RequestParam("typeDoc") String typeDoc,
            @RequestParam("nomDoc") String nomDoc,
            @RequestParam("nomClient") String nomClient,
            @RequestParam("numClient") String numClient,
            @RequestParam("emailClient") String emailClient,
            @RequestParam("file") MultipartFile file,
            @RequestParam("departementName") String departementName,
            @RequestParam("userId") Long userId) throws IOException {
        Document document = new Document();
        document.setTypeDoc(typeDoc);
        document.setNomDoc(nomDoc);
        document.setNomClient(nomClient);
        document.setNumClient(numClient);
        document.setEmailClient(emailClient);
        document.setDepartement(departmentService.getDepartementByName(departementName));
        Users user = userService.getUserById(userId);
        return documentService.saveDocument(document, file, user);
    }

    @DeleteMapping("/documents/{id}")
    public void deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
    }

    @PutMapping("/documents/{id}/status")
    public ResponseEntity<Document> updateDocumentStatus(
            @PathVariable Long id,
            @RequestParam("status") DocumentStatus status,
            @RequestParam(value = "comment", required = false) String comment) {
        Document updatedDocument = documentService.updateDocumentStatus(id, status, comment);
        if (updatedDocument == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(updatedDocument);
    }

    @PutMapping("/documents/{id}")
    public ResponseEntity<Document> updateDocument(
            @PathVariable Long id,
            @RequestParam("typeDoc") String typeDoc,
            @RequestParam("nomDoc") String nomDoc,
            @RequestParam("nomClient") String nomClient,
            @RequestParam("numClient") String numClient,
            @RequestParam("emailClient") String emailClient,
            @RequestParam("file") MultipartFile file,
            @RequestParam("departementName") String departementName) throws IOException {
        Document updatedDocument = new Document();
        updatedDocument.setTypeDoc(typeDoc);
        updatedDocument.setNomDoc(nomDoc);
        updatedDocument.setNomClient(nomClient);
        updatedDocument.setNumClient(numClient);
        updatedDocument.setEmailClient(emailClient);
        updatedDocument.setDepartement(departmentService.getDepartementByName(departementName));
        Document document = documentService.updateDocument(id, updatedDocument, file);
        return ResponseEntity.ok(document);
    }

    @PostMapping("/documents/{id}/versions")
    public ResponseEntity<Document> addDocumentVersion(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId) throws IOException {
        Users user = userService.getUserById(userId);
        Document document = documentService.addDocumentVersion(id, file, user);
        return ResponseEntity.ok(document);
    }

    @GetMapping("/documents/{id}/versions")
    public List<DocumentVersion> getDocumentVersions(@PathVariable Long id) {
        return documentService.getDocumentVersions(id);
    }

    @GetMapping("/documents/{id}/workflow")
    public Workflow getWorkflowByDocumentId(@PathVariable Long id) {
        return workflowService.getWorkflowByDocumentId(id);
    }

    @PutMapping("/documents/{id}/close")
    public ResponseEntity<Void> closeWorkflow(@PathVariable Long id) {
        documentService.WorkflowToCloture(id);
        return ResponseEntity.noContent().build();
    }
}

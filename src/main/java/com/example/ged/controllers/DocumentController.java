package com.example.ged.controllers;

import com.example.ged.Entities.Document;
import com.example.ged.Entities.DocumentStatus;
import com.example.ged.Services.DepartmentService;
import com.example.ged.Services.DocumentService;
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
            @RequestParam("departementName") String departementName) throws IOException {
        Document document = new Document();
        document.setTypeDoc(typeDoc);
        document.setNomDoc(nomDoc);
        document.setNomClient(nomClient);
        document.setNumClient(numClient);
        document.setEmailClient(emailClient);
        document.setDepartement(departmentService.getDepartementByName(departementName));
        return documentService.saveDocument(document, file);
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
        return ResponseEntity.ok(updatedDocument);
    }


}

package com.example.ged.controllers;

import com.example.ged.Entities.TypeDocument;
import com.example.ged.Services.TypeDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/typedocuments")
public class TypeDocumentController {

    @Autowired
    private TypeDocumentService typeDocumentService;

    @GetMapping
    public ResponseEntity<List<TypeDocument>> getAllTypeDocuments() {
        List<TypeDocument> typeDocuments = typeDocumentService.getAllTypeDocuments();
        return ResponseEntity.ok(typeDocuments);
    }

}

package com.example.ged.Services;

import com.example.ged.Entities.TypeDocument;
import com.example.ged.Repository.TypeDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TypeDocumentService {

    @Autowired
    private TypeDocumentRepository typeDocumentRepository;

    public TypeDocument getTypeDocumentById(Long id) {
        return typeDocumentRepository.findById(id).orElseThrow(() -> new RuntimeException("TypeDocument not found with id " + id));
    }

    public List<TypeDocument> getAllTypeDocuments() {
        return typeDocumentRepository.findAll();
    }

    public TypeDocument createTypeDocument(TypeDocument typeDocument) {
        return typeDocumentRepository.save(typeDocument);
    }

    public void deleteTypeDocument(Long id) {
        typeDocumentRepository.deleteById(id);
    }
}

package com.example.ged.Repository;

import com.example.ged.Entities.TypeDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TypeDocumentRepository extends JpaRepository<TypeDocument, Long> {
    Optional<TypeDocument> findByNom(String nom);
}

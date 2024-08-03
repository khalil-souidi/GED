package com.example.ged.Repository;

import com.example.ged.Entities.DocumentVersion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentVersionRepository extends JpaRepository<DocumentVersion, Long> {
    List<DocumentVersion> findByDocumentId(Long documentId);
}

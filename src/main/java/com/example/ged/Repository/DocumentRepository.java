package com.example.ged.Repository;

import com.example.ged.Entities.Departement;
import com.example.ged.Entities.Document;
import com.example.ged.Entities.DocumentStatus;
import com.example.ged.Entities.EtapeWorkflow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByDocumentStatus(DocumentStatus documentStatus);
    List<Document> findByNomDocContainingIgnoreCase(String nomDoc);
    List<Document> findByTypeDoc_NomContainingIgnoreCase(String nom);
    List<Document> findByCodeUnique(String codeUnique);
    List<Document> findByDateCreationBetween(Date startDate, Date endDate);
    List<Document> findByWorkflow_EtapeCourante(EtapeWorkflow etapeWorkflow);
    List<Document> findByDepartement(Departement departement);
    List<Document> findByDepartement_NameAndWorkflow_EtapeCourante(String departementName, EtapeWorkflow etapeCourante);
    List<Document> findByArchivedTrue();

}


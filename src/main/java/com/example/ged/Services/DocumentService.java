package com.example.ged.Services;

import com.example.ged.Entities.*;
import com.example.ged.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.example.ged.Entities.Document;
import com.example.ged.Entities.DocumentTypeStat;
import com.example.ged.Repository.DocumentRepository;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;
    @Autowired
    private DocumentVersionRepository documentVersionRepository;
    @Autowired
    private MetadataRepository metadataRepository;
    @Autowired
    private WorkflowRepository workflowRepository;
    @Autowired
    private AuditLogService auditLogService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private TypeDocumentService typeDocumentService;
    @Autowired
    private DepartementRepository departementRepository;

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public List<Document> getDocumentsByStatus(DocumentStatus status) {
        return documentRepository.findByDocumentStatus(status);
    }

    public List<Document> searchDocumentsByName(String name) {
        return documentRepository.findByNomDocContainingIgnoreCase(name);
    }

    public List<Document> searchDocumentsByType(String type) {
        return documentRepository.findByTypeDoc_NomContainingIgnoreCase(type);
    }

    public List<Document> searchDocumentsByCodeUnique(String codeUnique) {
        return documentRepository.findByCodeUnique(codeUnique);
    }

    public List<Document> searchDocumentsByDate(Date startDate, Date endDate) {
        return documentRepository.findByDateCreationBetween(startDate, endDate);
    }

    public List<Document> getDocumentsByWorkflow(EtapeWorkflow etapeWorkflow) {
        return documentRepository.findByWorkflow_EtapeCourante(etapeWorkflow);
    }

    public Document saveDocument(Document document, MultipartFile file, Users user, String typeDocNom) throws IOException {
        TypeDocument typeDocument = typeDocumentService.getTypeDocumentByNom(typeDocNom);
        document.setTypeDoc(typeDocument);

        if (file != null && !file.isEmpty()) {
            Metadata metadata = new Metadata();
            metadata.setNomFichierOriginal(file.getOriginalFilename());
            metadata.setTypeFichier(file.getContentType());
            metadata.setFichier(file.getBytes());
            metadata.setDateUpload(new Date());
            metadata = metadataRepository.save(metadata);
            document.setMetadata(metadata);
        }
        document.setUploadedBy(user);
        Document savedDocument = documentRepository.save(document);
        saveDocumentVersion(savedDocument, user);
        createInitialWorkflow(savedDocument);

        auditLogService.logAction("CREATE", "Document", savedDocument.getId(), "Document created", user);

        return savedDocument;
    }

    private void createInitialWorkflow(Document document) {
        Workflow workflow = new Workflow();
        workflow.setDocument(document);
        workflow.setEtapeCourante(EtapeWorkflow.DEPOT);
        workflow.setDateAction(new Date());
        document.setWorkflow(workflow);
        workflowRepository.save(workflow);
    }

    private void saveDocumentVersion(Document document, Users user) {
        DocumentVersion version = new DocumentVersion();
        version.setDocument(document);
        version.setVersionNumber(document.getVersions().size() + 1);
        version.setNomDoc(document.getNomDoc() + " v" + (document.getVersions().size() + 1));
        version.setNomClient(document.getNomClient());
        version.setNumClient(document.getNumClient());
        version.setEmailClient(document.getEmailClient());
        version.setDateCreation(new Date());
        version.setDocumentStatus(document.getDocumentStatus());
        version.setDepartement(document.getDepartement());
        version.setMetadata(document.getMetadata());
        version.setCommentaireRejet(document.getCommentaireRejet());
        version.setUploadedBy(user);
        documentVersionRepository.save(version);

        auditLogService.logAction("CREATE_VERSION", "DocumentVersion", version.getId(), "Document version created", user);
    }

    public void deleteDocument(Long id) {
        Document document = documentRepository.findById(id).orElseThrow(() -> new RuntimeException("Document not found with id " + id));
        documentRepository.deleteById(id);

        auditLogService.logAction("DELETE", "Document", id, "Document deleted", document.getUploadedBy());
    }

    public Document updateDocumentStatus(Long id, DocumentStatus status, String commentaireRejet) {
        Document document = documentRepository.findById(id).orElseThrow(() -> new RuntimeException("Document not found with id " + id));
        document.setDocumentStatus(status);
        if (status == DocumentStatus.REFUSÉ) {
            document.setCommentaireRejet(commentaireRejet);
        }
        document = documentRepository.save(document);
        saveDocumentVersion(document, document.getUploadedBy());

        updateWorkflow(document, status);

        auditLogService.logAction("UPDATE_STATUS", "Document", document.getId(), "Document status updated to " + status, document.getUploadedBy());

        sendStatusUpdateEmail(document, status, commentaireRejet);

        return document;
    }

    private void updateWorkflow(Document document, DocumentStatus status) {
        Workflow workflow = document.getWorkflow();
        if (status == DocumentStatus.APPROUVÉ) {
            workflow.setEtapeCourante(EtapeWorkflow.TRAITEMENT);
        } else if (status == DocumentStatus.REFUSÉ) {
            workflow.setEtapeCourante(EtapeWorkflow.DEPOT);
        }
        workflow.setDateAction(new Date());
        workflowRepository.save(workflow);
    }

    private void sendStatusUpdateEmail(Document document, DocumentStatus status, String commentaireRejet) {
        StringBuilder emailContent = new StringBuilder();
        emailContent.append("Votre Dossier a été ")
                .append(status == DocumentStatus.APPROUVÉ ? "approuvé" : "refusé")
                .append(".").append("\n")
                .append("Numéro de Dossier: ").append(document.getCodeUnique()).append("\n");
        if (status == DocumentStatus.REFUSÉ) {
            emailContent.append(" Commentaire de rejet: ").append(commentaireRejet).append("\n");
        }
        emailContent.append("\n\nBesoin d'aide ?\n")
                .append("Si vous avez des questions ou besoin d'assistance, n'hésitez pas à nous contacter :\n\n")
                .append("Téléphone : +212 (0)5 24 44 77 88\n")
                .append("Email : support@radeema.ma\n")
                .append("Adresse : Avenue Hassan II, Marrakech, Maroc");

        emailService.sendEmail(document.getEmailClient(), "Statut de votre Dossier", emailContent.toString());
    }

    public void WorkflowToCloture(Long documentId) {
        Document document = documentRepository.findById(documentId).orElseThrow(() -> new RuntimeException("Document not found with id " + documentId));
        Workflow workflow = document.getWorkflow();
        if (workflow.getEtapeCourante() != EtapeWorkflow.TRAITEMENT) {
            throw new RuntimeException("Document workflow must be in 'TRAITEMENT' stage to be closed.");
        }
        workflow.setEtapeCourante(EtapeWorkflow.CLOTURE);
        workflow.setDateAction(new Date());
        document.setArchived(true);
        workflowRepository.save(workflow);
        documentRepository.save(document);

        auditLogService.logAction("CLOSE_WORKFLOW", "Document", document.getId(), "Document workflow closed and archived", document.getUploadedBy());
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id).orElseThrow(() -> new RuntimeException("Document not found with id " + id));
    }

    public List<DocumentVersion> getDocumentVersions(Long documentId) {
        return documentVersionRepository.findByDocumentId(documentId);
    }

    public Document updateDocument(Long id, Document updatedDocument, MultipartFile file) throws IOException {
        Document existingDocument = documentRepository.findById(id).orElseThrow(() -> new RuntimeException("Document not found with id " + id));

        if (file != null && !file.isEmpty()) {
            Metadata metadata = new Metadata();
            metadata.setNomFichierOriginal(file.getOriginalFilename());
            metadata.setTypeFichier(file.getContentType());
            metadata.setFichier(file.getBytes());
            metadata.setDateUpload(new Date());
            metadata = metadataRepository.save(metadata);
            existingDocument.setMetadata(metadata);
        }

        existingDocument.setTypeDoc(updatedDocument.getTypeDoc());
        existingDocument.setNomDoc(updatedDocument.getNomDoc());
        existingDocument.setNomClient(updatedDocument.getNomClient());
        existingDocument.setNumClient(updatedDocument.getNumClient());
        existingDocument.setEmailClient(updatedDocument.getEmailClient());
        existingDocument.setDocumentStatus(updatedDocument.getDocumentStatus());
        existingDocument.setDepartement(updatedDocument.getDepartement());
        existingDocument.setCommentaireRejet(updatedDocument.getCommentaireRejet());

        Document savedDocument = documentRepository.save(existingDocument);
        saveDocumentVersion(savedDocument, existingDocument.getUploadedBy());

        auditLogService.logAction("UPDATE", "Document", savedDocument.getId(), "Document updated", existingDocument.getUploadedBy());

        return savedDocument;
    }

    public Document addDocumentVersion(Long documentId, MultipartFile file, Users user) throws IOException {
        Document document = documentRepository.findById(documentId).orElseThrow(() -> new RuntimeException("Document not found with id " + documentId));

        if (file != null && !file.isEmpty()) {
            Metadata metadata = new Metadata();
            metadata.setNomFichierOriginal(file.getOriginalFilename());
            metadata.setTypeFichier(file.getContentType());
            metadata.setFichier(file.getBytes());
            metadata.setDateUpload(new Date());
            metadata = metadataRepository.save(metadata);

            DocumentVersion version = new DocumentVersion();
            version.setDocument(document);
            version.setVersionNumber(document.getVersions().size() + 1);
            version.setNomDoc(document.getNomDoc() + " v" + (document.getVersions().size() + 1));
            version.setNomClient(document.getNomClient());
            version.setNumClient(document.getNumClient());
            version.setEmailClient(document.getEmailClient());
            version.setDateCreation(new Date());
            version.setDocumentStatus(document.getDocumentStatus());
            version.setDepartement(document.getDepartement());
            version.setMetadata(metadata);
            version.setCommentaireRejet(document.getCommentaireRejet());
            version.setUploadedBy(user);
            documentVersionRepository.save(version);

            auditLogService.logAction("CREATE_VERSION", "DocumentVersion", version.getId(), "Document version created", user);
        }

        return document;
    }

    public List<Document> getDocumentsByDepartement(String departementName) {
        Departement departement = departementRepository.findByName(departementName)
                .orElseThrow(() -> new RuntimeException("Departement not found with name " + departementName));
        return documentRepository.findByDepartement(departement);
    }

    public List<Document> getDocumentsByDepartmentAndWorkflow(String departmentName, EtapeWorkflow etapeWorkflow) {
        return documentRepository.findByDepartement_NameAndWorkflow_EtapeCourante(departmentName, etapeWorkflow);
    }
    public List<Document> getArchivedDocuments() {
        return documentRepository.findByArchivedTrue();
    }
    public List<DocumentTypeStat> getDocumentTypeStatistics() {
        List<Document> documents = documentRepository.findAll();

        return documents.stream()
                .collect(Collectors.groupingBy(doc -> doc.getTypeDoc().getNom(), Collectors.counting()))
                .entrySet()
                .stream()
                .map(entry -> new DocumentTypeStat(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }
}

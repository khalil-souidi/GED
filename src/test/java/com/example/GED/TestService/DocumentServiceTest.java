package com.example.GED.TestService;

import com.example.ged.Entities.*;
import com.example.ged.Repository.*;
import com.example.ged.Services.AuditLogService;
import com.example.ged.Services.DocumentService;
import com.example.ged.Services.EmailService;
import com.example.ged.Services.TypeDocumentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class DocumentServiceTest {

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private DocumentVersionRepository documentVersionRepository;

    @Mock
    private MetadataRepository metadataRepository;

    @Mock
    private WorkflowRepository workflowRepository;

    @Mock
    private AuditLogService auditLogService;

    @Mock
    private EmailService emailService;

    @Mock
    private TypeDocumentService typeDocumentService;

    @Mock
    private DepartementRepository departementRepository;

    @InjectMocks
    private DocumentService documentService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllDocuments() {
        List<Document> documents = Arrays.asList(new Document(), new Document());
        when(documentRepository.findAll()).thenReturn(documents);

        List<Document> result = documentService.getAllDocuments();

        assertEquals(2, result.size());
        verify(documentRepository, times(1)).findAll();
    }

    @Test
    public void testGetDocumentsByStatus() {
        DocumentStatus status = DocumentStatus.APPROUVÉ;
        List<Document> documents = Arrays.asList(new Document(), new Document());
        when(documentRepository.findByDocumentStatus(status)).thenReturn(documents);

        List<Document> result = documentService.getDocumentsByStatus(status);

        assertEquals(2, result.size());
        verify(documentRepository, times(1)).findByDocumentStatus(status);
    }

    @Test
    public void testSearchDocumentsByName() {
        String name = "Test Document";
        List<Document> documents = Arrays.asList(new Document(), new Document());
        when(documentRepository.findByNomDocContainingIgnoreCase(name)).thenReturn(documents);

        List<Document> result = documentService.searchDocumentsByName(name);

        assertEquals(2, result.size());
        verify(documentRepository, times(1)).findByNomDocContainingIgnoreCase(name);
    }

    @Test
    public void testSaveDocument() throws IOException {
        // Arrange
        Document document = new Document();
        MultipartFile file = mock(MultipartFile.class);
        Users user = new Users();
        String typeDocNom = "Type Test";

        TypeDocument typeDocument = new TypeDocument();
        when(typeDocumentService.getTypeDocumentByNom(typeDocNom)).thenReturn(typeDocument);
        when(documentRepository.save(any(Document.class))).thenReturn(document);
        when(metadataRepository.save(any(Metadata.class))).thenReturn(new Metadata());
        when(file.getOriginalFilename()).thenReturn("test.pdf");
        when(file.getContentType()).thenReturn("application/pdf");
        when(file.getBytes()).thenReturn(new byte[]{1, 2, 3});
        Document savedDocument = documentService.saveDocument(document, file, user, typeDocNom);
        assertNotNull(savedDocument);
        verify(documentRepository, times(1)).save(document);
        verify(metadataRepository, times(1)).save(any(Metadata.class));

    }


    @Test
    public void testDeleteDocument() {
        Long documentId = 1L;
        Document document = new Document();
        document.setId(documentId);
        Users user = new Users();
        document.setUploadedBy(user);

        when(documentRepository.findById(documentId)).thenReturn(Optional.of(document));

        documentService.deleteDocument(documentId);

        verify(documentRepository, times(1)).deleteById(documentId);
        verify(auditLogService, times(1)).logAction(eq("DELETE"), eq("Document"), eq(documentId), eq("Document deleted"), eq(user));
    }

    @Test
    public void testUpdateDocumentStatus() {
        Long documentId = 1L;
        DocumentStatus status = DocumentStatus.APPROUVÉ;
        String commentaireRejet = "Commentaire de test";
        Document document = new Document();
        document.setId(documentId);
        document.setUploadedBy(new Users());

        // Create and set a mock workflow
        Workflow workflow = new Workflow();
        document.setWorkflow(workflow);

        when(documentRepository.findById(documentId)).thenReturn(Optional.of(document));
        when(documentRepository.save(any(Document.class))).thenReturn(document);

        Document updatedDocument = documentService.updateDocumentStatus(documentId, status, commentaireRejet);

        assertEquals(status, updatedDocument.getDocumentStatus());
        assertEquals(EtapeWorkflow.TRAITEMENT, workflow.getEtapeCourante());
        verify(documentRepository, times(1)).save(document);
        verify(auditLogService, times(1)).logAction(eq("UPDATE_STATUS"), eq("Document"), eq(documentId), eq("Document status updated to " + status), eq(document.getUploadedBy()));
    }

    @Test
    public void testWorkflowToCloture() {
        Long documentId = 1L;
        Document document = new Document();
        document.setId(documentId);
        Workflow workflow = new Workflow();
        workflow.setEtapeCourante(EtapeWorkflow.TRAITEMENT);
        document.setWorkflow(workflow);

        when(documentRepository.findById(documentId)).thenReturn(Optional.of(document));
        when(documentRepository.save(any(Document.class))).thenReturn(document);

        documentService.WorkflowToCloture(documentId);

        assertEquals(EtapeWorkflow.CLOTURE, workflow.getEtapeCourante());
        verify(workflowRepository, times(1)).save(workflow);
        verify(documentRepository, times(1)).save(document);
        verify(auditLogService, times(1)).logAction(eq("CLOSE_WORKFLOW"), eq("Document"), eq(documentId), eq("Document workflow closed and archived"), eq(document.getUploadedBy()));
    }
}

package com.example.GED.TestService;

import com.example.ged.Entities.*;
import com.example.ged.Repository.*;
import com.example.ged.Services.AuditLogService;
import com.example.ged.Services.DocumentService;
import com.example.ged.Services.EmailService;
import com.example.ged.Services.TypeDocumentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
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

    private Document document;
    private Users user;
    private MultipartFile file;

    @BeforeEach
    public void setUp() {
        document = new Document();
        document.setId(1L);
        document.setNomDoc("Test Document");

        user = new Users();
        user.setId(1L);
        user.setEmail("user@example.com");

        file = mock(MultipartFile.class);
    }

    @Test
    public void testGetAllDocuments() {
        when(documentRepository.findAll()).thenReturn(List.of(document));

        List<Document> documents = documentService.getAllDocuments();

        assertEquals(1, documents.size());
        assertEquals("Test Document", documents.get(0).getNomDoc());
    }

    @Test
    public void testGetDocumentById() {
        when(documentRepository.findById(1L)).thenReturn(Optional.of(document));

        Document foundDocument = documentService.getDocumentById(1L);

        assertEquals(1L, foundDocument.getId());
        assertEquals("Test Document", foundDocument.getNomDoc());
    }

    @Test
    public void testSaveDocument() throws IOException {
        when(typeDocumentService.getTypeDocumentByNom(anyString())).thenReturn(new TypeDocument());
        when(metadataRepository.save(any(Metadata.class))).thenReturn(new Metadata());
        when(documentRepository.save(any(Document.class))).thenReturn(document);

        Document savedDocument = documentService.saveDocument(document, file, user, "Test Type");

        assertNotNull(savedDocument);
        verify(documentRepository, times(1)).save(document);
        verify(auditLogService, times(1)).logAction(eq("CREATE"), eq("Document"), anyLong(), anyString(), eq(user));
    }

    @Test
    public void testDeleteDocument() {
        when(documentRepository.findById(1L)).thenReturn(Optional.of(document));

        documentService.deleteDocument(1L);

        verify(documentRepository, times(1)).deleteById(1L);
        verify(auditLogService, times(1)).logAction(eq("DELETE"), eq("Document"), eq(1L), anyString(), eq(document.getUploadedBy()));
    }

    @Test
    public void testGetDocumentsByDepartement() {
        Departement departement = new Departement();
        departement.setName("Test Department");

        when(departementRepository.findByName("Test Department")).thenReturn(Optional.of(departement));
        when(documentRepository.findByDepartement(departement)).thenReturn(List.of(document));

        List<Document> documents = documentService.getDocumentsByDepartement("Test Department");

        assertEquals(1, documents.size());
        assertEquals("Test Document", documents.get(0).getNomDoc());
    }
}

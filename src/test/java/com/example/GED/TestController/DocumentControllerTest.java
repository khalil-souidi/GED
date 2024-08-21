package com.example.GED.TestController;

import com.example.ged.Entities.*;
import com.example.ged.Services.*;
import com.example.ged.controllers.DocumentController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class DocumentControllerTest {

    @Mock
    private DocumentService documentService;

    @Mock
    private DepartmentService departmentService;

    @Mock
    private WorkflowService workflowService;

    @Mock
    private UserService userService;

    @Mock
    private TypeDocumentService typeDocumentService;

    @InjectMocks
    private DocumentController documentController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllDocuments() {
        // Arrange
        Document doc1 = new Document();
        Document doc2 = new Document();
        when(documentService.getAllDocuments()).thenReturn(Arrays.asList(doc1, doc2));

        // Act
        List<Document> result = documentController.getAllDocuments();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    void testGetDocumentById() {
        // Arrange
        Document document = new Document();
        when(documentService.getDocumentById(anyLong())).thenReturn(document);

        // Act
        Document result = documentController.getDocumentById(1L);

        // Assert
        assertNotNull(result);
        verify(documentService, times(1)).getDocumentById(1L);
    }

    @Test
    void testGetDocumentsByStatus() {
        // Arrange
        Document doc1 = new Document();
        Document doc2 = new Document();
        when(documentService.getDocumentsByStatus(any(DocumentStatus.class))).thenReturn(Arrays.asList(doc1, doc2));

        // Act
        ResponseEntity<List<Document>> response = documentController.getDocumentsByStatus(DocumentStatus.En_COURS);

        // Assert
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void testSearchDocuments() {
        // Arrange
        Document doc1 = new Document();
        Document doc2 = new Document();

        // Set non-null dateCreation values
        doc1.setDateCreation(new Date());
        doc2.setDateCreation(new Date(System.currentTimeMillis() - 100000)); // some time in the past

        when(documentService.searchDocumentsByName(anyString())).thenReturn(Arrays.asList(doc1, doc2));

        // Act
        ResponseEntity<List<Document>> response = documentController.searchDocuments("test", null, null, null, null, "asc");

        // Assert
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());

        // Verify sorting order
        assertTrue(response.getBody().get(0).getDateCreation().compareTo(response.getBody().get(1).getDateCreation()) <= 0);
    }


    @Test
    void testDownloadFile() {
        // Arrange
        Metadata metadata = new Metadata();
        metadata.setNomFichierOriginal("test.pdf");
        metadata.setTypeFichier("application/pdf");
        metadata.setFichier(new byte[]{1, 2, 3});
        Document document = new Document();
        document.setMetadata(metadata);
        when(documentService.getDocumentById(anyLong())).thenReturn(document);

        // Act
        ResponseEntity<byte[]> response = documentController.downloadFile(1L);

        // Assert
        assertNotNull(response.getBody());
        assertEquals("attachment; filename=\"test.pdf\"", response.getHeaders().get("Content-Disposition").get(0));
        assertEquals("application/pdf", response.getHeaders().get("Content-Type").get(0));
    }

    @Test
    void testCreateDocument() throws IOException {
        // Arrange
        Document document = new Document();
        Users user = new Users();
        when(documentService.saveDocument(any(Document.class), any(MultipartFile.class), any(Users.class), anyString())).thenReturn(document);
        when(departmentService.getDepartementByName(anyString())).thenReturn(new Departement());
        when(userService.getUserById(anyLong())).thenReturn(user);

        // Act
        Document result = documentController.createDocument(
                "type", "nomDoc", "nomClient", "numClient", "emailClient", mock(MultipartFile.class), "department", 1L);

        // Assert
        assertNotNull(result);
        verify(documentService, times(1)).saveDocument(any(Document.class), any(MultipartFile.class), any(Users.class), anyString());
    }

    @Test
    void testDeleteDocument() {
        // Act
        documentController.deleteDocument(1L);

        // Assert
        verify(documentService, times(1)).deleteDocument(1L);
    }

    @Test
    void testUpdateDocumentStatus() {
        // Arrange
        Document document = new Document();
        when(documentService.updateDocumentStatus(anyLong(), any(DocumentStatus.class), anyString())).thenReturn(document);

        // Act
        ResponseEntity<Document> response = documentController.updateDocumentStatus(1L, DocumentStatus.APPROUVÉ, "comment");

        // Assert
        assertNotNull(response.getBody());
        verify(documentService, times(1)).updateDocumentStatus(1L, DocumentStatus.APPROUVÉ, "comment");
    }

    @Test
    void testUpdateDocument() throws IOException {
        // Arrange
        Document document = new Document();
        when(documentService.updateDocument(anyLong(), any(Document.class), any(MultipartFile.class))).thenReturn(document);
        when(typeDocumentService.getTypeDocumentByNom(anyString())).thenReturn(new TypeDocument());
        when(departmentService.getDepartementByName(anyString())).thenReturn(new Departement());

        // Act
        ResponseEntity<Document> response = documentController.updateDocument(
                1L, "typeDocNom", "nomDoc", "nomClient", "numClient", "emailClient", mock(MultipartFile.class), "departmentName");

        // Assert
        assertNotNull(response.getBody());
        verify(documentService, times(1)).updateDocument(anyLong(), any(Document.class), any(MultipartFile.class));
    }

    @Test
    void testAddDocumentVersion() throws IOException {
        // Arrange
        Document document = new Document();
        Users user = new Users();
        when(documentService.addDocumentVersion(anyLong(), any(MultipartFile.class), any(Users.class))).thenReturn(document);
        when(userService.getUserById(anyLong())).thenReturn(user);

        // Act
        ResponseEntity<Document> response = documentController.addDocumentVersion(1L, mock(MultipartFile.class), 1L);

        // Assert
        assertNotNull(response.getBody());
        verify(documentService, times(1)).addDocumentVersion(anyLong(), any(MultipartFile.class), any(Users.class));
    }

    @Test
    void testGetDocumentVersions() {
        // Arrange
        DocumentVersion version1 = new DocumentVersion();
        DocumentVersion version2 = new DocumentVersion();
        when(documentService.getDocumentVersions(anyLong())).thenReturn(Arrays.asList(version1, version2));

        // Act
        List<DocumentVersion> response = documentController.getDocumentVersions(1L);

        // Assert
        assertNotNull(response);
        assertEquals(2, response.size());
    }

    @Test
    void testGetWorkflowByDocumentId() {
        // Arrange
        Workflow workflow = new Workflow();
        when(workflowService.getWorkflowByDocumentId(anyLong())).thenReturn(workflow);

        // Act
        Workflow result = documentController.getWorkflowByDocumentId(1L);

        // Assert
        assertNotNull(result);
        verify(workflowService, times(1)).getWorkflowByDocumentId(1L);
    }

    @Test
    void testCloseWorkflow() {
        // Act
        ResponseEntity<Void> response = documentController.closeWorkflow(1L);

        // Assert
        assertEquals(204, response.getStatusCodeValue());
        verify(documentService, times(1)).WorkflowToCloture(1L);
    }

    @Test
    void testGetDocumentsByDepartmentAndWorkflow() {
        // Arrange
        Document doc1 = new Document();
        Document doc2 = new Document();
        when(documentService.getDocumentsByDepartmentAndWorkflow(anyString(), any(EtapeWorkflow.class))).thenReturn(Arrays.asList(doc1, doc2));

        // Act
        ResponseEntity<List<Document>> response = documentController.getDocumentsByDepartmentAndWorkflow("department", EtapeWorkflow.DEPOT);

        // Assert
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void testGetArchivedDocuments() {
        // Arrange
        Document doc1 = new Document();
        Document doc2 = new Document();
        when(documentService.getArchivedDocuments()).thenReturn(Arrays.asList(doc1, doc2));

        // Act
        List<Document> response = documentController.getArchivedDocuments();

        // Assert
        assertNotNull(response);
        assertEquals(2, response.size());
    }

    @Test
    void testGetDocumentTypeStatistics() {
        // Arrange
        DocumentTypeStat stat1 = new DocumentTypeStat("type1", 5L);
        DocumentTypeStat stat2 = new DocumentTypeStat("type2", 10L);
        when(documentService.getDocumentTypeStatistics()).thenReturn(Arrays.asList(stat1, stat2));

        // Act
        ResponseEntity<List<DocumentTypeStat>> response = documentController.getDocumentTypeStatistics();

        // Assert
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void testGetDocumentDepartmentStatistics() {
        // Arrange
        DocumentDepartmentStat stat1 = new DocumentDepartmentStat("department1", 5L);
        DocumentDepartmentStat stat2 = new DocumentDepartmentStat("department2", 10L);
        when(documentService.getDocumentDepartmentStatistics()).thenReturn(Arrays.asList(stat1, stat2));

        // Act
        ResponseEntity<List<DocumentDepartmentStat>> response = documentController.getDocumentDepartmentStatistics();

        // Assert
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
    }
}

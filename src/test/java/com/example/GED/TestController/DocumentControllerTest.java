package com.example.GED.TestController;

import com.example.ged.Entities.*;
import com.example.ged.Services.*;
import com.example.ged.controllers.DocumentController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class DocumentControllerTest {

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

    private MockMvc mockMvc;

    private Document document;
    private Users user;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(documentController).build();

        document = new Document();
        document.setId(1L);
        document.setNomDoc("Test Document");

        user = new Users();
        user.setId(1L);
        user.setEmail("user@example.com");
    }

    @Test
    public void testGetAllDocuments() throws Exception {
        when(documentService.getAllDocuments()).thenReturn(List.of(document));

        mockMvc.perform(get("/api/documents"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nomDoc").value("Test Document"));
    }

    @Test
    public void testGetDocumentById() throws Exception {
        when(documentService.getDocumentById(1L)).thenReturn(document);

        mockMvc.perform(get("/api/documents/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nomDoc").value("Test Document"));
    }


    @Test
    public void testSearchDocumentsByName() throws Exception {
        when(documentService.searchDocumentsByName("Test")).thenReturn(List.of(document));

        mockMvc.perform(get("/api/documents/search").param("name", "Test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nomDoc").value("Test Document"));
    }

    @Test
    public void testCreateDocument() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", MediaType.TEXT_PLAIN_VALUE, "Test Content".getBytes());
        when(userService.getUserById(anyLong())).thenReturn(user);
        when(documentService.saveDocument(any(Document.class), any(MultipartFile.class), any(Users.class), anyString())).thenReturn(document);

        mockMvc.perform(multipart("/api/documents")
                        .file(file)
                        .param("typeDocNom", "Test Type")
                        .param("nomDoc", "Test Document")
                        .param("nomClient", "Test Client")
                        .param("numClient", "123456")
                        .param("emailClient", "client@example.com")
                        .param("departementName", "Test Department")
                        .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nomDoc").value("Test Document"));
    }

    @Test
    public void testDeleteDocument() throws Exception {
        doNothing().when(documentService).deleteDocument(1L);

        mockMvc.perform(delete("/api/documents/{id}", 1L))
                .andExpect(status().isOk());
    }

    @Test
    public void testUpdateDocumentStatus() throws Exception {
        when(documentService.updateDocumentStatus(anyLong(), any(DocumentStatus.class), anyString())).thenReturn(document);

        mockMvc.perform(put("/api/documents/{id}/status", 1L)
                        .param("status", "APPROUVÉ")
                        .param("comment", "Test Comment"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nomDoc").value("Test Document"));
    }

    @Test
    public void testGetDocumentsByDepartement() throws Exception {
        when(documentService.getDocumentsByDepartement("Test Department")).thenReturn(List.of(document));

        mockMvc.perform(get("/api/documents/departement/{departementName}", "Test Department"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nomDoc").value("Test Document"));
    }
}

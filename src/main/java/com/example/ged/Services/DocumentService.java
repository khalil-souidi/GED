package com.example.ged.Services;

import com.example.ged.Entities.Document;
import com.example.ged.Entities.DocumentStatus;
import com.example.ged.Entities.Metadata;
import com.example.ged.Repository.DocumentRepository;
import com.example.ged.Repository.MetadataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private MetadataRepository metadataRepository;

    @Autowired
    private EmailService emailService;

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public Document saveDocument(Document document, MultipartFile file) throws IOException {
        if (file != null && !file.isEmpty()) {
            Metadata metadata = new Metadata();
            metadata.setNomFichierOriginal(file.getOriginalFilename());
            metadata.setTypeFichier(file.getContentType());
            metadata.setFichier(file.getBytes());
            metadata.setDateUpload(new Date());
            metadata.setUploadedBy(document.getNomClient());
            metadata = metadataRepository.save(metadata);
            document.setMetadata(metadata);
        }
        return documentRepository.save(document);
    }

    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }

    public Document updateDocumentStatus(Long id, DocumentStatus status, String commentaireRejet) {
        Optional<Document> documentOpt = documentRepository.findById(id);
        if (documentOpt.isPresent()) {
            Document document = documentOpt.get();
            document.setDocumentStatus(status);
            if (status == DocumentStatus.REFUSÉ) {
                document.setCommentaireRejet(commentaireRejet);
            }
            document = documentRepository.save(document);

            // Prepare email content
            StringBuilder emailContent = new StringBuilder();
            emailContent
                    .append("Votre Dossier a été ")
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

            // Send the email
            emailService.sendEmail(document.getEmailClient(), "Statut de votre Dossier", emailContent.toString());

            return document;
        } else {
            throw new RuntimeException("Document not found with id " + id);
        }
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id).orElseThrow(() -> new RuntimeException("Document not found with id " + id));
    }
}

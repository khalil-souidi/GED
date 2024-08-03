package com.example.ged.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class DocumentVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "document_id")
    private Document document;

    private Integer versionNumber;
    private String nomDoc;
    private String nomClient;
    private String numClient;
    private String emailClient;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(updatable = false)
    private Date dateCreation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentStatus documentStatus = DocumentStatus.En_COURS;

    @ManyToOne
    private Departement departement;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "metadata_id", referencedColumnName = "id")
    private Metadata metadata;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users uploadedBy;

    private String commentaireRejet;

    @PrePersist
    protected void onCreate() {
        this.dateCreation = new Date();
    }
}

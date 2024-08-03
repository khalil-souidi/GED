
package com.example.ged.Entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String typeDoc;
    private String nomDoc;
    private String nomClient;
    private String numClient;
    private String emailClient;

    @Column(unique = true, length = 255)
    private String codeUnique;

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

    private String commentaireRejet;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DocumentVersion> versions = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.dateCreation = new Date();
        this.codeUnique = RandomStringUtils.randomAlphanumeric(8);
    }
}

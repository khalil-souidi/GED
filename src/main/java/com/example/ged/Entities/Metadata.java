package com.example.ged.Entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Metadata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String typeFichier;
    private String nomFichierOriginal;
    private Date dateUpload;
    private String uploadedBy;

    @Lob
    private byte[] fichier;


}

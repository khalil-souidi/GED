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
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;
    private String entity;
    private Long entityId;
    private String details;
    private Date timestamp;

    @ManyToOne
    private Users user;

    @PrePersist
    protected void onCreate() {
        this.timestamp = new Date();
    }
}

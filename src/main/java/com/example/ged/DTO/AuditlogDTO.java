package com.example.ged.DTO;

import com.example.ged.Entities.Users;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AuditlogDTO {
    private String action;
    private String entity;
    private Long entityId;
    private String documentName;
    private String codeUnique;
    private String details;
    private Date timestamp;
    private Users user;
}

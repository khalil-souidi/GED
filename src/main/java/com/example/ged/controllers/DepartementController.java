package com.example.ged.controllers;

import com.example.ged.Entities.Departement;
import com.example.ged.Services.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departements")
public class DepartementController {

    @Autowired
    private DepartmentService departmentService;


    @PostMapping
    public Departement createDepartement(@RequestBody Departement departement) {
        return departmentService.saveDepartement(departement);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Departement> getDepartementById(@PathVariable Long id) {
        Departement departement = departmentService.getDepartementById(id);
        return ResponseEntity.ok(departement);
    }

}

package com.example.ged.controllers;

import com.example.ged.Entities.Departement;
import com.example.ged.Services.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DepartementController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping("/departements")
    public List<Departement> getAllDepartements() {
        return departmentService.getAllDepartements();
    }

    @PostMapping("/departements")
    public Departement createDepartement(@RequestBody Departement departement) {
        return departmentService.saveDepartement(departement);
    }

    @GetMapping("/departements/{id}")
    public ResponseEntity<Departement> getDepartementById(@PathVariable Long id) {
        Departement departement = departmentService.getDepartementById(id);
        return ResponseEntity.ok(departement);
    }

    @DeleteMapping("/departements/{id}")
    public void deleteDepartement(@PathVariable Long id) {
        departmentService.deleteDepartement(id);
    }
}

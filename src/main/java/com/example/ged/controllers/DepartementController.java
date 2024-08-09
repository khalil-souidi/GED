package com.example.ged.controllers;

import com.example.ged.Entities.Departement;
import com.example.ged.Entities.Users;
import com.example.ged.Services.DepartmentService;
import com.example.ged.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartementController {

    @Autowired
    private DepartmentService departmentService;
    @Autowired
    private UserService userService;


    @PostMapping
    public Departement createDepartement(@RequestBody Departement departement) {
        return departmentService.saveDepartement(departement);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Departement> getDepartementById(@PathVariable Long id) {
        Departement departement = departmentService.getDepartementById(id);
        return ResponseEntity.ok(departement);
    }
    @GetMapping("/users")
    public List<Users> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping
    public List<Departement> getAllDepartements() {
        return departmentService.getAllDepartements();
    }

}

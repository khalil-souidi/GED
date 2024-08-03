package com.example.ged.Services;

import com.example.ged.Entities.Departement;
import com.example.ged.Repository.DepartementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartementRepository departementRepository;

    public List<Departement> getAllDepartements() {
        return departementRepository.findAll();
    }

    public Departement saveDepartement(Departement departement) {
        return departementRepository.save(departement);
    }

    public Departement getDepartementById(Long id) {
        return departementRepository.findById(id).orElseThrow(() -> new RuntimeException("Departement not found with id " + id));
    }

    public Departement getDepartementByName(String name) {
        return departementRepository.findByNom(name).orElseThrow(() -> new RuntimeException("Departement not found with name " + name));
    }

    public void deleteDepartement(Long id) {
        departementRepository.deleteById(id);
    }
}

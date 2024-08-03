package com.example.ged.Repository;

import com.example.ged.Entities.Departement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartementRepository extends JpaRepository<Departement, Long> {
    Optional<Departement> findByNom(String Nom);
}

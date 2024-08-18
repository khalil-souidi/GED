package com.example.ged.Services;

import com.example.ged.DTO.UserDepartmentResponse;
import com.example.ged.Entities.Users;
import com.example.ged.Repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UsersRepository usersRepository;

    public Users getUserById(Long id) {
        return usersRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    public Users getUserByEmail(String email) {
        return usersRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found with email " + email));
    }

    public Users saveUser(Users user) {
        return usersRepository.save(user);
    }

    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    public UserDepartmentResponse getUserDepartmentByEmail(String email) {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email " + email));
        String departmentName = user.getDepartment().getName();
        return new UserDepartmentResponse(user.getId(), user.getEmail(), departmentName); // Include user ID
    }
}

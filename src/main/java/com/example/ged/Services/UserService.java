package com.example.ged.Services;

import com.example.ged.Entities.Users;
import com.example.ged.Repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}

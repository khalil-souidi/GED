package com.example.ged.controllers;


import com.example.ged.DTO.UserDepartmentResponse;
import com.example.ged.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/department")
    public UserDepartmentResponse getUserDepartment(@RequestParam String email) {
        return userService.getUserDepartmentByEmail(email);
    }

}

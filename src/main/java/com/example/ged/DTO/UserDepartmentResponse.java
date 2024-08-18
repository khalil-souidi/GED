package com.example.ged.DTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserDepartmentResponse {
    private Long id;
    private String email;
    private String departmentName;
}

package com.icet.frontium.model;

import com.icet.frontium.enum_pack.Department;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Employee {



    private Long id;


    private String name;


    private String email;



    private Department department;


    private LocalDateTime createdAt;


    private LocalDateTime updatedAt;

}

package com.icet.frontium.service;

import com.icet.frontium.model.Employee;

import java.util.List;

public interface EmployeeService {
    List<Employee> getAllEmployees();

    Employee addEmployee(Employee employee);

    Employee updateEmployee(Integer id, Employee employee);

    void deleteEmployeeById(Integer id);
}

package com.icet.frontium.service.impl;

import com.icet.frontium.entity.EmployeeEntity;
import com.icet.frontium.model.Employee;
import com.icet.frontium.repository.EmployeeRepository;
import com.icet.frontium.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<Employee> getAllEmployees() {
        List<EmployeeEntity> employeeEntityList = employeeRepository.findAll();
        List<Employee> employeeList = new ArrayList<>();
        employeeEntityList.forEach(employeeEntity -> {
            employeeList.add(modelMapper.map(employeeEntity,Employee.class));
        });
        return employeeList;
    }

    @Override
    public Employee addEmployee(Employee employee) {
        employeeRepository.save(modelMapper.map(employee, EmployeeEntity.class));
        return employee;
    }

    @Override
    public Employee updateEmployee(Integer id,Employee employee) {
        EmployeeEntity employeeEntity = employeeRepository.getById(id);
        employeeEntity.setName(employee.getName());
        employeeEntity.setEmail(employee.getEmail());
        employeeEntity.setDepartment(employee.getDepartment());
        employeeRepository.save(employeeEntity);
        return modelMapper.map(employeeEntity, Employee.class);
    }

    @Override
    public void deleteEmployeeById(Integer id) {
        employeeRepository.deleteById(id);
    }
}

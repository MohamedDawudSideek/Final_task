package com.icet.frontium.service.impl;

import com.icet.frontium.repository.EmployeeRepository;
import com.icet.frontium.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;



}

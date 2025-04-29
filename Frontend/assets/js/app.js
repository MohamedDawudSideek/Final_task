const editEmployeeModal = new bootstrap.Modal(document.getElementById('editEmployeeModal'));
const editEmployeeForm = document.getElementById('editEmployeeForm');
const employeeTableBody = document.getElementById('employeeTableBody');


let currentEditEmployeeId = null;
let employeesEmailCheckersArray = [];

function validationChecks() {
    return fetch('http://localhost:8080/api/employees')
        .then(res => res.json())
        .then(data => {
            employeesEmailCheckersArray = data;
        });
}

function fetchEmployees() {
    fetch('http://localhost:8080/api/employees')
        .then(response => response.json())
        .then(data => {
            employeeTableBody.innerHTML = '';
            data.forEach(employee => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', employee.id);
                row.innerHTML = `
                    <td>${employee.id}</td>
                    <td>${employee.name}</td>
                    <td>${employee.email}</td>
                    <td>${employee.department}</td>
                    <td>${employee.createdAt}</td>
                    <td>${employee.updatedAt}</td>
                    <td>
                        <button class="btn btn-warning btn-sm editBtn"
                            data-id="${employee.id}"
                            data-name="${employee.name}"
                            data-email="${employee.email}"
                            data-department="${employee.department}">
                            Edit
                        </button>
                        <button class="btn btn-danger btn-sm deleteBtn" data-id="${employee.id}">Delete</button>
                    </td>
                `;
                employeeTableBody.appendChild(row);
            });

            attachEditButtonListeners();
            attachDeleteButtonListeners();
        })
        .catch(error => console.error('Error fetching employees:', error));
}


function attachEditButtonListeners() {
    const editButtons = document.querySelectorAll('.editBtn');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentEditEmployeeId = button.getAttribute('data-id');
            document.getElementById('editName').value = button.getAttribute('data-name');
            document.getElementById('editEmail').value = button.getAttribute('data-email');
            document.getElementById('editDepartment').value = button.getAttribute('data-department');
            editEmployeeModal.show();
        });
    });
}


editEmployeeForm.addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();

    const updatedName = document.getElementById('editName').value;
    const updatedEmail = document.getElementById('editEmail').value;
    const updatedDepartment = document.getElementById('editDepartment').value;

    const isDuplicate = employeesEmailCheckersArray.some(employee => 
        employee.email === updatedEmail && employee.id !== currentEditEmployeeId
    );

    if (isDuplicate) {
        showToast('error', "Email already in use by another employee.");
        return;
    }

    fetch(`http://localhost:8080/api/employees/${currentEditEmployeeId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: updatedName,
            email: updatedEmail,
            department: updatedDepartment
        })
    })
        .then(response => {
            if (!response.ok) throw new Error("Update failed");
            return response.json();
        })
        .then(() => {
            showToast('success', "Employee Details Updated Successfully!");
            editEmployeeModal.hide();
            fetchEmployees();
        })
        .catch(error => {
            console.error("Error updating employee:", error);
            showToast('error', "Failed to update employee.");
        });
});

function attachDeleteButtonListeners() {
    const deleteButtons = document.querySelectorAll('.deleteBtn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const employeeId = button.getAttribute('data-id');
            const confirmDelete = confirm("Are you sure you want to delete this employee?");
            if (!confirmDelete) return;

            fetch(`http://localhost:8080/api/employees/${employeeId}`, {
                method: "DELETE"
            })
                .then(response => {
                    if (!response.ok) throw new Error("Delete failed");
                    showToast('success', "Employee deleted successfully!")
                    fetchEmployees();
                })
                .catch(error => {
                    console.error("Error deleting employee:", error);
                    showToast('error', "Failed to delete employee.")
                });
        });
    });
}

const addEmployeeForm = document.getElementById('employeeForm');

addEmployeeForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    await validationChecks(); 

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const department = document.getElementById('department').value;


    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!name || !nameRegex.test(name) || name.length > 100) {

        showToast('error', "Please enter a valid name (alphabetic only, max 100 characters).");
        return;
    }


    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
        showToast('error', "Please enter a valid email address.");
        return;
    }


    const allowedDepartments = ["HR", "IT", "Finance", "Operations"];
    if (!allowedDepartments.includes(department)) {
        showToast('error', "Please select a valid department.");
        return;
    }

    const isDuplicate = employeesEmailCheckersArray.some(employee => employee.email === email);
    if (isDuplicate) {
        showToast('error', "Email already in use.");
        return; 
    }


    fetch("http://localhost:8080/api/employees", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            department
        })
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to add employee");
            return response.json();
        })
        .then(() => {
            showToast('success', "Employee added successfully!");
            addEmployeeForm.reset();
            fetchEmployees();
        })
        .catch(error => {
            console.error("Error adding employee:", error);
            showToast('error', "Failed to add employee.");
        });
});

function showToast(type = 'success', message) {
    const toast = new bootstrap.Toast(document.getElementById(`${type}Toast`));
    const toastBody = document.querySelector(`#${type}Toast .toast-body`);
    toastBody.textContent = message;
    toast.show();
}

document.addEventListener('DOMContentLoaded', () => {
    fetchEmployees();
    validationChecks(); 
});

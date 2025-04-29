
// // Get modal and form elements
// const editEmployeeModal = new bootstrap.Modal(document.getElementById('editEmployeeModal'));
// const editEmployeeForm = document.getElementById('editEmployeeForm');
// const employeeTableBody = document.getElementById('employeeTableBody');

// // Track the current editing employee ID
// let currentEditEmployeeId = null;

// // Fetch all employees and populate the table
// function fetchEmployees() {
//     fetch('http://localhost:8080/api/employees')
//         .then(response => response.json())
//         .then(data => {
//             employeeTableBody.innerHTML = ''; // Clear table

//             data.forEach(employee => {
//                 const row = document.createElement('tr');
//                 row.setAttribute('data-id', employee.id);
//                 row.innerHTML = `
//                     <td>${employee.id}</td>
//                     <td>${employee.name}</td>
//                     <td>${employee.email}</td>
//                     <td>${employee.department}</td>
//                     <td>${employee.createdAt}</td>
//                     <td>${employee.updatedAt}</td>
//                     <td>
//                         <button class="btn btn-warning btn-sm editBtn"
//                             data-id="${employee.id}"
//                             data-name="${employee.name}"
//                             data-email="${employee.email}"
//                             data-department="${employee.department}">
//                             Edit
//                         </button>
//                         <button class="btn btn-danger btn-sm deleteBtn" data-id="${employee.id}">Delete</button>
//                     </td>
//                 `;
//                 employeeTableBody.appendChild(row);
//             });

//             attachEditButtonListeners(); // Re-attach edit listeners
//         })
//         .catch(error => console.error('Error fetching employees:', error));
// }

// // Attach edit button event listeners
// function attachEditButtonListeners() {
//     const editButtons = document.querySelectorAll('.editBtn');
//     editButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             // Extract data
//             currentEditEmployeeId = button.getAttribute('data-id');
//             document.getElementById('editName').value = button.getAttribute('data-name');
//             document.getElementById('editEmail').value = button.getAttribute('data-email');
//             document.getElementById('editDepartment').value = button.getAttribute('data-department');

//             editEmployeeModal.show(); // Show modal
//         });
//     });
// }

// // Handle the Save Changes form submission (edit)
// editEmployeeForm.addEventListener('submit', (submitEvent) => {
//     submitEvent.preventDefault();

//     const updatedName = document.getElementById('editName').value;
//     const updatedEmail = document.getElementById('editEmail').value;
//     const updatedDepartment = document.getElementById('editDepartment').value;

//     fetch(`http://localhost:8080/api/employees/${currentEditEmployeeId}`, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             name: updatedName,
//             email: updatedEmail,
//             department: updatedDepartment
//         })
//     })
//     .then(response => {
//         if (!response.ok) throw new Error("Update failed");
//         return response.json();
//     })
//     .then(() => {
//         alert("Employee details updated!");
//         editEmployeeModal.hide();
//         fetchEmployees(); // Refresh list
//     })
//     .catch(error => {
//         console.error("Error updating employee:", error);
//         alert("Failed to update employee.");
//     });
// });

// // Initial load
// document.addEventListener('DOMContentLoaded', fetchEmployees);



// Get modal and form elements
const editEmployeeModal = new bootstrap.Modal(document.getElementById('editEmployeeModal'));
const editEmployeeForm = document.getElementById('editEmployeeForm');
const employeeTableBody = document.getElementById('employeeTableBody');

// Track the current editing employee ID
let currentEditEmployeeId = null;

// Fetch all employees and populate the table
function fetchEmployees() {
    fetch('http://localhost:8080/api/employees')
        .then(response => response.json())
        .then(data => {
            employeeTableBody.innerHTML = ''; // Clear table

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

            attachEditButtonListeners();   // Re-attach edit listeners
            attachDeleteButtonListeners(); // Attach delete listeners
        })
        .catch(error => console.error('Error fetching employees:', error));
}

// Attach edit button event listeners
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

// Handle Save Changes in the edit modal
editEmployeeForm.addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();

    const updatedName = document.getElementById('editName').value;
    const updatedEmail = document.getElementById('editEmail').value;
    const updatedDepartment = document.getElementById('editDepartment').value;

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
        alert("Employee details updated!");
        editEmployeeModal.hide();
        fetchEmployees();
    })
    .catch(error => {
        console.error("Error updating employee:", error);
        alert("Failed to update employee.");
    });
});

// Attach delete button event listeners
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
                alert("Employee deleted successfully!");
                fetchEmployees();
            })
            .catch(error => {
                console.error("Error deleting employee:", error);
                alert("Failed to delete employee.");
            });
        });
    });
}

// Initial load
document.addEventListener('DOMContentLoaded', fetchEmployees);

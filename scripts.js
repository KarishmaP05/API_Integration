// GET CUST LIST
function getCustomerList() {
    // Get Customer list
    fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Authentication failed');
            }
            return response.json();
        })
        .then(data => {
            // ADD Customer Data
            const customerData = data;
            // Call the function to populate the table with rows
            const tableBody = document.querySelector('#customerList tbody');
            // Loop through the object and create a row for each customer
            let sr_no = 1;
            Object.keys(customerData).forEach(key => {
                const data = customerData[key];
                const row = document.createElement('tr');
                row.dataset.uuid = data.uuid; // Store UUID as a data attribute
                row.dataset.sr_no = sr_no; // Store UUID as a data attribute

                const sr_cell = document.createElement('td');
                sr_cell.textContent = sr_no;
                row.appendChild(sr_cell);

                Object.keys(data).forEach(prop => {
                    if (prop !== 'uuid') {
                        const cell = document.createElement('td');
                        cell.textContent = data[prop];
                        row.appendChild(cell);
                    }
                });

                // Add buttons to the last cell
                const actionCell = document.createElement('td');
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', editCustomer);
                actionCell.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', deleteCustomer);
                actionCell.appendChild(deleteButton);

                row.appendChild(actionCell);
                sr_no += 1;
                tableBody.appendChild(row);
            });
            // Show/hide forms as needed
            document.getElementById("loginForm").style.display = "none";
            document.getElementById("createCustomerForm").style.display = "block";
            document.getElementById("customerList").style.display = "block";
        })
        .catch(error => {
            alert('Authentication failed. Please check your credentials.');
        });
}

// Create Customer
function saveCreateCust() {
    // Get customer details from the form
    const firstName = document.getElementById("createFirstName").value;
    const lastName = document.getElementById("createLastName").value;
    const street = document.getElementById("createStreet").value;
    const address = document.getElementById("createAddress").value;
    const city = document.getElementById("createCity").value;
    const state = document.getElementById("createState").value;
    const email = document.getElementById("createEmail").value;
    const phone = document.getElementById("createPhone").value;

    // Make a POST request to create customer API
    fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken,
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                street: street,
                address: address,
                city: city,
                state: state,
                email: email,
                phone: phone,
            }),
        })
        .then(response => {
            if (response.status === 201) {
                alert('Customer created successfully');
                // Add new cust to list
                const tableBody = document.querySelector('#customerList tbody');
                const row = document.createElement('tr');
                const cell1 = document.createElement('td');
                cell1.textContent = "00";
                row.appendChild(cell1);
                const cell2 = document.createElement('td');
                cell2.textContent = firstName;
                row.appendChild(cell2);
                const cell3 = document.createElement('td');
                cell3.textContent = lastName;
                row.appendChild(cell3);
                const cell4 = document.createElement('td');
                cell4.textContent = street;
                row.appendChild(cell4);
                const cell5 = document.createElement('td');
                cell5.textContent = address;
                row.appendChild(cell5);
                const cell6 = document.createElement('td');
                cell6.textContent = city;
                row.appendChild(cell6);
                const cell7 = document.createElement('td');
                cell7.textContent = state;
                row.appendChild(cell7);
                const cell8 = document.createElement('td');
                cell8.textContent = email;
                row.appendChild(cell8);
                const cell9 = document.createElement('td');
                cell9.textContent = phone;
                row.appendChild(cell9);

                // Add buttons to the last cell
                const actionCell = document.createElement('td');
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                actionCell.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                actionCell.appendChild(deleteButton);

                row.appendChild(actionCell);

                tableBody.appendChild(row);

            } else if (response.status === 400) {
                alert('Failed to create customer. First Name or Last Name is missing.');
            } else {
                throw new Error('Failed to create customer');
            }
        })
        .catch(error => {
            alert('Error creating customer');
        });

    // Close the modal
    closeCreateModal();
}

function editCustomer() {
    // Display the modal when "Edit" is clicked
    const sr_no = this.closest('tr').dataset.sr_no;
    const uuid = this.closest('tr').dataset.uuid;
    // Get the data from the table cell for editing
    const firstName = document.querySelector('table tbody tr:nth-child(' + sr_no + ') td:nth-child(2)').innerText;
    const lastName = document.querySelector('table tbody tr:nth-child(' + sr_no + ') td:nth-child(3)').innerText;
    const street = document.querySelector('table tbody tr:nth-child(' + sr_no + ') td:nth-child(4)').innerText;
    const address = document.querySelector('table tbody tr:nth-child(' + sr_no + ') td:nth-child(5)').innerText;
    const city = document.querySelector('table tbody tr:nth-child(' + sr_no + ') td:nth-child(6)').innerText;
    const state = document.querySelector('table tbody tr:nth-child(' + sr_no + ') td:nth-child(7)').innerText;
    const email = document.querySelector('table tbody tr:nth-child(' + sr_no + ') td:nth-child(8)').innerText;
    const phone = document.querySelector('table tbody tr:nth-child(' + sr_no + ') td:nth-child(9)').innerText;

    document.getElementById('overlay').style.display = 'block';
    document.getElementById('editModal').style.display = 'block';

    // Get the current value to edit
    document.getElementById('editFirstName').value = firstName;
    document.getElementById('editLastName').value = lastName;
    document.getElementById('editStreet').value = street;
    document.getElementById('editAddress').value = address;
    document.getElementById('editCity').value = city;
    document.getElementById('editState').value = state;
    document.getElementById('editEmail').value = email;
    document.getElementById('editPhone').value = phone;
    document.getElementById('uuid').value = uuid;
    document.getElementById('sr_no').value = sr_no;


}
// Save Edit Changes            
function saveEdit() {
    // Get the current value to edit
    sr_no = document.getElementById('sr_no').value;
    uuid = document.getElementById('uuid').value;
    firstName = document.getElementById('editFirstName').value;
    lastName = document.getElementById('editLastName').value;
    street = document.getElementById('editStreet').value;
    address = document.getElementById('editAddress').value;
    city = document.getElementById('editCity').value;
    state = document.getElementById('editState').value;
    email = document.getElementById('editEmail').value;
    phone = document.getElementById('editPhone').value;

    // Make a POST request to update customer API
    fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=update&uuid=' + uuid, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken,
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                street: street,
                address: address,
                city: city,
                state: state,
                email: email,
                phone: phone,
            }),
        })
        .then(response => {
            if (response.status === 200) {
                alert('Customer updated successfully');
                document.querySelector('table tbody tr:nth-child(' + sr_no + ') td:nth-child(2)').innerText = firstName;
                document.querySelector('table tbody tr:nth-child(' + sr_no + ') td:nth-child(3)').innerText = lastName;
                document.querySelector('table tbody tr:nth-child(' + sr_no + ') td:nth-child(4)').innerText = street;
                document.querySelector('table tbody tr:nth-child(' + sr_no + ') td:nth-child(5)').innerText = address;
                document.querySelector('table tbody tr:nth-child(' + sr_no + ') td:nth-child(6)').innerText = city;
                document.querySelector('table tbody tr:nth-child(' + sr_no + ') td:nth-child(7)').innerText = state;
                document.querySelector('table tbody tr:nth-child(' + sr_no + ') td:nth-child(8)').innerText = email;
                document.querySelector('table tbody tr:nth-child(' + sr_no + ') td:nth-child(9)').innerText = phone;
            } else if (response.status === 400) {
                alert('Failed to update customer, UUID not found.');
            } else {
                throw new Error('Error Not delected');
            }
        })
        .catch(error => {
            alert('Error updating customer');
        });

    // Close the modal
    closeEditModal();
}


function closeEditModal() {
    // Hide the modal and overlay
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('editModal').style.display = 'none';
}

function closeCreateModal() {
    // Hide the modal and overlay
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('createModal').style.display = 'none';
}



let authToken;

function authenticateUser() {
    const loginId = document.getElementById("loginId").value;
    const password = document.getElementById("password").value;

    // Make a POST request to authentication API
    fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login_id: loginId,
                password: password,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Authentication failed');
            }
            return response.json();
        })
        .then(data => {
            authToken = data.access_token;
            alert('Authentication successful.');
            // Show/hide forms as needed
            document.getElementById("loginForm").style.display = "none";
            document.getElementById("createCustomerForm").style.display = "block";
            document.getElementById("customerList").style.display = "block";

            getCustomerList();

        })
        .catch(error => {
            alert('Authentication failed. Please check your credentials.');
        });
}

// Create Customer
function createCustomer() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('createModal').style.display = 'block';
}

// Delete Customer
function deleteCustomer() {
    const uuid = this.closest('tr').dataset.uuid;
    // Make a POST request to create customer API
    fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=delete&uuid=' + uuid, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken,
            },
        })
        .then(response => {
            if (response.status === 200) {
                alert('Customer deleted successfully');
                this.closest('tr').remove();
            } else if (response.status === 400) {
                alert('Failed to delete customer, UUID not found.');
            } else {
                throw new Error('Error Not delected');
            }
        })
        .catch(error => {
            alert('Error deleting customer');
        });
}
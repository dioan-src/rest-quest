document.addEventListener('DOMContentLoaded', function () {
    // Check if user is already logged in by checking localStorage for the login token
    if (localStorage.getItem('login_token')) {
        // If logged in, show the users list and update the navbar with the user role
        showUserList();
        showRequestsList();
        updateNavbar();
    } else {
        // If not logged in, show the login screen
        showLoginScreen();
    }
});

// Function to show the login screen
function showLoginScreen() {
    
    document.getElementById('login-form').classList.remove('is-hidden');
    document.getElementById('users-list').classList.add('is-hidden');
    document.getElementById('requests-list').classList.add('is-hidden');

    // Hide user info and logout button
    document.getElementById('user-info').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
}

// Function to show the users list screen
function showUserList() {
    document.getElementById('login-form').classList.add('is-hidden');
    document.getElementById('users-list').classList.remove('is-hidden');

    const role = localStorage.getItem('user_role');
    const username = localStorage.getItem('username');

    document.getElementById('user-info').style.display = 'flex';
    document.getElementById('user-role').innerText = role ? role : 'Unknown Role';
    document.getElementById('user-username').innerText = username ? username : 'Unknown User';
    document.getElementById('logout-btn').style.display = 'inline-block';

    fetchData();
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple validation (could be more advanced)
    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    // Hash the password here if necessary
    // const hashedPassword = hashPassword(password); // Add your password hashing logic here

    // Send the login request to the backend
    fetch('http://localhost:8020/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // On successful login, save login token and role to localStorage and show the users list
            localStorage.setItem('login_token', data.content.login_token);
            localStorage.setItem('user_role', data.content.role); // Save the role (Manager or Employer)
            localStorage.setItem('username', data.content.username); // Save the username
            localStorage.setItem('user_id', data.content.user_id); // Save user_id
            
            showUserList();
            showRequestsList();
            updateNavbar();;
        } else {
            alert('Login failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert('Error during login. Please try again later.');
    });
}

// Function to update the navbar with the user's role after login
function updateNavbar() {
    const role = localStorage.getItem('user_role'); // Retrieve the user's role from localStorage
    const username = localStorage.getItem('username'); // Retrieve the username from localStorage

    const userInfoElement = document.getElementById('user-info'); // Element to show role and username
    const logoutButton = document.getElementById('logout-btn'); // Logout button element

    if (role && username) {
        // Populate the role and username
        document.getElementById('user-role').innerText = `${role}`;
        document.getElementById('user-username').innerText = `${username}`;

        // Display the user info and logout button
        userInfoElement.style.display = 'flex';
        if (logoutButton) logoutButton.style.display = 'inline-block';
    } else {
        // Hide the user info and logout button if no role or username
        userInfoElement.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'none';
    }
}

// Function to fetch data from the backend API and populate the list
function fetchData() {
    // API URL for fetching users
    fetch('http://localhost:8020/api/users/employees')
        .then(response => response.json())  // Parse the JSON response
        .then(data => {
            // Check if the request was successful
            if (data.success) {
                // Get the list container
                const listContainer = document.getElementById('items-list');

                // Clear the list before populating
                listContainer.innerHTML = '';

                // Loop through the data (users) and create divs for each user
                data.content.forEach(user => {
                    const userDiv = document.createElement('div');
                    userDiv.classList.add('user-card');  // Add the class for styling
                    userDiv.innerHTML = `
                        <p><strong>Username:</strong> ${user.username}</p>
                        <p><strong>Email:</strong> ${user.email}</p>

                        <div class="buttons">
                            <button class="button is-info" onclick="editUser(${user.id})">Edit</button>
                            <button class="button is-danger" onclick="deleteUser(${user.id})">Delete</button>
                        </div>
                    `;
                    listContainer.appendChild(userDiv);
                });
            } else {
                // Handle error if request was not successful
                console.error('Error: ' + data.message);
            }
        })
        .catch(error => {
            // Handle network or other errors
            console.error('Error fetching data:', error);
        });
}

// Show the "Create User" form
function showCreateUserForm() {
    document.getElementById('create-user-form').classList.add('is-active');
}

// Close the "Create User" form
function closeCreateUserForm() {
    // Hide the modal by adding the "is-hidden" class
    document.getElementById('create-user-form').classList.remove('is-active');
}

// Function to submit the "Create User" form
function submitCreateUserForm(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const username = document.getElementById('new-username').value;
    const email = document.getElementById('new-email').value;
    const password = document.getElementById('new-password').value;

    // Validate inputs (you can enhance this logic)
    if (!username || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    // Send POST request to create a new user
    fetch('http://localhost:8020/api/users/employees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('login_token')}` // Include login token if needed
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Employer created successfully');
            closeCreateUserForm();  // Close the modal
            fetchData();  // Refresh the user list
        } else {
            alert('Error creating user: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error creating user:', error);
        alert('Error creating user. Please try again later.');
    });
}


function editUser(userId) {
    // Fetch the user data based on the userId
    fetch(`http://localhost:8020/api/users/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const user = data.content;

                // Populate the form with the current username and email
                document.getElementById('edit-username').value = user.username;
                document.getElementById('edit-email').value = user.email;
                document.getElementById('edit-user-id').value = userId;

                // Show the edit form as a modal
                document.getElementById('edit-user-form').classList.add('is-active');
            } else {
                alert('Error fetching user details: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            alert('Error fetching user data. Please try again later.');
        });
}


function updateUser(event) {
    event.preventDefault(); // Prevent form submission

    const userId = document.getElementById('edit-user-id').value;
    const username = document.getElementById('edit-username').value;
    const email = document.getElementById('edit-email').value;
    const password = document.getElementById('edit-password').value;

    // Prepare the data for the PUT request
    const updatedUser = { username, email };

    if (password) {
        updatedUser.password = password;
    }

    fetch(`http://localhost:8020/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('login_token')}`,
        },
        body: JSON.stringify(updatedUser),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('User updated successfully');
            showUserList(); // Refresh the users list
        } else {
            alert('Error updating user: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error updating user:', error);
        alert('Error updating user. Please try again later.');
    });
}

// Function to cancel editing and go back to the user list
function cancelEdit() {
    document.getElementById('edit-user-form').classList.remove('is-active');
}


function deleteUser(userId) {
    // Ask for confirmation before deleting
    const confirmation = confirm("Are you sure you want to delete this user?");
    if (confirmation) {
        // If confirmed, send the DELETE request
        fetch(`http://localhost:8020/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('login_token')}` // Include login token if needed
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('User deleted successfully');
                fetchData();  // Refresh the user list
            } else {
                alert('Error deleting user: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            alert('Error deleting user. Please try again later.');
        });
    }
}

function logout() {
    const userId = localStorage.getItem('user_id'); // Retrieve the user_id from localStorage

    if (!userId) {
        alert("Cant logout right now. Please log in again.");
        showLoginScreen();
        return;
    }

    fetch('http://localhost:8020/api/users/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('login_token')}`
        },
        body: JSON.stringify({ user_id: parseInt(userId) }) // Send the user_id
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message); // Display the success message
            // Clear all localStorage data
            localStorage.removeItem('login_token');
            localStorage.removeItem('user_role');
            localStorage.removeItem('username');
            localStorage.removeItem('user_id');
            // Redirect to login screen
            showLoginScreen();
        } else {
            alert('Logout failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error during logout:', error);
        alert('Error logging out. Please try again later.');
    });
}

// Function to fetch and display pending requests
function fetchPendingRequests() {
    fetch('http://localhost:8020/api/requests/pending', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('login_token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const container = document.getElementById('pending-requests-container');

            // Clear existing content
            container.innerHTML = '';

            if (data.content.length === 0) {
                container.innerHTML = '<p>No pending requests found.</p>';
                return;
            }

            // Populate the list with pending requests
            data.content.forEach(request => {
                const requestDiv = document.createElement('div');
                requestDiv.classList.add('request-card'); // Add a class for styling
                requestDiv.innerHTML = `
                    <p><strong>Start Date:</strong> ${request.start_date}</p>
                    <p><strong>End Date:</strong> ${request.end_date}</p>
                    <p><strong>Reason:</strong> ${request.reason}</p>
                    <p><strong>Submitted At:</strong> ${request.submitted_at}</p>
                    <div class="buttons">
                        <button class="button is-success" onclick="approveRequest(${request.id})">Approve</button>
                        <button class="button is-danger" onclick="rejectRequest(${request.id})">Reject</button>
                    </div>
                `;
                container.appendChild(requestDiv);
            });
        } else {
            console.error('Error fetching pending requests:', data.message);
        }
    })
    .catch(error => {
        console.error('Error during fetch:', error);
    });
}

function showRequestsList() {
    // Ensure the requests list is visible
    const requestsListElement = document.getElementById('requests-list');
    requestsListElement.classList.remove('is-hidden');

    // Fetch and display pending requests
    fetchPendingRequests();
}

function approveRequest(requestId) {
    const userId = localStorage.getItem('user_id'); // Get the user ID from localStorage

    if (!userId) {
        alert("You must be logged in to approve requests.");
        return;
    }

    // Send the PUT request to approve the request
    fetch(`http://localhost:8020/api/requests/${requestId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('login_token')}`
        },
        body: JSON.stringify({
            status_id: 2  // Status 2 means approved
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Request approved successfully!');
            fetchPendingRequests();  // Refresh the requests list
        } else {
            alert('Error approving request: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error approving request:', error);
        alert('Error approving request. Please try again later.');
    });
}

function rejectRequest(requestId) {
    const userId = localStorage.getItem('user_id'); // Get the user ID from localStorage

    if (!userId) {
        alert("You must be logged in to reject requests.");
        return;
    }

    // Send the PUT request to reject the request
    fetch(`http://localhost:8020/api/requests/${requestId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('login_token')}`
        },
        body: JSON.stringify({
            status_id: 3  // Status 3 means rejected
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Request rejected successfully!');
            fetchPendingRequests();  // Refresh the requests list
        } else {
            alert('Error rejecting request: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error rejecting request:', error);
        alert('Error rejecting request. Please try again later.');
    });
}

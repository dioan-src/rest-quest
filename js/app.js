document.addEventListener('DOMContentLoaded', function () {
    // Check if user is already logged in by checking localStorage for the login token
    if (localStorage.getItem('login_token')) {
        // If logged in, show the users list and update the navbar with the user role
        showUserList();
        updateNavbar();
    } else {
        // If not logged in, show the login screen
        showLoginScreen();
    }
});

// Function to show the login screen
function showLoginScreen() {
    document.getElementById('page-title').innerText = 'Login';
    document.getElementById('login-form').classList.remove('is-hidden');
    document.getElementById('users-list').classList.add('is-hidden');
}

// Function to show the users list screen
function showUserList() {
    document.getElementById('page-title').innerText = 'Employers List';
    document.getElementById('login-form').classList.add('is-hidden');
    document.getElementById('users-list').classList.remove('is-hidden');
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
            showUserList();
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
    const navbarItem = document.querySelector('.navbar-item'); // Select the navbar item to display the role
    
    if (role) {
        // Update the navbar item to show the role
        navbarItem.innerHTML = `<strong>My restQuest - ${role}</strong>`;
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
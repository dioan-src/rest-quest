document.addEventListener('DOMContentLoaded', function () {
    // Fetch data when the page loads
    fetchData();
});

// Function to fetch data from the backend API and populate the list
function fetchData() {
    // API URL for fetching users
    fetch('http://localhost:8020/api/users/')
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
                        <p><strong>Role ID:</strong> ${user.role_id}</p>
                        <p><strong>Created At:</strong> ${user.created_at}</p>
                        <p><strong>Updated At:</strong> ${user.updated_at}</p>
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

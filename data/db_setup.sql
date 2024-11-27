-- Drop the database if it exists
DROP DATABASE IF EXISTS rest_quest_db;

-- Create the database
CREATE DATABASE rest_quest_db;

-- Use the newly created database
USE rest_quest_db;

-- Create the roles table
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- Create the users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- Create the employees table
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    employee_code CHAR(7) NOT NULL UNIQUE,
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the statuses table
CREATE TABLE statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE
);

-- Create the logins table
CREATE TABLE logins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the login_tokens table
CREATE TABLE login_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    valid BOOLEAN DEFAULT TRUE,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the requests table
CREATE TABLE requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    status_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE RESTRICT
);

-- Insert initial data into roles table
INSERT INTO roles (role_name) VALUES ('Manager'), ('Employee');

-- Insert initial data into statuses table
INSERT INTO statuses (status_name) VALUES ('Pending'), ('Approved'), ('Rejected');

-- insert the first user(manager)
INSERT INTO users (username, email, password, role_id)
VALUES ('manageruser', 'manager@example.com', '01b613da484bee91c3f3806b52a6f40fd61ade874b5ffc0f62a2091cce38158b', 1),
    ('emp1', 'emp@ena', '01b613da484bee91c3f3806b52a6f40fd61ade874b5ffc0f62a2091cce38158b', 2),
    ('emp2', 'emp@dyo', '01b613da484bee91c3f3806b52a6f40fd61ade874b5ffc0f62a2091cce38158b', 2);

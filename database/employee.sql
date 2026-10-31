-- Employee Management System SQL Script
-- Database: employee_db

-- Drop table if exists
DROP TABLE IF EXISTS employees;

-- Create employees table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mobile VARCHAR(20) NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Search indexes
CREATE INDEX idx_employees_name ON employees(LOWER(name));
CREATE INDEX idx_employees_email ON employees(LOWER(email));
CREATE INDEX idx_employees_dept ON employees(department);

-- Sample seed data
INSERT INTO employees (name, email, mobile, department, designation) VALUES
('Aarav Sharma', 'aarav.sharma@example.com', '+91 98765 43210', 'Engineering', 'Senior Full Stack Developer'),
('Priya Patel', 'priya.patel@example.com', '+91 98234 56789', 'Human Resources', 'HR Manager'),
('Rohan Verma', 'rohan.verma@example.com', '+91 97123 45678', 'Design', 'Lead UI/UX Designer'),
('Ananya Iyer', 'ananya.iyer@example.com', '+91 96543 21098', 'Marketing', 'Digital Marketing Specialist'),
('Vikram Malhotra', 'vikram.malhotra@example.com', '+91 95432 10987', 'Engineering', 'Backend Architect'),
('Sneha Kulkarni', 'sneha.kulkarni@example.com', '+91 94321 09876', 'Finance', 'Financial Analyst'),
('Karan Mehta', 'karan.mehta@example.com', '+91 93210 98765', 'Product', 'Product Manager'),
('Neha Gupta', 'neha.gupta@example.com', '+91 92109 87654', 'Quality Assurance', 'QA Automation Engineer');

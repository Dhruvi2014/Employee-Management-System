# Employee Management System (PERN Stack)

A modern, full-stack **Employee Management System** built with **React.js (Vite)**, **Node.js + Express.js**, and **PostgreSQL**. The application provides end-to-end CRUD operations, live search by employee name or email, department filtering, multi-column sorting, comprehensive client and server-side validation, and a sleek, responsive dashboard.

---

## Table of Contents
1. [Features](#features)
2. [Project Architecture & Structure](#project-architecture--structure)
3. [Database Schema](#database-schema)
4. [REST API Documentation](#rest-api-documentation)
5. [Prerequisites](#prerequisites)
6. [Step-by-Step Setup Guide](#step-by-step-setup-guide)
7. [Running the Application](#running-the-application)
8. [Form Validation Rules](#form-validation-rules)
9. [Technical Discussion & Code Explanation](#technical-discussion--code-explanation)

---

## Features

- **Employee Management Dashboard**:
  - Displays all employees in a clean, high-contrast, responsive data table.
  - Generates custom employee avatar initials with unique color hashing.
  - Styled department badges (Engineering, HR, Design, Marketing, Finance, Product, QA, etc.).
  - Quick action buttons for **Edit** and **Delete**.
- **Add New Employee**:
  - Modal form with required fields: **Employee Name**, **Email**, **Mobile Number**, **Department**, and **Designation**.
  - Real-time client-side validation as you type.
  - Server-side validation with conflict detection (prevents duplicate emails).
- **Edit Existing Employee**:
  - Populates existing details into modal.
  - Validates updated data before committing to PostgreSQL.
- **Delete Employee**:
  - Two-step deletion with a confirmation modal showing employee name, department, and designation to prevent accidental deletions.
- **Search & Filter**:
  - Instant live search by **Employee Name** or **Email** (case-insensitive `ILIKE` database queries).
  - Department dropdown filter.
  - Multi-criteria sorting: Newest Added, Oldest Added, Name (A→Z), Name (Z→A), and Department (A→Z).
- **Dashboard Metric Cards**:
  - Real-time summary counts: Total Employees, Active Departments, Largest Team, and Live PostgreSQL connection health.
- **Toast Notifications**:
  - Non-blocking alerts for actions (Created, Updated, Deleted, Validation Errors).

---

## Project Architecture & Structure

The repository is cleanly partitioned into independent `backend`, `frontend`, `database`, and `scripts` directories following standard industry conventions:

```
d:\Employee Management System\
├── backend/                        # Node.js + Express REST API Backend
│   ├── config/
│   │   └── db.js                   # PostgreSQL connection pool (pg.Pool)
│   ├── controllers/
│   │   └── employeeController.js   # HTTP Request handling & business logic
│   ├── models/
│   │   └── employeeModel.js        # SQL queries, parameterized statements & database operations
│   ├── routes/
│   │   └── employeeRoutes.js       # Express Router route definitions
│   ├── middleware/
│   │   ├── validation.js           # Request payload validation middleware
│   │   └── errorHandler.js         # Centralized error handler & 404 handler
│   ├── .env                        # Backend environment configuration
│   ├── .env.example                # Example environment file
│   ├── package.json                # Backend dependencies (express, pg, cors, dotenv)
│   └── server.js                   # Express application entry point
│
├── frontend/                       # React.js SPA created with Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmDeleteModal.jsx # Delete confirmation dialog
│   │   │   ├── EmployeeModal.jsx      # Add / Edit employee modal with form validation
│   │   │   ├── EmployeeTable.jsx      # Responsive data table with action triggers
│   │   │   ├── Navbar.jsx             # Top bar with status pill & Add action
│   │   │   ├── SearchFilterBar.jsx    # Search input, department dropdown & sorting
│   │   │   ├── StatsCards.jsx         # Dashboard statistics cards
│   │   │   └── Toast.jsx              # Feedback toast notifications
│   │   ├── services/
│   │   │   └── api.js                 # Frontend API client communicating with backend
│   │   ├── App.jsx                    # Root state management & component composition
│   │   ├── index.css                  # Modern CSS design system & responsive styling
│   │   └── main.jsx                   # React DOM root entry
│   ├── index.html                     # HTML root template
│   ├── package.json                   # Frontend dependencies (react, lucide-react, vite)
│   └── vite.config.js                 # Vite configuration with API proxy
│
├── database/                       # SQL scripts
│   ├── schema.sql                  # PostgreSQL table schema and search indexes
│   └── seed.sql                    # Realistic seed dataset for demonstration
│
├── scripts/
│   └── setup-db.js                 # Automated database initialization script
│
├── package.json                    # Root package with monorepo utility scripts
├── screenshot.png                  # Screenshot of the completed application
└── README.md                       # Comprehensive documentation & setup instructions
```

---

## Database Schema

Database Name: `employee_db`

### Table: `employees`

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Unique autoincrementing employee identifier |
| `name` | `VARCHAR(100)` | `NOT NULL` | Employee full name (2 - 100 characters) |
| `email` | `VARCHAR(150)` | `NOT NULL, UNIQUE` | Employee email address (case-insensitive unique) |
| `mobile` | `VARCHAR(20)` | `NOT NULL` | Contact number with country code support |
| `department` | `VARCHAR(100)` | `NOT NULL` | Department / business division |
| `designation`| `VARCHAR(100)` | `NOT NULL` | Job role / designation |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Last updated timestamp |

### Indexes
- `idx_employees_name`: `ON employees(LOWER(name))` for fast search.
- `idx_employees_email`: `ON employees(LOWER(email))` for fast search & uniqueness lookup.
- `idx_employees_dept`: `ON employees(department)` for department filtering.

---

## REST API Documentation

Base URL: `http://localhost:5000/api`

### 1. Health Check
- **`GET /api/health`**
- **Response `200 OK`**:
  ```json
  {
    "status": "UP",
    "timestamp": "2026-10-31T11:48:00.000Z",
    "database": "Connected"
  }
  ```

### 2. Get All Employees
- **`GET /api/employees`**
- **Query Parameters (Optional)**:
  - `search`: Filter by name or email (e.g. `?search=aarav`)
  - `department`: Filter by department (e.g. `?department=Engineering`)
  - `sortBy`: `id`, `name`, `email`, `department`, `designation`, `created_at`
  - `sortOrder`: `ASC` or `DESC`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "count": 8,
    "data": [
      {
        "id": 1,
        "name": "Aarav Sharma",
        "email": "aarav.sharma@example.com",
        "mobile": "+91 98765 43210",
        "department": "Engineering",
        "designation": "Senior Full Stack Developer",
        "created_at": "2026-10-31T11:48:22.000Z",
        "updated_at": "2026-10-31T11:48:22.000Z"
      }
    ]
  }
  ```

### 3. Get Dashboard Statistics
- **`GET /api/employees/stats`**
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "totalEmployees": 8,
      "departmentStats": [
        { "department": "Engineering", "count": 2 },
        { "department": "Design", "count": 1 }
      ],
      "recentEmployees": [...]
    }
  }
  ```

### 4. Get Employee by ID
- **`GET /api/employees/:id`**
- **Response `200 OK`**: Single employee object.
- **Response `404 Not Found`**: If employee with ID does not exist.

### 5. Create Employee
- **`POST /api/employees`**
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "Kavita Rao",
    "email": "kavita.rao@example.com",
    "mobile": "+91 91234 56780",
    "department": "Engineering",
    "designation": "Frontend Specialist"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Employee created successfully.",
    "data": { "id": 9, "name": "Kavita Rao", ... }
  }
  ```
- **Response `400 Bad Request`**: Validation errors on one or more fields.
- **Response `409 Conflict`**: Email already in use.

### 6. Update Employee
- **`PUT /api/employees/:id`**
- **Request Body**:
  ```json
  {
    "name": "Kavita Rao",
    "email": "kavita.rao@example.com",
    "mobile": "+91 91234 99999",
    "department": "Engineering",
    "designation": "Lead Frontend Engineer"
  }
  ```
- **Response `200 OK`**: Updated employee record.
- **Response `404 Not Found`**: When target ID does not exist.
- **Response `409 Conflict`**: When updated email conflicts with another employee.

### 7. Delete Employee
- **`DELETE /api/employees/:id`**
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Employee \"Kavita Rao\" deleted successfully.",
    "data": { ... }
  }
  ```

---

## Prerequisites

Make sure the following are installed on your machine:
- **Node.js**: v18.0.0 or higher (Tested on v24.x)
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v14.0 or higher (Running locally on port 5432)

---

## Step-by-Step Setup Guide

### 1. Configure PostgreSQL Password
The application is pre-configured with default credentials:
- **Host**: `localhost`
- **Port**: `5432`
- **User**: `postgres`
- **Password**: `root`
- **Database**: `employee_db`

You can verify or change these in `backend/.env`.

### 2. Initialize Database & Seed Data
You can initialize the database automatically using the provided Node setup script:

```bash
# Run from project root
node scripts/setup-db.js
```

Or execute the SQL scripts manually via `psql`:

```bash
# Set password and execute schema and seed scripts
psql -U postgres -h localhost -c "CREATE DATABASE employee_db;"
psql -U postgres -h localhost -d employee_db -f database/schema.sql
psql -U postgres -h localhost -d employee_db -f database/seed.sql
```

### 3. Install Dependencies

Install backend dependencies:
```bash
cd backend
npm install
```

Install frontend dependencies:
```bash
cd ../frontend
npm install
```

Or install all dependencies from the root directory:
```bash
npm run install:all
```

---

## Running the Application

### Option A: Running Backend and Frontend in Separate Terminals

#### Terminal 1 (Backend REST API):
```bash
cd backend
npm run dev
```
Backend will start on: **`http://localhost:5000`**

#### Terminal 2 (React Frontend with Vite):
```bash
cd frontend
npm run dev
```
Frontend will start on: **`http://localhost:5173`**

### Option B: Build Frontend for Production
```bash
cd frontend
npm run build
```
This generates optimized assets inside `frontend/dist/`.

---

## Form Validation Rules

Both frontend and backend enforce the following validations:

1. **Employee Name**:
   - Required.
   - Minimum length: 2 characters.
   - Maximum length: 100 characters.
2. **Email Address**:
   - Required.
   - Valid email format (regex: `^[^\s@]+@[^\s@]+\.[^\s@]+$`).
   - Unique across all employees (checked in PostgreSQL with HTTP 409 status on duplicates).
3. **Mobile Number**:
   - Required.
   - Allowed characters: numbers, optional leading `+`, spaces, dashes, parentheses.
   - Must contain between 7 and 15 digits.
4. **Department**:
   - Required selection from dropdown.
5. **Designation**:
   - Required.
   - Minimum length: 2 characters.

---

## Technical Discussion & Code Explanation

During a technical discussion or code review, you can reference the following design decisions:

1. **Architecture Pattern (MVC)**:
   - **Model (`backend/models/employeeModel.js`)**: Encapsulates all SQL interactions and data retrieval methods.
   - **Controller (`backend/controllers/employeeController.js`)**: Orchestrates business logic, parses request bodies, handles HTTP response codes, and delegates to the model.
   - **Routes (`backend/routes/employeeRoutes.js`)**: Clean routing declarations with validation middleware attached.
2. **SQL Injection Protection**:
   - All queries use parameterized inputs (`$1, $2, ...`) via `node-postgres` (`pg.Pool`), ensuring that user inputs are never concatenated directly into SQL statements.
   - Sort columns are checked against an explicit whitelist of allowed column names before applying to the query.
3. **Database Connection Pooling**:
   - Utilizes `pg.Pool` for thread-safe reuse of database connections, maximizing throughput and reducing database connection overhead.
4. **Client-Side Debouncing**:
   - Live search input uses debouncing (250ms) to prevent overwhelming the server on rapid typing while giving users immediate search feedback.
5. **Responsive & Accessible UI**:
   - CSS system with CSS variables, high-contrast text, keyboard support (ESC closes modals), semantic HTML elements, and mobile-responsive layouts.

# Employee Management System

A simple Employee Management System developed using React.js, Node.js, Express.js and PostgreSQL.

## Features

- Add new employees.
- View all employees.
- Edit employee details.
- Delete employees.
- Search employees by name or email.
- Basic form validation.

## Technologies Used

- React.js (Vite)
- Node.js
- Express.js
- PostgreSQL
- Axios
- CSS

## Installation & Setup

### 1. Clone or Download Project

Download the project and open it in VS Code.

### 2. Database Setup

- Open pgAdmin 4 or psql.
- Create a database named `employee_db`.
- Open Query Tool.
- Execute the SQL file located in `database/employee.sql` (or `database/schema.sql`).

*(Quick alternative: Run `node scripts/setup-db.js` from the project root to automatically create and seed the database).*

---

### 3. Backend Setup

Open the terminal:

```bash
cd backend
npm install
```

*(If installing backend from complete scratch without package.json, run:*
```bash
npm init -y
npm install express pg cors dotenv morgan
npm install -D nodemon
```
*)*

Create a `.env` file and add your PostgreSQL credentials:

```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=employee_db
DB_USER=postgres
DB_PASSWORD=root
```

Start the backend:

```bash
npm run dev
```

---

### 4. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

*(If installing frontend from complete scratch, run:*
```bash
npm create vite@latest . -- --template react
npm install
npm install axios lucide-react
```
*)*

Start the frontend:

```bash
npm run dev
```

Open the application in your browser:

`http://localhost:5173`

---

## Backend API

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/employees | Get all employees |
| GET | /api/employees/:id | Get employee by ID |
| POST | /api/employees | Add employee |
| PUT | /api/employees/:id | Update employee |
| DELETE | /api/employees/:id | Delete employee |

---

## Project Structure

- `frontend/` – React application (Vite, Axios, Lucide Icons).
- `backend/` – Node.js and Express APIs (pg, cors, morgan, dotenv).
- `database/` – PostgreSQL SQL script (`employee.sql`, `schema.sql`, `seed.sql`).

## Author

Developed as part of the Employee Management System technical assignment.

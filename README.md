# Employee Management System

A simple Employee Management System developed using React.js, Node.js, Express.js and PostgreSQL.

## Features

- Add new employees.
- View all employees.
- Edit employee details.
- Delete employees.
- Search employees by name or email.
- Basic form validation.
- RESTful compliance with standard HTTP methods, status codes, and HATEOAS links.

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

## REST API Specifications

The backend adheres strictly to REST conditions:
- **Stateless**: Every request contains all required information; no server-side sessions.
- **Resource-Oriented URIs**: Nouns (`/api/employees`) represent resources.
- **Appropriate Status Codes**: `200 OK`, `201 Created` with `Location` header, `204 No Content`, `400 Bad Request`, `404 Not Found`, `409 Conflict`.
- **HATEOAS Navigation**: Each resource response includes `_links` to related actions (`self`, `update`, `patch`, `delete`, `collection`).

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| GET | /api/health | Server and DB health check | 200 OK |
| GET | /api/employees | Get all employees (supports `?search=`, `?department=`, `?sortBy=`) | 200 OK |
| GET | /api/employees/stats | Get dashboard metrics | 200 OK |
| GET | /api/employees/:id | Get employee by ID | 200 OK / 404 Not Found |
| POST | /api/employees | Add new employee | 201 Created (with `Location` header) |
| PUT | /api/employees/:id | Full update of employee details | 200 OK |
| PATCH | /api/employees/:id | Partial update of employee fields | 200 OK |
| DELETE | /api/employees/:id | Delete employee | 200 OK / 404 Not Found |
| OPTIONS | /api/employees | Inspect allowed methods on collection | 204 No Content (`Allow: GET, POST, HEAD, OPTIONS`) |
| OPTIONS | /api/employees/:id | Inspect allowed methods on resource | 204 No Content (`Allow: GET, PUT, PATCH, DELETE, HEAD, OPTIONS`) |

---

## Project Structure

- `frontend/` – React application (Vite, Axios, Lucide Icons).
- `backend/` – Node.js and Express APIs (pg, cors, morgan, dotenv).
- `database/` – PostgreSQL SQL script (`employee.sql`, `schema.sql`, `seed.sql`).

## Author

Developed as part of the Employee Management System technical assignment.

# Payroo Backend

A mini pay run backend API built with Node.js, TypeScript, Express, and MongoDB. This project manages employees, timesheets, payruns, and payslips, following the Payroo coding assessment specification.

---

## Features

- **Employee Management**: Add, update, and list employees.
- **Timesheet Management**: Submit and update timesheets for employees.
- **Payrun Calculation**: Generate payruns for a given period, including gross, tax, super, and net calculations.
- **Payslip Generation**: View payslips for each employee in a payrun.
- **Validation**: All endpoints use Joi for request validation.
- **Authentication**: JWT-based authentication for protected routes.
- **Logging**: Winston-based logging with separate error and info logs.
- **Testing**: Jest-based unit tests for business logic and endpoints.
- **Security**: Helmet, CORS, and best practices for secure APIs.

---

## Getting Started

### Prerequisites

- Node.js (v20.9.0 recommended) v18+
- npm
- MongoDB (local)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/saikumar161616/payroo_backend.git
   cd payroo_backend
   ```

2. **Install dependencies:**
   npm install
   

3. **Configure environment variables:**
   - Copy `.env` and adjust values as needed (see provided `.env` for reference).

4. **Start MongoDB** (if running locally):
   ```sh
   mongod
   ```

5. **Run the development server:**
   npm run dev
   
   The server will start on the port specified in `.env` (default: 5000).

---

## Scripts

- `npm run dev` — Start server with hot-reload (nodemon + ts-node)
- `npm run build` — Compile TypeScript to JavaScript
- `npm start` — Run compiled app
- `npm test` — Run Jest unit tests

---

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication

- All routes (except `/api/employees/get-token`) require a Bearer JWT token in the `Authorization` header.

### Employees

- `GET /api/employee` — List all active employees
- `POST /api/employee` — Add a new employee
- `PATCH /api/employee/:id` — Update an employee
- `POST /api/employee/get-token` — Get a JWT token for testing

### Timesheets

- `POST /api/timesheet` — Submit a new timesheet
- `GET /api/timesheet` — Fetch timesheets for an employee and period
- `PATCH /api/timesheet/:id` — Update a timesheet

### Payruns

- `POST /api/payrun/run` — Generate a payrun for a period (and optional employee subset)
- `GET /api/payrun` — List all payruns

---

## Business Logic

- **Gross Pay**:  
  `gross = normal_hours * base_rate + overtime_hours * base_rate * 1.5 + allowances`  
  (Overtime: hours > 38/week)

- **Tax**:  
  Progressive rates per period gross (see [utilities/helper.util.ts](utilities/helper.util.ts))

- **Superannuation**:  
  `super = gross * 0.115`

- **Net Pay**:  
  `net = gross - tax`

---

## Validation

- All input is validated using Joi schemas (see model files in each module).

---

## Logging

- Logs are written to `logs/error.log` and `logs/info.log` as well as the console.

---

## Testing

- Unit tests are in [`__tests__/`](__tests__) and can be run with `npm test`.

---

## Environment Variables

See `.env` for all required variables:

- `NODE_ENV`
- `PORT`
- `CORS_ORIGINS`
- `JWT_SECRET_KEY`
- `DATABASE_URL`
- `TIMEZONE`

---

## License

ISC

---

## Author

Saikumar Perumalla

---

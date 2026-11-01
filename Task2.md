# Task Management Module

## Overview

The goal of this module is to provide personal task management functionality within the NestJS application.

## Data Model

| Field         | Type      | Required | Description                                                    |
| :------------ | :-------- | :------- | :------------------------------------------------------------- |
| `id`          | `integer` | Auto     | Primary Key, auto-increment starting at 1 (`1, 2, 3, ...`)     |
| `title`       | `string`  | Yes      | Task title, length: 1 - 255 characters                         |
| `category`    | `string`  | No       | Task category / topic                                          |
| `description` | `string`  | No       | Detailed task description                                      |
| `isCompleted` | `boolean` | No       | Completion status, defaults to `false`                         |
| `createdAt`   | `Date`    | Auto     | Timestamp when the task was created                            |
| `updatedAt`   | `Date`    | Auto     | Timestamp when the task was last updated                       |

## Endpoints Summary

| Method   | Endpoint            | Description                                  |
| :------- | :------------------ | :------------------------------------------- |
| `POST`   | `/api/v1/tasks`     | Create a new task                            |
| `GET`    | `/api/v1/tasks`     | Get list of tasks (with optional filters)    |
| `GET`    | `/api/v1/tasks/:id` | Get details of a single task by ID           |
| `PATCH`  | `/api/v1/tasks/:id` | Update task fields by ID                     |
| `DELETE` | `/api/v1/tasks/:id` | Delete a task by ID                          |

---

## Endpoint Details

### 1. Create a Task

- **Endpoint**: `POST /api/v1/tasks`
- **Headers**: `Content-Type: application/json`

**Request Body**:
```json
{
  "title": "Learn NestJS basics",
  "category": "Backend",
  "description": "Explore DTO, Controller, Service, and Module"
}
```

**Response**: `201 Created`
```json
{
  "id": 1,
  "title": "Learn NestJS basics",
  "category": "Backend",
  "description": "Explore DTO, Controller, Service, and Module",
  "isCompleted": false,
  "createdAt": "2026-10-27T08:30:00.000Z",
  "updatedAt": "2026-10-27T08:30:00.000Z"
}
```
*Note: Creating subsequent tasks will automatically increment the ID to 2, 3, etc.*

### 2. Get All Tasks

- **Endpoint**: `GET /api/v1/tasks`
- **Query Parameters (Optional)**:
  - `isCompleted: boolean` (e.g. `true` or `false`) - Filter by completion status
  - `category: string` (e.g. `Backend`) - Filter by task category

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "title": "Learn NestJS basics",
    "category": "Backend",
    "description": "Explore DTO, Controller, Service, and Module",
    "isCompleted": false,
    "createdAt": "2026-10-27T08:30:00.000Z",
    "updatedAt": "2026-10-27T08:30:00.000Z"
  },
  {
    "id": 2,
    "title": "Build REST API",
    "category": "Backend",
    "description": "Implement CRUD endpoints",
    "isCompleted": false,
    "createdAt": "2026-10-27T09:00:00.000Z",
    "updatedAt": "2026-10-27T09:00:00.000Z"
  }
]
```

### 3. Get Task by ID

- **Endpoint**: `GET /api/v1/tasks/:id`
- **Params**: `id` (positive integer, e.g. `1`, `2`)

**Response**: `200 OK`
```json
{
  "id": 1,
  "title": "Learn NestJS basics",
  "category": "Backend",
  "description": "Explore DTO, Controller, Service, and Module",
  "isCompleted": false,
  "createdAt": "2026-10-27T08:30:00.000Z",
  "updatedAt": "2026-10-27T08:30:00.000Z"
}
```

### 4. Update Task

- **Endpoint**: `PATCH /api/v1/tasks/:id`
- **Params**: `id` (positive integer, e.g. `1`)

**Request Body** (all fields are optional):
```json
{
  "title": "Learn advanced NestJS",
  "isCompleted": true
}
```

**Response**: `200 OK`
```json
{
  "id": 1,
  "title": "Learn advanced NestJS",
  "category": "Backend",
  "description": "Explore DTO, Controller, Service, and Module",
  "isCompleted": true,
  "createdAt": "2026-10-27T08:30:00.000Z",
  "updatedAt": "2026-10-27T08:35:00.000Z"
}
```

### 5. Delete Task

- **Endpoint**: `DELETE /api/v1/tasks/:id`
- **Params**: `id` (positive integer, e.g. `1`)

**Response**: `200 OK`
```json
{
  "message": "Task deleted successfully"
}
```

---

## Exception & Error Handling

| Scenario                                                     | HTTP Status                 | Response / Exception                                 |
| :----------------------------------------------------------- | :-------------------------- | :--------------------------------------------------- |
| Validation failure (missing title, empty title, invalid type)| `400 Bad Request`           | `BadRequestException` via NestJS `ValidationPipe`    |
| Task record not found on GET, PATCH, DELETE by `:id`         | `404 Not Found`             | `NotFoundException('Tasks with ID ${id} not found')` |
| System / database connection error                           | `500 Internal Server Error` | NestJS `InternalServerErrorExceptionFilter`          |

---

## User Guide: How to Use

### 1. Database Migration

Ensure PostgreSQL is running and execute the migration to create the `tasks` table with the auto-increment integer ID:

```bash
# Run migrations
npm run typeorm:run-migrations
```

This creates the `tasks` table with `id SERIAL NOT NULL PRIMARY KEY`, which starts the ID sequence at 1 and increments by 1 for each new task.

### 2. Start Application

```bash
# Development mode
npm run start:dev

# Or production build & start
npm run build
npm run start:prod
```

By default, the server runs on port `3000` (or `PORT` specified in `.env`).

Swagger API documentation is available at:
`http://localhost:3000/api/docs`

### 3. Example Requests with cURL

#### A. Create First Task (ID will be 1)
```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn NestJS basics",
    "category": "Backend",
    "description": "Explore DTO, Controller, Service, and Module"
  }'
```

#### B. Create Second Task (ID will be 2)
```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build REST API",
    "category": "Backend",
    "description": "Implement CRUD endpoints",
    "isCompleted": false
  }'
```

#### C. List All Tasks
```bash
curl -X GET http://localhost:3000/api/v1/tasks
```

#### D. Filter Tasks
```bash
# Filter by completion status
curl -X GET "http://localhost:3000/api/v1/tasks?isCompleted=true"

# Filter by category
curl -X GET "http://localhost:3000/api/v1/tasks?category=Backend"

# Combine filters
curl -X GET "http://localhost:3000/api/v1/tasks?isCompleted=false&category=Backend"
```

#### E. Get Task by ID
```bash
curl -X GET http://localhost:3000/api/v1/tasks/1
```

#### F. Update Task
```bash
curl -X PATCH http://localhost:3000/api/v1/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn advanced NestJS",
    "isCompleted": true
  }'
```

#### G. Delete Task
```bash
curl -X DELETE http://localhost:3000/api/v1/tasks/1
```

### 4. Running Tests

```bash
# Run unit tests for Tasks module
npx jest src/modules/tasks
```

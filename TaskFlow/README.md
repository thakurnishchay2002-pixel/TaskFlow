# TaskFlow

TaskFlow is a production-style full-stack task management application built with React, Spring Boot, JPA/Hibernate, and MySQL.

## Features

- Dashboard with total, pending, in-progress, completed, and overdue counts
- Full task CRUD
- Task details page
- Search by title/description
- Combined priority/status/deadline filtering
- Sorting by newest, oldest, deadline, and priority
- Client-side and server-side validation
- Centralized REST exception handling
- Toast feedback and delete confirmation
- Responsive desktop/tablet/mobile UI
- Environment-based database configuration
- Docker Compose for frontend/backend/MySQL
- Backend service/repository architecture
- Automated backend tests and frontend utility tests

## Architecture

```text
React UI
  -> Axios service layer
  -> Spring Boot REST Controller
  -> Task Service
  -> Spring Data JPA Repository
  -> MySQL
```

## Project structure

```text
TaskFlow/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/main/java/com/taskflow/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── exception/
│   │   ├── repository/
│   │   └── service/
│   ├── src/test/
│   ├── Dockerfile
│   └── pom.xml
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Local setup

### Requirements

- Java 17+
- Maven 3.9+
- Node.js 20+
- MySQL 8+

### Database

Create the database:

```sql
CREATE DATABASE taskflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Copy `.env.example` values into your shell/environment or configure Spring properties directly.

Backend defaults are intentionally development-friendly:

```properties
DB_URL=jdbc:mysql://localhost:3306/taskflow
DB_USERNAME=root
DB_PASSWORD=root
```

For production, always provide credentials through environment variables.

### Backend

```bash
cd backend
mvn spring-boot:run
```

Backend: http://localhost:8080

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## Docker

The recommended one-command development deployment is:

```bash
docker compose up --build
```

Then open http://localhost:5173.

To stop:

```bash
docker compose down
```

To remove database data too:

```bash
docker compose down -v
```

## REST API

### GET `/api/tasks`

Query parameters:

- `search` — title/description text
- `priority` — LOW, MEDIUM, HIGH
- `status` — PENDING, IN_PROGRESS, COMPLETED
- `deadline` — ALL, OVERDUE, TODAY, UPCOMING, NO_DEADLINE
- `sortBy` — createdAt, deadline, title, priority
- `direction` — asc, desc

Example:

```text
GET /api/tasks?search=project&priority=HIGH&status=PENDING&deadline=UPCOMING&sortBy=deadline&direction=asc
```

### GET `/api/tasks/{id}`

Returns a single task.

### POST `/api/tasks`

```json
{
  "title": "Finish project report",
  "description": "Complete the final review",
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "deadline": "2026-10-10T17:00:00"
}
```

### PUT `/api/tasks/{id}`

Uses the same request body as POST.

### PATCH `/api/tasks/{id}/status`

```json
{
  "status": "COMPLETED"
}
```

### DELETE `/api/tasks/{id}`

Deletes the task.

## API error format

```json
{
  "success": false,
  "message": "Task with id 99 was not found",
  "timestamp": "2026-10-06T20:00:00"
}
```

Validation errors also include an `errors` object.

## Testing

Backend:

```bash
cd backend
mvn test
```

Frontend:

```bash
cd frontend
npm test
```

The backend test suite uses H2 for isolated repository/service tests so it does not require a running MySQL server. Production/runtime configuration remains MySQL.

## GitHub workflow

```bash
git init
git add .
git commit -m "feat: build TaskFlow task management application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/taskflow.git
git push -u origin main
```

Suggested follow-up commits:

```text
feat: add task creation API
feat: implement task filtering
feat: add responsive task dashboard
fix: handle task not found exception
docs: update API documentation
```

## Future enhancements

- Authentication and user-specific tasks
- Tags/categories
- Subtasks
- Attachments
- Notifications
- Recurring tasks
- Role-based access control
- Analytics
- Dark mode

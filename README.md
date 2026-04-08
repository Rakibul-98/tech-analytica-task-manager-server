# Task Management System — Backend

NestJS + Prisma + PostgreSQL backend for the Task Management System with role-based access and audit logging.

---

## 🔑 Demo Credentials

| Role  | Email              | Password   |
|-------|--------------------|------------|
| Admin | admin@taskapp.com  | admin123   |
| User  | user@taskapp.com   | user123    |

---

## 🚀 Quick Start (Docker)

```bash
docker compose up
```

The API will be available at `http://localhost:5000/api/v1`.  
The database is seeded automatically with the demo users above.

---

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your values
cp .env.example .env

# 3. Run migrations
npx prisma migrate dev

# 4. Seed demo users
npm run db:seed

# 5. Start dev server
npm run dev
```

---

## 📁 Project Structure

```
src/
├── main.ts                          # NestJS bootstrap
├── app.module.ts                    # Root module
└── app/
    ├── config/index.ts              # Env config (mirrors Express template)
    ├── constants/index.ts           # Enums: UserRole, TaskStatus, AuditActionType
    ├── errors/ApiError.ts           # Custom HTTP exceptions
    ├── helper/paginationHelper.ts   # Pagination utility (ported from template)
    ├── shared/
    │   ├── pick.ts                  # Object key picker (ported from template)
    │   ├── sendResponse.ts          # Response shaper (ported from template)
    │   ├── prisma.service.ts        # Injectable PrismaClient
    │   └── prisma.module.ts         # Global Prisma module
    ├── middlewares/
    │   └── GlobalExceptionFilter.ts # NestJS equivalent of globalErrorHandler
    ├── guards/
    │   ├── jwt-auth.guard.ts        # JWT authentication guard
    │   └── roles.guard.ts           # Role-based authorization guard
    ├── decorators/
    │   ├── roles.decorator.ts       # @Roles(UserRole.ADMIN)
    │   └── current-user.decorator.ts# @CurrentUser()
    └── modules/
        ├── auth/                    # Login + /me
        ├── users/                   # List users (Admin only)
        ├── tasks/                   # Full CRUD + status update
        └── audit-log/               # View logs (Admin only)
```

---

## 🗃️ Database Schema

```
users        → id, email, password, name, role, createdAt, updatedAt
tasks        → id, title, description, status, assignedUserId, createdAt, updatedAt
audit_logs   → id, actorId, taskId, actionType, beforeData, afterData, createdAt
```

---

## 🔌 API Reference

All routes are prefixed with `/api/v1`.  
Protected routes require: `Authorization: Bearer <token>`

### Auth
| Method | Path          | Auth | Role  | Description        |
|--------|---------------|------|-------|--------------------|
| POST   | /auth/login   | ✗    | —     | Login, get JWT     |
| GET    | /auth/me      | ✓    | Any   | Get current user   |

### Users
| Method | Path     | Auth | Role  | Description        |
|--------|----------|------|-------|--------------------|
| GET    | /users   | ✓    | Admin | List all users     |

### Tasks
| Method | Path                | Auth | Role        | Description                  |
|--------|---------------------|------|-------------|------------------------------|
| POST   | /tasks              | ✓    | Admin       | Create task                  |
| GET    | /tasks              | ✓    | Admin/User  | List tasks (filtered by role)|
| GET    | /tasks/:id          | ✓    | Admin/User  | Get single task               |
| PATCH  | /tasks/:id          | ✓    | Admin       | Update task (title, desc, assignee) |
| PATCH  | /tasks/:id/status   | ✓    | Admin/User  | Update task status           |
| DELETE | /tasks/:id          | ✓    | Admin       | Delete task                  |

**Query params for GET /tasks:** `page`, `limit`, `sortBy`, `sortOrder`, `status`, `search`

### Audit Logs
| Method | Path                      | Auth | Role  | Description              |
|--------|---------------------------|------|-------|--------------------------|
| GET    | /audit-logs               | ✓    | Admin | List all audit logs      |
| GET    | /audit-logs/task/:taskId  | ✓    | Admin | Logs for a specific task |

**Query params for GET /audit-logs:** `page`, `limit`, `actionType`, `actorId`, `taskId`

---

## 📋 Audit Log Action Types

| Action              | Triggered when                    |
|---------------------|-----------------------------------|
| TASK_CREATED        | Admin creates a task              |
| TASK_UPDATED        | Admin updates title/description   |
| TASK_DELETED        | Admin deletes a task              |
| STATUS_UPDATED      | Anyone updates task status        |
| ASSIGNMENT_UPDATED  | Admin changes assignedUserId      |

Each log records `beforeData` and `afterData` as JSON for full change history.

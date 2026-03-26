# Task Manager - Full Stack Home Assignment

A full-stack Task Management application built with React, TypeScript, Node.js, and Express.

> **📋 Assignment Instructions**: For complete assignment details, requirements, and submission guidelines, please see [ASSIGNMENT.md](./ASSIGNMENT.md).
> 
> **✨ What's New**: See [CHANGES.md](./CHANGES.md) for a detailed list of improvements and new features implemented.

## Overview

This is a Task Management application that allows users to:

- Register and authenticate
- Create and manage tasks
- Add comments to tasks
- Assign tasks to team members
- Tag tasks for better organization
- ✨ AI-powered task suggestions (Gemini)
- 🔍 Advanced filtering and search
- 📊 Activity tracking and audit log
- 🌙 Dark mode support

> For a complete list of features and improvements, see [CHANGES.md](./CHANGES.md)

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Fetch API

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL (via Docker)
- JWT Authentication
- bcrypt

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- Git
- Docker and Docker Compose (for PostgreSQL database)
- (Optional) Gemini API Key - for AI Magic Assistant feature

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd full-stack-home-assignment
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your configuration (optional, defaults are provided)
# DATABASE_URL="postgresql://taskmanager:taskmanager123@localhost:5432/taskmanager?schema=public"
# JWT_SECRET="your-secret-key-change-in-production"
# PORT=5000
# GEMINI_API_KEY="your-gemini-api-key-here"  # Optional: For AI Magic Assistant
# FRONTEND_URL="http://localhost:5173"       # Required: For CORS

# Start PostgreSQL database with Docker and setup database (migrate + seed)
npm run db:setup
```

**Note**: The `GEMINI_API_KEY` is optional. Without it, the AI Magic Assistant feature won't be available, but all other features will work normally. Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

```bash

# Or manually:
# Start PostgreSQL Docker container
# npm run db:docker:up

# Generate Prisma client
# npm run db:generate

# Run database migrations
# npm run db:migrate

# Seed the database with sample data
# npm run db:seed

# Start the development server
npm run dev
```

**Note**: The `db:setup` script will:

1. Start the PostgreSQL Docker container
2. Wait for the database to be ready
3. Generate Prisma client
4. Run migrations
5. Seed the database with sample data

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## Project Structure

```
full-stack-home-assignment/
├── shared/                 # Shared validation schemas (Zod)
│   ├── schemas/
│   │   ├── auth.ts
│   │   └── task.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/        # Reusable design system components
│   │   │   └── ...
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main app component
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/         # Express routes
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic
│   │   ├── db/             # Database schema
│   │   └── server.ts       # Express server
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (clears httpOnly cookie)
- `GET /api/auth/me` - Get current authenticated user

### Tasks

- `POST /api/tasks/suggest` - Get AI-powered task suggestions (requires auth)
- `GET /api/tasks` - Get all tasks (with optional filters)
- `GET /api/tasks/:id` - Get task by ID
- `GET /api/tasks/:id/activity` - Get activity log for a task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task (soft delete)

### Comments

- `GET /api/comments?taskId=:id` - Get comments for a task
- `POST /api/comments` - Create a comment
- `DELETE /api/comments/:id` - Delete a comment

### Tags

- `GET /api/tags` - Get all available tags

### Users

- `GET /api/users` - Get all users (for task assignment)

## Default Test Users

After seeding, you can login with:

- Email: `john@example.com`, Password: `password123`
- Email: `jane@example.com`, Password: `password123`
- Email: `bob@example.com`, Password: `password123`

## Development

### Backend

- Development: `npm run dev` (uses tsx for hot reload)
- Build: `npm run build`
- Start: `npm start`

### Frontend

- Development: `npm run dev` (Vite dev server)
- Build: `npm run build`
- Preview: `npm run preview`

## Database

The application uses PostgreSQL running in a Docker container. The database is automatically set up when you run `npm run db:setup`.

### Docker Commands

- Start database: `npm run db:docker:up`
- Stop database: `npm run db:docker:down`
- Restart database: `npm run db:docker:restart`
- Full setup (start + migrate + seed): `npm run db:setup`

### Database Connection

Default connection details (from docker-compose.yml):

- Host: `localhost`
- Port: `5432`
- Database: `taskmanager`
- Username: `taskmanager`
- Password: `taskmanager123`

Connection string: `postgresql://taskmanager:taskmanager123@localhost:5432/taskmanager?schema=public`

## Additional Documentation

- **[CHANGES.md](./CHANGES.md)** - Detailed list of all improvements, new features, and architectural decisions
- **[AI_MAGIC_ASSISTANT.md](./AI_MAGIC_ASSISTANT.md)** - Technical documentation for the AI feature
- **[ASSIGNMENT.md](./ASSIGNMENT.md)** - Original assignment requirements

## Notes

- The application is set up for development. For production, ensure proper environment variables and security configurations.
- The database is seeded with sample data for testing purposes.
- CORS is enabled for development. Adjust for production needs.

## Troubleshooting

**Database issues:**

- Ensure Docker is running: `docker ps`
- Ensure PostgreSQL container is up: `npm run db:docker:up`
- Check container logs: `docker logs task-manager-db`
- Reset database: `npm run db:docker:down && npm run db:docker:up && npm run db:migrate`
- Ensure Prisma client is generated: `npm run db:generate`

**Port conflicts:**

- Backend default: 5000 (change in `.env`)
- Frontend default: 5173 (change in `vite.config.ts`)

**Module not found errors:**

- Run `npm install` in both frontend and backend directories
- Ensure Prisma client is generated in backend

**AI features not working:**

- Ensure `GEMINI_API_KEY` is set in backend `.env`
- Check API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
- AI features are optional - app works without them

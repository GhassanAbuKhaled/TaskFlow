# TaskFlow API Integration

This document explains how the TaskFlow frontend integrates with the REST API backend.

## API Configuration

The API service is configured in `src/lib/api.js`. It uses axios to handle HTTP requests and includes:

- Base URL configuration
- Authentication token handling via interceptors
- Centralized error handling
- Organized API endpoints by resource type

## Authentication Flow

1. **Login**: 
   - User submits credentials to `/api/auth/login`
   - On success, JWT token is stored in localStorage
   - User is redirected to Dashboard

2. **Registration**:
   - User submits registration form to `/api/auth/register`
   - On success, user is redirected to Login page

3. **Authentication State**:
   - Global auth state is managed via AuthContext
   - Protected routes redirect unauthenticated users to login

4. **Logout**:
   - Removes token from localStorage
   - Redirects to login page

## Task Management

Tasks are managed through these endpoints:

- `GET /api/tasks` - Fetch all tasks
- `GET /api/tasks/{id}` - Fetch a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task
- `PATCH /api/tasks/{id}/status` - Update task status

## State Management

- `AuthContext` - Manages user authentication state
- `TaskContext` - Manages tasks data and operations

## Error Handling

- API errors are caught and displayed to users
- Loading states are shown during API operations
- Form validation errors are displayed inline

## Running the Application

1. Start the backend server (Spring Boot)
2. Install frontend dependencies:
   ```
   npm install
   ```
3. Start the frontend development server:
   ```
   npm run dev
   ```
4. Access the application at http://localhost:8080

## API Endpoints Reference

### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - Logout (optional, handled client-side)

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/status` - Update task status

### Users (if implemented)
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
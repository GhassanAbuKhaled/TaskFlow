# TaskFlow - Task Management Application

A beautiful and calming task management application built with React, TypeScript, and shadcn-ui.

## Features

- Create, edit, and delete tasks
- Filter and sort tasks by status, priority, and due date
- Track task progress with a dashboard
- Demo mode for trying the app without registration
- Backend API integration with authentication
- Responsive design for mobile and desktop
- Light and dark mode support
- Beautiful, calming UI design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```sh
git clone <repository-url>
cd TaskManagement
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:8080
```

## Usage

- **Dashboard**: View task statistics and recent tasks
- **Tasks**: View, filter, and manage all tasks
- **Create Task**: Add new tasks with title, description, status, priority, due date, and tags
- **Edit Task**: Update existing task details
- **Toggle Status**: Click the status icon to cycle through todo, in-progress, and completed states
- **Demo Mode**: Try the app without registration (see [Demo Mode documentation](./docs/DEMO_MODE.md))

## Technologies Used

- React
- TypeScript
- Vite
- shadcn-ui (UI components)
- Tailwind CSS (styling)
- Framer Motion (animations)
- React Router (routing)
- Axios (API requests)
- JWT Authentication
- Context API for state management

## Project Structure

- `/src/components`: Reusable UI components
- `/src/contexts`: React context providers
- `/src/pages`: Application pages
- `/src/hooks`: Custom React hooks
- `/src/lib`: Utility functions

## License

This project is licensed under the MIT License.
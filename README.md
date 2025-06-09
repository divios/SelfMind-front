# SelfMind Frontend

A modern todo list application built with React, TypeScript, and Vite. This application provides a user-friendly interface for managing tasks and to-dos with a beautiful and intuitive design.

## Features

- Create, read, update, and delete todo items
- Organize todos with categories and priorities
- Mark todos as complete/incomplete
- Set due dates and reminders
- Filter and search todos
- Modern, responsive UI with dark mode support
- Real-time updates and synchronization
- Copy to clipboard functionality
- API integration for backend services

## Tech Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Development Setup

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Create environment files
# Create .env for development
cp .env.template .env
# Edit .env with your development values

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Deployment

### Docker Deployment

The application can be deployed using Docker. The Dockerfile is configured for a multi-stage build that optimizes the production build.

1. Build the Docker image:
```sh
# For production
docker build -t zpl-converter .

# For development
docker build --build-arg NODE_ENV=development -t zpl-converter .
```

2. Run the container:
```sh
docker run -p 80:80 zpl-converter
```

### Environment Variables in Docker

When deploying with Docker, you can provide environment variables in several ways:

1. Using a .env file:
```sh
docker run --env-file .env.production -p 80:80 selfmind-frontend
```

2. Using environment variables directly:
```sh
docker run -e VITE_API_BASE_URL=https://api.example.com -e VITE_API_KEY=your_key -p 80:80 selfmind-frontend
```

### Production Build

For a production build without Docker:

```sh
# Create production environment file
cp .env.example .env.production
# Edit .env.production with your production values

# Build the application
npm run build

# The built files will be in the 'dist' directory
```

### Important Notes

- Never commit `.env` or `.env.production` files to version control
- Keep your API keys secure and rotate them regularly
- Use different API keys for development and production environments
- The application uses environment variables that are embedded at build time
- For local development, use the development environment variables
- For production deployment, always use production environment variables

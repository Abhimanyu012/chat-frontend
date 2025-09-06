# Real-time Chat Application Frontend

This is the frontend for a real-time chat application built with:

- **React**: UI library
- **Zustand**: State management
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Socket.IO Client**: Real-time messaging

## Features

- User authentication (login, signup)
- User profile management
- Real-time messaging
- Online/offline status
- Image uploads in messages

## Environment Setup

The application requires the following environment variables:

```
VITE_API_URL=https://your-backend-url.com/api
VITE_SOCKET_URL=https://your-backend-url.com
VITE_NODE_ENV=development|production
```

## Deployment

This repository is deployed on Vercel. The application works with the backend API at https://chat-backend-u3z3.onrender.com.

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

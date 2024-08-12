# Task Management System

## Overview

The Task Management System is a web application designed to help users manage and organize their tasks effectively. It features a modern UI with responsive design, Google authentication, task reminders, and task searching, filtering, and sorting capabilities. The application is primarily built using the following major technologies:

- **Next.js**: A React framework for server-side rendering and static site generation.
- **MongoDB**: A NoSQL database for storing user tasks.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Socket.IO**: A library for real-time, bidirectional communication between the server and clients.

## Features

- **Task Management**: Users can create, update, delete, and filter tasks based on status (To Do, In Progress, Done).
- **Google Authentication**: Users can log in using their Google account. User sessions are managed to ensure persistence even after page refreshes.
- **Responsive Design**: The application is fully responsive, adapting to different screen sizes and devices.
- **Modern UI**: The application has a clean and modern user interface, with a black-themed design and custom-styled components.
- **Search**: Tasks can be searched by their title and description.
- **Filter**: Tasks can be filtered based on their status.
- **Sort**: Tasks can be sorted by title, status, or due date.
- **Reminder Notifications**: Users receive reminders via browser notifications 10 minutes before the task's due date.

**Note:** Some files in this project use `require` type imports to ensure compatibility with `server.js`. These imports are necessary for the server-side functionality and may differ from the standard `import` syntax used elsewhere in the project.
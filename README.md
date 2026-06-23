# TaskManager - React Native App

A simple task management mobile app built with React Native and Expo.

## What was implemented

### Core Features
- Task list screen with all tasks displayed
- Add new task with title and description
- Mark tasks as completed / not completed
- Delete tasks with confirmation
- Task detail screen showing full task information
- Input validation (title min 3 chars, description required)
- Empty state when no tasks exist
- Fetch suggested tasks from public API (jsonplaceholder.typicode.com)

### Bonus Features
- Search tasks by title (real-time)
- Filter tasks by status (All / Active / Completed)
- Tasks stored locally on device using AsyncStorage
- Navigation between screens using React Navigation (Stack)

## Tech Stack
- React Native with JavaScript
- Expo SDK 56
- React Navigation (Stack)
- AsyncStorage (local storage)

## Setup Instructions

### Prerequisites
- Node.js installed
- Expo Go app on your phone (optional)

### Steps

1. Clone the repository
   git clone https://github.com/blendinamuhadri/TaskManager.git

2. Navigate to project folder
   cd TaskManager

3. Install dependencies
   npm install

4. Start the app
   npx expo start

5. Open in browser
   npx expo start --web

   Or scan QR code with Expo Go app on your phone.

## Screenshots

### Empty State
![Empty State](screenshots/Screenshot__855_.png)

### Task List
![Task List](screenshots/Screenshot__851_.png)

### Completed Filter
![Filter](screenshots/Screenshot__852_.png)

### Search
![Search](screenshots/Screenshot__853_.png)

### Task Detail
![Detail](screenshots/Screenshot__854_.png)

## Project Structure

TaskManager/
├── src/
│   ├── screens/
│   │   ├── TaskListScreen.js
│   │   └── TaskDetailScreen.js
│   ├── components/
│   │   ├── TaskItem.js
│   │   └── EmptyState.js
│   ├── hooks/
│   │   └── useTasks.js (removed - logic moved to screen)
│   └── utils/
│       ├── storage.js
│       └── api.js
├── App.js
└── README.md


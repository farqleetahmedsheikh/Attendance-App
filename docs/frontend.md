# Frontend Documentation

## Overview

- **Tech Stack:** React, Vite
- **Features:** UI for managing students, teachers, classes, subjects, attendance, parents, PTMs.

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Directory Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── index.html
└── vite.config.js
```

## Notes

- Connects to backend API at the URL specified in environment/config files.
- Uses React Router for navigation.

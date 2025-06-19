# Backend Documentation

## Overview

- **Tech Stack:** Node.js, Express, MySQL
- **Features:** RESTful APIs for students, teachers, classes, subjects, attendance, parents, PTMs.
- **Authentication:** JWT-based
- **File Uploads:** Multer

## Setup

1. Configure `.env` with your MySQL credentials and JWT secret.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm start
   ```

## Directory Structure

```
backend/
├── controllers/
├── middleware/
├── routes/
├── uploads/
├── connection.js
├── index.js
└── .env
```

## API Reference

See `API.txt` in the project root for endpoint details.

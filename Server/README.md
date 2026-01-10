# LearnAssess - Server

A Node.js/Express backend API for the LearnAssess learning assessment platform.

## Features

- User authentication and authorization
- Material management
- Quiz management and assessment
- Interview experience sharing
- Admin dashboard functionality

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server will run on http://localhost:5000
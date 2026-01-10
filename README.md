# LearnAssess

A comprehensive learning assessment platform that helps users prepare for technical interviews and assessments through interactive quizzes, study materials, and interview experiences.

## Features

- **Interactive Quizzes**: Take timed quizzes with instant feedback
- **Study Materials**: Access PDF materials and learning resources
- **Interview Experiences**: Share and learn from real interview experiences
- **Progress Tracking**: Monitor your learning progress and quiz performance
- **Admin Dashboard**: Manage content and view analytics
- **User Dashboard**: Personalized learning experience

## Tech Stack

### Frontend
- React 19 with Vite
- React Router for navigation
- Lucide React for icons
- PDF.js for document viewing
- Modern CSS with responsive design

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- bcryptjs for password hashing
- Multer for file uploads

## Project Structure

```
LearnAssess/
├── Client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── styles/
│   └── package.json
├── Server/          # Express backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LearnAssess
   ```

2. **Setup Backend**
   ```bash
   cd Server
   npm install
   # Create .env file with MongoDB URI and JWT secret
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd ../Client
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Usage

1. **Register/Login** as a user or admin
2. **Browse Materials** and take quizzes
3. **Track Progress** in your dashboard
4. **Share Interview Experiences** (users)
5. **Manage Content** (admins)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the ISC License.
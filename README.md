# 🎓 LearnAssess

<div align="center">
  <img src="https://img.shields.io/badge/React-19.2.0-blue.svg" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-18+-green.svg" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-9.1.1-green.svg" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Express-5.2.1-lightgrey.svg" alt="Express"/>
  <img src="https://img.shields.io/badge/License-ISC-yellow.svg" alt="License"/>
  <br>
  <img src="https://img.shields.io/badge/Deployed%20on-Render-46e3b7.svg" alt="Render"/>
  <img src="https://img.shields.io/badge/Status-Live-brightgreen.svg" alt="Status"/>
</div>

---

## 🚀 Live Demo

🌐 **[Visit LearnAssess](https://learnassess.vercel.app/)**

> **Experience the platform live!** Take quizzes and explore materials.

---

## ✨ Overview

**LearnAssess** is a cutting-edge learning assessment platform designed to revolutionize learning through interactive assessments. Built with modern web technologies, it provides an immersive environment where users can master skills through interactive quizzes and comprehensive study materials.

Whether you're a student mastering new skills or an educator managing learning content, LearnAssess offers a seamless, intuitive experience that adapts to your needs.

---

## 🎯 Key Features

### 🎮 Interactive Learning Experience
- **🧠 Smart Quizzes**: Take dynamic quizzes with instant feedback and detailed explanations
- **📚 Rich Materials**: Access PDF documents and multimedia learning resources
- **📊 Advanced Analytics Dashboard**: Comprehensive quiz analytics with:
  - 📈 **Interactive Charts**: Score distribution (doughnut), performance trends (line), quiz comparisons (bar)
  - 📋 **Detailed Results Table**: Complete quiz history with scores, timing, and performance metrics
  - 🎯 **Performance Insights**: Average scores, highest achievements, and progress tracking
  - 📱 **Responsive Design**: Black & white themed analytics accessible on all devices

### 👥 Dual-User System
- **👨‍🎓 Students**: Personalized learning paths, quiz attempts, progress tracking, submit feedback
- **👨‍🏫 Admins**: Content management, user analytics, platform oversight, review feedback

### 🎨 Modern UI/UX
- **📱 Responsive Design**: Seamless experience across all devices
- **🎨 Sophisticated Styling**: Professional black & white theme with clean card layouts
- **🌙 Intuitive Interface**: Clean, modern design with smooth animations
- **♿ Accessibility**: WCAG compliant with keyboard navigation support

---

## 🛠️ Tech Stack

### 🎨 Frontend
```javascript
⚡ React 19.2.0        // Latest React with concurrent features
🚀 Vite 7.2.4         // Lightning-fast build tool
🧭 React Router 7.11.0 // Declarative routing
🎯 Lucide React 0.562.0 // Beautiful, customizable icons
📊 Chart.js 4.x + React-Chartjs-2 // Interactive data visualization
📄 PDF.js 5.4.530     // Advanced PDF viewing capabilities
🎨 Modern CSS3         // Responsive, component-based styling
```

### ⚙️ Backend
```javascript
🚀 Node.js + Express 5.2.1  // High-performance server
🍃 MongoDB + Mongoose 9.1.1 // Flexible NoSQL database
🔐 JWT 9.0.3               // Secure authentication
🔒 bcryptjs 3.0.3          // Password hashing
📁 Multer 1.4.5            // File upload handling
🌐 CORS 2.8.5              // Cross-origin resource sharing
```

### 📦 Additional Tools
- **ESLint** - Code quality and consistency
- **Dotenv** - Environment configuration
- **Render** - Cloud deployment platform

---

## 🏗️ Architecture

```
📁 LearnAssess/
├── 🎨 Client/                    # React Frontend Application
│   ├── 📱 src/
│   │   ├── 🧩 components/        # Reusable UI Components
│   │   │   ├── common/          # Shared Components (Navbar, Button, Card)
│   │   │   └── [user|admin]/    # Role-specific Components (QuizAnalytics, MaterialCard)
│   │   ├── 📄 pages/            # Route Components
│   │   │   ├── auth/            # Login, Signup
│   │   │   ├── user/            # Student Dashboard, Materials, Quizzes
│   │   │   └── admin/           # Admin Dashboard, Content Management
│   │   ├── 🔄 context/          # React Context for State Management
│   │   ├── 🎨 styles/           # Global Styles & Variables
│   │   └── 🛠️ utils/           # Helper Functions
│   └── ⚙️ package.json
│
├── ⚙️ Server/                    # Express Backend API
│   ├── 📊 models/               # MongoDB Schemas
│   │   ├── 👤 User.js           # User authentication & profiles
│   │   ├── 📚 Material.js       # Learning materials & resources
│   │   ├── 🧠 Quiz.js           # Quiz structure & questions
│   │   ├── 📈 QuizResult.js     # Quiz attempts & scoring
│   │   ├── 💬 Feedback.js       # User feedback system
│   ├── 🛣️ routes/               # API Route Handlers
│   │   ├── 🔐 authRoutes.js     # Authentication endpoints
│   │   ├── 📚 materialRoutes.js # Material CRUD operations
│   │   ├── 🧠 quizRoutes.js     # Quiz management
│   │   ├── 💬 feedbackRoutes.js # Feedback operations
│   ├── 🛡️ middleware/           # Custom Middleware
│   │   └── 🔐 auth.js           # JWT authentication middleware
│   ├── 📁 uploads/              # File storage directory
│   └── 🚀 server.js             # Main application entry point
│
└── 📖 README.md                 # Project documentation
```

---

## 🚀 Quick Start

### 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local or cloud instance) - [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** - [Download here](https://git-scm.com/)
- **npm** or **yarn** package manager

### ⚡ Installation & Setup

#### 1. 📥 Clone the Repository
```bash
git clone https://github.com/your-username/learnassess.git
cd LearnAssess
```

#### 2. 🛠️ Backend Setup

```bash
# Navigate to server directory
cd Server

# Install dependencies
npm install

# Create environment file
touch .env

# Add your configuration to .env
echo "MONGO_URI=mongodb://localhost:27017/learnassess
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000" > .env

# Start the server
npm start
```

**Expected Output:**
```
Connected to MongoDB
Server running on port 5000
```

#### 3. 🎨 Frontend Setup

```bash
# Open new terminal and navigate to client directory
cd ../Client

# Install dependencies (includes Chart.js for analytics)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v7.2.4 ready in 300ms
➜ Local:   http://localhost:5173/
➜ Network: http://192.168.1.xxx:5173/
➜ press h + enter to show help
```

#### 4. 🌐 Access Your Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 📖 Usage Guide

### 👤 User Registration & Authentication

1. **Visit** the application at http://localhost:5173
2. **Click** "Sign Up" to create a new account
3. **Fill** in your details (username, email, password, name)
4. **Login** with your credentials

### 🎓 Student Experience

1. **Dashboard**: View your learning progress and recent activities
2. **Materials**: Browse and download study materials (PDFs, documents)
3. **Quizzes**: Take interactive quizzes with instant feedback
4. **Analytics**: Access detailed performance analytics
5. **Feedback**: Submit suggestions, bug reports, or general feedback
6. **Progress**: Track your quiz scores and learning milestones

### 👨‍🏫 Admin Experience

1. **Content Management**: Add, edit, delete learning materials and quizzes

---

## 🔌 API Documentation

### Authentication Endpoints
```
POST /api/auth/register  # User registration
POST /api/auth/login     # User login
```

### Materials API
```
GET    /api/materials           # Get all materials
POST   /api/materials           # Upload new material (Admin)
GET    /api/materials/:id       # Get specific material
PUT    /api/materials/:id       # Update material (Admin)
DELETE /api/materials/:id       # Delete material (Admin)
```

### Quizzes API
```
GET    /api/quizzes             # Get all quizzes
POST   /api/quizzes             # Create new quiz (Admin)
GET    /api/quizzes/:id         # Get specific quiz
PUT    /api/quizzes/:id         # Update quiz (Admin)
DELETE /api/quizzes/:id         # Delete quiz (Admin)
```

### Quiz Results API
```
GET    /api/quiz-results        # Get all results
POST   /api/quiz-results        # Submit quiz result
GET    /api/quiz-results/:userId # Get user results
```

### Feedback API
```
GET    /api/feedbacks           # Get all feedbacks
POST   /api/feedbacks           # Submit new feedback
GET    /api/feedbacks/:id       # Get specific feedback
PUT    /api/feedbacks/:id       # Update feedback (Owner only)
DELETE /api/feedbacks/:id       # Delete feedback (Owner only)
```


---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `Server` directory:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/learnassess


# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000

# Optional: File Upload Limits
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

### Database Models

The application uses the following MongoDB collections:

- **Users**: Authentication and profile data
- **Materials**: Learning resources and documents
- **Quizzes**: Quiz structure with questions and answers
- **QuizResults**: User quiz attempts and scores
- **Feedbacks**: User submitted feedback and reports


---

## 🧪 Testing

```bash
# Run frontend tests
cd Client
npm test

# Run backend tests (if implemented)
cd ../Server
npm test
```

---

## 🚀 Deployment

### Production Deployment on Render

The application is configured for easy deployment on Render:

1. **Connect Repository**: Link your GitHub repository to Render
2. **Configure Services**:
   - **Web Service**: Frontend (static site)
   - **Web Service**: Backend API
   - **Database**: MongoDB Atlas
3. **Environment Variables**: Set production environment variables
4. **Deploy**: Automatic deployments on git push

### Build Commands

```bash
# Frontend build
cd Client && npm run build

# Backend serves static files from Client/dist
cd Server && npm start
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 📋 Contribution Guidelines

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes and test thoroughly
4. **Commit** your changes: `git commit -m 'Add amazing feature'`
5. **Push** to the branch: `git push origin feature/amazing-feature`
6. **Open** a Pull Request

### 🐛 Bug Reports & Feature Requests

- **Bug Reports**: Use the issue template with detailed reproduction steps
- **Feature Requests**: Describe the feature and its benefits
- **Questions**: Check existing issues or start a discussion

### 📝 Code Style

- Follow ESLint configuration
- Use meaningful variable and function names
- Add comments for complex logic
- Write tests for new features

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

```
ISC License

Copyright (c) 2026 LearnAssess

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
```

---

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **MongoDB** for the flexible database solution
- **Render** for reliable hosting
- **Open Source Community** for inspiration and tools

---



<div align="center">

**Made with ❤️ for learners worldwide**

⭐ **Star this repo** if you found it helpful!

[⬆️ Back to Top](#-learnassess)

</div>
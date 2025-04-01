# SchoolHub - A Comprehensive School Management System

SchoolHub is a **web-based School Management System** built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It is designed to streamline administrative tasks, enhance communication, and improve class organization, providing a seamless experience for **administrators & teachers.

---

## ✨ Features

### 👨‍💼 Admin Dashboard
- **User Management**: Create, edit, and remove students, teachers, and administrators.
- **Class & Subject Management**: Organize and manage classes, subjects, and timetables.
- **System Configuration**: Define academic settings, grading structures, and term schedules.
- **Data Analytics & Reports**: Generate reports on student performance, attendance, and overall school insights.
- **Messaging System**: Send announcements and updates to staff, students, and parents.

### 👩‍🏫 Teacher Portal
- **Attendance Tracking**: Mark and manage student attendance with daily and monthly tracking.
- **Performance Assessment**: Record grades, assignments, and track student progress.
- **Class Management**: View and manage assigned classes, subjects, and student lists.
- **Communication System**: Directly message students and collaborate with other staff members.


---

## 🛠 Technologies Used

### **Frontend**
- **React.js** - Fast and scalable UI development.
- **Redux Toolkit** - State management for a smooth user experience.
- **React Router** - Navigation and routing for different user roles.
-
- **Chart.js** - Data visualization for reports and analytics.

### **Backend**
- **Node.js** - JavaScript runtime for server-side execution.
- **Express.js** - Minimal and fast web framework for handling API requests.
- **Mongoose** - ODM for interacting with MongoDB efficiently.
- **JWT (JSON Web Token)** - Secure authentication and authorization.
- **Bcrypt.js** - Password hashing for secure user credentials.

### **Database**
- **MongoDB** - NoSQL database for flexible and scalable data storage.
- **MongoDB Atlas** - Cloud-based database management.

### **Other Tools & Services**
- **Git & GitHub** - Version control and collaboration.
- **Postman** - API testing and debugging.

---

## 🚀 Installation Guide

### **Prerequisites**
Ensure you have the following installed on your system:
- **Node.js** (v14 or higher)
- **MongoDB** (local or Atlas)
- **Git**

### **Setup Instructions**

#### **1. Clone the Repository**
```bash
git clone https://github.com/rsnj5/SchoolHub.git
cd SchoolHub
```

#### **2. Backend Setup**
```bash
cd backend
npm install
```

#### **3. Configure Environment Variables**
Create a `.env` file in the backend directory and add:
```env
MONGO_URL=mongodb://127.0.0.1/school
JWT_SECRET=your_jwt_secret_key
PORT=5000
```
*(Replace `MONGO_URL` with your MongoDB Atlas connection string if using cloud storage.)*

#### **4. Start Backend Server**
```bash
npm start
```

#### **5. Frontend Setup**
Open a new terminal window and run:
```bash
cd ../frontend
npm install
```

#### **6. Start Frontend Development Server**
```bash
npm start
```

#### **7. Access the Application**
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📂 Project Structure

```
SchoolHub/
├── backend/                  # Backend server code
│   ├── config/              # Database and middleware configuration
│   ├── controllers/         # Route controllers
│   ├── models/              # MongoDB schemas and models
│   ├── routes/              # API routes for authentication, users, etc.
│   ├── middleware/          # Authentication & authorization middleware
│   ├── utils/               # Helper functions and utilities
│   ├── .env                 # Environment variables
│   ├── server.js            # Main server file
│   └── package.json         # Backend dependencies
│
├── frontend/                # Frontend React application
│   ├── public/              # Static assets
│   ├── src/                 # React source code
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application pages (Dashboard, Profile, etc.)
│   │   ├── redux/           # State management with Redux Toolkit
│   │   ├── styles/          # CSS files and themes
│   │   ├── utils/           # Helper functions for frontend
│   │   ├── hooks/           # Custom React hooks
│   │   └── App.js           # Main application component
│   ├── .env                 # Environment variables for frontend
│   ├── package.json         # Frontend dependencies
│   └── index.js             # Main entry point
│
└── README.md                # Project documentation
```

---



---

## 📄 License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.


---



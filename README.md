# 🎓 Outpass Portal

A comprehensive digital outpass management system for educational institutions, enabling students to request outpasses and administrators to manage them efficiently.

## 📋 Overview

The Outpass Portal is a full-stack web application that streamlines the process of requesting, approving, and tracking student outpasses. It provides role-based access control for Students, Wardens, and Security Guards with real-time notifications and approval workflows.

## ✨ Features

### 👨‍🎓 Student Features
- **Create Outpass Requests** - Submit outpass requests with reason, destination, and time details
- **Track Status** - Real-time tracking of outpass approval status
- **View History** - Complete history of all outpass requests with filtering options
- **Profile Management** - Update personal information and contact details
- **Dashboard Statistics** - View pending, approved, and rejected outpass counts
- **Late Return Tracking** - Automatic flagging of late returns

### 👔 Warden Features
- **Approve/Reject Outpasses** - Review and process student outpass requests
- **Add Comments** - Provide feedback or reasons for approval/rejection
- **Dashboard Analytics** - View statistics of pending and processed outpasses
- **Student Management** - View student profiles and outpass history
- **Bulk Actions** - Efficiently manage multiple outpass requests

### 🔒 Security Guard Features
- **Verify Outpasses** - Validate approved outpasses at exit/entry points
- **Mark Exit/Entry** - Record actual exit and return times
- **View Active Outpasses** - List of currently active approved outpasses
- **Dashboard Overview** - Real-time status of students outside campus

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - Modern UI library
- **React Router DOM 7.13.1** - Client-side routing
- **Vite** - Fast build tool and dev server
- **Bootstrap 5.3.8** - Responsive design framework
- **Font Awesome 7.2.0** - Professional icon library
- **Axios 1.13.6** - HTTP client
- **React Hot Toast 2.6.0** - Toast notifications
- **date-fns 4.1.0** - Date formatting and manipulation

### Backend
- **Spring Boot 4.0.3** - Java backend framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database ORM
- **MySQL** - Relational database
- **JWT (jjwt 0.12.6)** - Token-based authentication
- **Lombok** - Reduce boilerplate code
- **Java 21** - Latest LTS Java version

## 🏗️ Architecture

```
outpass-portal/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   └── common/      # Shared components (Navbar, Modals, etc.)
│   │   ├── context/         # React Context (AuthContext)
│   │   ├── pages/           # Route-based page components
│   │   │   ├── auth/        # Login, Register
│   │   │   ├── student/     # Student dashboard, create outpass, history
│   │   │   ├── warden/      # Warden dashboard, pending approvals
│   │   │   └── security/    # Security guard dashboard
│   │   ├── routes/          # Route definitions and PrivateRoute
│   │   ├── services/        # API service layer (axios)
│   │   └── utils/           # Constants and utilities
│   └── vite.config.js       # Vite configuration
│
└── backend/                 # Spring Boot backend
    ├── src/main/java/com/outpass/portal/
    │   ├── config/          # Security, CORS configuration
    │   ├── controller/      # REST API endpoints
    │   ├── dto/             # Data Transfer Objects
    │   ├── model/           # JPA entities
    │   ├── repository/      # Database repositories
    │   ├── security/        # JWT filters, authentication
    │   ├── service/         # Business logic layer
    │   └── util/            # Utility classes
    └── src/main/resources/
        ├── application.properties
        └── schema.sql       # Database schema
```

## 🚀 Getting Started

### Prerequisites
- Java 21 or higher
- Node.js 18+ and npm
- MySQL 8.0+
- Maven 3.8+

### Backend Setup

1. **Clone the repository**
```bash
git clone <https://github.com/yuvii-b/outpass-portal>
cd outpass-portal/backend
```

2. **Configure MySQL Database**
```bash
mysql -u root -p
CREATE DATABASE outpass_db;
```

3. **Update application.properties**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/outpass_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

4. **Run the backend**
```bash
./mvnw spring-boot:run
```
Backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd outpass-portal/frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

4. **Run development server**
```bash
npm run dev
```
Frontend will start on `http://localhost:5173`

## 🔐 Authentication

The application uses JWT-based authentication with the following roles:

- **STUDENT** - Students can create and manage their outpass requests
- **WARDEN** - Wardens can approve/reject outpass requests
- **SECURITY_GUARD** - Security guards can verify and mark exit/entry

### Default Credentials for Testing
Create users via the registration page or use SQL:
```sql
-- Password should be bcrypt-encoded
INSERT INTO users (email, password, role, name, phone, department)
VALUES ('student@college.edu', '$2a$10$...', 'STUDENT', 'John Doe', '1234567890', 'CSE');
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Student APIs
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update profile
- `POST /api/student/outpass` - Create outpass request
- `GET /api/student/outpass/history` - Get outpass history
- `GET /api/student/outpass/stats` - Get statistics

### Warden APIs
- `GET /api/warden/outpasses/pending` - Get pending outpasses
- `PUT /api/warden/outpasses/{id}/approve` - Approve outpass
- `PUT /api/warden/outpasses/{id}/reject` - Reject outpass

### Security APIs
- `GET /api/security/outpasses/active` - Get active outpasses
- `PUT /api/security/outpasses/{id}/mark-exit` - Mark exit time
- `PUT /api/security/outpasses/{id}/mark-entry` - Mark entry time

## 🎨 UI/UX Features

- **Monotone Theme** - Professional dark slate color scheme (#1a202c, #2d3748)
- **Responsive Design** - Mobile-first approach with Bootstrap
- **Font Awesome Icons** - Consistent, scalable icon system
- **Enhanced Date Picker** - User-friendly date/time selection
- **Toast Notifications** - Real-time feedback for user actions
- **Loading States** - Clear feedback during async operations
- **Card-based Layout** - Organized information presentation

## 🌐 Deployment

### Frontend Build
```bash
cd frontend
npm run build
```
The production build will be in `frontend/dist/`

### Nginx Configuration
```nginx
# Frontend
location /outpass-portal/ {
    alias /path/to/frontend/dist/;
    try_files $uri $uri/ /outpass-portal/index.html;
}

# Backend API Proxy
location /api/outpass-portal/ {
    proxy_pass http://localhost:8080/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

### Cloudflare Tunnel
Configure cloudflared to expose your nginx server:
```bash
cloudflared tunnel --url http://localhost:80
```

### Backend Deployment
Package as JAR:
```bash
cd backend
./mvnw clean package
java -jar target/portal-0.0.1-SNAPSHOT.jar
```

Or run as a service using systemd on Linux. (preferred)

## 📊 Database Schema

### Main Tables
- **users** - User accounts (students, wardens, security guards)
- **outpasses** - Outpass requests and their status
- **outpass_history** - Audit trail of status changes

For complete schema, see [schema.sql](backend/src/main/resources/schema.sql)

## 📝 Configuration Files

- `frontend/vite.config.js` - Vite build configuration with base path
- `frontend/.env` - Environment variables for API URL
- `backend/application.properties` - Spring Boot configuration
- `backend/pom.xml` - Maven dependencies and build settings

## 📄 License

This project is created for educational purposes.

## 👥 Authors

- **Yuvaraj B** - Initial work and full-stack development

**Built with ❤️ using React and Spring Boot**

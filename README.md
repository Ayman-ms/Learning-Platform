# 📚 Learning Platform

A modern, full-featured online learning platform built with Angular and .NET Core. It enables students to browse and enroll in courses, while providing administrators with complete control over content and user management.

---

## 🚀 Features

### 👨‍🎓 For Students
- 🧑‍💻 Sign up and sign in
- 📚 Browse and enroll in available courses
- 🔍 Search and filter courses by category
- 🧾 View detailed course descriptions
- ✉️ Contact form for inquiries

### 👩‍🏫 For Admins
- 🔐 Secure admin login
- 📊 Dashboard with an overview of platform statistics
- 👨‍🏫 Manage teachers: add, edit, or remove
- 📘 Manage courses: create, update, delete
- 🏷️ Manage categories: organize courses into categories
- 👥 Manage students and view enrollments

---

## 🛠️ Technologies Used

### 🔧 Frontend
- Angular 15+
- TypeScript
- Reactive Forms
- PrimeNG UI components
- SCSS

### 🔩 Backend
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server

### ☁️ Other
- JWT Authentication
- RESTful APIs
- File upload for user photos
- Role-based access control

---

## 📂 Project Structure

```plaintext
/ClientApp         # Angular frontend
│
└── /src
    ├── /app
    │   ├── /components
    │   ├── /services
    │   ├── /models
    │   └── app-routing.module.ts
│
/API               # .NET Core backend
├── /Controllers
├── /Models
├── /Data
├── /DTOs
└── Startup.cs

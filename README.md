# UniSync - Smart Campus Management System

A comprehensive platform for managing university resources, support tickets, and bookings.

## 🚀 Quick Start

**Just cloned the project?** Start here: [QUICK-START.md](QUICK-START.md)

## 📚 Documentation

- **[QUICK-START.md](QUICK-START.md)** - Get up and running in 5 minutes
- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[DATABASE-SETUP.md](DATABASE-SETUP.md)** - Database configuration and user creation

## ⚡ Features

- User Management (Admin, Student, Technician roles)
- Support Ticket System
- Resource Booking
- Resource catalogue bulk import (CSV upload)
- Notifications
- Google OAuth Authentication

## 📥 Bulk Resource Import (CSV)

Admins can import resources in bulk from a CSV file.

- **Endpoint**: `POST /api/resources/import/csv` (multipart form-data)
- **Form field**: `file`
- **Required headers**: `name,type,capacity,location,availableFrom,availableTo`
- **Optional headers**: `description,status,visibleTo,assignedUsers`
- **Sample file**: `docs/resource-import-sample.csv`

## 🛠️ Tech Stack

- **Backend:** Spring Boot, MySQL, JWT
- **Frontend:** React, Vite
- **Authentication:** Google OAuth 2.0

## 📋 Prerequisites

- Java 17+
- MySQL 8.0+
- Node.js 18+
- Maven

## 🔑 First Time Setup

1. Create database: `CREATE DATABASE smartcampus_db;`
2. Copy `.env.example` to `.env` and configure
3. Start backend: `./mvnw.cmd spring-boot:run`
4. **Create users:** Edit and run `create-my-users.sql`
5. Start frontend: `cd frontend && npm install && npm run dev`

**Important:** You must create users in the database before you can login! See [DATABASE-SETUP.md](DATABASE-SETUP.md)

## 🐛 Troubleshooting

### Can't login?
- Make sure you created users in the database
- Your Google email must match an email in the `users` table
- Run: `SELECT * FROM users;` to verify users exist

### Database connection failed?
- Check MySQL is running
- Verify credentials in `.env` file
- Ensure database `smartcampus_db` exists

See [SETUP.md](SETUP.md) for more troubleshooting tips.

## 📞 Support

Check the documentation files or contact the development team.

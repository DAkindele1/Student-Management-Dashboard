# Database Setup Guide

## PostgreSQL Connection Configuration

The Student Management Dashboard requires a PostgreSQL database. Follow these steps to configure it:

### Step 1: Verify PostgreSQL is Running

Check if PostgreSQL is accessible:
```bash
# Test port 5432
Test-NetConnection -ComputerName localhost -Port 5432
```

### Step 2: Get Your PostgreSQL Credentials

Find your PostgreSQL connection details:
- **Username** (default: `postgres`)
- **Password** (set during PostgreSQL installation)
- **Host** (default: `localhost`)
- **Port** (default: `5432`)

### Step 3: Update `.env` File

Edit `backend/.env` and update the `DATABASE_URL`:

```
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/student_management"
```

**Examples:**

If your PostgreSQL user is `postgres` with password `mypassword`:
```
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/student_management"
```

If using no password (common in local dev):
```
DATABASE_URL="postgresql://postgres@localhost:5432/student_management"
```

### Step 4: Initialize the Database

After updating the `.env` file, run:

```bash
cd backend
npx prisma db push
npm run prisma:seed
```

This will:
1. Create the `student_management` database
2. Apply the Prisma schema (tables: User, Class, Student)
3. Seed the admin user and sample data

**Seeded Admin Account:**
- Email: `admin@school.com`
- Password: `Password123!`

### Step 5: Verify Connection

Test the backend:
```bash
npm run dev
```

You should see:
```
API running on port 4000
```

Then test the login endpoint:
```bash
Invoke-RestMethod -Method Post -Uri 'http://localhost:4000/api/auth/login' `
  -ContentType 'application/json' `
  -Body '{"email":"admin@school.com","password":"Password123!"}'
```

## Troubleshooting

### "Authentication failed" Error
- Verify your PostgreSQL username and password in the `DATABASE_URL`
- Make sure PostgreSQL is running
- Check port 5432 is accessible

### "User was denied access" Error
- The database user might not have permission to create databases
- Try creating the database manually:
  ```sql
  CREATE DATABASE student_management;
  ```

### Database Already Exists
If you get an error about the database already existing:
```bash
# Drop and recreate
npx prisma db push --force-reset
```

## Windows PostgreSQL Setup

If PostgreSQL is not installed, download it from [postgresql.org](https://www.postgresql.org/download/windows/)

Common installation paths:
- C:\Program Files\PostgreSQL\16

During installation, remember the password you set for the `postgres` user.

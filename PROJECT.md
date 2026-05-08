# EduManage - Production-Grade SaaS Education Management System

## 🚀 What is EduManage?
**EduManage** is a modern, high-performance SaaS platform designed to streamline and automate the operations of educational institutions, coaching centers, and skill development institutes. 

Built with a **multi-tenant architecture**, it allows multiple organizations to manage their own branches, students, staff, and financial records within a single, secure ecosystem. The platform emphasizes **visual excellence** through a premium glassmorphic dashboard and a robust, type-safe backend.

---

## 💡 Why It Exists (The Problem & Solution)
Educational institutions often struggle with fragmented data, manual fee tracking, and complex admission workflows. EduManage was built to:
- **Centralize Operations**: Move from spreadsheets and manual logs to a unified digital system.
- **Automate Financials**: Handle complex installment plans, generate professional receipts, and track pending dues automatically.
- **Scale Seamlessly**: Support multi-branch operations with granular Role-Based Access Control (RBAC).
- **Enhance Communication**: Integrated wallet system for SMS, Email, and WhatsApp marketing to keep students and parents informed.

---

## 📍 Where It Is Right Now (Current Status)

### ✅ Core Infrastructure
- **Next.js 15/16 + Prisma + SQLite**: High-performance stack with type-safe database operations.
- **NextAuth integration**: Secure authentication with support for Email/Password and Google OAuth (pending final implementation).
- **Multi-Tenant System**: Complete Organization and Branch management logic.
- **RBAC Middleware**: Robust role verification (Super Admin, Branch Admin, User).

### ✅ Key Modules Status Matrix
| Module | Status | Features |
| :--- | :--- | :--- |
| **Auth & Security** | 🟢 Ready | NextAuth, JWT, RBAC Middleware, Organization context |
| **Admission System** | 🟢 Ready | Multi-step form, Student IDs, Document uploads |
| **Fee & Installments** | 🟢 Ready | Installment logic, Receipt generation, Payment tracking |
| **Courses & Batches** | 🟢 Ready | Subject mapping, Batch timings, Multi-course support |
| **CRM (Leads/Enquiry)** | 🟢 Ready | Lead pipelines, Source tracking, Conversion flow |
| **Staff & HR** | 🟡 Partial | Profile management, Payroll config, Attendance (Staff) |
| **Attendance** | 🟡 Partial | Student daily tracking, status reports |
| **Communication** | 🟡 Partial | Email integration via Resend, Wallet system (Models only) |
| **Academic (Timetable)** | 🔴 Planned | Weekly schedules, Teacher mapping |
| **Examination** | 🔴 Planned | Result processing, Marksheets |
| **Expenses** | 🔴 Planned | Basic expenditure tracking |

### ✅ UI/UX
- **Premium Design**: Dark-mode ready glassmorphic interface using Tailwind CSS 4 and Framer Motion.
- **Data Visualization**: Real-time revenue charts and student growth metrics using Recharts.
- **Advanced Tables**: Headless data grids with TanStack Table for sorting, filtering, and pagination.

---

## 🛠️ Technology Stack
| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Next.js 16 (App Router), Framer Motion, Tailwind CSS 4 |
| **Backend** | Next.js Server Actions, Prisma ORM, NextAuth.js |
| **Database** | SQLite (Development), Prisma |
| **UI Components** | shadcn/ui, Radix UI, Lucide Icons |
| **Utilities** | TanStack Query/Table, Zod, React Hook Form, Zustand |
| **Services** | Resend (Emails), Sharp (Image Processing) |

---

## 🗺️ Roadmap: What Should We Do Now?

### 1. 🛡️ Security & Auth Hardening
- Complete Google OAuth integration in `LoginForm.tsx`.
- Implement full email verification flow using the existing `Otp` model.

### 2. 📊 Advanced Financials
- **Expense Management**: Bridge the `expenses` directory with actual database models.
- **Financial Reports**: Exportable PDF/Excel reports for GST, Revenue, and Pending Dues.

### 3. 🎓 Academic Expansion
- **Examination Module**: Create models and UI for managing exams, marks, and result generation.
- **Attendance Automation**: QR-based or biometric integration for student attendance.

### 4. 📢 Communication Hub
- Activate the **Wallet System**: Implement the logic to deduct from `textBalance` and `emailBalance` when sending notifications.
- **WhatsApp Integration**: Connect a WhatsApp API provider to the marketing balance system.

### 5. 📱 Student/Staff Portal
- Create a restricted view for students to check their own attendance, installments, and notifications.

---

## 📁 Key Project Structure
- `src/app/admin`: Core dashboard and management modules.
- `src/lib/services`: Business logic layer (The "Brain" of the app).
- `src/lib/types`: Centralized TypeScript definitions for the entire project.
- `src/hooks`: Custom data fetching and state hooks (e.g., `useDashboard`, `useAuth`).
- `prisma/schema.prisma`: The source of truth for the database architecture.

---

*This document serves as the high-level technical and business summary of the EduManage project.*

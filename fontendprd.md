📄 FRONTEND PRD
🏦 Small Finance Loan Management System

Tech Stack: React.js + Tailwind CSS
Type: Responsive Web Application

🎯 1. Objective

Ek user-friendly, responsive aur secure UI build karna jisme:

Users loan apply kar sake

Admin/Subadmin approvals manage kare

EMI tracking & payments ho

Document upload + OCR auto-fill ho

👥 2. User Roles (Frontend Behavior)
👤 User

Profile create karega

Loan apply karega

EMI track karega

Payment karega

🧑‍💼 Subadmin

Loan requests dekhega

Offline EMI collect karega

👑 Admin

Full control

Loan approve/reject

Interest set karega

📱 3. UI/UX Principles

Mobile-first design 📱

Clean dashboard UI

Minimal clicks flow

Real-time status indicators

Fully responsive (mobile, tablet, desktop)

🎨 4. Design System
Colors

Primary: Blue (#2563EB)

Success: Green

Danger: Red

Warning: Yellow

Components

Buttons (Primary / Secondary / Disabled)

Cards (Loan, EMI, Profile)

Modals (Confirmations)

Tables (Admin panel)

Forms (Input + Validation)

🧱 5. Page Structure
🔐 5.1 Auth Pages
📌 Login Page

Email / Mobile

Password

Login Button

Role-based redirect

📌 Register Page

Name

Email

Password

Confirm Password

🏠 5.2 Dashboard
👤 User Dashboard

Profile Status

Active Loans

EMI Summary

Apply Loan Button

👑 Admin Dashboard

Total Users

Loan Requests

Active Loans

Pending Approvals

🧑‍💼 Subadmin Dashboard

Assigned Collections

Pending EMI

🧾 5.3 Profile Creation Page
Features:

Aadhaar Upload (Front + Back)

OCR Auto-fill:

Name

DOB

Aadhaar Number

Editable Inputs:

Contact No

Address

Status:

Pending / Approved / Rejected

💰 5.4 Loan Application Page

Loan Type Dropdown

Personal

Business

Amount Input

Duration (Months)

Submit Button

📊 5.5 Loan Details Page

Loan Amount

Interest Rate

Total Payable

Status:

Pending

Approved

Rejected

Confirmation Required

✅ 5.6 Loan Confirmation Page

Interest %

Charges

Total EMI

Accept / Reject Button

📅 5.7 EMI Dashboard
User View:

EMI List

Amount

Due Date

Status (Paid / Pending / Late)

Payment Button (Razorpay)

Admin/Subadmin View:

Mark EMI as Paid

Mark as Collected (Offline)

💳 5.8 Payment Page

Razorpay Integration Button

Payment Status

📄 5.9 PDF Download Section

User can download:

Profile Details

Loan Summary

EMI Schedule

Admin can download:

All user data

Loan reports

🛠️ 5.10 Admin Panel
Features:

User Management

Loan Approval

Interest Setup Form

EMI Management

🚚 5.11 Collection Module (Subadmin)

Assigned Users List

Collect EMI Button

Mark as Collected

🔁 6. State Management

Use:

React Context API OR Redux Toolkit

State:

Auth State

User Data

Loan Data

EMI Data

🌐 7. API Integration

Use:

Axios

Endpoints:

Auth APIs

Profile APIs

Loan APIs

EMI APIs

Payment APIs

📦 8. Folder Structure (React)
src/
│
├── components/
│   ├── common/
│   ├── forms/
│   ├── ui/
│
├── pages/
│   ├── auth/
│   ├── dashboard/
│   ├── profile/
│   ├── loan/
│   ├── emi/
│   ├── admin/
│
├── services/
│   ├── api.js
│
├── context/
│   ├── AuthContext.jsx
│
├── hooks/
├── utils/
├── App.jsx
🎯 9. Responsiveness Strategy
Mobile:

Stack layout

Bottom navigation

Tablet:

Grid (2 columns)

Desktop:

Sidebar + content layout

⚡ 10. Performance Optimization

Lazy loading (React.lazy)

Image compression (Aadhaar upload)

Debounced API calls

🔐 11. Security (Frontend Level)

Token storage (HTTP-only cookies preferred)

Protected routes

Role-based UI rendering

🧪 12. Validation

Form validation (React Hook Form / Yup)

File validation (size/type)

Required fields check

🔔 13. Notifications UI

Toast messages

Alerts:

Loan approved

EMI due

Payment success

🚀 14. Future Enhancements

Dark mode 🌙

Multi-language support

Charts (Loan analytics)

Push notifications
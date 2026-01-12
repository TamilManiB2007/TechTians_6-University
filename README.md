# 🎓 University 360 Portal

[React](https://img.shields.io/badge/React-18.x-blue)
[Vite](https://img.shields.io/badge/Vite-5.x-purple)
[TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
[Node.js](https://img.shields.io/badge/Node.js-18.x-green)
[MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
[License](https://img.shields.io/badge/License-MIT-yellow)

> A modern, full-stack university management system featuring an immersive **Virtual 360° Campus Tour**, Student Dashboard, and AI-powered assistance. Built with **MERN Stack** and **TypeScript** for scalability and type safety.

---



## ✨ Key Features

🔐 Role-Based Authentication: Secure login for students and admins using **JWT** (JSON Web Tokens) and secure password hashing.
🏫 Virtual 360° Tour: Integrated **Pannellum** viewer to explore campus facilities (Library, Entrance, Labs) remotely.
🤖 AI Assistant: Lightweight client-side AI helper to guide users through portal navigation.
⚡ TypeScript Backend: Robust API built with Express.js and TypeScript, featuring strong typing for Requests/Responses and Mongoose Models.
🛠️ Developer Ready: Includes custom **Database Seeding scripts** to instantly generate dummy data for testing.
📱 Responsive UI: Built with React + Vite for lightning-fast loading and mobile compatibility.

---

## 🏗️ Tech Stack

### Frontend
Framework: React (Vite)
Language: :TypeScript / JavaScript
360 Viewer Pannellum
Styling: CSS Modules / Tailwind (Optional)

### Backend
Runtime: Node.js
Framework: Express.js
Language: TypeScript
Database: MongoDB (Mongoose ODM)
Auth: JWT & Bcrypt

---

## 📂 Repository Structure

```bash
├── backend/                # Express + TypeScript Server
│   ├── src/
│   │   ├── app.ts          # Server entry point
│   │   ├── routes/         # API Endpoints (Auth, Students)
│   │   └── seed.ts         # Database Seeding Script
│   ├── data/
│   │   └── students.csv    # Mock credentials for seeding
│   └── .env.example        # Backend config example
│
├── src/                    # React Frontend
│   ├── pages/
│   │   ├── StudentPortal.tsx
│   │   └── Facilities.tsx  # Contains Pannellum Logic
│   ├── assets/             # Stores 360° Panorama Images
│   └── main.tsx
└── vite.config.ts          # Vite Configuration

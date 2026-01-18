# TaskFlow - Real-time Task Manager

A modern task management application built with **Next.js**, **Firebase**, and **React**. Users can sign up, log in, and manage their tasks with real-time synchronization.

## Features

- 🔐 **User Authentication** - Email/Password signup and login with Firebase
- 📝 **Task Management** - Create, view, and delete tasks in real-time
- ⚡ **Real-time Updates** - Instant task synchronization using Firestore
- 🌙 **Dark Mode** - Toggle between light and dark themes on landing page
- 👤 **User-specific Tasks** - Each user sees only their own tasks (isolated by email)
- 💬 **Testimonials** - Social proof section with user reviews
- 📱 **Responsive Design** - Works seamlessly on all devices

## Tech Stack

- **Frontend:** Next.js 14, React, JavaScript
- **Backend:** Firebase (Firestore Database, Authentication)
- **Styling:** CSS-in-JS with inline styles
- **Package Manager:** npm

## Getting Started

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- Firebase account

### Installation

```bash
# Navigate to project directory
cd next-basics

# Install dependencies
npm install

# Configure Firebase
# Update  with your Firebase credentials:
# - apiKey
# - authDomain
# - projectId
# - storageBucket
# - messagingSenderId
# - appId

# Run development server
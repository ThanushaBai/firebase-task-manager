"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/src/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const styles = {
    page: {
      minHeight: "100vh",
      backgroundColor: darkMode ? "#0f172a" : "#f8fafc",
      color: darkMode ? "#f8fafc" : "#0f172a",
      transition: "0.3s",
      fontFamily: "Arial",
    },
    button: {
      padding: "10px 16px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      backgroundColor: darkMode ? "#38bdf8" : "#0f172a",
      color: darkMode ? "#0f172a" : "#f8fafc",
    },
    card: {
      border: "1px solid #cbd5f5",
      padding: "20px",
      borderRadius: "10px",
      width: "220px",
      textAlign: "center",
    },
    testimonialCard: {
      border: `1px solid ${darkMode ? "#334155" : "#cbd5f5"}`,
      padding: "20px",
      borderRadius: "10px",
      width: "280px",
      textAlign: "center",
      backgroundColor: darkMode ? "#1e293b" : "#ffffff",
      boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)",
    },
  };

  const testimonials = [
    {
      name: "virat",
      role: "Project Manager",
      text: "TaskFlow has completely transformed how I manage my team's daily tasks. The real-time updates are game-changing!",
      rating: 5,
    },
    {
      name: "saniya",
      role: "Developer",
      text: "As a developer, I appreciate how clean and efficient TaskFlow is. Firebase integration is seamless.",
      rating: 5,
    },
    {
      name: "elena",
      role: "Entrepreneur",
      text: "Simple, elegant, and powerful. TaskFlow is exactly what I needed to stay organized.",
      rating: 4,
    },
  ];

  const handleAuth = async () => {
    setError("");
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      localStorage.setItem("userEmail", email);
      router.push("/tasks");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          borderBottom: "1px solid #cbd5f5",
        }}
      >
        <h2>TaskFlow</h2>
        <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
          <a href="#home" style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>Home</a>
          <a href="#features" style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>Features</a>
          <a href="#testimonials" style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>Testimonials</a>
          <a href="#contact" style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>Contact Us</a>
          <button
            style={styles.button}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          padding: "120px 20px",
        }}
      >
        <h1 style={{ fontSize: "36px", marginBottom: "16px" }}>
          Real-time Task Manager
        </h1>

        <p style={{ fontSize: "18px", maxWidth: "600px", margin: "auto" }}>
          A simple task management application with real-time updates
          powered by Firebase and built using Next.js.
        </p>

        <button
          style={{ ...styles.button, marginTop: "30px" }}
          onClick={() => setShowLogin(true)}
        >
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap",
          padding: "100px 20px",
        }}
      >
        <div style={styles.card}>
          <h3>⚡ Real-time Updates</h3>
          <p>Instant task sync using Firestore</p>
        </div>

        <div style={styles.card}>
          <h3>🗑 Add & Delete Tasks</h3>
          <p>Manage tasks easily</p>
        </div>

        <div style={styles.card}>
          <h3>🔥 Firebase Powered</h3>
          <p>Fast & reliable backend</p>
        </div>
      </section>

      <section style={{ marginTop: "100px", padding: "100px 20px", textAlign: "center" }}>
        <h2>Why TaskFlow?</h2>

        <p style={{ maxWidth: "600px", margin: "20px auto", color: "#555" }}>
          TaskFlow helps you manage your daily tasks efficiently with real-time
          updates powered by Firebase. Built using modern technologies like Next.js,
          it ensures fast performance and smooth user experience.
        </p>

        <p style={{ maxWidth: "600px", margin: "20px auto", color: "#555" }}>
          This project demonstrates real-time data synchronization, CRUD operations,
          authentication flow, and clean UI design — making it ideal for modern web
          applications.
        </p>
      </section>

      {/* Testimonials Section */}
      <section style={{ marginTop: "120px", padding: "100px 20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "50px" }}>What Our Users Say</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            flexWrap: "wrap",
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} style={styles.testimonialCard}>
              <div style={{ marginBottom: "10px" }}>
                {"⭐".repeat(testimonial.rating)}
              </div>
              <p style={{ fontStyle: "italic", marginBottom: "15px", fontSize: "14px" }}>
                &quot;{testimonial.text}&quot;
              </p>
              <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
                {testimonial.name}
              </p>
              <p style={{ fontSize: "13px", color: "#888" }}>
                {testimonial.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: darkMode ? "#1e293b" : "#f1f5f9",
          padding: "60px 20px 20px",
          borderTop: "1px solid #cbd5f5",
          marginTop: "80px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "40px", marginBottom: "40px" }}>
            {/* Company Info */}
            <div>
              <h3 style={{ marginBottom: "15px" }}>TaskFlow</h3>
              <p style={{ maxWidth: "250px", fontSize: "14px", color: "#666" }}>
                Your ultimate task management solution with real-time updates powered by Firebase.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ marginBottom: "15px" }}>Quick Links</h4>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: "8px" }}><a href="#home" style={{ textDecoration: "none", color: "inherit" }}>Home</a></li>
                <li style={{ marginBottom: "8px" }}><a href="#features" style={{ textDecoration: "none", color: "inherit" }}>Features</a></li>
                <li style={{ marginBottom: "8px" }}><a href="#testimonials" style={{ textDecoration: "none", color: "inherit" }}>Testimonials</a></li>
                <li><a href="#contact" style={{ textDecoration: "none", color: "inherit" }}>Contact Us</a></li>
              </ul>
            </div>

            {/* Contact Information */}
            <div id="contact">
              <h4 style={{ marginBottom: "15px" }}>Contact Us</h4>
              <p style={{ marginBottom: "10px", fontSize: "14px" }}>
                📧 Email: <a href="mailto:info@taskflow.com" style={{ textDecoration: "none", color: "#38bdf8" }}>info@taskflow.com</a>
              </p>
              <p style={{ marginBottom: "10px", fontSize: "14px" }}>
                📱 Phone: <a href="tel:+1234567890" style={{ textDecoration: "none", color: "#38bdf8" }}>+1 (234) 567-890</a>
              </p>
              <p style={{ marginBottom: "10px", fontSize: "14px" }}>
                📍 Address: 123 Tech Street, Tech City, TC 12345
              </p>
              <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                <a href="#" style={{ textDecoration: "none", color: "#38bdf8", fontSize: "14px" }}>Twitter</a>
                <a href="#" style={{ textDecoration: "none", color: "#38bdf8", fontSize: "14px" }}>LinkedIn</a>
                <a href="#" style={{ textDecoration: "none", color: "#38bdf8", fontSize: "14px" }}>Facebook</a>
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #cbd5f5", paddingTop: "20px", textAlign: "center", fontSize: "14px", color: "#666" }}>
            <p>© 2026 TaskFlow. All rights reserved. Built with Next.js & Firebase</p>
          </div>
        </div>
      </footer>

      {showLogin && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: darkMode ? "#020617" : "#fff",
              color: darkMode ? "#fff" : "#000",
              padding: "30px",
              borderRadius: "10px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h3>{isSignUp ? "Sign Up" : "Sign In"}</h3>

            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
            />

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "15px", boxSizing: "border-box" }}
            />

            {error && <p style={{ color: "red", fontSize: "12px", marginBottom: "10px" }}>{error}</p>}

            <button
              style={styles.button}
              onClick={handleAuth}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>

            <p
              style={{ marginTop: "15px", fontSize: "14px", cursor: "pointer", color: "#38bdf8" }}
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </p>

            <p
              style={{ marginTop: "10px", fontSize: "14px", cursor: "pointer" }}
              onClick={() => {
                setShowLogin(false);
                setEmail("");
                setPassword("");
                setError("");
              }}
            >
              Cancel
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "@/src/lib/firebase";
import { signOut } from "firebase/auth";

export default function TasksPage() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get user email from localStorage
    const email = localStorage.getItem("userEmail");
    if (!email) {
      router.push("/");
      return;
    }
    setUserEmail(email);

    // Real-time listener for user-specific tasks
    const q = query(collection(db, "tasks"), where("userEmail", "==", email));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setTasks(taskList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Add task with user email
  const addTask = async () => {
    if (!task.trim()) return;

    await addDoc(collection(db, "tasks"), {
      title: task,
      userEmail: userEmail,
      createdAt: new Date(),
    });

    setTask("");
  };

  // Delete task
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  return (
    <main
      style={{
        padding: "20px",
        maxWidth: "500px",
        margin: "auto",
        fontFamily: "Arial",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>🔥 Real-time Task Manager</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <p style={{ marginBottom: "20px", color: "#666" }}>Logged in as: <strong>{userEmail}</strong></p>

      <input
        type="text"
        placeholder="Enter task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && addTask()}
        style={{ padding: "8px", width: "100%", marginBottom: "10px", boxSizing: "border-box" }}
      />

      <button
        onClick={addTask}
        style={{ padding: "8px", width: "100%", marginBottom: "20px", cursor: "pointer" }}
      >
        Add Task
      </button>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999" }}>No tasks yet. Create one to get started!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((t) => (
            <li
              key={t.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              <span>{t.title}</span>
              <button
                onClick={() => deleteTask(t.id)}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
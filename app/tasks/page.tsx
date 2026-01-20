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
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "@/src/lib/firebase";
import { signOut } from "firebase/auth";

interface Task {
  id: string;
  title: string;
  userEmail: string;
  createdAt: Date;
  dueDate?: string;
  priority: string;
  completed: boolean;
}

export default function TasksPage() {
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      router.push("/");
      return;
    }

    const q = query(collection(db, "tasks"), where("userEmail", "==", email));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Task[];
      setTasks(taskList);
      setUserEmail(email);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);
  const addTask = async () => {
    if (!task.trim()) return;

    await addDoc(collection(db, "tasks"), {
      title: task,
      userEmail: userEmail,
      createdAt: new Date(),
      dueDate: dueDate || null,
      priority: priority,
      completed: false,
    });

    setTask("");
    setDueDate("");
    setPriority("medium");
  };


  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  const toggleTask = async (id: string, completed: boolean) => {
    await updateDoc(doc(db, "tasks", id), {
      completed: !completed,
    });
  };

  const updateTask = async (id: string) => {
    if (!editingTitle.trim()) return;
    await updateDoc(doc(db, "tasks", id), {
      title: editingTitle,
    });
    setEditingId(null);
    setEditingTitle("");
  };

  const filteredTasks = filterPriority === "all" 
    ? tasks 
    : tasks.filter(t => t.priority === filterPriority);

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "high": return "#ef4444";
      case "medium": return "#f59e0b";
      case "low": return "#10b981";
      default: return "#6b7280";
    }
  };


  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#0f172a", margin: 0 }}>🔥 Real-time Task Manager</h1>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 16px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>

        <p style={{ marginBottom: "25px", color: "#666", fontSize: "16px" }}>
          Logged in as: <strong style={{ color: "#0f172a" }}>{userEmail}</strong>
        </p>

        {/* Add Task Form */}
        <div style={{ 
          backgroundColor: "#f8fafc", 
          padding: "20px", 
          borderRadius: "8px", 
          marginBottom: "30px",
          border: "1px solid #e2e8f0"
        }}>
          <h3 style={{ color: "#0f172a", marginTop: 0 }}>Add New Task</h3>
          
          <input
            type="text"
            placeholder="Enter task title..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            style={{ 
              padding: "10px", 
              width: "100%", 
              marginBottom: "12px", 
              boxSizing: "border-box",
              border: "1px solid #cbd5f5",
              borderRadius: "6px",
              fontSize: "14px",
              color: "#0f172a",
              backgroundColor: "#ffffff"
            }}
          />

          <div style={{ display: "flex", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ 
                padding: "10px", 
                flex: 1,
                minWidth: "150px",
                border: "1px solid #cbd5f5",
                borderRadius: "6px",
                fontSize: "14px",
                color: "#0f172a",
                backgroundColor: "#ffffff"
              }}
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{ 
                padding: "10px", 
                border: "1px solid #cbd5f5",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                color: "#0f172a",
                backgroundColor: "#ffffff"
              }}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <button
            onClick={addTask}
            style={{ 
              padding: "10px 20px", 
              width: "100%", 
              marginBottom: "0", 
              cursor: "pointer",
              backgroundColor: "#0f172a",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              fontSize: "14px"
            }}
          >
            ➕ Add Task
          </button>
        </div>

        {/* Filter Section */}
        <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ color: "#666", fontWeight: "bold", alignSelf: "center" }}>Filter by Priority:</span>
          {["all", "high", "medium", "low"].map((priority) => (
            <button
              key={priority}
              onClick={() => setFilterPriority(priority)}
              style={{
                padding: "8px 16px",
                backgroundColor: filterPriority === priority ? "#0f172a" : "#e2e8f0",
                color: filterPriority === priority ? "white" : "#0f172a",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "bold",
                textTransform: "capitalize"
              }}
            >
              {priority}
            </button>
          ))}
        </div>

        {/* Task Stats */}
        <div style={{
          display: "flex",
          gap: "15px",
          marginBottom: "25px",
          flexWrap: "wrap"
        }}>
          <div style={{
            backgroundColor: "#dbeafe",
            padding: "15px",
            borderRadius: "6px",
            textAlign: "center",
            flex: 1,
            minWidth: "100px"
          }}>
            <p style={{ margin: "0 0 5px 0", color: "#666", fontSize: "12px" }}>Total Tasks</p>
            <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#0f172a" }}>{tasks.length}</p>
          </div>
          <div style={{
            backgroundColor: "#dcfce7",
            padding: "15px",
            borderRadius: "6px",
            textAlign: "center",
            flex: 1,
            minWidth: "100px"
          }}>
            <p style={{ margin: "0 0 5px 0", color: "#666", fontSize: "12px" }}>Completed</p>
            <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#0f172a" }}>{tasks.filter(t => t.completed).length}</p>
          </div>
          <div style={{
            backgroundColor: "#fee2e2",
            padding: "15px",
            borderRadius: "6px",
            textAlign: "center",
            flex: 1,
            minWidth: "100px"
          }}>
            <p style={{ margin: "0 0 5px 0", color: "#666", fontSize: "12px" }}>Pending</p>
            <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#0f172a" }}>{tasks.filter(t => !t.completed).length}</p>
          </div>
        </div>

        {/* Task List */}
        {loading ? (
          <p style={{ textAlign: "center", color: "#666" }}>Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999" }}>No tasks yet. Create one to get started!</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredTasks.map((t) => (
              <li
                key={t.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                  padding: "15px",
                  backgroundColor: t.completed ? "#f0fdf4" : "#ffffff",
                  border: `2px solid ${getPriorityColor(t.priority || "medium")}`,
                  borderRadius: "6px",
                  textDecoration: t.completed ? "line-through" : "none",
                  opacity: t.completed ? 0.7 : 1,
                }}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={t.completed || false}
                  onChange={() => toggleTask(t.id, t.completed)}
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                />

                {/* Task Content */}
                <div style={{ flex: 1 }}>
                  {editingId === t.id ? (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        style={{
                          flex: 1,
                          padding: "8px",
                          border: "1px solid #cbd5f5",
                          borderRadius: "4px"
                        }}
                      />
                      <button
                        onClick={() => updateTask(t.id)}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#10b981",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#6b7280",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p style={{ margin: "0 0 5px 0", color: "#0f172a", fontWeight: "500" }}>{t.title}</p>
                      <div style={{ display: "flex", gap: "15px", fontSize: "12px", color: "#666" }}>
                        {t.priority && (
                          <span style={{
                            backgroundColor: getPriorityColor(t.priority),
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "3px",
                            textTransform: "capitalize"
                          }}>
                            {t.priority}
                          </span>
                        )}
                        {t.dueDate && <span>📅 Due: {new Date(t.dueDate).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => {
                      setEditingId(t.id);
                      setEditingTitle(t.title);
                    }}
                    style={{
                      padding: "6px 10px",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteTask(t.id)}
                    style={{
                      padding: "6px 10px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    ❌ Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
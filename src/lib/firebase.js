import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCe5UVKq_XjcOQ7gkUd-IP1iW9U2sFFgRA",
  authDomain: "nextjs-task-manager-6efb3.firebaseapp.com",
  projectId: "nextjs-task-manager-6efb3",
  storageBucket: "nextjs-task-manager-6efb3.firebasestorage.app",
  messagingSenderId: "113682857987",
  appId: "1:113682857987:web:e5f33069475cf04faf8e36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);
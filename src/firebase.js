import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAL5Q-Cp83Bhj_edCfkHrQXLExhCVfO814",
  authDomain: "academic-pro-b72fd.firebaseapp.com",
  projectId: "academic-pro-b72fd",
  storageBucket: "academic-pro-b72fd.firebasestorage.app",
  messagingSenderId: "647549384015",
  appId: "1:647549384015:web:4cab285de9ff249abb413a",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
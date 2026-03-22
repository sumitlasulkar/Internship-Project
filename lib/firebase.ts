/*
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBN4F2QsgIzRYG7_jWyltnbH75UVaY3Xc",
  authDomain: "portfolio-maker-8464a.firebaseapp.com",
  projectId: "portfolio-maker-8464a",
  storageBucket: "portfolio-maker-8464a.firebasestorage.app",
  messagingSenderId: "885985983934",
  appId: "1:885985983934:web:7cbad26ea18784df73cdef",
  measurementId: "G-39109Y2J88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
*/
/*
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Analytics ko abhi skip karte hain kyunki wo server-side pe error deta hai
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDBN4F2QsgIzRYG7_jWyltnbH75UVaY3Xc",
  authDomain: "portfolio-maker-8464a.firebaseapp.com",
  projectId: "portfolio-maker-8464a",
  storageBucket: "portfolio-maker-8464a.firebasestorage.app",
  messagingSenderId: "885985983934",
  appId: "1:885985983934:web:7cbad26ea18784df73cdef",
  measurementId: "G-39109Y2J88"
};

// Singleton pattern: Agar app pehle se initialize hai toh wahi use karo
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

*/
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  // Hum process.env use karenge taaki Vercel dashboard ki keys uth sakein
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Singleton Pattern: Ensure app doesn't initialize multiple times on hot-reload
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google Provider Customization (Optional but good for UX)
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { db, auth, googleProvider };
/*
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, EmailAuthProvider, PhoneAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDBN4F2QsgIzRYG7_jWyltnbH75UVaY3Xc",
  authDomain: "portfolio-maker-8464a.firebaseapp.com",
  projectId: "portfolio-maker-8464a",
  storageBucket: "portfolio-maker-8464a.firebasestorage.app",
  messagingSenderId: "885985983934",
  appId: "1:885985983934:web:7cbad26ea18784df73cdef",
  measurementId: "G-39109Y2J88"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Auth
const googleProvider = new GoogleAuthProvider(); // Initialize Google Provider

export { db, auth, googleProvider };

*/
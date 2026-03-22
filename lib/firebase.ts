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
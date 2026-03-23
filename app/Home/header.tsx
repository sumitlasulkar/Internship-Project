'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/firebase'; // 🚀 Firebase import
import { onAuthStateChanged, signOut } from 'firebase/auth'; // 🚀 Auth methods
import styles from './header.module.css';
import style from './components.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null); // 🚀 User state

  // 1. Check Login Status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. Logout Function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
      window.location.href = "/"; // Logout ke baad home pe bhej do
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <header className={styles.header}>
      {/* Logo */}
      <Link href="/" className={styles.logoLink}>
        <img
          src="/thinkhatch.jpeg"
          alt="Logo"
          className={styles.logo}
        />
      </Link>

      {/* Hamburger */}
      <div
        className={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? '✖' : '☰'}
      </div>

      <nav className={`${styles.nav} ${menuOpen ? styles.active : ''}`}>
        <Link href="/" className={style.button} onClick={() => setMenuOpen(false)}> 💠Home </Link>
        <Link href="/dashboard" className={style.button} onClick={() => setMenuOpen(false)}> 📊 Create </Link>
        
        {/* 🚀 Conditional Links */}
        {user ? (
          <>
            <button 
              onClick={handleLogout} 
              className={style.button} 
              style={{ color: '#ff4d4d', cursor: 'pointer', textAlign: 'left' }}
            > 
              Logout 
            </button>
          </>
        ) : (
          <Link href="/login" className={style.button} onClick={() => setMenuOpen(false)}> Login </Link>
        )}

        <Link href="/ats-checker" className={style.button} onClick={() => setMenuOpen(false)}> ✨Resume ATS </Link>
        <Link href="/opportunities" className={style.button} onClick={() => setMenuOpen(false)}> 🚀 Grow </Link>
        <Link href="/community" className={style.button} onClick={() => setMenuOpen(false)}> 🌐community </Link>
        <Link href="/chatbot" className={style.button} onClick={() => setMenuOpen(false)}> 🤖 Resume AI </Link>
        <Link href="/analytics" className={style.button} onClick={() => setMenuOpen(false)}> Analytics </Link>
        <Link href="/contact" className={style.button} onClick={() => setMenuOpen(false)}> Contact Us </Link>
      </nav>
    </header>
  );
}
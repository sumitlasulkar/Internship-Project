'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <>
        <div className= {styles.footer}>
            <p>
                <a href="/Policies"> Privacy Policy | </a>
                <a href="/terms"> Terms & Conditions </a>
            </p>
        </div>
        <div className= {styles.footer}>
             <p>
                <a href="/about"> About | </a>
                <a href="/contact"> Contact | </a>
                <a href="/"> Home </a>
            </p>
        </div>
        <div className= {styles.footer}>
            <p>
                <a href="/chatbot"> Resume AI | </a>
                <a href="/community"> Community | </a>
                <a href="/guide">  Guidance </a>
            </p>
        </div>
        <div className= {styles.footer}>
            <p> © Thinkhatch 2026 | All rights reserved.</p>
        </div>
        
        </>
    );

}
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
                <a href="/About"> About | </a>
                <a href="/About"> Contact | </a>
                <a href="/"> Home </a>
            </p>
        </div>
        <div className= {styles.footer}>
            <p>
                <a href="/Explore"> Cources | </a>
                <a href="/Search"> Projects | </a>
                <a href="/AI">  Guidance </a>
            </p>
        </div>
        <div className= {styles.footer}>
            <p> © Thinkhatch 2026 | All rights reserved.</p>
        </div>
        
        </>
    );

}
'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './home.module.css'; 
import style from '../button.module.css';

export default function Hero(){
    return(
            <div className= {styles.heroSection}>
                <h3>" Build Smarter with AI "</h3>
                <h5>
                    <a href="/guide"><button className= {style.button}>👤Guidance</button></a>
                    <a href="/chatbot"><button className= {style.button}>🤖 Resume AI </button></a>
                </h5>
                <h4>Tools and guidance for students, Professionals</h4>
                <h4>Let's Create with Thinkhatch</h4>
                <h5>
                    <a href="/dashboard"><button className= {style.button}> Portfolio </button></a>
                    <a href="/dashboard"><button className= {style.button}> Resume </button></a>
                </h5>
                <h4> "Built For Everyone"</h4>
                <div className={styles.buttons}>
                    <a href="/interview"><button className= {style.button}>✨ AI Interview</button></a>
                    <a href="/pathfindeer"><button className= {style.button}>🚀 Pathfinder  </button></a>
                    <a href="/jobs"><button className= {style.button}> 🌐Global Jobs </button></a>
                    <a href="/project"><button className= {style.button}>📊Project</button></a>
                </div>
                <h3>Start Building With Thinkhatch!</h3>
                <h5><a href="/dashboard"><button className={style.button}>Build Now!</button></a></h5>
            </div>
    );
}
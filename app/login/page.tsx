'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider, // 🚀 Naya Import
  signInWithPopup      // 🚀 Naya Import
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  // 🚀 GOOGLE LOGIN LOGIC
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check karo agar user pehle se Firestore mein hai ya nahi
      const docSnap = await getDoc(doc(db, "portfolios", user.uid));
      
      if (!docSnap.exists()) {
        // Naya user hai toh Firestore mein document bana do
        await setDoc(doc(db, "portfolios", user.uid), {
          name: user.displayName,
          email: user.email,
          profilePic: user.photoURL,
          createdAt: new Date()
        });
      }
      
      router.push('/dashboard');
    } catch (err: any) {
      alert("Google Sign-In Error: " + err.message);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "portfolios", user.uid), {
          email: user.email,
          name: email.split('@')[0],
          createdAt: new Date()
        });
      }
      router.push('/dashboard');
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="bg-zinc-900 p-10 rounded-3xl border border-orange-600/20 w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-black italic text-orange-600 mb-2 tracking-tighter text-center">
          {isLogin ? 'SIGN_IN' : 'CREATE_ACCOUNT'}
        </h1>
        
        {/* 🚀 GOOGLE BUTTON */}
        <button 
          onClick={handleGoogleSignIn}
          className="w-full mt-6 bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-200 transition mb-6"
        >
          <img src="thinkhatch.jpeg" width="20" alt="google" />
          CONTINUE_WITH_GOOGLE
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] bg-zinc-800 flex-1"></div>
          <span className="text-zinc-600 text-xs font-bold">OR_USE_EMAIL</span>
          <div className="h-[1px] bg-zinc-800 flex-1"></div>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full bg-black border border-zinc-800 p-4 rounded-xl outline-none focus:border-orange-500"
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-black border border-zinc-800 p-4 rounded-xl outline-none focus:border-orange-500"
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button className="w-full bg-orange-600 py-4 rounded-xl font-bold hover:scale-105 transition shadow-lg shadow-orange-600/20">
            {isLogin ? 'LOG IN' : 'SIGN UP'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-orange-500 text-sm font-semibold hover:underline">
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}


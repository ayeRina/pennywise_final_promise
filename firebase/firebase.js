// firebase/firebase.js

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ✅ Your Firebase config (make sure keys are not exposed in production apps)
const firebaseConfig = {
  apiKey: "AIzaSyAL7jP8SIph6IVVvBnvAKlXYDHuRCq97to",
  authDomain: "pennywise-3bffa.firebaseapp.com",
  projectId: "pennywise-3bffa",
  storageBucket: "pennywise-3bffa.appspot.com",
  messagingSenderId: "475676380260",
  appId: "1:475676380260:web:ea3be5e5d327d539be6371",
  measurementId: "G-ES7RE99GN8"
};

// ✅ Initialize Firebase app once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

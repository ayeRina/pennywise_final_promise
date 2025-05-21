import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAL7jP8SIph6IVVvBnvAKlXYDHuRCq97to",
  authDomain: "pennywise-3bffa.firebaseapp.com",
  projectId: "pennywise-3bffa",
  storageBucket: "pennywise-3bffa.appspot.com",
  messagingSenderId: "475676380260",
  appId: "1:475676380260:web:ea3be5e5d327d539be6371",
  measurementId: "G-ES7RE99GN8"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);

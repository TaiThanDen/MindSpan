import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCL9Rcrn6lSiL-aguuW3FR4OSR01glbSUY",
  authDomain: "mindspan-f4112.firebaseapp.com",
  databaseURL: "https://mindspan-f4112-default-rtdb.firebaseio.com",
  projectId: "mindspan-f4112",
  storageBucket: "mindspan-f4112.firebasestorage.app",
  messagingSenderId: "551821730299",
  appId: "1:551821730299:web:bd159c4e864d576d7d6b5e",
  measurementId: "G-JQ9PW60L4B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAYUJl-iuIySWw9y5qoKw_6n4mAKwnV4c0",
  authDomain: "fleetpulse-3698a.firebaseapp.com",
  databaseURL: "https://fleetpulse-3698a-default-rtdb.firebaseio.com",
  projectId: "fleetpulse-3698a",
  storageBucket: "fleetpulse-3698a.firebasestorage.app",
  messagingSenderId: "397513253585",
  appId: "1:397513253585:web:c0bc7a0d5d4a3dd5639bf0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
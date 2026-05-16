import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDI6Z53repPzBbasbbZEdaZnndKIuuEdT4",
  authDomain: "espire-esports.firebaseapp.com",
  projectId: "espire-esports",
  storageBucket: "espire-esports.firebasestorage.app",
  messagingSenderId: "1067059675791",
  appId: "1:1067059675791:web:3c4511c41f9be37af266fa",
  measurementId: "G-KN10XH1FN9"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Analytics
export const analytics = getAnalytics(app);

// Initialize Auth & Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// YAHAN HAI MAIN FIX: Exporting the functions for Login.tsx
export { 
  signInWithPopup, 
  signInAnonymously, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
};

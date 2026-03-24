// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDI6Z53repPzBbasbbZEdaZnndKIuuEdT4",
  authDomain: "espire-esports.firebaseapp.com",
  projectId: "espire-esports",
  storageBucket: "espire-esports.firebasestorage.app",
  messagingSenderId: "1067059675791",
  appId: "1:1067059675791:web:3c4511c41f9be37af266fa",
  measurementId: "G-KN10XH1FN9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
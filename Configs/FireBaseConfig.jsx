// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACiqF4r2nJtpWoUIBOxSltplIAGwfNN4Q",
  authDomain: "local-shop-directory.firebaseapp.com",
  projectId: "local-shop-directory",
  storageBucket: "local-shop-directory.firebasestorage.app",
  messagingSenderId: "132764792567",
  appId: "1:132764792567:web:9c1fbbafcc7a53004385f2",
  measurementId: "G-ZWCH75DMY4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
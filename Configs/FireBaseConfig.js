// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUfq2vbGQHTL256aqXbtBvFL7y3CCOdq4",
  authDomain: "business-d0612.firebaseapp.com",
  projectId: "business-d0612",
  storageBucket: "business-d0612.firebasestorage.app",
  messagingSenderId: "612844624312",
  appId: "1:612844624312:web:4aa5c492bf0f593637574d",
  measurementId: "G-17Y1ZXTE42"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// const analytics = getAnalytics(app);
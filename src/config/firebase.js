// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPgMa2cQIJJHAD5loZZrQOrn8oGyCtuXQ",
  authDomain: "getfit-79396.firebaseapp.com",
  projectId: "getfit-79396",
  storageBucket: "getfit-79396.firebasestorage.app",
  messagingSenderId: "241827461493",
  appId: "1:241827461493:web:704bb4a0c2d368043ebb3c",
  measurementId: "G-J44KNXJ2BP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
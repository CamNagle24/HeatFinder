// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuKOdwo9Xy9_VtYGBRFs17KMFf4VscCPM",
  authDomain: "heatfinder-2522b.firebaseapp.com",
  projectId: "heatfinder-2522b",
  storageBucket: "heatfinder-2522b.firebasestorage.app",
  messagingSenderId: "943966066490",
  appId: "1:943966066490:web:afd1939411a147b5b5a203"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)

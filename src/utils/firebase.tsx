// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
console.log({ apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY })
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_APP_NAME}.firebaseapp.com`,
    projectId: `${process.env.NEXT_PUBLIC_FIREBASE_APP_NAME}`,
    storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_APP_NAME}.appspot.com`,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: "G-96SHS4SQ70",
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_APP_NAME}-default-rtdb.europe-west1.firebasedatabase.app`,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
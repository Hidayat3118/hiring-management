// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrChyokeEoUOgSP9ElEbZRo_giSmdJ0ZY",
  authDomain: "hiring-management-50c51.firebaseapp.com",
  projectId: "hiring-management-50c51",
  storageBucket: "hiring-management-50c51.firebasestorage.app",
  messagingSenderId: "364857020557",
  appId: "1:364857020557:web:28537ee03811afe587d2c4",
  measurementId: "G-V87F8WNPLP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
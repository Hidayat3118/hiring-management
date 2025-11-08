import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCrChyokeEoUOgSP9ElEbZRo_giSmdJ0ZY",
  authDomain: "hiring-management-50c51.firebaseapp.com",
  projectId: "hiring-management-50c51",
  storageBucket: "hiring-management-50c51.appspot.com",
  messagingSenderId: "364857020557",
  appId: "1:364857020557:web:28537ee03811afe587d2c4",
  measurementId: "G-V87F8WNPLP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };

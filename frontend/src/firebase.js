// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBegUIJUyGOPhdQl-AvcdbnWbMkssr92yA",
  authDomain: "truthlens-2025-76d80.firebaseapp.com",
  projectId: "truthlens-2025-76d80",
  storageBucket: "truthlens-2025-76d80.firebasestorage.app",
  messagingSenderId: "812540429756",
  appId: "1:812540429756:web:182405134ed0d19fe697b9",
  measurementId: "G-K8L9YJJZTP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };

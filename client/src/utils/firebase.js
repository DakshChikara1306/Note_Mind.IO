
import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "authexamnotesai-d7242.firebaseapp.com",
  projectId: "authexamnotesai-d7242",
  storageBucket: "authexamnotesai-d7242.firebasestorage.app",
  messagingSenderId: "871248322025",
  appId: "1:871248322025:web:076f0569a9add6a8b23f78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
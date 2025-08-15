import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Add GoogleAuthProvider
import { getFirestore } from "firebase/firestore"; // Firestore for optional user data storage

const firebaseConfig = {
  apiKey: "AIzaSyDlRuAF8Xb-pRJPVxqy_YZ9Di8dH1bcOnM",
  authDomain: "reactweb-c116f.firebaseapp.com",
  projectId: "reactweb-c116f",
  storageBucket: "reactweb-c116f.firebasestorage.app",
  messagingSenderId: "814782148313",
  appId: "1:814782148313:web:6705601b93863a958c18c8",
  measurementId: "G-WZJNV6DWC1"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider(); // Initialize Google provider

export { auth, db, googleProvider };
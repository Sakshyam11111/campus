import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDlRuAF8Xb-pRJPVxqy_YZ9Di8dH1bcOnM",
  authDomain: "reactweb-c116f.firebaseapp.com",
  projectId: "reactweb-c116f",
  storageBucket: "reactweb-c116f.appspot.com", 
  messagingSenderId: "814782148313",
  appId: "1:814782148313:web:6705601b93863a958c18c8",
  measurementId: "G-WZJNV6DWC1"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// Export so you can use them anywhere
export { auth, googleProvider, db };
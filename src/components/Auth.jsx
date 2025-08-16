
import React, { useState } from "react";
import { auth, googleProvider, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  // Handle signup
  const handleSignup = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        createdAt: new Date().toISOString(),
      });

      alert("Signup successful ✅");
    } catch (error) {
      console.error("Signup Error:", error);
      alert(error.message);
    }
  };

  // Handle login
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful ✅");
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    try {
      const userCred = await signInWithPopup(auth, googleProvider);
      const user = userCred.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: user.displayName || "",
        email: user.email,
        createdAt: new Date().toISOString(),
      }, { merge: true });

      alert("Google login successful ✅");
    } catch (error) {
      console.error("Google Login Error:", error);
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>{isLogin ? "Login" : "Signup"}</h2>
      {!isLogin && (
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={isLogin ? handleLogin : handleSignup}>
        {isLogin ? "Login" : "Signup"}
      </button>

      <button onClick={handleGoogleLogin}>Login with Google</button>

      <p
        style={{ cursor: "pointer", color: "blue" }}
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
      </p>
    </div>
  );
}

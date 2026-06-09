import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "bookmovishow.firebaseapp.com",
  projectId: "bookmovishow",
  storageBucket: "bookmovishow.appspot.com",
  messagingSenderId: "346188799454",
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app, auth, googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} catch (error) {
  console.error("Firebase initialization failed:", error);
  // Create dummy objects to prevent crashes if keys are missing
  auth = {};
  googleProvider = {};
}

export { auth, googleProvider, RecaptchaVerifier, signInWithPhoneNumber };

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;

// Only initialize Firebase when a real API key is present.
// Without this guard, Firebase throws auth/invalid-api-key and crashes the entire app.
let app = null;
let auth = null;

if (apiKey && apiKey !== 'undefined') {
  const firebaseConfig = {
    apiKey,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} else {
  // Stub auth object so AuthContext doesn't crash
  auth = {
    onIdTokenChanged: (cb) => { cb(null); return () => {}; },
    currentUser: null,
  };
}

export { auth, app };

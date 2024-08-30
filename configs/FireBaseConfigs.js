import { initializeApp, getApps, getApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_yppZOWbC3Rb9ClHSybiq7yyxTT5nhY8",
  authDomain: "fir-chat-48a7d.firebaseapp.com",
  projectId: "fir-chat-48a7d",
  storageBucket: "fir-chat-48a7d.appspot.com",
  messagingSenderId: "622042439081",
  appId: "1:622042439081:web:400a94261e063db4ac78b8",
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();  // If already initialized, use that one
}

// Initialize Firebase Auth with React Native persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);  // Use the already initialized Auth instance if error occurs
}

// Initialize Firestore
export const db = getFirestore(app);

// Export auth instance
export { auth };

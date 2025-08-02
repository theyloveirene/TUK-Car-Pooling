// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";


// Web-compatible imports (conditionally import these)
let analytics = null;
let messaging = null;

try {
  const { getAnalytics } = require("firebase/analytics");
  analytics = getAnalytics;
} catch (error) {
  console.log('Analytics not available in this environment');
}

try {
  const { getMessaging } = require("firebase/messaging");
  messaging = getMessaging;
} catch (error) {
  console.log('Messaging not available in this environment');
}

// Firebase config using environment variables
const firebaseConfig = {
  apiKey: "AIzaSyCtldoUoT5S79UUFGBoma5itHNjBHDNp9g",
  authDomain: "tuk-car-pooling.firebaseapp.com",
  projectId: "tuk-car-pooling",
  storageBucket: "tuk-car-pooling.firebasestorage.app",
  messagingSenderId: "114957884318",
  appId: "1:114957884318:web:068de2cfca99159f14548f",
  measurementId: "G-2JGE0X3MVJ"
  }

// Validate config
if (!firebaseConfig.apiKey) {
  throw new Error('Firebase API key is missing. Please check your .env file.');
}


// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);

// Initialize analytics if available
export const getAnalyticsInstance = () => {
  if (analytics && typeof window !== 'undefined') {
    return analytics(app);
  }
  return null;
};

// Initialize Firestore database
export const db = firestore;
enableNetwork(db).catch((error) => {
  console.error("Error enabling Firestore network:", error);
});
// Initialize messaging if available
export const getMessagingInstance = () => {
  if (messaging && typeof window !== 'undefined') {
    return messaging(app);
  }
  return null;
};

export default app;
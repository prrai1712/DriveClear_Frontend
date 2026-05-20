import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export function getFirebaseApp(): FirebaseApp {
  if (!firebaseConfig.apiKey) {
    throw new Error("Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* to .env.local");
  }
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

let emulatorConnected = false;

export function getFirebaseAuth(): Auth {
  const auth = getAuth(getFirebaseApp());
  const emulator = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR;
  if (emulator && !emulatorConnected) {
    const host = emulator.startsWith("http") ? emulator : `http://${emulator}`;
    connectAuthEmulator(auth, host, { disableWarnings: true });
    emulatorConnected = true;
  }
  return auth;
}

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

// src/services/firebaseConfig.ts
import { initializeApp, getApp, getApps } from "firebase/app";
// @ts-ignore: getReactNativePersistence existe no bundle React Native da SDK,
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCz5oFTiDx26O3J-YUKK8FxfMqktTCVNtE",
  authDomain: "mosaico-bdffd.firebaseapp.com",
  projectId: "mosaico-bdffd",
  storageBucket: "mosaico-bdffd.firebasestorage.app",
  messagingSenderId: "705279649458",
  appId: "1:705279649458:web:d002886b7383359e8f4bab",
  measurementId: "G-68TVK8J60E"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };

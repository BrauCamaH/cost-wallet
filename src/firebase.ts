import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage } from "firebase/storage";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
const config: FirebaseConfig = {
  apiKey: "AIzaSyB2PYsWQ0BqXXWuta5VRTKhG1vxYKq4zKY",
  authDomain: "notelink-c75c3.firebaseapp.com",
  projectId: "notelink-c75c3",
  storageBucket: "notelink-c75c3.appspot.com",
  messagingSenderId: "182423058494",
  appId: "1:182423058494:web:f27b11e20f20cbf3ebf96f",
};
const authUrl = "http://127.0.0.1:9099";

const app = initializeApp(config);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, authUrl);
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

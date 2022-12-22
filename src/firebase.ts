import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

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

const app = initializeApp(config);
export const db = getFirestore(app);

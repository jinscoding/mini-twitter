import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCiwCWDlgaNvPtISjwTLp2pXSC3eVc1-Ps",
  authDomain: "mini-twitter-311a8.firebaseapp.com",
  projectId: "mini-twitter-311a8",
  storageBucket: "mini-twitter-311a8.appspot.com",
  messagingSenderId: "635600196344",
  appId: "1:635600196344:web:fb5c8c38722f5f3beee10d",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);

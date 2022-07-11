import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

type Config = {
  apiKey: string;
  authDomain: string;
  databaseURL?: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

let firebaseConfig: Config = {
  apiKey: "AIzaSyCQ-kbnMJIVj-P-oGebmzY0feWZu_i8gyk",
  authDomain: "catchapp-ed8dd.firebaseapp.com",
  projectId: "catchapp-ed8dd",
  storageBucket: "catchapp-ed8dd.appspot.com",
  messagingSenderId: "870843416351",
  appId: "1:870843416351:web:31183a0184820243a47a2a",
  measurementId: "G-JPNVMGH16L",
};

const firebaseApp = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);

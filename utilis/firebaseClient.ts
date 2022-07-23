// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, writeBatch } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTy_8knzQkV-UrAhNWPLkl4N4Ny3lOZHQ",
  authDomain: "create-poll-b371a.firebaseapp.com",
  projectId: "create-poll-b371a",
  storageBucket: "create-poll-b371a.appspot.com",
  messagingSenderId: "144807500102",
  appId: "1:144807500102:web:f9fd1554544a2323abad47",
  measurementId: "G-R9H8G46S5H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const batch = writeBatch(db);

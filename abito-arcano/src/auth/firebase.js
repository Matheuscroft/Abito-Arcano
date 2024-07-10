// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLhjyLzcEswFspbHxxIhVyV4taSzmjMew",
  authDomain: "abito-arcano.firebaseapp.com",
  projectId: "abito-arcano",
  storageBucket: "abito-arcano.appspot.com",
  messagingSenderId: "373198258504",
  appId: "1:373198258504:web:9e8bb40e9de8a74749f37d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage(app);

export const db = getFirestore(app);
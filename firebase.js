// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBz0vfrhL5MHQfbGVcNoo4sTJKg86IxvH8",
  authDomain: "flashcardsaas-dad65.firebaseapp.com",
  projectId: "flashcardsaas-dad65",
  storageBucket: "flashcardsaas-dad65.appspot.com",
  messagingSenderId: "168330152038",
  appId: "1:168330152038:web:dc3421c777e5fe878385a7",
  measurementId: "G-D5JE3DSYMD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app)

export {db}
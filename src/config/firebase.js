// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXdGyqUJwIF5nujfJFqWXs_g9YE8Uf3fw",
  authDomain: "trackingapps-25483.firebaseapp.com",
  projectId: "trackingapps-25483",
  storageBucket: "trackingapps-25483.appspot.com",
  messagingSenderId: "256805038209",
  appId: "1:256805038209:web:930d07e57378439c0b0580",
  measurementId: "G-1JY9Q6EBQB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

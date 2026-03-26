// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA4ax1cmN5dqND4Jyzt9RKVTopEF8DA-h8",
    authDomain: "st-marys-assessment-port-f13d8.firebaseapp.com",
    projectId: "st-marys-assessment-port-f13d8",
    storageBucket: "st-marys-assessment-port-f13d8.firebasestorage.app",
    messagingSenderId: "641013997334",
    appId: "1:641013997334:web:31b60d368e4a8965afba37",
    measurementId: "G-X91VKJCP5T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
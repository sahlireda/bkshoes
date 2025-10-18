// Votre configuration Firebase pour votre application web
// Pour Firebase JS SDK v7.20.0 et versions ultérieures, measurementId est facultatif
const firebaseConfig = {
  apiKey: "AIzaSyADzXsHTHDwI_xmszBwAxwjQ4mXwUQOTnE",
  authDomain: "bkshoesma.firebaseapp.com",
  projectId: "bkshoesma",
  storageBucket: "bkshoesma.firebasestorage.app",
  messagingSenderId: "408692141461",
  appId: "1:408692141461:web:5641ce60201a9834115a9c",
  measurementId: "G-1REM83VRFS"
};

// Initialiser Firebase (SDK v8)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
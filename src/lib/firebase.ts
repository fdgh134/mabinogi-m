import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA-wKRe1T4csgtwt-2vwO42BJvTCXDoZ3U",
  authDomain: "mabinogi-m-1881b.firebaseapp.com",
  projectId: "mabinogi-m-1881b",
  storageBucket: "mabinogi-m-1881b.firebasestorage.app",
  messagingSenderId: "686664479287",
  appId: "1:686664479287:web:c649ec3875bbbc248145b2",
  measurementId: "G-Y0362SWVQJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
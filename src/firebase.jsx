import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQttHAeRlbGUfaXtdlAozdI3U0xn7XpyU",
  authDomain: "sylvan-dragon-140003.firebaseapp.com",
  databaseURL: "https://sylvan-dragon-140003.firebaseio.com",
  projectId: "sylvan-dragon-140003",
  storageBucket: "sylvan-dragon-140003.appspot.com",
  messagingSenderId: "776241463289",
  appId: "1:776241463289:web:e66e98fcaa5b1bdef70728",
  measurementId: "G-KGBZHJ9K6T"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);

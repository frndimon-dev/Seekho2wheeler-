import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAGbROD4YLWMyWkxgR0ZRe8nUW-x2Cei9E",
  authDomain: "seekho2wheeler-11dd4.firebaseapp.com",
  projectId: "seekho2wheeler-11dd4",
  storageBucket: "seekho2wheeler-11dd4.firebasestorage.app",
  messagingSenderId: "826957044553",
  appId: "1:826957044553:web:5133ad8059dc071da7d898"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

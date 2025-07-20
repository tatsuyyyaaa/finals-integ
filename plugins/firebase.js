// plugins/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD27B8oNF6xVvc0U1FmTWjvonovaPWrD1o",
  authDomain: "bgremover-43c03.firebaseapp.com",
  projectId: "bgremover-43c03",
  storageBucket: "bgremover-43c03.appspot.com",
  messagingSenderId: "317754869217",
  appId: "1:317754869217:web:ae97e3281aa468b0513ea0",
  measurementId: "G-2WNFXT7RXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);

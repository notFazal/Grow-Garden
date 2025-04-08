import { initializeApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig: {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
} = {
  apiKey: "AIzaSyCam33TQJJjNDUl-pgxxn62brMwIC7BsG0",
  authDomain: "focus-garden.firebaseapp.com",
  projectId: "focus-garden",
  storageBucket: "focus-garden.firebasestorage.app",
  messagingSenderId: "313416977238",
  appId: "1:313416977238:web:ad827380e766a98c5824f7",
  measurementId: "G-EM7SN7EZQL"
};

const app = initializeApp(firebaseConfig);
const analytics: Analytics = getAnalytics(app);
export const auth: Auth = getAuth(app);
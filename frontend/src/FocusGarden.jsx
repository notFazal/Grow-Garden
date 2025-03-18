import React from "react";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import "./Login.css";

function FocusGarden() {
  return (
    <h1>Focus Garden</h1>
  );
}

export default FocusGarden;

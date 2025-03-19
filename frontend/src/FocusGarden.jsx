import React from "react";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import './FocusGarden.css'

function FocusGarden() {
	const navigate = useNavigate();
	const FocusGardenPath = () => {
		navigate('/'); 
	};
  return (
    <div className = "FocusGarden">
		<div className="FGDiv">
			<h1 className = "gardenTitle">Focus Garden </h1>
			<button onClick={FocusGardenPath}className="buttonFG">LeaderBoard</button>
		</div>
    </div>
  );
}

export default FocusGarden;

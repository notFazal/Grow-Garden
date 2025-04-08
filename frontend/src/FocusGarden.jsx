import React from "react";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import './FocusGarden.css'
import ImageGrid from './imageGrid.jsx'

function FocusGarden() {
	const navigate = useNavigate();
	const farmGrid = 'Farmland.png'
	const FocusGardenPath = () => {
		navigate('/'); 
	};
  return (
    <div className = "FocusGarden">
		<div className="FGDiv">
			<h1 className = "gardenTitle">Focus Garden </h1>
			<button onClick={FocusGardenPath}className="buttonFG">LeaderBoard</button>
			<div className = "GridLocation">
				<ImageGrid/>
			</div>
		</div>
    </div>
  );
}

export default FocusGarden;

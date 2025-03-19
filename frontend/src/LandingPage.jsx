import { StrictMode } from 'react'
import './LandingPage.css'
import SignUp from './SignUp.jsx'
import Login from './Login.jsx'

function LandingPage(){
	return (
	<div className='main'>
		<div className='scaling'>
			<div className="header">
				<h1>Focus Garden</h1>
				<h3>Sign in or Create </h3>
			</div>
			<div className = "loginSignUp">
    	    	<div><Login/></div>
    	    	<div><SignUp /></div>
    		</div>
		</div>
	</div>

	)
} export default LandingPage;

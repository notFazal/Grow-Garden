import { StrictMode } from 'react'
import './LandingPage.css'
import SignUp from './SignUp.jsx'
import Login from './Login.jsx'

function LandingPage(){
	return (
  <StrictMode>
	<div className="header">
		<h1>Focus Garden
		</h1>
		<h3>Sign in or Create 
		</h3>
	</div>
	<div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}>
        <div><Login/></div>
        <div><SignUp /></div>
    </div>
  </StrictMode>
	)
} export default LandingPage;

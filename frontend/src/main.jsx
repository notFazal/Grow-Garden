import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import SignUp from './SignUp.jsx'
import Login from './Login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
	<div className="header">
		<h1>Focus Garden
		</h1>
		<p>Sign in or Create 
		</p>
	</div>
	<div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}>
        <div><Login/></div>
        <div><SignUp /></div>
    </div>
  </StrictMode>,
)

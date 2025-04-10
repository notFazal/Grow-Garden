// LandingPage.tsx
import './LandingPage.css';
import SignUp from './components/SignUp.tsx';
import Login from './components/Login.tsx';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
            <div className='scaling'>
                <div className="header">
                    <h1>Focus Garden</h1>
                    <h3>Sign in or Create </h3>
                </div>
                <div className="loginSignUp">
                    <div><Login /></div>
                    <div><SignUp /></div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
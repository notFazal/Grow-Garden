import SignUp from './components/SignUp.tsx';
import Login from './components/Login.tsx';

const LandingPage: React.FC = () => {
	return (
	<div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-8">
	  <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-10">
		<header className="mb-10 text-center">
		  <div className="flex items-center justify-center gap-2 mb-4">
			<div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white">
			  🌱
			</div>
			<h1 className="text-4xl font-bold text-emerald-800">Focus Garden</h1>
		  </div>
		  <p className="text-emerald-600">Sign in or create your garden to begin growing</p>
		</header>
		<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
		  <div>
			<Login />
		  </div>
		  <div>
			<SignUp />
		  </div>
		</div>
	  </div>
	</div>
	);
};

export default LandingPage;
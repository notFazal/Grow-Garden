import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './LandingPage.jsx';
import FocusGarden from "./FocusGarden.jsx";

// Routes to navigate between pages - App holds all my routes and / is the default path
// So when I go to localhost:/ landing page is the first component that comes up 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
		<Route path="/FocusGarden" element={<FocusGarden/>}/>
      </Routes>
    </BrowserRouter>
  );
}
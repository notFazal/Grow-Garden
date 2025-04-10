// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './LandingPage.tsx';
import FocusGarden from "./FocusGarden.tsx";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/FocusGarden" element={<FocusGarden />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
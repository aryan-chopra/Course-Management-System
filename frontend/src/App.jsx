import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage.jsx'
import SignUp from './pages/SignUp.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
      </Routes>
    </Router>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./components/Applicant/Content/HomePage/HomePage.jsx";
import Login from './components/Applicant/Content/LoginPage/LoginPage.jsx';
import Dashboard from './components/Applicant/Content/Dashboard/Dashboard.jsx';
import SignUp from './components/Applicant/Content/SignUp/SignUp.jsx';
import ForgotPass from './components/Applicant/Content/ForgotPass/ForgotPass.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgotPass" element={<ForgotPass />} />
      </Routes>
    </Router>
  );
}

export default App;

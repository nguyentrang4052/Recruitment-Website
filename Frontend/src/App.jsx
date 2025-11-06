import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./components/Applicant/Content/HomePage/HomePage.jsx";
import Login from './components/Employer/Login/Login.jsx';
import Dashboard from './components/Applicant/Content/Dashboard/Dashboard.jsx';
import SignUp from './components/Applicant/Content/SignUp/SignUp.jsx';
import ForgotPass from './components/Employer/ForgotPassword/ForgotPassword.jsx';
import EmployerLink from './components/Employer/EmployerRegistration/EmployerRegistration.jsx';
import EmployerDashboard from './components/Employer/EmployerDashboard/EmployerDashboard.jsx';
import EmployerRegistration from './components/Employer/EmployerRegistration/EmployerRegistration';
import { GoogleOAuthProvider } from '@react-oauth/google';

import ApplicantDetail from './components/Employer/ApplicantDetail/ApplicantDetail.jsx';

import './App.css';

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (!clientId) {
    console.error("❌ VITE_GOOGLE_CLIENT_ID chưa được định nghĩa trong file .env")
  }
  return (

    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/employer-link" element={<EmployerLink />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/employer-signup" element={<EmployerRegistration />} />


          <Route path="/employer/applicant/:id" element={<ApplicantDetail />} />

        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
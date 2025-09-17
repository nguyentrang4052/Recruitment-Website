import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./components/Applicant/Content/HomePage/HomePage.jsx";
import Login from './components/Applicant/Content/LoginPage/LoginPage.jsx';
import Dashboard from './components/Applicant/Content/Dashboard/Dashboard.jsx';
import SignUp from './components/Applicant/Content/SignUp/SignUp.jsx';
import ForgotPass from './components/Applicant/Content/ForgotPass/ForgotPass.jsx';
import './App.css';

function App() {
  return (
<<<<<<< HEAD
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
=======
    <>
      <Header />
    </>
  )
}
export default App

/*
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import EmployerRegistration from './components/EmployerRegistration/EmployerRegistration';
import EmployerDashboard from './components/EmployerDashboard/EmployerDashboard';
import Login from './components/Login/Login';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<EmployerRegistration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
 */
>>>>>>> 7e621e9811bfb9065b4925fbcdb545d2f5df34d5

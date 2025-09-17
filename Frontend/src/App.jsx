import './App.css'
import Header from "./components/Applicant/Header/Header.jsx";

function App() {

  return (
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
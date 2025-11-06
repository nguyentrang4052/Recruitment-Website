import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from "./components/Applicant/Pages/HomePage/HomePage.jsx"
import Login from './components/Employer/Login/Login.jsx'
import SignUp from './components/Applicant/Content/SignUp/SignUp.jsx'
import ForgotPass from './components/Employer/ForgotPassword/ForgotPassword.jsx'
import EmployerLink from './components/Employer/EmployerDashboard/EmployerDashboard.jsx'
import EmployerDashboard from './components/Employer/EmployerDashboard/EmployerDashboard.jsx'
import Verify from './components/Applicant/Content/SignUp/OtpVerify.jsx'
import EmployerRegistration from './components/Employer/EmployerRegistration/EmployerRegistration'
import RecruitmentDetail from './components/Applicant/Content/RecruitDetail/RecruitDetail.jsx'
import Profile from './components/Applicant/Content/Profile/Profile.jsx'
import Notice from './components/Applicant/Content/Notice/Notice.jsx'
import Setting from './components/Applicant/Content/Setting/Setting.jsx'
import RecruimentNews from './components/Applicant/Content/RecruimentNews/RecruimentNews.jsx'
import CV from './components/Applicant/Content/CV/CV.jsx'
import SaveJob from './components/Applicant/Content/ManageJob/SaveJob/SaveJob.jsx'
import ApplyJob from './components/Applicant/Content/ManageJob/ApplyJob/ApplyJob.jsx'
import OverviewCompany from './components/Applicant/Content/Company/OverviewCompany/OverviewCompany.jsx'
import CompanyDetail from './components/Applicant/Content/Company/CompanyDetail/CompanyDetail.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { LayoutWithHeader, LayoutWithHomePage } from './components/Applicant/Layout.jsx';
import './App.css';
import CompanyReviews from './components/Applicant/Content/Company/CompanyReviews/CompanyReviews.jsx'


function App() {

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (!clientId) {
    console.error("❌ VITE_GOOGLE_CLIENT_ID chưa được định nghĩa trong file .env")
  }



  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>

        <Routes>
          <Route path="/" element={<LayoutWithHomePage />}>
           <Route path="/" element={<RecruimentNews />} />  
            <Route path="/login" element={<Login />} />

            <Route path="/employer-link" element={<EmployerLink />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-otp" element={<Verify />} />
            <Route path="/forgot-password" element={<ForgotPass />} />
            <Route path='/recruitment/:rnid' element={<RecruitmentDetail />} />


          </Route>
          <Route path="/" element={<LayoutWithHeader />}>
             
            <Route path='/recruitment/:rnid' element={<RecruitmentDetail />} />

            <Route path="/dashboard" element={<RecruimentNews />} />
            <Route path="/companies" element={<OverviewCompany/>}/>
            <Route path="/companies/:id" element={<CompanyDetail />} />
            <Route path="/companies/reviews" element={<CompanyReviews/>}/>
            {/* <Route path ='/companies/intro' element={<CompanyDetail/>}/> */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/save-jobs" element={<SaveJob />} />
            <Route path="/apply-jobs" element={<ApplyJob />} />
            <Route path="/notifications" element={<Notice />} />
            <Route path="/settings" element={<Setting />} />
            <Route path="/cv-templates" element={<CV />} />


          </Route>
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />

          <Route path="/employer-signup" element={<EmployerRegistration />} />

        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
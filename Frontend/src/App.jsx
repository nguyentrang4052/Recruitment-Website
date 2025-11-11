import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Employer/Login/Login.jsx'
import ApplicantLogin from './components/Applicant/Login/Login.jsx'
import SignUp from './components/Applicant/Content/SignUp/SignUp.jsx'
import ForgotPass from './components/Employer/ForgotPassword/ForgotPassword.jsx'
import EmployerLink from './components/Employer/EmployerRegistration/EmployerRegistration.jsx'
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
import CompanyReview from './components/Applicant/Content/Company/CompanyReview/CompanyReview.jsx'
import CompanyIntro from './components/Applicant/Content/Company/CompanyIntro/CompanyIntro.jsx'
import CompanyDetail from './components/Applicant/Content/Company/CompanyDetail/CompanyDetail.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { LayoutWithHeader, LayoutWithHomePage } from './components/Applicant/Layout.jsx';
import './App.css';
import CompanyReviewDetail from './components/Applicant/Content/Company/CompanyReviewDetail/ReviewDetail.jsx'
import ApplicantDetail from './components/Employer/ApplicantDetail/ApplicantDetail.jsx';
import AdminDashboard from './components/Admin/Dashboard/Dashboard.jsx'



function App() {


  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (!clientId) {
    console.error("❌ VITE_GOOGLE_CLIENT_ID chưa được định nghĩa trong file .env")
  }

  const RoleRedirect = () => {
    const role = localStorage.getItem('roleName');
    if (role === 'applicant') return <Navigate to="/dashboard" replace />;
    if (role === 'employer') return <Navigate to="/employer-dashboard" replace />;
    return null;
  };



  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>

        <Routes>
          <Route path="/" element={<RoleRedirect />} />
          <Route element={<LayoutWithHomePage />}>
            <Route index element={<RecruimentNews />} />
            <Route path="/login" element={<Login />} />
            <Route path="/applicant-login" element={<ApplicantLogin />} />

            <Route path="/employer-link" element={<EmployerLink />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-otp" element={<Verify />} />
            <Route path="/forgot-password" element={<ForgotPass />} />
            <Route path='/recruitment/:rnid' element={<RecruitmentDetail />} />
            <Route path='/companies' element={<CompanyIntro />} />
            <Route path='/companies/:employerId' element={<CompanyDetail />} />

            <Route path="/companies/reviews/:employerId" element={<CompanyReviewDetail />} />
            <Route path="/companies/reviews" element={<CompanyReview />} />


          </Route>
          <Route element={<LayoutWithHeader />}>

            {/* <Route path='/recruitment/:rnid' element={<RecruitmentDetail />} /> */}

            <Route path="/dashboard" element={<RecruimentNews />} />
            {/* <Route path='/companies' element={<CompanyIntro />} />
            <Route path='/companies/:employerId' element={<CompanyDetail />} />

            <Route path="/companies/reviews/:employerId" element={<CompanyReviewDetail />} />
            <Route path="/companies/reviews" element={<CompanyReview />} /> */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/save-jobs" element={<SaveJob />} />
            <Route path="/apply-jobs" element={<ApplyJob />} />
            <Route path="/notifications" element={<Notice />} />
            <Route path="/settings" element={<Setting />} />
            <Route path="/cv-templates" element={<CV />} />
            


          </Route>
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />

          <Route path="/employer-signup" element={<EmployerRegistration />} />
          <Route path="/employer/applicant/:id" element={<ApplicantDetail />} />
          <Route path = "/admin" element=   {<AdminDashboard/>}/>
          {/* <Route path = "/admin/recruitment" element={<AdminRecruitmentDetail/>}/> */}


        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
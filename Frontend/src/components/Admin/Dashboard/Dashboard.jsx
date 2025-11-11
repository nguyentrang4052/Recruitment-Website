// src/Dashboard.jsx
import React, { useState } from 'react';
import './Dashboard.css';
import { FiHome } from "react-icons/fi";
import { FiUsers } from "react-icons/fi";
import { IoBriefcaseOutline } from "react-icons/io5";
import { FiFileText } from "react-icons/fi";
import { VscPackage } from "react-icons/vsc";
import { MdLogout } from "react-icons/md";
import { LuTriangleAlert } from "react-icons/lu";
import { IoChevronDownOutline } from "react-icons/io5";
import { FiChevronRight } from "react-icons/fi";


import Home from '../Content/Home/Home.jsx';
import Applicant from '../Content/Applicant/Applicant.jsx'
import Employers from '../Content/Employer/Employer.jsx';
import Skills from '../Content/Skill/Skill.jsx';
import Recruitment from '../Content/Recruitment/Recruitment.jsx';
import Packages from '../Content/Package/Package.jsx';
import Reports from '../Content/Report/Report.jsx';

import RecruitmentDetail from '../Content/Recruitment/RecruitmentDetail.jsx';
import ApplicantDetail from '../Content/Applicant/ApplicantDetail.jsx'
import EmployerDetail from '../Content/Employer/EmployerDetail.jsx'




export default function AdminDashboard() {

  const pageMap = {
    home: <Home />,
    applicants: (
      <Applicant
        onViewDetail={(applicant) => {
          setSelectedApplicant(applicant);
          setView('detail');
        }}
      />
    ),
    employers: ( 
      <Employers 
        onViewDetail={(employer) => {
          setSelectedEmployer(employer);
          setView('detail');
        }}
    />
    ),
    skills: <Skills />,
    jobs: (
      <Recruitment
        onViewDetail={(job) => {
          setSelectedJob(job);
          setView('detail');
        }}
      />
    ),
    packages: <Packages />,
    reports: <Reports />,
  };

  const [active, setActive] = useState('home');
  const [umOpen, setUmOpen] = useState(false);

  const [view, setView] = useState('list');        // 'list' | 'detail'
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedEmployer, setSelectedEmployer] = useState(null);

  return (
    <div className="dashboard-container">
      {/* ---------- Sidebar ---------- */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-content">
          </div>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => setActive('home')} className={`nav-button ${active === 'home' ? 'active' : ''}`}>
            <FiHome /><span>Trang chủ</span>
          </button>

          <div>
            <button onClick={() => setUmOpen(s => !s)} className="nav-button nav-button-with-submenu">
              <div className="nav-button-content">
                <FiUsers /><span>Quản lý người dùng</span>
              </div>
              {umOpen ? <IoChevronDownOutline /> : <FiChevronRight />}
            </button>
            {umOpen && (
              <div className="submenu">
                <button onClick={() => setActive('applicants')} className={`submenu-button ${active === 'applicants' ? 'active' : ''}`}>Quản lý ứng viên</button>
                <button onClick={() => setActive('employers')} className={`submenu-button ${active === 'employers' ? 'active' : ''}`}>Quản lý nhà tuyển dụng</button>
              </div>
            )}
          </div>

          <button onClick={() => setActive('skills')} className={`nav-button ${active === 'skills' ? 'active' : ''}`}><FiFileText /> Quản lý kỹ năng</button>
          <button onClick={() => setActive('jobs')} className={`nav-button ${active === 'jobs' ? 'active' : ''}`}><IoBriefcaseOutline /> Quản lý tin tuyển dụng</button>
          <button onClick={() => setActive('packages')} className={`nav-button ${active === 'packages' ? 'active' : ''}`}><VscPackage /> Quản lý gói dịch vụ</button>
          <button onClick={() => setActive('reports')} className={`nav-button ${active === 'reports' ? 'active' : ''}`}><LuTriangleAlert /> Quản lý báo cáo vi phạm</button>
          <button className="logout-button"><MdLogout /> Đăng xuất</button>
        </nav>
      </aside>

      <div className="main-content">
        <header className="header">
          <h2 className="header-title">GZCONNECT</h2>
          <div className="header-actions">

            <div className="user-avatar">A</div>
          </div>
        </header>

        <main className="content-area">
          {view === 'detail' && active === 'jobs' && selectedJob ? (
            <RecruitmentDetail job={selectedJob} onBack={() => setView('list')} />
          ) : view === 'detail' && active === 'applicants' && selectedApplicant ? (
            <ApplicantDetail applicant={selectedApplicant} onBack={() => setView('list')} />
          ) : view === 'detail' && active === 'employers' && selectedEmployer ? (
            <EmployerDetail employer={selectedEmployer} onBack={() => setView('list')} />
          ) : (
            pageMap[active] || <div style={{ textAlign: 'center', paddingTop: '80px' }}>Chọn menu để xem nội dung</div>
          )}
        </main>
      </div>
    </div>
  );
}
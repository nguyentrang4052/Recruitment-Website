// src/components/Recruitment/Recruitment.jsx
import { useState } from 'react';
import './Recruitment.css';
import { useEffect } from 'react';
import axios from 'axios';
import { formatDate } from '../../../../utils/Format';
import { formatRangeShort } from '../../../../utils/formatSalary';

const JOBS_PER_PAGE = 5;
const API_URL = import.meta.env.VITE_API_URL;
export default function Recruitment({ onViewDetail }) {

  const [currentPage, setCurrentPage] = useState(1);


  const [activeTab, setActiveTab] = useState("all");
  const [jobs, setJobs] = useState([]);
  const token = localStorage.getItem('token');

  const tabs = [
    { key: "all", label: "Tất cả" },
    { key: "approved", label: "Đã duyệt" },
    { key: "pending", label: "Chờ duyệt" },
    { key: "rejected", label: "Đã từ chối" }
  ];

  const API = `${API_URL}/api/admin/recruitment`;

  useEffect(() => {
    if (activeTab === "all") {
      axios.get(API, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(res => setJobs(res.data));
    }
    else if (activeTab === "approved") {
      axios.get(`${API}/approve`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(res => setJobs(res.data));
    }
    else if (activeTab === "pending") {
      axios.get(`${API}/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(res => setJobs(res.data));
    }
    else if (activeTab === "rejected") {
      axios.get(`${API}/rejected`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(res => setJobs(res.data));
    }
  }, [activeTab]);

    const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);
  const start = (currentPage - 1) * JOBS_PER_PAGE;
  const currentJobs = jobs.slice(start, start + JOBS_PER_PAGE);


  const goPrev = () => setCurrentPage(p => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage(p => Math.min(p + 1, totalPages));

  return (
    <div className="recruitment-wrapper">
      <h1 className="content-title">Quản lý Tin tuyển dụng</h1>

      <div className="tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={activeTab === t.key ? "tab active" : "tab"}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card">
        {/* <div className="table-toolbar">
          <input type="text" placeholder="Tìm kiếm tin tuyển dụng..." className="table-search" />
        </div> */}

        <div className="job-list">
          {currentJobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-card-content">
                <div className="job-info">
                  <h3 className="job-title">{job.position}</h3>
                  <p className="job-company">{job.employer.name} - {job.location}</p>
                  <div className="job-meta">
                    <span>💰 <span>{job.salary && job.salary !== "Thỏa thuận"
                                                ? formatRangeShort(job.salary)
                                                : job.salary}</span></span>
                    <span>📅 Ngày đăng: {formatDate(job.postedAt)}</span>
                    <span>👁️ {job.view} lượt xem</span>
                  </div>
                </div>
                <div className="job-actions">
                  <button className="btn-outline blue" onClick={() => onViewDetail(job)}>
                    Chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button onClick={goPrev} disabled={currentPage === 1} className="page-btn">
            Trước
          </button>
          <span className="page-info">
            Trang {currentPage} / {totalPages}
          </span>
          <button onClick={goNext} disabled={currentPage === totalPages} className="page-btn">
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}
// src/components/Recruitment/Recruitment.jsx
import { useState } from 'react';
import './Recruitment.css';
import { useEffect } from 'react';
import axios from 'axios';
import { formatDate } from '../../../../utils/Format';

const JOBS_PER_PAGE = 5;

export default function Recruitment({ onViewDetail }) {
  // const jobs = [
  //   {
  //     id: 1,
  //     position: 'Senior Frontend Developer',
  //     companyName: 'Công ty ABC Tech',
  //     salary: '20-30 triệu',
  //     location: 'Hà Nội',
  //     postedAt: '2025-06-25',
  //     views: 156,
  //     status: 'PENDING',
  //     description: 'Cần Senior FE thạo React, TypeScript, Tailwind...',
  //     experience: '3+ năm',
  //     literacy: 'Đại học CNTT',
  //     level: 'Senior',
  //     other: 'Tiếng Anh giao tiếp',
  //     benefit: 'BHXH, thưởng, phép năm, remote 2 ngày/tuần',
  //     formOfWork: 'FULLTIME',
  //     workingTime: '8h-17h',
  //     applyBy: 'Online',
  //     skill: ['React', 'TypeScript', 'Tailwind'],
  //     deadline: '2025-07-10',
  //     employer: { companyLogo: '🏢', companyName: 'ABC Tech' }
  //   },
  //   {
  //     id: 2,
  //     position: 'Backend Engineer (Node.js)',
  //     companyName: 'XYZ Solutions',
  //     salary: '18-27 triệu',
  //     location: 'TP.HCM',
  //     postedAt: '2025-06-24',
  //     views: 203,
  //     status: 'APPROVED',
  //     description: 'Phát triển API, tối ưu hiệu năng hệ thống...',
  //     experience: '2+ năm Node.js',
  //     literacy: 'Đại học',
  //     level: 'Middle',
  //     other: 'Biết Docker là lợi thế',
  //     benefit: 'Cơm trưa, thưởng KPI, team-building',
  //     formOfWork: 'FULLTIME',
  //     workingTime: '9h-18h',
  //     applyBy: 'Email',
  //     skill: ['Node.js', 'Express', 'MongoDB', 'Docker'],
  //     deadline: '2025-07-15',
  //     employer: { companyLogo: '🏢', companyName: 'XYZ Solutions' }
  //   },
  //   {
  //     id: 3,
  //     position: 'UI/UX Designer',
  //     companyName: 'Creative Studio',
  //     salary: '15-22 triệu',
  //     location: 'Đà Nẵng',
  //     postedAt: '2025-06-23',
  //     views: 89,
  //     status: 'PENDING',
  //     description: 'Thiết kế giao diện web/app, làm việc với Figma...',
  //     experience: '2+ năm design',
  //     literacy: 'Cao đẳng trở lên',
  //     level: 'Middle',
  //     other: 'Có portfolio',
  //     benefit: 'Laptop riêng, khóa học design hàng quý',
  //     formOfWork: 'HYBRID',
  //     workingTime: '8h30-17h30',
  //     applyBy: 'Portfolio + CV',
  //     skill: ['Figma', 'Adobe XD', 'Photoshop'],
  //     deadline: '2025-07-20',
  //     employer: { companyLogo: '🎨', companyName: 'Creative Studio' }
  //   },
  //   {
  //     id: 4,
  //     position: 'DevOps Engineer',
  //     companyName: 'Cloudify VN',
  //     salary: '25-40 triệu',
  //     location: 'Hà Nội',
  //     postedAt: '2025-06-22',
  //     views: 312,
  //     status: 'REJECTED',
  //     description: 'Triển khai CI/CD, quản lý K8s, AWS...',
  //     experience: '4+ năm DevOps',
  //     literacy: 'Đại học',
  //     level: 'Senior',
  //     other: 'Có chứng chỉ AWS là lợi thế',
  //     benefit: 'Lương tháng 13, bonus dự án, bảo hiểm VIP',
  //     formOfWork: 'FULLTIME',
  //     workingTime: '9h-18h',
  //     applyBy: 'Online',
  //     skill: ['Kubernetes', 'AWS', 'Jenkins', 'Terraform'],
  //     deadline: '2025-07-05',
  //     employer: { companyLogo: '☁️', companyName: 'Cloudify VN' }
  //   },
  //   {
  //     id: 5,
  //     position: 'Product Manager',
  //     companyName: 'Tech Startup 360',
  //     salary: '30-50 triệu',
  //     location: 'TP.HCM',
  //     postedAt: '2025-06-21',
  //     views: 445,
  //     status: 'APPROVED',
  //     description: 'Quản lý sản phẩm, lập roadmap, phân tích KPI...',
  //     experience: '5+ năm PM',
  //     literacy: 'Thạc sĩ ưu tiên',
  //     level: 'Lead',
  //     other: 'Kinh nghiệm Agile',
  //     benefit: 'Cổ phiếu, lương tháng 13, du lịch nước ngoài',
  //     formOfWork: 'FULLTIME',
  //     workingTime: '9h-18h',
  //     applyBy: 'Online',
  //     skill: ['Agile', 'Scrum', 'Jira', 'Analytics'],
  //     deadline: '2025-07-30',
  //     employer: { companyLogo: '🚀', companyName: 'Tech Startup 360' }
  //   },
  //   {
  //     id: 6,
  //     position: 'Mobile Developer (Flutter)',
  //     companyName: 'AppLab',
  //     salary: '17-26 triệu',
  //     location: 'Remote',
  //     postedAt: '2025-06-20',
  //     views: 267,
  //     status: 'PENDING',
  //     description: 'Lập trình app Flutter, hỗ trợ publish...',
  //     experience: '2+ năm Flutter',
  //     literacy: 'Đại học',
  //     level: 'Middle',
  //     other: 'Có app trên Store',
  //     benefit: 'Remote 100%, thiết bị cấp, học Flutter mỗi tháng',
  //     formOfWork: 'REMOTE',
  //     workingTime: 'Flexible',
  //     applyBy: 'GitHub + CV',
  //     skill: ['Flutter', 'Dart', 'Firebase', 'Bloc'],
  //     deadline: '2025-07-25',
  //     employer: { companyLogo: '📱', companyName: 'AppLab' }
  //   },
  //   {
  //     id: 7,
  //     position: 'Data Analyst',
  //     companyName: 'DataViet',
  //     salary: '14-21 triệu',
  //     location: 'Hà Nội',
  //     postedAt: '2025-06-19',
  //     views: 198,
  //     status: 'APPROVED',
  //     description: 'Phân tích dữ liệu sale, làm dashboard PowerBI...',
  //     experience: '1+ năm',
  //     literacy: 'Đại học Toán/Kinh tế',
  //     level: 'Junior',
  //     other: 'Kinh nghiệm SQL',
  //     benefit: 'Khóa học Data, lương tháng 13, OT có trả',
  //     formOfWork: 'FULLTIME',
  //     workingTime: '8h-17h',
  //     applyBy: 'Email',
  //     skill: ['SQL', 'Python', 'PowerBI', 'Excel'],
  //     deadline: '2025-07-15',
  //     employer: { companyLogo: '📊', companyName: 'DataViet' }
  //   },
  //   {
  //     id: 8,
  //     position: 'QA Engineer (Manual + Auto)',
  //     companyName: 'Quality Plus',
  //     salary: '16-24 triệu',
  //     location: 'TP.HCM',
  //     postedAt: '2025-06-18',
  //     views: 142,
  //     status: 'PENDING',
  //     description: 'Viết test case, automation với Selenium, Cypress...',
  //     experience: '3+ năm QA',
  //     literacy: 'Đại học',
  //     level: 'Middle',
  //     other: 'Có ISTQB là lợi thế',
  //     benefit: 'Bonus lỗi, khóa học test, du lịch hằng năm',
  //     formOfWork: 'FULLTIME',
  //     workingTime: '9h-18h',
  //     applyBy: 'Online',
  //     skill: ['Selenium', 'Cypress', 'Jira', 'Postman'],
  //     deadline: '2025-07-20',
  //     employer: { companyLogo: '🔍', companyName: 'Quality Plus' }
  //   }
  // ];

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

  const API = "http://localhost:8080/api/admin/recruitment";

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
        <div className="table-toolbar">
          <input type="text" placeholder="Tìm kiếm tin tuyển dụng..." className="table-search" />
        </div>

        <div className="job-list">
          {currentJobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-card-content">
                <div className="job-info">
                  <h3 className="job-title">{job.position}</h3>
                  <p className="job-company">{job.employer.name} - {job.location}</p>
                  <div className="job-meta">
                    <span>💰 {job.salary}</span>
                    <span>📅 {formatDate(job.postedAt)}</span>
                    <span>👁️ {job.view} lượt xem</span>
                  </div>
                </div>
                <div className="job-actions">
                  <button className="btn-outline blue" onClick={() => onViewDetail(job)}>
                    Chi tiết
                  </button>
                  {/* <button className="btn-outline red">Xóa</button> */}
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
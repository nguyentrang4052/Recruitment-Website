// src/components/Applicant/ApplicantDetail.jsx
import { ChevronLeft } from 'lucide-react';
import './ApplicantDetail.css';

export default function ApplicantDetail({ applicant, onBack }) {
  // const genderText = (g) => {
  //   if (g === 1) return 'Nam';
  //   if (g === 0) return 'Nữ';
  //   return 'Khác';
  // };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('vi-VN') : '—');

  return (
    <div className="applicant-detail-wrapper">
      <div className="applicant-detail-container">
        <div className="applicant-detail-header">
          <button className="back-applicantbutton" onClick={onBack}>
            <ChevronLeft size={24} />
          </button>
          <h1 className="page-title">Chi tiết ứng viên</h1>
        </div>

        <div className="avatar-section">
          <div className="avatar-circle">
            {applicant.avatar ? (
              <img src={applicant.avatar} alt="Avatar" className="avatar-img" />
            ) : (
              <span className="avatar-fallback">{applicant.applicantName?.charAt(0)}</span>
            )}
          </div>
          <div className="avatar-info">
            <h3>{applicant.applicantName}</h3>
          </div>
        </div>

        <div className="main-card">
          <div className="section border-b">
            <h2 className="section-title">Thông tin cá nhân</h2>
            <div className="info-grid">
              <div>
                <p className="info-label">Ngày sinh</p>
                <p className="info-value">{formatDate(applicant.birthday)}</p>
              </div>
              <div>
                <p className="info-label">Giới tính</p>
                <p className="info-value">{applicant.gender}</p>
              </div>
              <div>
                <p className="info-label">Địa chỉ</p>
                <p className="info-value">{applicant.address || '—'}</p>
              </div>
              <div>
                <p className="info-label">Trình độ</p>
                <p className="info-value">{applicant.literacy || '—'}</p>
              </div>
            </div>
          </div>

          <div className="section border-b">
            <h2 className="section-title">Mục tiêu & Kinh nghiệm</h2>
            <div className="info-row">
              <p className="info-label">Mục tiêu nghề nghiệp</p>
              <p className="info-content">{applicant.goal || 'Chưa cập nhật'}</p>
            </div>
            <div className="info-row">
              <p className="info-label">Kinh nghiệm</p>
              <p className="info-content">{applicant.experience || 'Chưa cập nhật'}</p>
            </div>
          </div>

          <div className="section border-b">
            <h2 className="section-title">Kỹ năng</h2>
            <div className="skill-tags">
              {applicant.skill?.length ? (
                applicant.skill.map((s, i) => <span key={i} className="skill-tag">{s}</span>)
              ) : (
                <span className="text-gray-500">Chưa có kỹ năng</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
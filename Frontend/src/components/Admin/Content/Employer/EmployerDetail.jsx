// src/components/Employer/Employers.jsx
import { ChevronLeft } from 'lucide-react';
import './Employer.css';

export default function Employers({ onBack, employer }) {

    return (
        <div className="employer-detail-wrapper">
            <div className="employer-detail-container">
                <div className="employer-detail-header">
                    <button className="back-employerbutton" onClick={onBack}>
                        <ChevronLeft size={25} />
                    </button>
                    <h1 className="page-title">Chi tiết Nhà tuyển dụng</h1>
                </div>

                <div className="avatar-section">
                    <div className="avatar-circle">
                        {employer.companyLogo ? (
                            <img src={employer.companyLogo} alt="Company Logo" className="avatar-img" />
                        ) : (
                            <span className="avatar-fallback">{employer.employerName?.charAt(0)}</span>
                        )}
                    </div>
                    <div className="avatar-info">
                        <h3>{employer.employerName}</h3>
                        <p>{employer.phone}</p>
                    </div>
                </div>

                <div className="main-card">
                    <div className="section border-b">
                        <h2 className="section-title">Thông tin công ty</h2>
                        <div className="info-grid">
                            <div>
                                <p className="info-label">Địa chỉ</p>
                                <p className="info-value">{employer.address || '—'}</p>
                            </div>
                            <div>
                                <p className="info-label">Số điện thoại</p>
                                <p className="info-value">{employer.phone || '—'}</p>
                            </div>
                            <div>
                                <p className="info-label">Website</p>
                                <p className="info-value">
                                    <a href={employer.companyWebsite} target="_blank" rel="noopener noreferrer">{employer.companyWebsite}</a>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="section border-b">
                        <h2 className="section-title">Giới thiệu công ty</h2>
                        <p className="info-content">{employer.companyProfile || 'Chưa cập nhật'}</p>
                    </div>

                    <div className="section">
                        <h2 className="section-title">Mô tả công ty</h2>
                        <p className="info-content">{employer.companyDescription || 'Chưa có mô tả'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

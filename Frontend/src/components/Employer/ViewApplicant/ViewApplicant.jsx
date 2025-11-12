import React, { useState, useEffect } from 'react';
import './ViewApplicant.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faPhone,
    faEnvelope,
    faMapMarkerAlt,
    faBirthdayCake,
    faVenusMars,
    faCheckCircle,
    faTimesCircle,
    faDownload,
    faBriefcase,
    faGraduationCap,
    faBullseye,
    faFileAlt,
    faStar
} from '@fortawesome/free-solid-svg-icons';
import avatar from '../../../assets/avatar.png';

const ViewApplicant = ({ applicantId, onBack, onApprove, onReject, showActions = true }) => {
    const [applicant, setApplicant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Giả lập fetch data từ API
        // Thay thế bằng axios.get(`/api/applicants/${applicantId}`) trong thực tế
        const fetchApplicantDetail = async () => {
            setLoading(true);

            // Mock data dựa trên entity của bạn
            const mockData = {
                applicantID: applicantId,
                applicantName: 'Trần Văn Đạt',
                birthday: '1995-05-15',
                gender: 1, // 1: Nam, 0: Nữ
                address: 'Số 123, Đường Láng, Đống Đa, Hà Nội',
                phone: '0912345678',
                goal: 'Mong muốn trở thành một Front-end Developer chuyên nghiệp, đóng góp vào các dự án công nghệ hiện đại và không ngừng học hỏi các công nghệ mới.',
                experience: '2 năm kinh nghiệm làm việc với ReactJS, JavaScript và HTML/CSS. Đã tham gia phát triển 5+ dự án web application cho các công ty startup.',
                literacy: 'Cử nhân Công nghệ Thông tin - Đại học Bách Khoa Hà Nội (2013-2017)',
                account: {
                    email: 'tranvandat@example.com'
                },
                skill: [
                    { skillID: 1, skillName: 'ReactJS' },
                    { skillID: 2, skillName: 'JavaScript' },
                    { skillID: 3, skillName: 'HTML/CSS' },
                    { skillID: 4, skillName: 'UI/UX' },
                    { skillID: 5, skillName: 'Git' },
                    { skillID: 6, skillName: 'Responsive Design' }
                ],
                careerInformation: {
                    position: 'Lập trình viên Front-end',
                    salary: '15-20 triệu',
                    workingForm: 'Full-time'
                },
                application: [
                    {
                        date: '2025-09-15',
                        status: 'PENDING',
                        note: 'Ứng viên có kinh nghiệm tốt với ReactJS',
                        CV: '/files/cv_tranvanda.pdf',
                        recruitmentNews: {
                            RNID: 1,
                            title: 'Tuyển dụng Front-end Developer'
                        }
                    }
                ],
                rating: [
                    {
                        score: 4.5,
                        comment: 'Ứng viên có kỹ năng tốt và thái độ làm việc chuyên nghiệp'
                    }
                ],
                avatar: avatar
            };

            setTimeout(() => {
                setApplicant(mockData);
                setLoading(false);
            }, 500);
        };

        fetchApplicantDetail();
    }, [applicantId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'PENDING': return 'status-pending';
            case 'APPROVED': return 'status-approved';
            case 'REJECTED': return 'status-rejected';
            default: return 'status-pending';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING': return 'Đang chờ duyệt';
            case 'APPROVED': return 'Đã duyệt';
            case 'REJECTED': return 'Đã từ chối';
            default: return 'Đang chờ duyệt';
        }
    };

    if (loading) {
        return (
            <div className="view-cv-container">
                <p style={{ textAlign: 'center', padding: '50px' }}>Đang tải thông tin ứng viên...</p>
            </div>
        );
    }

    if (!applicant) {
        return (
            <div className="view-cv-container">
                <p style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy thông tin ứng viên.</p>
            </div>
        );
    }

    const currentApplication = applicant.application?.[0];

    return (
        <div className="view-cv-container">
            <div className="view-cv-header">
                <h2>HỒ SƠ ỨNG VIÊN</h2>
                <div className="header-actions">
                    <button className="back-btn" onClick={onBack}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
                    </button>
                </div>
            </div>

            <div className="cv-content">
                {/* Left Sidebar */}
                <div className="cv-sidebar">
                    <div className="avatar-section">
                        <img src={applicant.avatar} alt="Avatar" className="view-cv-avatar" />
                        <h3 className="applicant-title">{applicant.applicantName}</h3>
                        <p className="applicant-subtitle">
                            {applicant.careerInformation?.position || 'Chưa cập nhật vị trí'}
                        </p>
                    </div>

                    <div className="contact-info">
                        <div className="info-item">
                            <FontAwesomeIcon icon={faPhone} />
                            <div>
                                <div className="info-label">Điện thoại</div>
                                <div>{applicant.phone || 'Chưa cập nhật'}</div>
                            </div>
                        </div>

                        <div className="info-item">
                            <FontAwesomeIcon icon={faEnvelope} />
                            <div>
                                <div className="info-label">Email</div>
                                <div>{applicant.account?.email || 'Chưa cập nhật'}</div>
                            </div>
                        </div>

                        <div className="info-item">
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                            <div>
                                <div className="info-label">Địa chỉ</div>
                                <div>{applicant.address || 'Chưa cập nhật'}</div>
                            </div>
                        </div>

                        <div className="info-item">
                            <FontAwesomeIcon icon={faBirthdayCake} />
                            <div>
                                <div className="info-label">Ngày sinh</div>
                                <div>{applicant.birthday ? formatDate(applicant.birthday) : 'Chưa cập nhật'}</div>
                            </div>
                        </div>

                        <div className="info-item">
                            <FontAwesomeIcon icon={faVenusMars} />
                            <div>
                                <div className="info-label">Giới tính</div>
                                <div>{applicant.gender === 1 ? 'Nam' : applicant.gender === 0 ? 'Nữ' : 'Khác'}</div>
                            </div>
                        </div>
                    </div>

                    {applicant.skill && applicant.skill.length > 0 && (
                        <div className="skills-section">
                            <div className="section-title">
                                <FontAwesomeIcon icon={faStar} /> Kỹ năng
                            </div>
                            <div className="skills-list">
                                {applicant.skill.map(skill => (
                                    <span key={skill.skillID} className="skill-badge">
                                        {skill.skillName}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="cv-main-content">
                    {/* Mục tiêu nghề nghiệp */}
                    <div className="content-section">
                        <h3>
                            <FontAwesomeIcon icon={faBullseye} /> Mục tiêu nghề nghiệp
                        </h3>
                        <p className="content-text">
                            {applicant.goal || 'Chưa cập nhật mục tiêu nghề nghiệp'}
                        </p>
                    </div>

                    {/* Học vấn */}
                    <div className="content-section">
                        <h3>
                            <FontAwesomeIcon icon={faGraduationCap} /> Học vấn
                        </h3>
                        <p className="content-text">
                            {applicant.literacy || 'Chưa cập nhật thông tin học vấn'}
                        </p>
                    </div>

                    {/* Kinh nghiệm làm việc */}
                    <div className="content-section">
                        <h3>
                            <FontAwesomeIcon icon={faBriefcase} /> Kinh nghiệm làm việc
                        </h3>
                        <p className="content-text">
                            {applicant.experience || 'Chưa cập nhật kinh nghiệm làm việc'}
                        </p>
                    </div>

                    {/* Thông tin ứng tuyển */}
                    {currentApplication && (
                        <div className="content-section">
                            <h3>
                                <FontAwesomeIcon icon={faFileAlt} /> Thông tin ứng tuyển
                            </h3>
                            <div className="info-grid">
                                <div className="grid-item">
                                    <span className="grid-label">Vị trí ứng tuyển:</span>
                                    <span className="grid-value">
                                        {currentApplication.recruitmentNews?.title || 'Chưa cập nhật'}
                                    </span>
                                </div>
                                <div className="grid-item">
                                    <span className="grid-label">Ngày nộp:</span>
                                    <span className="grid-value">
                                        {formatDate(currentApplication.date)}
                                    </span>
                                </div>
                                <div className="grid-item">
                                    <span className="grid-label">Trạng thái:</span>
                                    <span className={`application-status ${getStatusClass(currentApplication.status)}`}>
                                        {getStatusText(currentApplication.status)}
                                    </span>
                                </div>
                                <div className="grid-item">
                                    <span className="grid-label">Mức lương mong muốn:</span>
                                    <span className="grid-value">
                                        {applicant.careerInformation?.salary || 'Thỏa thuận'}
                                    </span>
                                </div>
                            </div>
                            {currentApplication.note && (
                                <div style={{ marginTop: '15px' }}>
                                    <span className="grid-label">Ghi chú:</span>
                                    <p className="content-text" style={{ marginTop: '5px' }}>
                                        {currentApplication.note}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* CV File Download */}
                    {currentApplication?.CV && (
                        <div className="cv-file-section">
                            <h3 style={{ color: 'white', marginBottom: '10px' }}>
                                <FontAwesomeIcon icon={faFileAlt} /> Tài liệu CV
                            </h3>
                            <p style={{ marginBottom: '10px' }}>
                                Tải xuống CV đầy đủ của ứng viên
                            </p>
                            <a
                                href={currentApplication.CV}
                                download
                                className="cv-download-btn"
                            >
                                <FontAwesomeIcon icon={faDownload} />
                                Tải CV xuống
                            </a>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {currentApplication?.status === 'PENDING' && showActions && (
                        <div className="action-buttons">
                            <button
                                className="primary-btn approve-btn"
                                onClick={() => onApprove(applicant.applicantID)}
                            >
                                <FontAwesomeIcon icon={faCheckCircle} />
                                Duyệt hồ sơ
                            </button>
                            <button
                                className="primary-btn reject-btn"
                                onClick={() => onReject(applicant.applicantID)}
                            >
                                <FontAwesomeIcon icon={faTimesCircle} />
                                Từ chối
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewApplicant;
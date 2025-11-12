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
    // faDownload,
    faBriefcase,
    faGraduationCap,
    faBullseye,
    faFileAlt,
    faStar
} from '@fortawesome/free-solid-svg-icons';
import avatarPlaceholder from '../../../assets/avatar.png';

const API_BASE_URL = 'http://localhost:8080/api/employer';

const ViewApplicant = ({ applicantId, recruitmentNewsId, onBack, onApprove, onReject, showActions = true }) => {
    const [applicant, setApplicant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplicantDetail = async () => {
            setLoading(true);
            try {
                let token = localStorage.getItem('token');
                if (!token) throw new Error('Bạn chưa đăng nhập');

                token = token.trim();
                const url = `${API_BASE_URL}/applicant/detail/${applicantId}`;

                const res = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) {
                    if (res.status === 404) throw new Error('Không tìm thấy ứng viên');
                    if (res.status === 401 || res.status === 403) throw new Error('Bạn không có quyền truy cập');
                    throw new Error(`Lỗi ${res.status}: ${res.statusText}`);
                }

                const data = await res.json();

                // Map applications và đổi cv -> CV
                const mappedApplications = (data.applications || []).map(app => ({
                    ...app,
                    CV: app.cv, // map chữ thường cv sang CV
                    status: app.status?.toUpperCase(),
                }));

                const mappedApplicant = {
                    applicantID: data.applicantId || data.ID,
                    applicantName: data.applicantName || data.name,
                    birthday: data.birthday,
                    gender: data.gender,
                    address: data.address,
                    phone: data.phone,
                    goal: data.summary,
                    experience: data.experience,
                    literacy: data.literacy || data.education,
                    account: { email: data.email },
                    skill: data.skillNames?.map((s, i) => ({ skillID: i, skillName: s })) || [],
                    careerInformation: {
                        position: data.jobTitle || data.position,
                        salary: data.desireSalary,
                        workingForm: data.workForm
                    },
                    application: mappedApplications,
                    avatar: data.photo || avatarPlaceholder
                };

                setApplicant(mappedApplicant);
            } catch (err) {
                console.error(err);
                alert(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicantDetail();
    }, [applicantId]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa cập nhật';
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



    if (loading) return <div className="view-cv-container"><p style={{ textAlign: 'center', padding: '50px' }}>Đang tải thông tin ứng viên...</p></div>;
    if (!applicant) return <div className="view-cv-container"><p style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy thông tin ứng viên.</p></div>;

    // Lấy hồ sơ ứng tuyển mới nhất
    const currentApplication = applicant.application
        ?.filter(app => app.recruitmentNewsID === recruitmentNewsId) // lọc đúng RNID
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
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
                <div className="cv-sidebar">
                    <div className="avatar-section">
                        <img src={applicant.avatar} alt="Avatar" className="view-cv-avatar" />
                        <h3 className="applicant-title">{applicant.applicantName}</h3>
                        <p className="applicant-subtitle">{applicant.careerInformation?.position || 'Chưa cập nhật vị trí'}</p>
                    </div>

                    <div className="contact-info">
                        <div className="info-item"><FontAwesomeIcon icon={faPhone} /><div><div className="info-label">Điện thoại</div><div>{applicant.phone}</div></div></div>
                        <div className="info-item"><FontAwesomeIcon icon={faEnvelope} /><div><div className="info-label">Email</div><div>{applicant.account?.email}</div></div></div>
                        <div className="info-item"><FontAwesomeIcon icon={faMapMarkerAlt} /><div><div className="info-label">Địa chỉ</div><div>{applicant.address}</div></div></div>
                        <div className="info-item"><FontAwesomeIcon icon={faBirthdayCake} /><div><div className="info-label">Ngày sinh</div><div>{formatDate(applicant.birthday)}</div></div></div>
                        <div className="info-item"><FontAwesomeIcon icon={faVenusMars} /><div><div className="info-label">Giới tính</div><div>{applicant.gender === 1 ? 'Nam' : applicant.gender === 0 ? 'Nữ' : 'Khác'}</div></div></div>
                    </div>

                    {applicant.skill && applicant.skill.length > 0 && (
                        <div className="skills-section">
                            <div className="section-title"><FontAwesomeIcon icon={faStar} /> Kỹ năng</div>
                            <div className="skills-list">{applicant.skill.map(skill => <span key={skill.skillID} className="skill-badge">{skill.skillName}</span>)}</div>
                        </div>
                    )}
                </div>

                <div className="cv-main-content">
                    <div className="content-section">
                        <h3><FontAwesomeIcon icon={faBullseye} /> Mục tiêu nghề nghiệp</h3>
                        <p className="content-text">{applicant.goal || 'Chưa cập nhật'}</p>
                    </div>
                    <div className="content-section">
                        <h3><FontAwesomeIcon icon={faGraduationCap} /> Học vấn</h3>
                        <p className="content-text">{applicant.literacy || 'Chưa cập nhật'}</p>
                    </div>
                    <div className="content-section">
                        <h3><FontAwesomeIcon icon={faBriefcase} /> Kinh nghiệm làm việc</h3>
                        <p className="content-text">{applicant.experience || 'Chưa cập nhật'}</p>
                    </div>

                    {currentApplication && (
                        <div className="content-section">
                            <h3><FontAwesomeIcon icon={faFileAlt} /> Thông tin ứng tuyển</h3>
                            <div className="info-grid">
                                <div className="grid-item"><span className="grid-label">Vị trí ứng tuyển:</span> <span className="grid-value">{currentApplication.recruitmentNewsTitle || currentApplication.recruitmentNews?.title}</span></div>
                                <div className="grid-item"><span className="grid-label">Ngày nộp:</span> <span className="grid-value">{formatDate(currentApplication.date)}</span></div>
                                <div className="grid-item"><span className="grid-label">Trạng thái:</span> <span className={`application-status ${getStatusClass(currentApplication.status)}`}>{getStatusText(currentApplication.status)}</span></div>
                                <div className="grid-item"><span className="grid-label">Mức lương mong muốn:</span> <span className="grid-value">{applicant.careerInformation?.salary || 'Thỏa thuận'}</span></div>
                            </div>
                            {currentApplication.note && <div style={{ marginTop: '15px' }}><span className="grid-label">Ghi chú:</span><p className="content-text">{currentApplication.note}</p></div>}
                        </div>
                    )}

                    {currentApplication?.CV && (
                        <div className="cv-file-section">
                            <a
                                href={`http://localhost:8080${currentApplication.CV}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cv-view-btn"
                            >
                                <FontAwesomeIcon icon={faFileAlt} /> Xem CV trực tiếp
                            </a>
                        </div>
                    )}



                    {currentApplication?.status === 'PENDING' && showActions && (
                        <div className="action-buttons">
                            <button className="primary-btn approve-btn" onClick={() => onApprove(applicant.applicantID)}><FontAwesomeIcon icon={faCheckCircle} /> Duyệt hồ sơ</button>
                            <button className="primary-btn reject-btn" onClick={() => onReject(applicant.applicantID)}><FontAwesomeIcon icon={faTimesCircle} /> Từ chối</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewApplicant;

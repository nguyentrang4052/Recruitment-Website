import React, { useState, useEffect } from 'react';
import './ViewApplicant.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft, faPhone, faEnvelope, faMapMarkerAlt, faBirthdayCake,
    faVenusMars, faCheckCircle, faTimesCircle, faBriefcase,
    faGraduationCap, faBullseye, faFileAlt, faStar, faTimes
} from '@fortawesome/free-solid-svg-icons';
import avatarPlaceholder from '../../../assets/avatar.png';

const API_BASE_URL = 'http://localhost:8080/api/employer';

const ViewApplicant = ({ applicantId, recruitmentNewsId, onBack, onApprove, onReject, showActions = true, hideApplicationInfo = false }) => {
    const [applicant, setApplicant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCvModal, setShowCvModal] = useState(false);
    const [showInterviewModal, setShowInterviewModal] = useState(false)
    const companyName = localStorage.getItem('employerName') || 'Công ty của bạn';

    useEffect(() => {
        fetchApplicantDetail();
    }, [applicantId]);

    const fetchApplicantDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Bạn chưa đăng nhập');

            const res = await fetch(`${API_BASE_URL}/applicant/detail/${applicantId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error(`Lỗi ${res.status}`);
            const data = await res.json();

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
                application: (data.applications || []).map(app => ({
                    ...app,
                    cv: app.cv || app.CV,
                    CV: app.cv || app.CV,
                    status: app.status?.toUpperCase(),
                    recruitmentNewsID: app.recruitmentNewsId || app.recruitmentNews?.RNID || app.recruitmentNews?.id || app.recruitmentNewsID,
                    recruitmentNewsTitle: app.recruitmentNewsTitle || app.recruitmentNews?.position || app.recruitmentNews?.title,
                })),
                avatar: data.photo || avatarPlaceholder
            };

            setApplicant(mappedApplicant);
        } catch (err) {
            console.error("❌ Error fetching applicant:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleScheduleInterview = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = {
            applicantId: applicant.applicantID,
            recruitmentNewsId,
            interviewDate: form.interviewDate.value,
            interviewTime: form.interviewTime.value,
            interviewType: form.interviewType.value,
            note: form.note.value,
            email: applicant.account?.email,
            applicantName: applicant.applicantName,
            companyName: companyName
        };

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/employer/send-interview-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Gửi email thất bại');

            alert('✅ Đã gửi lịch phỏng vấn qua email!');
            setShowInterviewModal(false);
            onApprove(applicant.applicantID);
        } catch (err) {
            alert('❌ Lỗi: ' + err.message);
        }
    };


    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa cập nhật';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusClass = (status) => {
        const classes = {
            PENDING: 'status-pending',
            APPROVED: 'status-approved',
            REJECTED: 'status-rejected'
        };
        return classes[status] || 'status-pending';
    };

    const getStatusText = (status) => {
        const texts = {
            PENDING: 'Đang chờ duyệt',
            APPROVED: 'Đã duyệt',
            REJECTED: 'Đã từ chối'
        };
        return texts[status] || 'Đang chờ duyệt';
    };

    const getCvUrl = (cvPath) => {
        if (!cvPath) return null;
        if (cvPath.startsWith('http://') || cvPath.startsWith('https://')) {
            return cvPath;
        }
        return `http://localhost:8080${cvPath}`;
    };

    const handleViewCV = (cvUrl) => {
        console.log("🔥 handleViewCV called with:", cvUrl);
        console.log("🔥 cvUrl type:", typeof cvUrl);
        console.log("🔥 cvUrl truthy?", !!cvUrl);

        if (!cvUrl || cvUrl === 'http://localhost:8080null') {
            console.error("❌ Invalid CV URL");
            alert('Không tìm thấy file CV');
            return;
        }

        console.log("✅ Attempting to open CV...");

        //  Mở tab mới với window.open
        try {
            const newWindow = window.open(cvUrl, '_blank', 'noopener,noreferrer');
            console.log("🔥 window.open result:", newWindow);

            // Nếu bị chặn popup
            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                console.warn("⚠️ Popup blocked, trying alternative method...");

                const link = document.createElement('a');
                link.href = cvUrl;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                console.log("✅ Alternative method executed");
            } else {
                console.log("✅ New window opened successfully");
            }
        } catch (error) {
            console.error("❌ Error opening CV:", error);
            alert('Lỗi khi mở CV: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="view-cv-container">
                <p style={{ textAlign: 'center', padding: '50px' }}>Đang tải...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="view-cv-container">
                <p style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                    Lỗi: {error}
                </p>
            </div>
        );
    }

    if (!applicant) {
        return (
            <div className="view-cv-container">
                <p style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy</p>
            </div>
        );
    }

    let currentApplication = recruitmentNewsId
        ? applicant.application?.find(app =>
            String(app.recruitmentNewsID) === String(recruitmentNewsId)
        )
        : null;

    if (recruitmentNewsId && !currentApplication && applicant.application?.length > 0) {
        currentApplication = applicant.application.find(app => app.cv || app.CV) || applicant.application[0];
    }

    const cvPath = currentApplication?.cv || currentApplication?.CV ||
        applicant.application?.[0]?.cv || applicant.application?.[0]?.CV;
    const cvUrl = getCvUrl(cvPath);

    console.log("🔍 DEBUG INFO:");
    console.log("- currentApplication:", currentApplication);
    console.log("- cvPath:", cvPath);
    console.log("- cvUrl:", cvUrl);
    console.log("- cvUrl exists?", !!cvUrl);

    return (
        <div className="view-cv-container">
            <div className="view-cv-header">
                <h2>HỒ SƠ ỨNG VIÊN</h2>
                <button className="back-btn" onClick={onBack}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
                </button>
            </div>

            <div className="cv-content">
                {/* Sidebar */}
                <div className="cv-sidebar">
                    <div className="avatar-section">
                        <img
                            src={applicant.avatar}
                            alt="Avatar"
                            className="view-cv-avatar"
                            onError={(e) => { e.target.src = avatarPlaceholder; }}
                        />
                        <h3>{applicant.applicantName}</h3>
                        <p>{applicant.careerInformation?.position || 'Chưa cập nhật'}</p>
                    </div>

                    <div className="contact-info">
                        <div className="info-item">
                            <FontAwesomeIcon icon={faPhone} />
                            <div>
                                <div>Điện thoại</div>
                                <div>{applicant.phone || 'Chưa cập nhật'}</div>
                            </div>
                        </div>
                        <div className="info-item">
                            <FontAwesomeIcon icon={faEnvelope} />
                            <div>
                                <div>Email</div>
                                <div>{applicant.account?.email || 'Chưa cập nhật'}</div>
                            </div>
                        </div>
                        <div className="info-item">
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                            <div>
                                <div>Địa chỉ</div>
                                <div>{applicant.address || 'Chưa cập nhật'}</div>
                            </div>
                        </div>
                        <div className="info-item">
                            <FontAwesomeIcon icon={faBirthdayCake} />
                            <div>
                                <div>Ngày sinh</div>
                                <div>{formatDate(applicant.birthday)}</div>
                            </div>
                        </div>
                        <div className="info-item">
                            <FontAwesomeIcon icon={faVenusMars} />
                            <div>
                                <div>Giới tính</div>
                                <div>
                                    {applicant.gender === 1 ? 'Nam' : applicant.gender === 0 ? 'Nữ' : 'Khác'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {applicant.skill?.length > 0 && (
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
                    <div className="content-section">
                        <h3><FontAwesomeIcon icon={faBullseye} /> Mục tiêu nghề nghiệp</h3>
                        <p>{applicant.goal || 'Chưa cập nhật'}</p>
                    </div>

                    <div className="content-section">
                        <h3><FontAwesomeIcon icon={faGraduationCap} /> Học vấn</h3>
                        <p>{applicant.literacy || 'Chưa cập nhật'}</p>
                    </div>

                    <div className="content-section">
                        <h3><FontAwesomeIcon icon={faBriefcase} /> Kinh nghiệm làm việc</h3>
                        <p>{applicant.experience || 'Chưa cập nhật'}</p>
                    </div>

                    {!hideApplicationInfo && currentApplication && (
                        <div className="content-section">
                            <h3><FontAwesomeIcon icon={faFileAlt} /> Thông tin ứng tuyển</h3>
                            <div className="info-grid">
                                <div className="grid-item">
                                    <span>Vị trí:</span>
                                    <span>{currentApplication.recruitmentNewsTitle || 'Chưa cập nhật'}</span>
                                </div>
                                <div className="grid-item">
                                    <span>Ngày nộp:</span>
                                    <span>{formatDate(currentApplication.date)}</span>
                                </div>
                                <div className="grid-item">
                                    <span>Trạng thái:</span>
                                    <span className={`application-status ${getStatusClass(currentApplication.status)}`}>
                                        {getStatusText(currentApplication.status)}
                                    </span>
                                </div>
                                <div className="grid-item">
                                    <span>Mức lương:</span>
                                    <span>{applicant.careerInformation?.salary || 'Thỏa thuận'}</span>
                                </div>
                            </div>
                            {currentApplication.note && (
                                <div style={{ marginTop: '15px' }}>
                                    <span>Ghi chú:</span>
                                    <p>{currentApplication.note}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {cvUrl && (
                        <div className="cv-file-section">
                            <button
                                className="cv-view-btn"
                                onClick={(e) => {
                                    console.log("🖱️ Button clicked!");
                                    console.log("🖱️ Event:", e);
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleViewCV(cvUrl);
                                }}
                            >
                                <FontAwesomeIcon icon={faFileAlt} /> Xem CV trực tiếp
                            </button>
                        </div>
                    )}

                    {currentApplication?.status === 'PENDING' && showActions && recruitmentNewsId && (
                        <div className="action-buttons">
                            <button
                                className="primary-btn approve-btn"
                                onClick={() => setShowInterviewModal(true)}
                            >
                                <FontAwesomeIcon icon={faCheckCircle} /> Duyệt hồ sơ
                            </button>
                            <button
                                className="primary-btn reject-btn"
                                onClick={() => onReject(applicant.applicantID)}
                            >
                                <FontAwesomeIcon icon={faTimesCircle} /> Từ chối
                            </button>
                        </div>
                    )}
                </div>
            </div>


            {showCvModal && cvUrl && (
                <div className="cv-modal-overlay" onClick={() => setShowCvModal(false)}>
                    <div className="cv-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="cv-modal-close" onClick={() => setShowCvModal(false)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <iframe
                            src={cvUrl}
                            title="CV Preview"
                            style={{ width: '100%', height: '100%', border: 'none' }}
                        />
                    </div>
                </div>
            )}

            {showInterviewModal && (
                <div className="interview-modal-overlay" onClick={() => setShowInterviewModal(false)}>
                    <div className="interview-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>📅 Đặt lịch phỏng vấn</h3>
                        <form onSubmit={handleScheduleInterview}>
                            <label>
                                Ngày phỏng vấn:
                                <input type="date" name="interviewDate" required />
                            </label>
                            <label>
                                Giờ phỏng vấn:
                                <input type="time" name="interviewTime" required />
                            </label>
                            <label>
                                Hình thức:
                                <select name="interviewType" required>
                                    <option value="Trực tiếp">Trực tiếp</option>
                                    <option value="Trực tuyến">Trực tuyến</option>
                                </select>
                            </label>
                            <label>
                                Ghi chú:
                                <textarea name="note" rows="3" placeholder="Địa điểm, link họp, yêu cầu,..." />
                            </label>
                            <div className="modal-actions">
                                <button type="submit" className="primary-btn approve-btn">Gửi lịch hẹn</button>
                                <button type="button" onClick={() => setShowInterviewModal(false)} className="primary-btn secondary">Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewApplicant;
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../ApplicantDetail/ApplicantDetail.css';
import avatarPlaceholder from '../../../assets/avatar.png';

const API_BASE_URL = 'http://localhost:8080/api/employer';

const ApplicantDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    const fetchCandidateDetail = useCallback(async () => {
        if (!token) {
            setError("Lỗi: Không tìm thấy token. Vui lòng đăng nhập lại.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/applicant/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = response.data;
            setCandidate({
                applicantID: data.applicantID,
                name: data.applicantName,
                title: data.jobTitle,
                location: data.location,
                skills: data.skillNames || [],
                experience: data.experience,
                salaryExpectation: data.desireSalary || 'Thỏa thuận',
                avatar: data.photo,
                email: data.email,
                phone: data.phone,
                summary: data.summary,
                level: data.level,
                literacy: data.literacy,
            });
        } catch (err) {
            console.error("Lỗi khi tải chi tiết ứng viên:", err);
            if (err.response?.status === 404)
                setError(`Không tìm thấy ứng viên có ID: ${id}`);
            else if (err.response?.status === 403)
                setError("Bạn không có quyền xem thông tin ứng viên này.");
            else
                setError("Lỗi kết nối hoặc lỗi server khi tải dữ liệu.");
            setCandidate(null);
        } finally {
            setLoading(false);
        }
    }, [id, token]);

    useEffect(() => { fetchCandidateDetail(); }, [fetchCandidateDetail]);

    const formatExperience = (exp) => {
        const expNum = parseInt(exp);
        if (!isNaN(expNum)) return `${expNum} năm kinh nghiệm`;
        return exp || "Chưa rõ";
    };

    if (loading) return <div className="applicant-detail-container">Đang tải thông tin ứng viên...</div>;
    if (error) return <div className="applicant-detail-container error-message">{error}</div>;
    if (!candidate) return <div className="applicant-detail-container">Không tìm thấy ứng viên có ID: {id}</div>;

    return (
        <div className="applicant-detail-container">


            <div className="applicant-header">
                <img
                    src={candidate.avatar || avatarPlaceholder}
                    alt="Avatar"
                    className="profile-avatar"
                    onError={(e) => { e.target.onerror = null; e.target.src = avatarPlaceholder; }}
                />
                <div className="header-info">
                    <h2>{candidate.name}</h2>
                    <p className="job-title">{candidate.title || "Chưa cập nhật chức danh"}</p>

                    <div className="contact-info">
                        <span><i className="fas fa-envelope"></i> {candidate.email || "Không có"}</span>
                        <span><i className="fas fa-phone"></i> {candidate.phone || "Không có"}</span>
                    </div>

                    <div className="summary-meta">
                        <span><i className="fas fa-map-marker-alt"></i> {candidate.location || "Toàn quốc"}</span>

                    </div>
                </div>

                <button className="back-button-header" onClick={() => navigate(-1)}>
                    <i className="fas fa-arrow-left"></i> Quay lại
                </button>
            </div>


            <div className="applicant-body">
                <div className="main-content-column">


                    <div className="section-card summary-section">
                        <h3><i className="fas fa-user-tag"></i> Tóm tắt Hồ sơ / Mục tiêu nghề nghiệp</h3>
                        <p>{candidate.summary || "Ứng viên chưa cập nhật tóm tắt/mục tiêu nghề nghiệp."}</p>
                    </div>


                    <div className="section-card experience-section">
                        <h3><i className="fas fa-briefcase"></i> Kinh nghiệm làm việc</h3>
                        <p><strong>Kinh nghiệm tổng quan:</strong> {formatExperience(candidate.experience)}</p>
                        <p>(Chi tiết kinh nghiệm sẽ được cập nhật sau...)</p>
                    </div>

                    <div className="section-card placeholder-section">
                        <h3><i className="fas fa-graduation-cap"></i> Học vấn</h3>
                        {candidate.literacy ? (
                            <p><strong>Học vấn:</strong> {candidate.literacy}</p>
                        ) : (
                            <p>Ứng viên chưa cập nhật trình độ học vấn.</p>
                        )}
                    </div>
                </div>

                <div className="sidebar-column">
                    <div className="section-card skills-section">
                        <h3><i className="fas fa-tools"></i> Kỹ năng chính</h3>
                        <div className="skills-list">
                            {candidate.skills.length > 0 ? (
                                candidate.skills.map(skill => (
                                    <span key={skill} className="skill-tag">{skill}</span>
                                ))
                            ) : (
                                <p>Ứng viên chưa cập nhật kỹ năng.</p>
                            )}
                        </div>
                    </div>


                    <div className="section-card additional-info">
                        <h3><i className="fas fa-info-circle"></i> Thông tin cơ bản</h3>
                        <p><strong>Cấp bậc:</strong> {candidate.level || "Chưa rõ"}</p>
                        <p><strong>Lương mong muốn:</strong> {candidate.salaryExpectation}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicantDetail;
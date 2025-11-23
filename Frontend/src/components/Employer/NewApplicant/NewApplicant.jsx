import React, { useState, useEffect, useCallback } from "react";
import "./NewApplicant.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import avatarPlaceholder from "../../../assets/avatar.png";
import ViewApplicant from "../ViewApplicant/ViewApplicant.jsx";

const NewApplicant = ({ recruitmentNewsId, onBack }) => {

    // console.log("3️⃣ Received recruitmentNewsId:", recruitmentNewsId, typeof recruitmentNewsId);

    // useEffect(() => {
    //     if (!recruitmentNewsId) {
    //         console.error("❌ recruitmentNewsId is undefined!");
    //         setError("Không tìm thấy ID tin tuyển dụng");
    //         setLoading(false);
    //         return;
    //     }
    //     fetchApplicants();
    // }, [recruitmentNewsId]);

    const [applicants, setApplicants] = useState([]);
    const [selectedApplicantId, setSelectedApplicantId] = useState(null);
    const [showViewCV, setShowViewCV] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const applicantsPerPage = 4;
    const [jobStatus, setJobStatus] = useState({ isActive: true });

    const API_BASE = "http://localhost:8080/api/employer/applications";
    const token = localStorage.getItem("token");

    const fetchApplicants = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`${API_BASE}/new?recruitmentNewsId=${recruitmentNewsId}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` },
                credentials: "include"
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}: Không thể tải danh sách ứng viên`);
            const data = await res.json();
            const withAvatars = data.map(a => ({ ...a, avatar: a.avatar || avatarPlaceholder }));
            setApplicants(withAvatars);
        } catch (err) {
            console.error("fetchApplicants", err);
            setError("Lỗi khi tải danh sách ứng viên mới.");
        } finally {
            setLoading(false);
        }
    }, [recruitmentNewsId, token]);

    useEffect(() => {
        const fetchJobStatus = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/employer/jobs/${recruitmentNewsId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const data = await res.json();
                setJobStatus({ isActive: data.isActive });
            } catch (e) {
                console.warn("Không thể kiểm tra trạng thái tin:", e);
            }
        };
        if (recruitmentNewsId) fetchJobStatus();
    }, [recruitmentNewsId]);

    useEffect(() => { fetchApplicants(); }, [fetchApplicants]);

    const handleApprove = async (applicantId) => {
        try {
            const res = await fetch(`${API_BASE}/${recruitmentNewsId}/${applicantId}/approve`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
            });
            if (!res.ok) throw new Error("Không thể duyệt hồ sơ");
            alert(`✅ Đã duyệt hồ sơ ứng viên ID: ${applicantId}`);
            await fetchApplicants();
            handleBackFromCV();
        } catch (err) {
            console.error("handleApprove", err);
            alert("❌ Có lỗi xảy ra khi duyệt ứng viên.");
        }
    };

    const handleReject = async (applicantId) => {
        if (!window.confirm('Bạn có chắc chắn muốn TỪ CHỐI ứng viên này?')) return;

        try {
            const res = await fetch(`${API_BASE}/${recruitmentNewsId}/${applicantId}/reject`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Không thể từ chối hồ sơ");
            alert(`✅ Đã từ chối hồ sơ ứng viên ID: ${applicantId}`);
            await fetchApplicants();
            handleBackFromCV();
        } catch (err) {
            console.error("handleReject", err);
            alert("❌ Có lỗi xảy ra khi từ chối ứng viên.");
        }
    };

    const handleViewCV = (id) => {
        setSelectedApplicantId(id);
        setShowViewCV(true);
    };

    const handleBackFromCV = () => {
        setShowViewCV(false);
        setSelectedApplicantId(null);
    };

    const totalPages = Math.ceil(applicants.length / applicantsPerPage);
    const indexOfLastApplicant = currentPage * applicantsPerPage;
    const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
    const currentApplicants = applicants.slice(indexOfFirstApplicant, indexOfLastApplicant);

    if (loading) return <div className="loading-spinner">⏳ Đang tải danh sách...</div>;
    if (error) return (
        <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchApplicants}>🔄 Thử lại</button>
        </div>
    );

    if (showViewCV) {
        const selectedApplicant = applicants.find(a => a.applicantId === selectedApplicantId);

        return (
            <ViewApplicant
                applicantId={selectedApplicantId}
                recruitmentNewsId={recruitmentNewsId}
                isJobActive={jobStatus.isActive}
                onBack={handleBackFromCV}
                onApprove={handleApprove}
                onReject={handleReject}
                showActions={selectedApplicant?.status === 'PENDING'}
            />
        );
    }

    return (
        <div className="new-applicants-container">
            <header className="main-header">
                <button className="back-button" onClick={onBack}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
                </button>
                <h2>ỨNG VIÊN ĐÃ ỨNG TUYỂN</h2>
            </header>

            <div className="applicants-list">
                {currentApplicants.length > 0 ? (
                    currentApplicants.map((applicant) => (
                        <div key={applicant.applicantId} className="applicant-card">
                            <div className="applicant-header">
                                <img src={applicant.avatar} alt="Avatar" className="candidate-avatar" />
                                <div className="applicant-info">
                                    <h4 className="applicant-name">
                                        {applicant.applicantName}
                                        {applicant.status === "APPROVED" && (
                                            <span className="status-badge approved">✅ Đã duyệt</span>
                                        )}
                                    </h4>
                                    <p className="applicant-position">{applicant.position}</p>
                                    {/* <div className="applicant-details">
                                        <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {applicant.location}</span>
                                        <span><FontAwesomeIcon icon={faBriefcase} /> {applicant.experience}</span>
                                    </div> */}
                                    {applicant.skills && (
                                        <div className="applicant-skills">
                                            {applicant.skills.map(skill => (
                                                <span key={skill} className="skill-tag">{skill}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="applicant-actions">
                                <button onClick={() => handleViewCV(applicant.applicantId)} className="action-button view-button">
                                    <FontAwesomeIcon icon={faEye} /> Xem CV
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-applicants">📭 Không có ứng viên</p>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                        ← Trang trước
                    </button>
                    <span>Trang {currentPage} / {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                        Trang sau →
                    </button>
                </div>
            )}
        </div>
    );
};

export default NewApplicant;
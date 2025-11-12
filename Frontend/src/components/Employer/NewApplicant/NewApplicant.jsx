import React, { useState } from 'react';
import './NewApplicant.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faMapMarkerAlt, faBriefcase, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import avatar from '../../../assets/avatar.png';
import ViewCV from '../ViewApplicant/ViewApplicant.jsx';

// Giả lập dữ liệu ứng viên mới nộp
const initialApplicants = [
    {
        id: 1,
        name: 'Trần Văn Đạt',
        position: 'Lập trình viên Front-end',
        location: 'Hà Nội',
        experience: '2 năm',
        skills: ['ReactJS', 'JavaScript', 'HTML/CSS', 'UI/UX'],
        appliedDate: '15/09/2025',
        status: 'pending',
        cvLink: '#',
        avatar: avatar
    },
    {
        id: 2,
        name: 'Nguyễn Thị Hương',
        position: 'Thiết kế đồ họa',
        location: 'Hồ Chí Minh',
        experience: '3 năm',
        skills: ['Photoshop', 'Illustrator', 'Figma'],
        appliedDate: '14/09/2025',
        status: 'pending',
        cvLink: '#',
        avatar: avatar
    },
    {
        id: 3,
        name: 'Phạm Hữu Nam',
        position: 'Kiểm thử phần mềm',
        location: 'Đà Nẵng',
        experience: '1 năm',
        skills: ['Manual Testing', 'Automation Testing', 'SQL'],
        appliedDate: '14/09/2025',
        status: 'pending',
        cvLink: '#',
        avatar: avatar
    },
    {
        id: 4,
        name: 'Phạm Hữu N',
        position: 'Kiểm thử phần mềm',
        location: 'Đà Nẵng',
        experience: '1 năm',
        skills: ['Manual Testing', 'Automation Testing', 'SQL'],
        appliedDate: '14/09/2025',
        status: 'pending',
        cvLink: '#',
        avatar: avatar
    }, {
        id: 5,
        name: 'Phạm Hữu K',
        position: 'Kiểm thử phần mềm',
        location: 'Đà Nẵng',
        experience: '1 năm',
        skills: ['Manual Testing', 'Automation Testing', 'SQL'],
        appliedDate: '14/09/2025',
        status: 'pending',
        cvLink: '#',
        avatar: avatar
    }, {
        id: 6,
        name: 'Phạm Hữu H',
        position: 'Kiểm thử phần mềm',
        location: 'Đà Nẵng',
        experience: '1 năm',
        skills: ['Manual Testing', 'Automation Testing', 'SQL'],
        appliedDate: '14/09/2025',
        status: 'pending',
        cvLink: '#',
        avatar: avatar
    },
];

const NewApplicant = ({ username, setActiveTab }) => {
    const [applicants, setApplicants] = useState(initialApplicants);
    const [selectedApplicantId, setSelectedApplicantId] = useState(null);
    const [showViewCV, setShowViewCV] = useState(false);

    // phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const applicantsPerPage = 4;
    const totalPages = Math.ceil(applicants.length / applicantsPerPage);

    const indexOfLastApplicant = currentPage * applicantsPerPage;
    const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
    const currentApplicants = applicants.slice(indexOfFirstApplicant, indexOfLastApplicant);

    // SỬA LẠI: Thêm handleBackFromCV vào trong các handler
    const handleApprove = (id) => {
        setApplicants(prevApplicants => {
            const updated = prevApplicants.map(app =>
                app.id === id ? { ...app, status: 'approved' } : app
            );
            return updated;
        });
        alert(`Đã duyệt hồ sơ của ứng viên ID: ${id}`);
        handleBackFromCV(); // QUAY LẠI DANH SÁCH NGAY LẬP TỨC
    };

    const handleReject = (id) => {
        setApplicants(prevApplicants => {
            const updated = prevApplicants.filter(app => app.id !== id);
            return updated;
        });
        alert(`Đã từ chối hồ sơ của ứng viên ID: ${id}`);
        handleBackFromCV(); // QUAY LẠI DANH SÁCH NGAY LẬP TỨC
    };

    const handleViewCV = (id) => {
        setSelectedApplicantId(id);
        setShowViewCV(true);
    };

    const handleBackFromCV = () => {
        setShowViewCV(false);
        setSelectedApplicantId(null);
    };

    if (showViewCV) {
        return (
            <ViewCV
                applicantId={selectedApplicantId}
                onBack={handleBackFromCV}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        );
    }

    return (
        <div className="new-applicants-container">
            <header className="main-header">
                <button className="back-button" onClick={() => setActiveTab('dashboard')}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
                </button>
                <h2>ỨNG VIÊN MỚI</h2>
                <div className="user-info">
                    <span>{username}</span>
                </div>
            </header>

            <div className="applicants-list">
                {currentApplicants.length > 0 ? (
                    currentApplicants.map(applicant => (
                        <div key={applicant.id} className="applicant-card">
                            <div className="applicant-header">
                                <img src={applicant.avatar} alt="Avatar" className="candidate-avatar" />
                                <div className="applicant-info">
                                    <h4 className="applicant-name">
                                        {applicant.name}
                                        {/* Hiển thị trạng thái Đã duyệt */}
                                        {applicant.status === 'approved' && (
                                            <span className="status-badge approved">Đã duyệt</span>
                                        )}
                                    </h4>
                                    <p className="applicant-position">{applicant.position}</p>
                                    <div className="applicant-details">
                                        <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {applicant.location}</span>
                                        <span><FontAwesomeIcon icon={faBriefcase} /> {applicant.experience}</span>
                                    </div>
                                    <div className="applicant-skills">
                                        {applicant.skills.map(skill => (
                                            <span key={skill} className="skill-tag">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="applicant-actions">
                                {/* CHỈ CÓ NÚT XEM CV */}
                                <button onClick={() => handleViewCV(applicant.id)} className="action-button view-button">
                                    <FontAwesomeIcon icon={faEye} /> Xem CV
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-applicants">Không có ứng viên mới nào.</p>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Trang trước
                    </button>
                    <span>Trang {currentPage} / {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Trang sau
                    </button>
                </div>
            )}
        </div>
    );
};

export default NewApplicant;
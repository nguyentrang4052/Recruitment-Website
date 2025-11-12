import React, { useState } from 'react';
import '../../Employer/ActiveJobs/ActiveJobs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock, faUsers } from '@fortawesome/free-solid-svg-icons';
import JobDetail from '../JobDetail/JobDetail.jsx';

const initialJobs = [
    { id: 1, title: 'Lập trình viên ReactJS', location: 'Hà Nội', applicants: 12, postedDate: '10/09/2025', status: 'Đang tuyển' },
    { id: 2, title: 'Thiết kế UI/UX', location: 'Hồ Chí Minh', applicants: 8, postedDate: '12/09/2025', status: 'Đang tuyển' },
    { id: 3, title: 'Kỹ sư DevOps', location: 'Đà Nẵng', applicants: 5, postedDate: '14/09/2025', status: 'Đang tuyển' },
    { id: 4, title: 'Phân tích dữ liệu', location: 'Hà Nội', applicants: 7, postedDate: '15/09/2025', status: 'Đang tuyển' },
    { id: 5, title: 'Tester Manual', location: 'Hồ Chí Minh', applicants: 9, postedDate: '16/09/2025', status: 'Đang tuyển' },
    { id: 6, title: 'Java Developer', location: 'Hà Nội', applicants: 14, postedDate: '17/09/2025', status: 'Đang tuyển' },
    { id: 7, title: 'Mobile Developer', location: 'Đà Nẵng', applicants: 6, postedDate: '18/09/2025', status: 'Đang tuyển' },
];

const ActiveJobs = ({ setActiveTab }) => {
    const [jobs] = useState(initialJobs);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const jobsPerPage = 6;

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

    const totalPages = Math.ceil(jobs.length / jobsPerPage);

    const handleJobClick = (jobId) => {
        setSelectedJobId(jobId);
    };

    const handleBackToList = () => {
        setSelectedJobId(null);
    };

    // Nếu đang xem chi tiết, hiển thị JobDetail
    if (selectedJobId) {
        return (
            <JobDetail
                jobId={selectedJobId}
                onBack={handleBackToList}
            />
        );
    }

    // Nếu không, hiển thị danh sách
    return (
        <div className="joblist-container">
            <div className="joblist-header">
                <button className="joblist-back-button" onClick={() => setActiveTab('dashboard')}>
                    ← Quay lại
                </button>
                <h2 className="page-title">TIN TUYỂN DỤNG ĐANG HOẠT ĐỘNG</h2>
            </div>

            <div className="joblist-list">
                {currentJobs.map(job => (
                    <div
                        key={job.id}
                        className="joblist-card"
                        onClick={() => handleJobClick(job.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <h3 className="joblist-title">{job.title}</h3>
                        <p className="joblist-meta">
                            <FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location} |{' '}
                            <FontAwesomeIcon icon={faClock} /> {job.postedDate}
                        </p>
                        <p className="joblist-applicants">
                            <FontAwesomeIcon icon={faUsers} /> Ứng viên đã nộp: {job.applicants}
                        </p>
                        <span className="joblist-status">{job.status}</span>
                    </div>
                ))}
            </div>

            <div className="joblist-pagination">
                <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
                    ← Trang trước
                </button>
                <span>Trang {currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
                    Trang sau →
                </button>
            </div>
        </div>
    );
};

export default ActiveJobs;
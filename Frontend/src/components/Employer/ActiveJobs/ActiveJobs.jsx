import React, { useState } from 'react';
import '../../Employer/ActiveJobs/ActiveJobs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock, faUsers } from '@fortawesome/free-solid-svg-icons';

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
    const jobsPerPage = 4;

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

    const totalPages = Math.ceil(jobs.length / jobsPerPage);

    return (
        <div className="active-jobs-container">
            <div className="header-row">
                <button className="back-button" onClick={() => setActiveTab('dashboard')}>
                    ← Quay lại
                </button>
                <h2 className="page-title">TIN TUYỂN DỤNG ĐANG HOẠT ĐỘNG</h2>
            </div>

            <div className="jobs-list">
                {currentJobs.map(job => (
                    <div key={job.id} className="job-card">
                        <h3 className="job-title">{job.title}</h3>
                        <p className="job-meta">
                            <FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location} |{' '}
                            <FontAwesomeIcon icon={faClock} /> {job.postedDate}
                        </p>
                        <p className="job-applicants">
                            <FontAwesomeIcon icon={faUsers} /> Ứng viên đã nộp: {job.applicants}
                        </p>
                        <span className="job-status">{job.status}</span>
                    </div>
                ))}
            </div>

            <div className="pagination">
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

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock, faUsers } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './ActiveJobs.css';
import NewApplicant from '../NewApplicant/NewApplicant.jsx';
import JobDetail from '../JobDetail/JobDetail.jsx';

const ActiveJobs = ({ setActiveTab }) => {
    const api = useMemo(() => {
        const instance = axios.create({
            baseURL: 'http://localhost:8080',
            withCredentials: true,
        });

        instance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return instance;
    }, []);

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [viewingApplicants, setViewingApplicants] = useState(false);

    const fetchActiveJobs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/api/employer/jobs/active', {
                params: { page: currentPage },
            });

            setJobs(response.data.content || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            console.error('❌ Lỗi chi tiết:', err);

            if (err.response?.status === 401) {
                setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
                localStorage.removeItem('token');
            } else if (err.response?.status === 403) {
                setError('Bạn không có quyền truy cập tính năng này.');
            } else {
                setError('Không thể tải danh sách công việc. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    }, [currentPage, api]);

    useEffect(() => {
        fetchActiveJobs();
    }, [fetchActiveJobs]);

    const handleJobClick = (jobId) => {
        setSelectedJobId(jobId);
        setViewingApplicants(false);
    };

    const handleViewApplicants = (jobId) => {
        setSelectedJobId(jobId);
        setViewingApplicants(true);
    };

    const handleBack = () => {
        setSelectedJobId(null);
        setViewingApplicants(false);
    };

    if (selectedJobId && viewingApplicants) {
        return (
            <NewApplicant
                recruitmentNewsId={selectedJobId}
                onBack={handleBack}
            />
        );
    }

    if (selectedJobId && !viewingApplicants) {
        return (
            <JobDetail
                jobId={selectedJobId}
                onBack={handleBack}
            />
        );
    }

    if (loading) return <div className="loading-spinner">⏳ Đang tải danh sách...</div>;

    if (error) return (
        <div className="error-message">
            <p>{error}</p>
            <button onClick={() => { setCurrentPage(1); fetchActiveJobs(); }}>
                🔄 Thử lại
            </button>
            {error.includes('đăng nhập') && (
                <button onClick={() => window.location.href = '/login'}>
                    🔐 Đăng nhập
                </button>
            )}
        </div>
    );

    return (
        <div className="joblist-container">
            <div className="joblist-header">
                <button className="joblist-back-button" onClick={() => setActiveTab('dashboard')}>
                    ← Quay lại Dashboard
                </button>
                <h2 className="page-title">📋 TIN TUYỂN DỤNG ĐANG HOẠT ĐỘNG</h2>
            </div>

            <div className="joblist-list">
                {jobs.length === 0 ? (
                    <div className="no-jobs">
                        <p>📭 Không có công việc nào đang hoạt động</p>
                        <p style={{ fontSize: '14px', color: '#666' }}>Hãy đăng tin tuyển dụng mới</p>
                    </div>
                ) : (
                    jobs.map(job => (
                        <div key={job.id} className="joblist-card">
                            <h3
                                className="joblist-title"
                                onClick={() => handleJobClick(job.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                {job.title || 'Không có tiêu đề'}
                            </h3>
                            <p className="joblist-meta">
                                <FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location || 'Chưa cập nhật'} |{' '}
                                <FontAwesomeIcon icon={faClock} /> {job.postedDate || 'N/A'}
                            </p>
                            <span
                                className="joblist-applicants"
                                onClick={() => handleViewApplicants(job.id)}
                                style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
                            >
                                <FontAwesomeIcon icon={faUsers} /> Ứng viên đã nộp: {job.applicants || 0}
                            </span>
                            <span className={`joblist-status ${job.status === 'APPROVED' ? 'active' : ''}`}>
                                {job.status || 'Đang tuyển'}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="joblist-pagination">
                    <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        ← Trang trước
                    </button>
                    <span>Trang {currentPage} / {totalPages}</span>
                    <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage >= totalPages}
                    >
                        Trang sau →
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActiveJobs;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './JobDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft, faEdit, faTrash, faMapMarkerAlt, faClock,
    faBriefcase, faMoneyBill, faUsers, faEye, faFileAlt,
    faGraduationCap, faCalendar, faStar, faPauseCircle,
} from '@fortawesome/free-solid-svg-icons';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


const htmlToPlainText = (html) => {
    if (!html) return '';

    const temp = document.createElement('div');
    temp.innerHTML = html;


    const listItems = temp.querySelectorAll('li');
    if (listItems.length > 0) {
        return Array.from(listItems)
            .map(li => `• ${li.textContent.trim()}`)
            .join('\n');
    }

    const paragraphs = temp.querySelectorAll('p');
    if (paragraphs.length > 0) {
        return Array.from(paragraphs)
            .map(p => p.textContent.trim())
            .join('\n');
    }

    return temp.textContent.trim();
};

const formatHtmlContent = (text) => {
    if (!text) return '';

    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length === 0) return '';

    let html = '';
    let inList = false;

    const bulletRegex = new RegExp('^[•*-]\\s+');
    const numberRegex = /^\d+\.\s+/;

    lines.forEach(line => {
        const isBullet = bulletRegex.test(line);
        const isNumbered = numberRegex.test(line);

        if (isBullet || isNumbered) {
            if (!inList) {
                html += '<ul>';
                inList = true;
            }
            const content = isBullet ? line.replace(bulletRegex, '') : line.replace(numberRegex, '');
            html += `<li>${content}</li>`;
        } else {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            if (line) {
                html += `<p>${line}</p>`;
            }
        }
    });

    if (inList) {
        html += '</ul>';
    }

    return html;
};

const JobDetail = ({ jobId, onBack }) => {
    const [job, setJob] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchJobDetail = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get(`/api/employer/jobs/${jobId}`);
            const jobData = response.data;

            setJob(jobData);
            setEditData(jobData);
        } catch (err) {
            console.error('❌ Lỗi tải chi tiết job:', err);
            if (err.response?.status === 404) {
                setError('Không tìm thấy công việc này');
            } else if (err.response?.status === 401) {
                setError('Phiên đăng nhập hết hạn');
                localStorage.removeItem('token');
            } else {
                setError('Không thể tải thông tin công việc');
            }
        } finally {
            setLoading(false);
        }
    }, [jobId]);

    useEffect(() => {
        if (jobId) {
            fetchJobDetail();
        }
    }, [jobId, fetchJobDetail]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const handleDeactivate = async () => {
        if (!window.confirm('Bạn có chắc muốn ngừng tuyển dụng tin này?')) return;

        try {
            const response = await api.patch(`/api/employer/jobs/${jobId}/deactivate`);

            if (response.data.success) {
                alert('✅ Đã ngừng tuyển dụng');
                setJob(prev => ({ ...prev, status: 'INACTIVE' }));
                setEditData(prev => ({ ...prev, status: 'INACTIVE' }));
            }
        } catch (err) {
            console.error('❌ Lỗi ngừng tuyển:', err);
            alert(`❌ ${err.response?.data?.message || 'Thất bại'}`);
        }
    };

    const formatSalary = (min, max) => {
        if (!min && !max) return 'Thỏa thuận';
        if (!min) return `Lên tới ${new Intl.NumberFormat('vi-VN').format(max)} đ`;
        if (!max) return `Từ ${new Intl.NumberFormat('vi-VN').format(min)} đ`;
        return `${new Intl.NumberFormat('vi-VN').format(min)} - ${new Intl.NumberFormat('vi-VN').format(max)} đ`;
    };

    const getFormOfWorkText = (form) => {
        const forms = {
            'FULL_TIME': 'Full-time',
            'PART_TIME': 'Part-time',
            'REMOTE': 'Remote',
            'HYBRID': 'Hybrid'
        };
        return forms[form] || form || 'Không xác định';
    };

    const isExpired = () => {
        if (!job?.deadline) return false;
        return new Date(job.deadline) < new Date();
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditData({
            ...job,
            description: htmlToPlainText(job.description),
            benefit: htmlToPlainText(job.benefit),
            applyBy: htmlToPlainText(job.applyBy)
        });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditData(job);
    };

    const handleSaveEdit = async () => {
        if (!window.confirm('Bạn có chắc muốn lưu thay đổi?')) return;

        setLoading(true);
        setError(null);

        try {
            const response = await api.put(`/api/employer/jobs/${jobId}`, editData);

            if (response.data.success) {
                setJob(response.data.data);
                setIsEditing(false);
                alert('✅ Cập nhật thành công!');
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            console.error('❌ Lỗi cập nhật:', err);
            alert(`❌ ${err.response?.data?.message || 'Cập nhật thất bại'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này?')) return;

        setLoading(true);

        try {
            const response = await api.delete(`/api/employer/jobs/${jobId}`);

            if (response.data.success) {
                alert('✅ Xóa thành công!');
                onBack();
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            console.error('❌ Lỗi xóa:', err);
            alert(`❌ ${err.response?.data?.message || 'Xóa thất bại'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;

        if (type === 'number') {
            setEditData(prev => ({
                ...prev,
                [name]: value ? parseInt(value) : null
            }));
        } else {
            setEditData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleTextareaKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const { name, value, selectionStart } = e.target;


            const newValue = value.substring(0, selectionStart) + '\n• ' + value.substring(selectionStart);

            setEditData(prev => ({ ...prev, [name]: newValue }));


            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = selectionStart + 3;
            }, 0);
        }
    };

    if (loading) {
        return (
            <div className="jd-container">
                <div className="loading-spinner">⏳ Đang tải thông tin...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="jd-container">
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={fetchJobDetail}>🔄 Thử lại</button>
                    {error.includes('đăng nhập') && (
                        <button onClick={() => window.location.href = '/login'}>
                            🔐 Đăng nhập
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="jd-container">
                <p style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy thông tin tin tuyển dụng.</p>
            </div>
        );
    }

    return (
        <div className="jd-container">
            <div className="jd-header">
                <h2>CHI TIẾT TIN TUYỂN DỤNG</h2>
                <div className="jd-actions">
                    <button className="jd-btn jd-btn-back" onClick={onBack}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
                    </button>
                    {!isEditing && (
                        <>
                            <button className="jd-btn jd-btn-edit" onClick={handleEdit}>
                                <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa
                            </button>
                            <button className="jd-btn jd-btn-delete" onClick={handleDelete}>
                                <FontAwesomeIcon icon={faTrash} /> Xóa
                            </button>
                            {job.status === 'APPROVED' && !isExpired() && (
                                <button className="jd-btn jd-btn-deactivate" onClick={handleDeactivate}>
                                    <FontAwesomeIcon icon={faPauseCircle} /> Ngừng tuyển
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="jd-content">
                <div className="jd-main">
                    {!isEditing ? (
                        <>
                            <div className="jd-title-section">
                                <h1 className="jd-title">{job.title}</h1>
                                <div className="jd-meta">
                                    <span className="jd-meta-item">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                                        {job.location}
                                    </span>
                                    <span className="jd-meta-item">
                                        <FontAwesomeIcon icon={faBriefcase} />
                                        {getFormOfWorkText(job.formOfWork)}
                                    </span>
                                    <span className="jd-meta-item">
                                        <FontAwesomeIcon icon={faClock} />
                                        {job.workingTime}
                                    </span>
                                    <span className="jd-meta-item">
                                        <FontAwesomeIcon icon={faCalendar} />
                                        Đăng: {formatDate(job.postedDate)}
                                    </span>
                                </div>
                            </div>

                            <div className="jd-section">
                                <h3 className="jd-section-title">
                                    <FontAwesomeIcon icon={faFileAlt} />
                                    Mô tả công việc
                                </h3>
                                <div
                                    className="jd-section-content formatted-content"
                                    dangerouslySetInnerHTML={{ __html: formatHtmlContent(job.description) }}
                                />
                            </div>

                            {job.skills && job.skills.length > 0 && (
                                <div className="jd-section">
                                    <h3 className="jd-section-title">
                                        <FontAwesomeIcon icon={faStar} />
                                        Yêu cầu kỹ năng
                                    </h3>
                                    <div className="jd-skills">
                                        {job.skills.map(skill => (
                                            <span key={skill.skillID} className="jd-skill">
                                                {skill.skillName}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="jd-section">
                                <h3 className="jd-section-title">
                                    <FontAwesomeIcon icon={faGraduationCap} />
                                    Yêu cầu khác
                                </h3>
                                <div className="jd-section-content formatted-content">
                                    <p><strong>Số lượng tuyển:</strong> {job.quantity || 'Không xác định'}</p>
                                    <p><strong>Kinh nghiệm:</strong> {job.experience || 'Không yêu cầu'}</p>
                                    <p><strong>Học vấn:</strong> {job.literacy || 'Không yêu cầu'}</p>
                                    <p><strong>Cấp bậc:</strong> {job.level || 'Không yêu cầu'}</p>
                                </div>
                            </div>

                            {job.benefit && (
                                <div className="jd-section">
                                    <h3 className="jd-section-title">
                                        <FontAwesomeIcon icon={faMoneyBill} />
                                        Quyền lợi
                                    </h3>
                                    <div
                                        className="jd-section-content formatted-content"
                                        dangerouslySetInnerHTML={{ __html: formatHtmlContent(job.benefit) }}
                                    />
                                </div>
                            )}

                            <div className="jd-section">
                                <h3 className="jd-section-title">
                                    <FontAwesomeIcon icon={faFileAlt} />
                                    Cách thức ứng tuyển
                                </h3>
                                <div
                                    className="jd-section-content formatted-content"
                                    dangerouslySetInnerHTML={{ __html: formatHtmlContent(job.applyBy) }}
                                />
                            </div>
                        </>
                    ) : (
                        <form className="jd-form">
                            <div className="jd-form-group">
                                <label>Vị trí tuyển dụng</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={editData.title || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="jd-form-row">
                                <div className="jd-form-group">
                                    <label>Địa điểm</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={editData.location || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="jd-form-group">
                                    <label>Hình thức làm việc</label>
                                    <select
                                        name="formOfWork"
                                        value={editData.formOfWork || 'FULL_TIME'}
                                        onChange={handleInputChange}
                                    >
                                        <option value="FULL_TIME">Full-time</option>
                                        <option value="PART_TIME">Part-time</option>
                                        <option value="REMOTE">Remote</option>
                                        <option value="HYBRID">Hybrid</option>
                                    </select>
                                </div>
                            </div>

                            <div className="jd-form-row">
                                <div className="jd-form-group">
                                    <label>Lương tối thiểu</label>
                                    <input
                                        type="number"
                                        name="minSalary"
                                        value={editData.minSalary || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="jd-form-group">
                                    <label>Lương tối đa</label>
                                    <input
                                        type="number"
                                        name="maxSalary"
                                        value={editData.maxSalary || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="jd-form-row">
                                <div className="jd-form-group">
                                    <label>Kinh nghiệm</label>
                                    <input
                                        type="text"
                                        name="experience"
                                        value={editData.experience || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="jd-form-group">
                                    <label>Học vấn</label>
                                    <input
                                        type="text"
                                        name="literacy"
                                        value={editData.literacy || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="jd-form-row">
                                <div className="jd-form-group">
                                    <label>Cấp bậc</label>
                                    <input
                                        type="text"
                                        name="level"
                                        value={editData.level || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="jd-form-group">
                                    <label>Hạn nộp hồ sơ</label>
                                    <input
                                        type="date"
                                        name="deadline"
                                        value={editData.deadline || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="jd-form-group">
                                <label>Số lượng tuyển</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={editData.quantity || ''}
                                    onChange={handleInputChange}
                                    min="1"
                                    placeholder="Nhập số lượng cần tuyển"
                                />
                            </div>
                            <div className="jd-form-group">
                                <label>Thời gian làm việc</label>
                                <input
                                    type="text"
                                    name="workingTime"
                                    value={editData.workingTime || ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="jd-form-group">
                                <label>Mô tả công việc</label>
                                <textarea
                                    name="description"
                                    value={editData.description || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={handleTextareaKeyDown}
                                    rows="6"
                                    required
                                    placeholder="Nhập mô tả công việc (xuống dòng mỗi ý, dùng dấu • hoặc - cho bullet points)"
                                />
                            </div>

                            <div className="jd-form-group">
                                <label>Quyền lợi</label>
                                <textarea
                                    name="benefit"
                                    value={editData.benefit || ''}
                                    onChange={handleInputChange}
                                    onKeyDown={handleTextareaKeyDown}
                                    rows="4"
                                    placeholder="Nhập quyền lợi (xuống dòng mỗi ý, dùng dấu • hoặc - cho bullet points)"
                                />
                            </div>

                            <div className="jd-form-group">
                                <label>Cách thức ứng tuyển</label>
                                <textarea
                                    name="applyBy"
                                    value={editData.applyBy || ''}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Nhập cách thức ứng tuyển"
                                />
                            </div>

                            <div className="jd-form-actions">
                                <button type="button" className="jd-btn jd-btn-save" onClick={handleSaveEdit} disabled={loading}>
                                    {loading ? '⏳ Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                                <button type="button" className="jd-btn jd-btn-cancel" onClick={handleCancelEdit} disabled={loading}>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="jd-sidebar">
                    <div className="jd-card">
                        <h3>Thông tin chung</h3>
                        <div className="jd-info-row">
                            <span className="jd-label">Mức lương:</span>
                            <span className="jd-value">
                                {formatSalary(job.minSalary, job.maxSalary)}
                            </span>
                        </div>
                        <div className="jd-info-row">
                            <span className="jd-label">Số lượng tuyển:</span>
                            <span className="jd-value">{job.quantity || 'N/A'}</span>
                        </div>
                        <div className="jd-info-row">
                            <span className="jd-label">Hạn nộp:</span>
                            <span className="jd-value">{formatDate(job.deadline)}</span>
                        </div>
                        <div className="jd-info-row">
                            <span className="jd-label">Trạng thái:</span>
                            <span className={`jd-status ${job.status === 'INACTIVE' ? 'jd-status-inactive' :
                                isExpired() ? 'jd-status-expired' :
                                    'jd-status-active'
                                }`}>
                                {job.status === 'INACTIVE' ? 'Đã ngừng tuyển' :
                                    isExpired() ? 'Hết hạn' :
                                        'Đang tuyển'}
                            </span>
                        </div>
                    </div>

                    <div className="jd-card jd-stats">
                        <h3>Thống kê</h3>
                        <div className="jd-stat-item">
                            <span className="jd-stat-label">
                                <FontAwesomeIcon icon={faEye} />
                                Lượt xem
                            </span>
                            <span className="jd-stat-value">{job.numbersOfViews || 0}</span>
                        </div>
                        <div className="jd-stat-item">
                            <span className="jd-stat-label">
                                <FontAwesomeIcon icon={faUsers} />
                                Ứng viên
                            </span>
                            <span className="jd-stat-value">{job.numbersOfRecords || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;
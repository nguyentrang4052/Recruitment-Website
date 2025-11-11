// src/components/JobDetail/RecruitmentDetail.jsx
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import './RecruitmentDetail.css';

export default function RecruitmentDetail({ job, onBack }) {
    const [localJob, setLocalJob] = useState(job);

    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [reason, setReason] = useState('');

    const handleApprove = () => {
        setActionType('approve');
        setShowApprovalModal(true);
    };

    const handleReject = () => {
        setActionType('reject');
        setShowApprovalModal(true);
    };

    const handleConfirm = () => {
        const newStatus = actionType === 'approve' ? 'APPROVED' : 'REJECTED';
        setLocalJob({ ...localJob, status: newStatus });
        setShowApprovalModal(false);
        setReason('');
        alert(`Tin tuyển dụng đã được ${actionType === 'approve' ? 'phê duyệt' : 'từ chối'}`);
    };

    const handleCancel = () => {
        setShowApprovalModal(false);
        setReason('');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'APPROVED': return 'bg-green-100 text-green-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING': return 'Chờ phê duyệt';
            case 'APPROVED': return 'Đã phê duyệt';
            case 'REJECTED': return 'Đã từ chối';
            default: return status;
        }
    };

    return (
        <div className="job-detail-wrapper">
            <div className="job-detail-container">
                {/* Header */}
                <div className="job-detail-header">
                    <button className="back-recruitmentbutton" onClick={onBack}>
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="page-title">Chi tiết tin tuyển dụng</h1>
                </div>

                {/* Main Card */}
                <div className="main-card">
                    {/* Employer and Status */}
                    <div className="employer-status">
                        <div>
                            <p className="company-name">{localJob.employer.companyLogo} {localJob.employer.companyName}</p>
                            <h2 className="job-position">{localJob.position}</h2>
                            <span className={`status-badge ${getStatusColor(localJob.status)}`}>
                                {getStatusText(localJob.status)}
                            </span>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="basic-info-grid">
                        <div>
                            <p className="info-label">💰 Mức lương</p>
                            <p className="info-value">{localJob.salary}</p>
                        </div>
                        <div>
                            <p className="info-label">📍 Địa điểm</p>
                            <p className="info-value">{localJob.location}</p>
                        </div>
                        <div>
                            <p className="info-label">📅 Hạn ứng tuyển</p>
                            <p className="info-value">{new Date(localJob.deadline).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <div>
                            <p className="info-label">🕐 Ngày đăng</p>
                            <p className="info-value">{new Date(localJob.postedAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="section border-b">
                        <h3 className="section-title">Mô tả công việc</h3>
                        <p className="section-content">{localJob.description}</p>
                    </div>

                    {/* Requirements & Job Info */}
                    <div className="two-col-section border-b">
                        <div>
                            <h3 className="section-title">Yêu cầu</h3>
                            <div className="info-row">
                                <p className="info-label">Kinh nghiệm</p>
                                <p className="info-value">{localJob.experience}</p>
                            </div>
                            <div className="info-row">
                                <p className="info-label">Trình độ học vấn</p>
                                <p className="info-value">{localJob.literacy}</p>
                            </div>
                            <div className="info-row">
                                <p className="info-label">Cấp độ</p>
                                <p className="info-value">{localJob.level}</p>
                            </div>
                            <div className="info-row">
                                <p className="info-label">Khác</p>
                                <p className="info-value">{localJob.other}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="section-title">Thông tin công việc</h3>
                            <div className="info-row">
                                <p className="info-label">Hình thức làm việc</p>
                                <p className="info-value">{localJob.formOfWork === 'FULLTIME' ? 'Toàn thời gian' : 'Bán thời gian'}</p>
                            </div>
                            <div className="info-row">
                                <p className="info-label">Thời gian làm việc</p>
                                <p className="info-value">{localJob.workingTime}</p>
                            </div>
                            <div className="info-row">
                                <p className="info-label">Cách ứng tuyển</p>
                                <p className="info-value">{localJob.applyBy}</p>
                            </div>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="section border-b">
                        <h3 className="section-title">Quyền lợi</h3>
                        <p className="section-content">{localJob.benefit}</p>
                    </div>

                    {/* Skills */}
                    <div className="section">
                        <h3 className="section-title">Kỹ năng cần thiết</h3>
                        <div className="skill-tags">
                            {localJob.skill.map((s, i) => (
                                <span key={i} className="skill-tag">{s}</span>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button
                            onClick={handleApprove}
                            disabled={localJob.status === 'APPROVED' || localJob.status === 'REJECTED'}
                            className="btn-approve"
                        >
                            ✓ Phê duyệt
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={localJob.status === 'APPROVED' || localJob.status === 'REJECTED'}
                            className="btn-reject"
                        >
                            ✕ Từ chối
                        </button>
                    </div>
                </div>
            </div>

            {/* Approval Modal */}
            {showApprovalModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <div className={`modal-icon ${actionType}`}>
                                {actionType === 'approve' ? '✓' : '✕'}
                            </div>
                            <h2 className="modal-title">
                                {actionType === 'approve' ? 'Phê duyệt tin tuyển dụng' : 'Từ chối tin tuyển dụng'}
                            </h2>
                        </div>

                        <p className="modal-message">
                            {actionType === 'approve'
                                ? 'Bạn có chắc chắn muốn phê duyệt tin tuyển dụng này không?'
                                : 'Bạn có chắc chắn muốn từ chối tin tuyển dụng này không?'}
                        </p>

                        {actionType === 'reject' && (
                            <div className="modal-textarea">
                                <label>Lý do từ chối (tùy chọn)</label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Nhập lý do từ chối..."
                                    rows="3"
                                />
                            </div>
                        )}

                        <div className="modal-actions">
                            <button onClick={handleCancel} className="btn-cancel">Hủy</button>
                            <button onClick={handleConfirm} className={`btn-confirm ${actionType}`}>
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
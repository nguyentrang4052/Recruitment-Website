import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import './RecruitmentDetail.css';
import axios from 'axios';
import { formatDescription } from '../../../../utils/formatDescription';
import { formatRangeShort } from '../../../../utils/formatSalary';
import useToast from '../../../../utils/useToast';
import Toast from '../../../Toast/Toast';
export default function RecruitmentDetail({ job, onBack, onUpdate }) {

    const API = "http://localhost:8080/api/admin/recruitment";
    const token = localStorage.getItem("token");

    const [localJob, setLocalJob] = useState(job);

    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const { toast, showSuccess, showError, hideToast } = useToast();

    const handleApprove = () => {
        setActionType('approve');
        setShowApprovalModal(true);
    };

    const handleReject = () => {
        setActionType('reject');
        setShowApprovalModal(true);
    };


    const handleConfirm = async () => {
        setLoading(true);
        try {
            if (actionType === 'approve') {
                await axios.post(`${API}/approve/${localJob.rnid}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setLocalJob({ ...localJob, status: 'APPROVED' });
            } else {
                await axios.post(`${API}/reject/${localJob.rnid}`, { reason }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setLocalJob({ ...localJob, status: 'REJECTED', rejectReason: reason });
            }
            showSuccess(`Tin tuyển dụng đã được ${actionType === 'approve' ? 'phê duyệt' : 'từ chối'}`);

            if (onUpdate) onUpdate(localJob.id, actionType === 'approve' ? 'APPROVED' : 'REJECTED');

        } catch {
            showError("Lỗi khi cập nhật trạng thái tin tuyển dụng");
        } finally {
            setShowApprovalModal(false);
            setReason('');
            setLoading(false);
        }
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
\
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
                            <p className="info-value">{formatRangeShort(localJob.salary)}</p>
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

                    <div className="section border-b">
                        <h3 className="section-title">Mô tả công việc</h3>

                        <div
                            className="section-content"
                            dangerouslySetInnerHTML={formatDescription(localJob.description)}
                        />
                    </div>
                    <div className="two-col-section border-b">
                        <div>
                            <h3 className="section-title">Yêu cầu công việc</h3>
                            <div className="info-row">
                                <p className="info-label">Mô tả yêu cầu</p>

                                {localJob.requirement && (
                                    <div
                                        className="section-content"
                                        dangerouslySetInnerHTML={{ __html: formatDescription(localJob.requirement) }}
                                    />
                                )}

                            </div>
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
                        <div
                            className="section-content"
                            dangerouslySetInnerHTML={formatDescription(localJob.benefit)}
                        />
                    </div>

                    <div className="section">
                        <h3 className="section-title">Kỹ năng cần thiết</h3>
                        <div className="skill-tags">
                            {localJob.skill.map((s, i) => (
                                <span key={i} className="skill-tag">{s}</span>
                            ))}
                        </div>
                    </div>
                    <div className="action-buttons">
                        <button
                            onClick={handleApprove}
                            disabled={localJob.status !== 'PENDING' || loading}
                            className="btn-approve"
                        >
                            ✓ Phê duyệt
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={localJob.status !== 'PENDING' || loading}
                            className="btn-reject"
                        >
                            ✕ Từ chối
                        </button>
                    </div>

                </div>
            </div>
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
                            <button onClick={handleConfirm} className={`btn-confirm ${actionType}`} disabled={loading}
                            >
                                {loading ? "Đang xử lý..." : "Xác nhận"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={hideToast}
                    />
                )}
        </div>
    );
}
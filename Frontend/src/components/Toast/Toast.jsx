import { useEffect } from 'react';
import './Toast.css';

function Toast({
    message = "Thông báo",
    type = 'info',
    onClose,
    duration = 5000,
    confirmText,
    cancelText,
    onConfirm,
    onCancel
}) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose?.();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [onClose, duration]);

    const getIcon = () => {
        switch (type) {
            case 'success': return '✓';
            case 'error': return '⚠️';
            case 'warning': return '⚡';
            case 'info': return 'ℹ️';
            default: return 'ℹ️';
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'success': return 'Thành công';
            case 'error': return 'Lỗi';
            case 'warning': return 'Cảnh báo';
            case 'info': return 'Thông tin';
            default: return 'Thông báo';
        }
    };

    return (
        <div className={`toast-notification ${type}`}>
            <div className="toast-content">
                <div className="toast-icon-wrapper">
                    <span className="toast-icon">{getIcon()}</span>
                </div>

                <div className="toast-text">
                    <div className="toast-title">{getTitle()}</div>
                    <div className="toast-message">{message}</div>

                    {(type === 'warning' && (onConfirm || onCancel)) && (
                        <div className="toast-actions">
                            {onConfirm && (
                                <button
                                    className="toast-btn-confirm"
                                    onClick={() => {
                                        onConfirm?.();
                                        onClose?.();
                                    }}
                                >
                                    {confirmText || "Xác nhận"}
                                </button>
                            )}
                            {onCancel && (
                                <button
                                    className="toast-btn-cancel"
                                    onClick={() => {
                                        onCancel?.();
                                        onClose?.();
                                    }}
                                >
                                    {cancelText || "Huỷ"}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <button className="toast-close" onClick={onClose} aria-label="Đóng">
                    ×
                </button>
            </div>
        </div>
    );
}

export default Toast;

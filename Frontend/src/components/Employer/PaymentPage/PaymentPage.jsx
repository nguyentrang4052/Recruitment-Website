import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShieldAlt,
    faCheckCircle,
    faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import './PaymentPage.css';
import useToast from '../../../utils/useToast.js';
import Toast from '../../Toast/Toast.jsx';

const API_BASE = 'http://localhost:8080/api/employer/payment';

function PaymentPage({ packageInfo, onGoBack }) {
    const defaultPackage = {
        name: 'TIÊU CHUẨN (Standard)',
        price: 12000000,
        duration: '90 Ngày',
        description: 'Giải pháp toàn diện, tối ưu hóa quá trình tìm kiếm ứng viên tiềm năng.',
        features: ['Đăng 20 tin tuyển dụng', 'Tiếp cận 500 CV cao cấp', 'Báo cáo hiệu suất hàng tuần'],
        taxRate: 10.00,
    };

    const generateFeatures = (pkg) => {
        if (!pkg) return defaultPackage.features;
        const features = [];
        if (pkg.maxPosts) features.push(`Đăng tối đa ${pkg.maxPosts} tin tuyển dụng`);
        else features.push('Đăng tin không giới hạn');
        if (pkg.maxCvViews) features.push(`Xem tối đa ${pkg.maxCvViews} CV ứng viên`);
        else features.push('Xem CV không giới hạn');
        if (pkg.supportPriorityDays > 0) features.push(`Ưu tiên duyệt tin trong vòng ${pkg.supportPriorityDays} ngày`);
        if (pkg.has1on1Consult) features.push('Tư vấn 1-1 với chuyên gia');
        if (pkg.hasEmailSupport) features.push('Hỗ trợ Email 24/7');
        return features.length > 0 ? features : defaultPackage.features;
    };

    const currentPackage = {
        name: packageInfo?.packageName || defaultPackage.name,
        price: packageInfo?.price ?? defaultPackage.price,
        duration: `${packageInfo?.duration || defaultPackage.duration} ngày`,
        description: packageInfo?.description || defaultPackage.description,
        features: generateFeatures(packageInfo),
        taxRate: packageInfo?.taxRate ?? defaultPackage.taxRate,
    };

    const [qrCode, setQrCode] = useState(null);
    const [qrTransactionRef, setQrTransactionRef] = useState(null);
    const [qrChecking, setQrChecking] = useState(false);
    const [qrLoading, setQrLoading] = useState(false);
    const [paymentVerified, setPaymentVerified] = useState(false);
    const [email, setEmail] = useState('');

    const { toast, hideToast, showError, showSuccess } = useToast();

    useEffect(() => {
        const stored = localStorage.getItem('email');
        if (stored) setEmail(stored);
    }, []);

    const taxRateDecimal = currentPackage.taxRate / 100;
    const vatAmount = currentPackage.price * taxRateDecimal;
    const totalAmount = currentPackage.price + vatAmount;

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const getToken = () => localStorage.getItem('token');
    const getEmployerId = () => localStorage.getItem('employerID');

    const postJSON = async (endpoint, body) => {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (!qrTransactionRef) {
            showError('Vui lòng tạo mã QR trước.');
            return;
        }
        if (paymentVerified) {
            showError('Giao dịch đã được xác nhận trước đó.');
            return;
        }
        setQrChecking(true);
        try {
            const empId = getEmployerId();
            if (!empId) throw new Error('Không tìm thấy employerID – vui lòng đăng nhập lại.');
            const res = await postJSON(
                `/verify-qr?transactionRef=${encodeURIComponent(qrTransactionRef)}&employerID=${empId}`,
                { email: email }
            );
            console.log('[QR] verify-qr response:', res);
            if (res.success) {
                showSuccess(res.message || 'Thanh toán QR thành công! Gói đã được kích hoạt.');
                setPaymentVerified(true);
            } else {
                showError(res.message || 'Giao dịch chưa được thanh toán. Vui lòng thực hiện chuyển khoản trước khi xác nhận.');
            }
        } catch (err) {
            showError('Kiểm tra thất bại: ' + err.message);
        } finally {
            setQrChecking(false);
        }
    };

    useEffect(() => {
        const generate = async () => {
            setQrLoading(true);
            const empId = getEmployerId();
            const pkgId = packageInfo?.packageID ?? 1;
            if (!empId) {
                showError('Thiếu thông tin employer – vui lòng đăng nhập lại.');
                setQrLoading(false);
                return;
            }

            const payload = {
                packageID: pkgId,
                employerID: empId,
                amount: totalAmount,
                description: `Thanh toán gói ${currentPackage.name}`,
                currency: 'VND',
            };

            try {
                const res = await fetch(`${API_BASE}/generate-qr`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify(payload),
                });

                const text = await res.text();
                if (!res.ok) throw new Error(text || 'Lỗi mạng');
                const data = JSON.parse(text);

                if (data.success && data.qrCodeData) {
                    const imgRes = await fetch(data.qrCodeData);
                    const blob = await imgRes.blob();
                    setQrCode(URL.createObjectURL(blob));
                    setQrTransactionRef(data.content || data.transactionRef);
                    setPaymentVerified(false);
                } else {
                    showError('Tạo QR thất bại: ' + (data.message || 'Không có dữ liệu'));
                }
            } catch (err) {
                showError('Không tạo được QR: ' + err.message);
            } finally {
                setQrLoading(false);
            }
        };

        generate();
    }, [totalAmount, currentPackage.name, packageInfo, showError]);

    return (
        <>
            <div className="payment-page-container">
                <button className="back-btn" onClick={onGoBack}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Quay lại chọn gói
                </button>

                <h1 className="payment-header">Xác nhận và Thanh toán dịch vụ</h1>
                <p className="payment-subheader">
                    Hoàn tất các bước dưới đây để kích hoạt gói <strong>{currentPackage.name}</strong>.
                </p>

                <div className="payment-layout">
                    <div className="payment-details-form">
                        <div className="section-card package-summary">
                            <h2>Thông tin Gói</h2>
                            <div className="summary-item">
                                <span>Gói dịch vụ: </span>
                                <span className="package-name-summary">{currentPackage.name}</span>
                            </div>
                            <div className="summary-item">
                                <span>Thời hạn: </span>
                                <span>{currentPackage.duration}</span>
                            </div>
                            <ul className="feature-list-summary">
                                {currentPackage.features.map((f, idx) => (
                                    <li key={idx}>
                                        <FontAwesomeIcon icon={faCheckCircle} className="check-icon" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="section-card qr-payment-block">
                            <h2>Quét mã QR để thanh toán</h2>
                            <div className="qr-payment-section">
                                <div className="qr-code-box">
                                    {qrLoading ? (
                                        <div style={{ width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', fontSize: '14px', fontWeight: 600 }}>
                                            Đang tạo mã QR...
                                        </div>
                                    ) : qrCode ? (
                                        <img src={qrCode} alt="QR Code Thanh Toán" style={{ width: 180, height: 180 }} />
                                    ) : (
                                        <div style={{ width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e2e8f0', borderRadius: 8, color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: 20 }}>
                                            Mã QR sẽ xuất hiện ở đây
                                        </div>
                                    )}
                                </div>
                                <div className="qr-info">
                                    <h3>Hướng dẫn thanh toán</h3>
                                    <div className="qr-info-row">
                                        <span className="qr-info-label">Số tiền:</span>
                                        <span className="qr-info-value qr-amount">{formatCurrency(totalAmount)}</span>
                                    </div>
                                    <div className="qr-info-row">
                                        <span className="qr-info-label">Bước 1:</span>
                                        <span className="qr-info-value">Mở ứng dụng ngân hàng/Ví điện tử</span>
                                    </div>
                                    <div className="qr-info-row">
                                        <span className="qr-info-label">Bước 2:</span>
                                        <span className="qr-info-value">Quét mã QR bên cạnh</span>
                                    </div>
                                    <div className="qr-info-row">
                                        <span className="qr-info-label">Bước 3:</span>
                                        <span className="qr-info-value">Xác nhận thanh toán</span>
                                    </div>
                                </div>
                            </div>
                            <p style={{ marginTop: 16, color: '#666', fontSize: '13px', textAlign: 'center' }}>
                                Sau khi thanh toán thành công, gói dịch vụ sẽ được kích hoạt tự động trong vòng 5-10 phút.
                            </p>
                        </div>

                        <form className="payment-form" onSubmit={handlePaymentSubmit}>
                            <div className="section-card">
                                <h2>Thông tin Khách hàng</h2>
                                <label>Email nhận hóa đơn:</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled required />
                            </div>

                            <button type="submit" className="complete-payment-btn" disabled={qrChecking || (paymentVerified)}>
                                {qrChecking
                                    ? 'Đang kiểm tra...'
                                    : paymentVerified
                                        ? '✔ Đã xác nhận'
                                        : `Xác nhận đã quét QR và thanh toán ${formatCurrency(totalAmount)}`}
                            </button>
                        </form>
                    </div>

                    <div className="payment-summary-box">
                        <h3>Chi tiết Thanh toán</h3>
                        <div className="price-row">
                            <span>Giá gói ({currentPackage.name}): </span>
                            <span>{formatCurrency(currentPackage.price)}</span>
                        </div>
                        <div className="price-row">
                            <span>VAT ({currentPackage.taxRate.toFixed(0)}%): </span>
                            <span>{formatCurrency(vatAmount)}</span>
                        </div>
                        <div className="total-row">
                            <strong>Tổng cộng: </strong>
                            <strong>{formatCurrency(totalAmount)}</strong>
                        </div>
                        <div className="security-note">
                            <FontAwesomeIcon icon={faShieldAlt} />
                            Giao dịch của bạn được bảo mật tuyệt đối.
                        </div>
                    </div>
                </div>
            </div>

            {toast && <Toast {...toast} onClose={hideToast} />}
        </>
    );
}

export default PaymentPage;
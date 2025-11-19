import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShieldAlt,
    faCheckCircle,
    faArrowLeft,
    // faUniversity,
    faQrcode,
} from '@fortawesome/free-solid-svg-icons';
import './PaymentPage.css';

const API_BASE = 'http://localhost:8080/api/employer/payment';

function PaymentPage({ packageInfo, onGoBack }) {

    const defaultPackage = {
        name: 'TIÊU CHUẨN (Standard)',
        price: 12000000,
        duration: '90 Ngày',
        description: 'Giải pháp toàn diện, tối ưu hóa quá trình tìm kiếm ứng viên tiềm năng.',
        features: ['Đăng 20 tin tuyển dụng', 'Tiếp cận 500 CV cao cấp', 'Báo cáo hiệu suất hàng tuần'],
        taxRate: 0.1,
    };

    const currentPackage = {
        name: packageInfo?.packageName || defaultPackage.name,
        price: packageInfo?.price ?? defaultPackage.price,
        duration: packageInfo?.duration || defaultPackage.duration,
        description: packageInfo?.description || defaultPackage.description,
        features: packageInfo?.features || defaultPackage.features,
        taxRate: packageInfo?.taxRate ?? defaultPackage.taxRate,
    };

    const [paymentMethod, setPaymentMethod] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBank, setSelectedBank] = useState(null);
    const [bankForm, setBankForm] = useState({
        accountHolder: '',
        accountNumber: '',
        cardNumber: '',
        transferDate: '',
        transferReference: '',
        receiptFileName: '',
    });

    const [qrCode, setQrCode] = useState(null);
    const [qrTransactionRef, setQrTransactionRef] = useState(null);
    const [qrChecking, setQrChecking] = useState(false);
    const [qrLoading, setQrLoading] = useState(false);
    const [paymentVerified, setPaymentVerified] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('email');
        if (stored) setEmail(stored);
    }, []);

    const [banks, setBanks] = useState([]);
    useEffect(() => {
        const token = getToken();
        fetch(`${API_BASE}/banks`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
            .then((res) => {
                if (!res.ok) throw new Error('Không thể tải danh sách ngân hàng');
                return res.json();
            })
            .then((json) => {
                if (json.code === '00') {
                    // Lọc bỏ ví điện tử, chỉ giữ lại ngân hàng 
                    const excludeList = ['momo', 'VTLMONEY', 'VNPTMONEY', 'CAKE', 'Ubank', 'TIMO'];
                    const cleaned = json.data
                        .filter((b) => !excludeList.includes(b.code))
                        .map((b) => ({
                            ...b,
                            logo: b.logo.trim(),
                        }));
                    setBanks(cleaned);
                }
            })
            .catch((err) => console.error('Lỗi tải ngân hàng:', err));
    }, []);

    const filteredBanks = banks.filter(
        (b) =>
            b.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const vatAmount = currentPackage.price * currentPackage.taxRate;
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

    const handleBankSelect = (bankCode) => {
        setSelectedBank(bankCode);
        setBankForm({
            accountHolder: '',
            accountNumber: '',
            cardNumber: '',
            transferDate: '',
            transferReference: '',
            receiptFileName: '',
        });
    };

    const validateBankForm = () => {
        if (!selectedBank) return { ok: false, msg: 'Vui lòng chọn ngân hàng.' };
        if (!bankForm.transferDate) return { ok: false, msg: 'Vui lòng nhập ngày chuyển.' };
        if (!bankForm.accountNumber && !bankForm.cardNumber)
            return { ok: false, msg: 'Vui lòng nhập Số tài khoản HOẶC Số thẻ.' };
        if (!bankForm.accountHolder)
            return { ok: false, msg: 'Vui lòng nhập Tên chủ tài khoản đã thực hiện chuyển khoản.' };
        return { ok: true };
    };

    const fetchCardInfo = async (cardNumber) => {
        if (cardNumber.replace(/\s/g, '').length < 6) return;

        try {
            const res = await fetch(`${API_BASE}/card-info`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ cardNumber }),
            });

            const data = await res.json();
            if (data.success) {
                setBankForm((prev) => ({
                    ...prev,
                    accountHolder: data.cardHolder || '',
                }));
            }
        } catch (err) {
            console.warn('Không lấy được thông tin thẻ:', err);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        if (paymentMethod === 'BANK_TRANSFER') {
            const v = validateBankForm();
            if (!v.ok) return alert(v.msg);

            const payload = {
                amount: totalAmount,
                bankId: selectedBank,
                accountHolder: bankForm.accountHolder,
                accountNumber: bankForm.accountNumber || bankForm.cardNumber,
                transferDate: bankForm.transferDate,
                transferReference: bankForm.transferReference,
                email: email,
            };
            try {
                const res = await postJSON('/bank-transfer', payload);
                alert(res.message || 'Gửi thông tin chuyển khoản thành công!');
            } catch (err) {
                alert('Lỗi gửi thông tin: ' + err.message);
            }
            return;
        }

        if (paymentMethod === 'QR_CODE') {
            if (!qrTransactionRef) return alert('Vui lòng tạo mã QR trước.');
            if (paymentVerified) return alert('Giao dịch đã được xác nhận trước đó.');
            setQrChecking(true);
            try {
                const empId = getEmployerId();
                if (!empId) throw new Error('Không tìm thấy employerID – vui lòng đăng nhập lại.');
                const res = await postJSON(
                    `/verify-qr?transactionRef=${encodeURIComponent(qrTransactionRef)}&employerID=${empId}`,
                    {
                        email: email,
                    }
                );
                console.log('[QR] verify-qr response:', res);
                if (res.success) {
                    alert(res.message || 'Thanh toán QR thành công! Gói đã được kích hoạt.');
                    setPaymentVerified(true);
                } else {
                    alert(res.message || 'Giao dịch chưa được thanh toán. Vui lòng thực hiện chuyển khoản trước khi xác nhận.');
                }
            } catch (err) {
                alert('Kiểm tra thất bại: ' + err.message);
            } finally {
                setQrChecking(false);
            }
            return;
        }

        alert(`Bạn đã chọn thanh toán gói ${currentPackage.name} với tổng ${formatCurrency(totalAmount)}. Vui lòng chọn phương thức thanh toán.`);
    };

    useEffect(() => {
        if (paymentMethod !== 'QR_CODE') {
            setQrCode(null);
            setQrTransactionRef(null);
            setQrLoading(false);
            setPaymentVerified(false);
            return;
        }

        const generate = async () => {
            setQrLoading(true);
            const empId = getEmployerId();
            const pkgId = packageInfo?.packageID ?? 1;
            if (!empId) {
                alert('Thiếu thông tin employer – vui lòng đăng nhập lại.');
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
                    alert('Tạo QR thất bại: ' + (data.message || 'Không có dữ liệu'));
                }
            } catch (err) {
                alert('Không tạo được QR: ' + err.message);
            } finally {
                setQrLoading(false);
            }
        };

        generate();
    }, [paymentMethod, totalAmount, currentPackage.name, packageInfo]);

    return (
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
                            <span>Thời hạn (ngày): </span>
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

                    <div className="section-card payment-method-selection">
                        <h2>Thanh toán</h2>
                        {/* <div
                            className={`method-option bank-transfer-main ${paymentMethod === 'BANK_TRANSFER' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('BANK_TRANSFER')}
                        >
                            <span>Thẻ nội địa và tài khoản ngân hàng</span>
                            <FontAwesomeIcon icon={faUniversity} className="bank-icon-lg" />
                        </div> */}
                        <div
                            className={`method-option qr-payment ${paymentMethod === 'QR_CODE' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('QR_CODE')}
                        >
                            <span>Quét mã QR để thanh toán</span>
                            <FontAwesomeIcon icon={faQrcode} className="qr-icon-lg" />
                        </div>
                    </div>

                    {paymentMethod === 'BANK_TRANSFER' && (
                        <div className="section-card bank-transfer-block">
                            <h2>Chọn Ngân hàng</h2>
                            <div className="bank-search-wrapper">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm ngân hàng..."
                                    className="bank-search-input"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="bank-grid">
                                {filteredBanks.length ? (
                                    filteredBanks.map((bank) => (
                                        <button
                                            key={bank.id}
                                            type="button"
                                            className={`bank-item ${selectedBank === bank.code ? 'active' : ''}`}
                                            onClick={() => handleBankSelect(bank.code)}
                                        >
                                            {bank.logo ? (
                                                <img
                                                    src={bank.logo.trim()}
                                                    alt={bank.shortName}
                                                    className="bank-logo-img"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.parentElement.innerHTML = `<div style="font-size:12px;font-weight:600;color:#64748b;">${bank.shortName}</div>`;
                                                    }}
                                                />
                                            ) : (
                                                <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
                                                    {bank.shortName}
                                                </div>
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#718096' }}>
                                        Không tìm thấy ngân hàng nào.
                                    </p>
                                )}
                            </div>
                            {selectedBank && (
                                <div className="bank-detail-form">
                                    <h3>Thông tin thanh toán từ {banks.find((b) => b.code === selectedBank)?.shortName}</h3>
                                    <label>Số thẻ:</label>
                                    <input
                                        type="text"
                                        placeholder="XXXX XXXX XXXX XXXX"
                                        required
                                        value={bankForm.cardNumber}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setBankForm((prev) => ({ ...prev, cardNumber: value }));
                                            fetchCardInfo(value);
                                        }}
                                    />
                                    <label>Tên chủ thẻ:</label>
                                    <input
                                        type="text"
                                        placeholder="Tên chủ thẻ"
                                        required
                                        value={bankForm.accountHolder}
                                        onChange={(e) => setBankForm((prev) => ({ ...prev, accountHolder: e.target.value }))}
                                    />
                                    <div className="card-info-row">
                                        <div>
                                            <label>Ngày phát hành:</label>
                                            <input type="text" placeholder="MM/YY" required />
                                        </div>
                                        <div>
                                            <label>CVV:</label>
                                            <input type="text" placeholder="XXX" required />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {paymentMethod === 'QR_CODE' && (
                        <div className="section-card qr-payment-block">
                            <h2>Quét mã QR để thanh toán</h2>
                            <div className="qr-payment-section">
                                <div className="qr-code-box">
                                    {qrLoading ? (
                                        <div
                                            style={{
                                                width: 180,
                                                height: 180,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#6366f1',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Đang tạo mã QR...
                                        </div>
                                    ) : qrCode ? (
                                        <img
                                            src={qrCode}
                                            alt="QR Code Thanh Toán"
                                            style={{ width: 180, height: 180 }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML =
                                                    '<div style="color:red;text-align:center;padding:20px;">Không thể hiển thị QR Code</div>';
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: 180,
                                                height: 180,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '2px dashed #e2e8f0',
                                                borderRadius: 8,
                                                color: '#94a3b8',
                                                fontSize: '13px',
                                                textAlign: 'center',
                                                padding: 20,
                                            }}
                                        >
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
                                    {/* <div className="qr-info-row">
                                        <span className="qr-info-label">Nội dung:</span>
                                        <span className="qr-info-value">Thanh toán gói {currentPackage.name}</span>
                                    </div> */}
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
                    )}

                    <form className="payment-form" onSubmit={handlePaymentSubmit}>
                        <div className="section-card">
                            <h2>Thông tin Khách hàng</h2>
                            <label>Email nhận hóa đơn:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="complete-payment-btn"
                            disabled={qrChecking || (paymentMethod === 'QR_CODE' && paymentVerified)}
                        >
                            {paymentMethod === 'QR_CODE'
                                ? qrChecking
                                    ? 'Đang kiểm tra...'
                                    : paymentVerified
                                        ? '✔ Đã xác nhận'
                                        : `Xác nhận đã quét QR và thanh toán ${formatCurrency(totalAmount)}`
                                : `Hoàn Tất Thanh Toán ${formatCurrency(totalAmount)}`}
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
                        <span>VAT (10%): </span>
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
    );
}

export default PaymentPage;
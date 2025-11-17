import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faCheckCircle, faArrowLeft, faUniversity, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { QRCodeCanvas } from 'qrcode.react';
import './PaymentPage.css';

import vietcom from '../../../assets/bank-logos/vietcombank.jpg';
import vietin from '../../../assets/bank-logos/vietinbank.png';
import bidv from '../../../assets/bank-logos/bidv.jpg';
import agribank from '../../../assets/bank-logos/agribank.jpg';
import sacombank from '../../../assets/bank-logos/sacombank.png';
import techcombank from '../../../assets/bank-logos/techcombank.png';
import acb from '../../../assets/bank-logos/acb.jpg';
import vpbank from '../../../assets/bank-logos/vpbank.png';
import vib from '../../../assets/bank-logos/vib.png';
import tpbank from '../../../assets/bank-logos/tpbank.png';

function PaymentPage({ packageInfo, onGoBack }) {
    const defaultPackage = {
        name: "TIÊU CHUẨN (Standard)",
        price: 12000000,
        duration: "90 Ngày",
        description: "Giải pháp toàn diện, tối ưu hóa quá trình tìm kiếm ứng viên tiềm năng.",
        features: ["Đăng 20 tin tuyển dụng", "Tiếp cận 500 CV cao cấp", "Báo cáo hiệu suất hàng tuần"],
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

    const allBanks = [
        { id: 'VCB', name: 'Vietcombank', logoUrl: vietcom },
        { id: 'VTB', name: 'VietinBank', logoUrl: vietin },
        { id: 'BIDV', name: 'BIDV', logoUrl: bidv },
        { id: 'AGR', name: 'Agribank', logoUrl: agribank },
        { id: 'STB', name: 'Sacombank', logoUrl: sacombank },
        { id: 'TCB', name: 'Techcombank', logoUrl: techcombank },
        { id: 'ACB', name: 'ACB', logoUrl: acb },
        { id: 'VPB', name: 'VPBank', logoUrl: vpbank },
        { id: 'VIB', name: 'VIB', logoUrl: vib },
        { id: 'TPB', name: 'TPBank', logoUrl: tpbank },
    ];

    const filteredBanks = allBanks.filter(bank =>
        bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const vatAmount = currentPackage.price * currentPackage.taxRate;
    const totalAmount = currentPackage.price + vatAmount;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleBankSelect = (bankId) => {
        setSelectedBank(bankId);
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
        if (!bankForm.accountNumber && !bankForm.cardNumber) return { ok: false, msg: 'Vui lòng nhập Số tài khoản HOẶC Số thẻ.' };
        if (!bankForm.accountHolder) return { ok: false, msg: 'Vui lòng nhập Tên chủ tài khoản đã thực hiện chuyển khoản.' };
        return { ok: true };
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();

        if (paymentMethod === 'BANK_TRANSFER') {
            const v = validateBankForm();
            if (!v.ok) {
                alert(v.msg);
                return;
            }
            const selectedBankObj = allBanks.find(b => b.id === selectedBank);
            alert(
                `Bạn đã chọn Chuyển khoản (${selectedBankObj ? selectedBankObj.name : 'Không xác định'}).\n` +
                `Tên Chủ TK chuyển: ${bankForm.accountHolder}\n` +
                `Số TK / Thẻ chuyển: ${bankForm.accountNumber || bankForm.cardNumber}\n` +
                `Ngày chuyển: ${bankForm.transferDate}\n` +
                `Mã tham chiếu: ${bankForm.transferReference || '(không)'}\n` +
                `Tổng: ${formatCurrency(totalAmount)}\n` +
                `File biên lai: ${bankForm.receiptFileName || '(chưa tải lên)'}`
            );
            return;
        }

        if (paymentMethod === 'QR_CODE') {
            alert(`Bạn đã chọn thanh toán qua QR Code gói ${currentPackage.name} với tổng ${formatCurrency(totalAmount)}. Vui lòng quét mã QR để hoàn tất thanh toán.`);
            return;
        }

        alert(`Bạn đã chọn thanh toán gói ${currentPackage.name} với tổng ${formatCurrency(totalAmount)} bằng ${paymentMethod}.`);
    };

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
                            <span>Thời hạn: </span>
                            <span>{currentPackage.duration}</span>
                        </div>
                        <ul className="feature-list-summary">
                            {currentPackage.features.map((f, idx) => (
                                <li key={idx}><FontAwesomeIcon icon={faCheckCircle} className="check-icon" /> {f}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="section-card payment-method-selection">
                        <h2>Phương thức Thanh toán</h2>

                        {/* Phương thức Chuyển khoản */}
                        <div
                            className={`method-option bank-transfer-main ${paymentMethod === 'BANK_TRANSFER' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('BANK_TRANSFER')}
                        >
                            <span>Thẻ nội địa và tài khoản ngân hàng</span>
                            <FontAwesomeIcon icon={faUniversity} className="bank-icon-lg" />
                        </div>

                        {/* PHƯƠNG THỨC MỚI: Quét mã QR */}
                        <div
                            className={`method-option qr-payment ${paymentMethod === 'QR_CODE' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('QR_CODE')}
                        >
                            <span>Quét mã QR để thanh toán</span>
                            <FontAwesomeIcon icon={faQrcode} className="qr-icon-lg" />
                        </div>
                    </div>

                    {/* Nội dung Chuyển khoản */}
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
                                {filteredBanks.length > 0 ? (
                                    filteredBanks.map(bank => (
                                        <button
                                            key={bank.id}
                                            type="button"
                                            className={`bank-item ${selectedBank === bank.id ? 'active' : ''}`}
                                            onClick={() => handleBankSelect(bank.id)}
                                        >
                                            {bank.logoUrl ? (
                                                <img src={bank.logoUrl} alt={bank.name} className="bank-logo-img" />
                                            ) : (
                                                <div className="bank-name-hidden">{bank.name}</div>
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#718096' }}>Không tìm thấy ngân hàng nào.</p>
                                )}
                            </div>
                            {selectedBank && (
                                <div className="bank-detail-form">
                                    <h3>Thông tin thanh toán từ {allBanks.find(b => b.id === selectedBank)?.name}</h3>
                                    <label>Số thẻ:</label>
                                    <input
                                        type="text"
                                        placeholder="XXXX XXXX XXXX XXXX"
                                        required
                                        value={bankForm.cardNumber}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setBankForm(prev => ({
                                                ...prev,
                                                cardNumber: value,
                                                accountHolder: value ? 'Nguyễn Văn Trọng' : '',
                                            }));
                                        }}
                                    />
                                    <label>Tên chủ thẻ:</label>
                                    <input
                                        type="text"
                                        placeholder="Tên chủ thẻ"
                                        required
                                        value={bankForm.accountHolder}
                                        onChange={(e) => setBankForm(prev => ({ ...prev, accountHolder: e.target.value }))}
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

                    {/* NỘI DUNG MỚI: QR Code Section */}
                    {paymentMethod === 'QR_CODE' && (
                        <div className="section-card qr-payment-block">
                            <h2>Quét mã QR để thanh toán</h2>
                            <div className="qr-payment-section">
                                <div className="qr-code-box">
                                    <QRCodeCanvas
                                        value={JSON.stringify({
                                            amount: totalAmount,
                                            description: `Thanh toán gói ${currentPackage.name}`,
                                            currency: 'VND',
                                            orderId: `ORDER_${Date.now()}`
                                        })}
                                        size={180}
                                        includeMargin={true}
                                        bgColor="#ffffff"
                                        fgColor="#000000"
                                    />
                                </div>
                                <div className="qr-info">
                                    <h3>Hướng dẫn thanh toán</h3>
                                    <div className="qr-info-row">
                                        <span className="qr-info-label">Số tiền:</span>
                                        <span className="qr-info-value qr-amount">{formatCurrency(totalAmount)}</span>
                                    </div>
                                    <div className="qr-info-row">
                                        <span className="qr-info-label">Nội dung:</span>
                                        <span className="qr-info-value">Thanh toán gói {currentPackage.name}</span>
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
                            <p style={{ marginTop: '16px', color: '#666', fontSize: '13px', textAlign: 'center' }}>
                                Sau khi thanh toán thành công, gói dịch vụ sẽ được kích hoạt tự động trong vòng 5-10 phút.
                            </p>
                        </div>
                    )}

                    <form className="payment-form" onSubmit={handlePaymentSubmit}>
                        <div className="section-card">
                            <h2>Thông tin Khách hàng</h2>
                            <label>Email liên hệ:</label>
                            <input type="email" placeholder="Nhập email của bạn" required />
                            <label>Mã số thuế/Tên công ty (nếu cần hóa đơn):</label>
                            <input type="text" placeholder="Nhập mã số thuế hoặc tên công ty" />
                        </div>

                        <button type="submit" className="complete-payment-btn">
                            {paymentMethod === 'QR_CODE'
                                ? `Xác nhận đã quét QR và thanh toán ${formatCurrency(totalAmount)}`
                                : `Hoàn Tất Thanh Toán ${formatCurrency(totalAmount)}`
                            }
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
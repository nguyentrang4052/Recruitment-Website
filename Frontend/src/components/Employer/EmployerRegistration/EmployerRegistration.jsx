import React, { useState, useEffect } from 'react';
import './EmployerRegistration.css';
import { Link } from 'react-router-dom';
import GZPic1 from '../../../assets/GZConnect1.png';
import GZPic2 from '../../../assets/GZConnect2.png';
import GZPic3 from '../../../assets/GZConnect3.png';
import useToast from '../../../utils/useToast.js';
import Toast from '../../Toast/Toast.jsx';

const EmployerRegistration = () => {
    const images = [GZPic1, GZPic2, GZPic3];


    const { toast, hideToast, showSuccess, showInfo, showError } = useToast();

    const TERMS_OF_SERVICE = `Nhà tuyển dụng phải cung cấp thông tin chính xác, đầy đủ và cập nhật kịp thời. Không được đăng tin sai sự thật, phân biệt đối xử, hoặc vi phạm pháp luật. Dịch vụ cao cấp cần thanh toán theo bảng giá hiện hành. Chúng tôi có quyền khóa tài khoản nếu phát hiện vi phạm mà không cần báo trước.`;

    const PRIVACY_POLICY = `Chúng tôi thu thập tên, email, số điện thoại, tên công ty để phục vụ tuyển dụng. Mật khẩu được mã hóa một chiều; dữ liệu không chia sẻ cho bên thứ ba, trừ khi có yêu cầu pháp lý. Bạn có thể yêu cầu xuất/xóa dữ liệu cá nhân bất kỳ lúc nào qua email hỗ trợ.`;

    const [formData, setFormData] = useState({
        username: '',
        companyName: '',
        contactPerson: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
    });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);


    useEffect(() => {
        const id = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(id);
    }, [images.length]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleCheckboxChange = e => setAgreedToTerms(e.target.checked);


    const handleLinkClick = (title, content) => {
        showInfo(content);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showError('Email không hợp lệ.');
            return;
        }

        const phoneRegex = /^(0|\+84)(\d{9})$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            showError('Số điện thoại không hợp lệ.');
            return;
        }

        if (!agreedToTerms) {
            showError('Bạn phải đồng ý với các điều khoản.');
            return;
        }

        if (formData.password.length < 8) {
            showError('Mật khẩu ít nhất 8 ký tự.');
            return;
        }
        if (!/[A-Z]/.test(formData.password)) {
            showError('Mật khẩu cần 1 chữ hoa.');
            return;
        }
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(formData.password)) {
            showError('Mật khẩu cần 1 ký tự đặc biệt.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            showError('Mật khẩu và xác nhận không khớp!');
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/employer/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                showSuccess(`Đăng ký thành công! Vui lòng kiểm tra email: ${formData.email}`);

                setFormData({
                    username: '',
                    companyName: '',
                    contactPerson: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    phoneNumber: ''
                });
                setAgreedToTerms(false);
            } else {
                const data = await res.json();
                showError(data.message || 'Đăng ký thất bại');
            }
        } catch (err) {
            console.error(err);
            showError('Không thể kết nối server. Vui lòng thử lại sau.');
        }
    };


    return (
        <div className="main-page-container">
            <div className="main-card-container">
                <div className="image-panel">
                    {images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`Slide ${idx + 1}`}
                            className={`image-slide ${idx === currentImageIndex ? 'visible' : ''}`}
                        />
                    ))}
                </div>


                <div className="form-panel">
                    <div className="form-content-wrapper">
                        <h2 className="form-title">Đăng ký tài khoản nhà tuyển dụng</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="username">Tên đăng nhập</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="companyName">Tên công ty</label>
                                <input
                                    type="text"
                                    id="companyName"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="contactPerson">Tên người liên hệ</label>
                                <input
                                    type="text"
                                    id="contactPerson"
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Mật khẩu</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phoneNumber">Số điện thoại</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    id="agreedToTerms"
                                    checked={agreedToTerms}
                                    onChange={handleCheckboxChange}
                                />
                                <label htmlFor="agreedToTerms" className="checkbox-label">
                                    Tôi đã đồng ý với{' '}
                                    <button
                                        type="button"
                                        onClick={() => handleLinkClick('Điều khoản dịch vụ', TERMS_OF_SERVICE)}
                                        className="link-button"
                                    >
                                        Điều khoản dịch vụ
                                    </button>{' '}
                                    và{' '}
                                    <button
                                        type="button"
                                        onClick={() => handleLinkClick('Chính sách bảo mật', PRIVACY_POLICY)}
                                        className="link-button"
                                    >
                                        Chính sách bảo mật
                                    </button>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className={`register-button ${!agreedToTerms ? 'disabled' : ''}`}
                                disabled={!agreedToTerms}
                            >
                                Đăng ký
                            </button>

                            <div className="switch-page-link">
                                Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={hideToast}
                    onConfirm={toast.onConfirm}
                    onCancel={toast.onCancel}
                    confirmText={toast.confirmText}
                    cancelText={toast.cancelText}
                />
            )}
        </div>


    );
};

export default EmployerRegistration;
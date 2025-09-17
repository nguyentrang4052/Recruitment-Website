import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './EmployerRegistration.css';

function EmployerRegistration() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',

    });

    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        setAgreedToTerms(e.target.checked);
    };

    const handleLinkClick = (content) => {
        setModalContent(content);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalContent('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Email không hợp lệ. Vui lòng nhập đúng định dạng email.');
            return;
        }

        const phoneRegex = /^(0|\+84)(\d{9})$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            alert('Số điện thoại không hợp lệ. Vui lòng nhập theo định dạng Việt Nam (VD: 0912345678 hoặc +84912345678).');
            return;
        }

        if (!agreedToTerms) {
            alert('Bạn phải đồng ý với các điều khoản để tiếp tục đăng ký.');
            return;
        }

        if (formData.password.length < 8) {
            alert('Mật khẩu phải có ít nhất 8 ký tự.');
            return;
        }

        if (!/[A-Z]/.test(formData.password)) {
            alert('Mật khẩu phải có ít nhất một chữ cái viết hoa.');
            return;
        }

        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(formData.password)) {
            alert('Mật khẩu phải có ít nhất một ký tự đặc biệt.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('Mật khẩu và xác nhận mật khẩu không khớp!');
            return;
        }

        console.log('Dữ liệu đăng ký:', formData);
        alert(`Đăng ký thành công! Vui lòng kiểm tra email của bạn tại ${formData.email} để xác nhận.`);

        navigate('/login');
    };


    return (
        <div className="main-container">
            <div className="image-container">
                <img src="" alt="Website visual" className="website-image" />
            </div>
            <div className="form-wrapper">
                <div className="registration-card">
                    <h2>Đăng ký tài khoản nhà tuyển dụng</h2>
                    <form onSubmit={handleSubmit}>
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

                        <div className="form-group checkbox-group">
                            <input
                                type="checkbox"
                                id="agreedToTerms"
                                checked={agreedToTerms}
                                onChange={handleCheckboxChange}
                            />
                            <label htmlFor="agreedToTerms" className="checkbox-label">
                                Tôi đã đọc và đồng ý với{' '}
                                <button
                                    onClick={() => handleLinkClick('Đây là nội dung Điều khoản dịch vụ...')}
                                    className="link-button"
                                >
                                    Điều khoản dịch vụ
                                </button>{' '}
                                và{' '}
                                <button
                                    onClick={() => handleLinkClick('Đây là nội dung Chính sách bảo mật...')}
                                    className="link-button"
                                >
                                    Chính sách bảo mật
                                </button>
                            </label>
                        </div>
                        <button type="submit" className="register-button" disabled={!agreedToTerms}>
                            Đăng ký
                        </button>
                        <div className="switch-page-link">
                            Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                        </div>
                    </form>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-content">
                            <h3>{modalContent.includes('Điều khoản') ? 'Điều khoản dịch vụ' : 'Chính sách bảo mật'}</h3>
                            <p>{modalContent}</p>
                            <button className="modal-close-button" onClick={closeModal}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmployerRegistration;
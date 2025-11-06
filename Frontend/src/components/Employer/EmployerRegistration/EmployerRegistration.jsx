<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './EmployerRegistration.css';

function EmployerRegistration() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
=======
import React, { useState, useEffect } from 'react';
import './EmployerRegistration.css';
import { Link } from 'react-router-dom';
import GZPic1 from '../../../assets/GZConnect1.png';
import GZPic2 from '../../../assets/GZConnect2.png';
import GZPic3 from '../../../assets/GZConnect3.png';

const EmployerRegistration = () => {
    const images = [GZPic1, GZPic2, GZPic3];

    const [formData, setFormData] = useState({
        username: '',
>>>>>>> origin/Trong
        companyName: '',
        contactPerson: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
<<<<<<< HEAD

=======
>>>>>>> origin/Trong
    });

    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showModal, setShowModal] = useState(false);
<<<<<<< HEAD
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
=======
    const [modalContent, setModalContent] = useState({ title: '', message: '' });
    const [currentImageIndex, setCurrentImageIndex] = useState(0);


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);


    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = e => setAgreedToTerms(e.target.checked);
    const handleLinkClick = (title, message) => {
        setModalContent({ title, message });
        setShowModal(true);
    };
    const closeModal = () => setShowModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

       
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            handleLinkClick('Lỗi', 'Email không hợp lệ.');
>>>>>>> origin/Trong
            return;
        }

        const phoneRegex = /^(0|\+84)(\d{9})$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
<<<<<<< HEAD
            alert('Số điện thoại không hợp lệ. Vui lòng nhập theo định dạng Việt Nam (VD: 0912345678 hoặc +84912345678).');
=======
            handleLinkClick('Lỗi', 'Số điện thoại không hợp lệ.');
>>>>>>> origin/Trong
            return;
        }

        if (!agreedToTerms) {
<<<<<<< HEAD
            alert('Bạn phải đồng ý với các điều khoản để tiếp tục đăng ký.');
=======
            handleLinkClick('Lỗi', 'Bạn phải đồng ý với các điều khoản.');
>>>>>>> origin/Trong
            return;
        }

        if (formData.password.length < 8) {
<<<<<<< HEAD
            alert('Mật khẩu phải có ít nhất 8 ký tự.');
=======
            handleLinkClick('Lỗi', 'Mật khẩu ít nhất 8 ký tự.');
>>>>>>> origin/Trong
            return;
        }

        if (!/[A-Z]/.test(formData.password)) {
<<<<<<< HEAD
            alert('Mật khẩu phải có ít nhất một chữ cái viết hoa.');
=======
            handleLinkClick('Lỗi', 'Mật khẩu cần 1 chữ hoa.');
>>>>>>> origin/Trong
            return;
        }

        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(formData.password)) {
<<<<<<< HEAD
            alert('Mật khẩu phải có ít nhất một ký tự đặc biệt.');
=======
            handleLinkClick('Lỗi', 'Mật khẩu cần 1 ký tự đặc biệt.');
>>>>>>> origin/Trong
            return;
        }

        if (formData.password !== formData.confirmPassword) {
<<<<<<< HEAD
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
=======
            handleLinkClick('Lỗi', 'Mật khẩu và xác nhận không khớp!');
            return;
        }

 
        try {
            const response = await fetch('http://localhost:8080/api/employer/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    companyName: formData.companyName,
                    confirmPassword: formData.confirmPassword,
                    contactPerson: formData.contactPerson,
                    email: formData.email,
                    password: formData.password,
                    phoneNumber: formData.phoneNumber
                })
            });

            const data = await response.json();

            if (response.ok) {
                handleLinkClick('Đăng ký thành công!', `Vui lòng kiểm tra email: ${formData.email}`);
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
                handleLinkClick('Lỗi', data.message || 'Đăng ký thất bại');
            }
        } catch (error) {
            handleLinkClick('Lỗi', 'Không thể kết nối server. Vui lòng thử lại sau.');
            console.error('API error:', error);
        }
    };

    return (
        <div className="main-page-container">
            <div className="main-card-container">
                <div className="image-panel">
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Slide ${index + 1}`}
                            className={`image-slide ${index === currentImageIndex ? 'visible' : ''}`}
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
                                        onClick={() => handleLinkClick('Điều khoản dịch vụ', 'Nội dung điều khoản...')}
                                        className="link-button"
                                    >
                                        Điều khoản dịch vụ
                                    </button>{' '}
                                    và{' '}
                                    <button
                                        type="button"
                                        onClick={() => handleLinkClick('Chính sách bảo mật', 'Nội dung chính sách...')}
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
>>>>>>> origin/Trong
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-content">
<<<<<<< HEAD
                            <h3>{modalContent.includes('Điều khoản') ? 'Điều khoản dịch vụ' : 'Chính sách bảo mật'}</h3>
                            <p>{modalContent}</p>
                            <button className="modal-close-button" onClick={closeModal}>Đóng</button>
=======
                            <h3 className="modal-title">{modalContent.title}</h3>
                            <p>{modalContent.message}</p>
                            <button onClick={closeModal} className="modal-close-button">
                                Đóng
                            </button>
>>>>>>> origin/Trong
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
<<<<<<< HEAD
}

export default EmployerRegistration;
=======
};

export default EmployerRegistration;
>>>>>>> origin/Trong

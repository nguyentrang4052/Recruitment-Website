import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [countdown, setCountdown] = useState(180);   // 3 phút
    const navigate = useNavigate();

    useEffect(() => {
        if (step === 2 && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && step === 2) {
            handleResendOtp();
        }
    }, [step, countdown]);


    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLongEnough = password.length >= 8;

        if (!isLongEnough) {
            return 'Mật khẩu phải có ít nhất 8 ký tự.';
        }
        if (!hasUpperCase) {
            return 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa.';
        }
        if (!hasSpecialChar) {
            return 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt.';
        }
        return null;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Email không hợp lệ.";
        }
        return null;
    };


    const handleSendEmail = async (e) => {
        e.preventDefault();

        // Kiểm tra định dạng email
        const emailError = validateEmail(email);
        if (emailError) {
            alert(emailError);
            return;
        }

        // API kiểm tra email đã đăng ký chưa 
        const existingEmails = ["nguyenvantrong3254@gmail.com"]; // giả lập
        const isRegistered = existingEmails.includes(email);

        if (!isRegistered) {
            alert("Email chưa được đăng ký tài khoản.");
            return;
        }
        console.log('Gửi yêu cầu OTP đến email:', email);
        // Gọi API để gửi email với OTP
        alert('Mã OTP đã được gửi đến email của bạn.');
        setStep(2);
        setCountdown(180);
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        console.log('Xác thực OTP:', otp);
        // Gọi API để xác thực OTP
        if (otp === '123456') { // Giả lập OTP đúng
            alert('Mã OTP hợp lệ. Bây giờ bạn có thể đặt lại mật khẩu.');
            setStep(3);
        } else {
            alert('Mã OTP không hợp lệ. Vui lòng thử lại.');
        }
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            alert(passwordError);
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('Mật khẩu mới và xác nhận mật khẩu không khớp.');
            return;
        }
        console.log('Đặt lại mật khẩu mới:', newPassword);
        alert('Mật khẩu của bạn đã được thay đổi thành công!');
        navigate('/login');
    };

    const handleResendOtp = () => {
        setStep(1);
        setOtp('');
        setCountdown(180);
        alert('Thời gian hết hạn, vui lòng gửi lại mã OTP.');
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <form onSubmit={handleSendEmail}>
                        <div className="form-groups">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="forgot-password-button">Gửi yêu cầu</button>
                    </form>
                );
            case 2:
                {
                const formatTime = (seconds) => {
                    const minutes = Math.floor(seconds / 60);
                    const remainingSeconds = seconds % 60;
                    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
                };

                return (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="form-groups">
                            <label htmlFor="otp">
                                Nhập mã OTP (hết hạn trong {formatTime(countdown)})
                            </label>
                            <input
                                type="text"
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="forgot-password-button">Xác nhận mã OTP</button>
                    </form>
                );
                }
            case 3:
                return (
                    <form onSubmit={handleResetPassword}>
                        <div className="form-groups">
                            <label htmlFor="newPassword">Mật khẩu mới</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-groups">
                            <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="forgot-password-button">Đổi mật khẩu</button>
                    </form>
                );
            default:
                return null;
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <h2>Quên Mật Khẩu</h2>
                {renderStep()}
            </div>
        </div>
    );
};

export default ForgotPassword;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import './ForgotPassword.css';
import axios from 'axios';
import useToast from '../../../utils/useToast.js';
import Toast from '../../Toast/Toast.jsx';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const { toast, hideToast, showError, showSuccess } = useToast();

    const validatePassword = (password) => {
        if (password.length < 8) {
            showError('Mật khẩu phải có ít nhất 8 ký tự.');
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            showError('Mật khẩu phải chứa ít nhất một chữ cái viết hoa.');
            return false;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            showError('Mật khẩu phải chứa ít nhất một ký tự đặc biệt.');
            return false;
        }
        return true;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) ? null : "Email không hợp lệ.";
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();
        const emailError = validateEmail(email);
        if (emailError) {
            showError(emailError);
            return;
        }
        try {
            const response = await axios.post("http://localhost:8080/api/auth/forgot-password", { email });
            setStep(2);
            showSuccess(response.data.message);
        } catch {
            showError('Gửi OTP thất bại');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/verify-otp', { email, otp });
            if (response.data.success) {
                setStep(3);
                showSuccess(response.data.message);
            } else {
                showError('Mã OTP không hợp lệ. Vui lòng thử lại.');
            }
        } catch (error) {
            showError(error.response?.data?.message || 'Không thể kết nối server!');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!validatePassword(newPassword)) {

            return;
        }
        if (newPassword !== confirmPassword) {
            showError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/reset-password', {
                email,
                otp,
                password: newPassword,
                confirmPassword
            });

            if (response.data.success) {
                showSuccess(response.data.message);
                navigate('/login');
            } else {
                showError(response.data.message);
            }
        } catch {
            showError('Có lỗi xảy ra, vui lòng thử lại.');
        }
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
                return (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="form-groups">
                            <OtpInput
                                value={otp}
                                onChange={setOtp}
                                numInputs={6}
                                isInputNum
                                shouldAutoFocus
                                renderInput={(props) => <input {...props} className="otp-box" />}
                            />
                        </div>
                        <button type="submit" className="forgot-password-button">Xác nhận mã OTP</button>
                    </form>
                );
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


            {toast && <Toast {...toast} onClose={hideToast} />}
        </div>
    );
};

export default ForgotPassword;
import React, { useState } from 'react'
import axios from 'axios'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from "@react-oauth/google";
import { isTokenExpired } from '../../../utils/Auth'
import Toast from '../../Toast/Toast.jsx'
import useToast from '../../../utils/useToast.js'


function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const token = localStorage.getItem('token')
    const roleName = localStorage.getItem('roleName')

     const { toast, showError, hideToast } = useToast();

    if (token && !isTokenExpired(token) && roleName == "applicant") {
        navigate('/dashboard')
    }
    else if (token && !isTokenExpired(token) && roleName == "employer") {
        navigate('/employer-dashboard')
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', { username, password })

            const { token, email, roleName, applicantID } = response.data;
            localStorage.setItem('email', email)
            localStorage.setItem('token', token)
            localStorage.setItem('roleName', roleName)
            localStorage.setItem('applicantID', applicantID);
            if (roleName == "applicant") {
                navigate('/dashboard')
            }
            else if (roleName == "employer") {
                navigate('/employer-dashboard')
            } else {
                navigate('/admin')
            }
        }
        catch (error) {
            if (error.response && error.response.status === 401) {
               showError(error.response.data)
            } else {
                showError("Có lỗi xảy ra. Vui lòng thử lại sau.")
            }
        }
    }

    const handleGoogleLogin = async (response) => {
        const idToken = response.credential;
        try {
            const res = await axios.post('http://localhost:8080/api/auth/google', { idToken });

            const { token, email, roleName, applicantID } = res.data;

            if (!token) {
                return;
            }

            localStorage.setItem('token', token);
            localStorage.setItem('email', email);
            localStorage.setItem('roleName', roleName);
            localStorage.setItem('applicantID', applicantID);

            if (roleName === "applicant") {
                navigate('/dashboard');
            } else if (roleName === "employer") {
                navigate('/employer-dashboard');
            } else {
                navigate('/login');
            }

        } catch (error) {
            if (error.response && error.response.status === 401) {
                showError(error.response.data)
            } else {
                showError("Đăng nhập với google thất bại. Vui lòng thử lại sau.")
            }
        }
    };


    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Đăng nhập</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-groups">
                        <label htmlFor="username">Tên đăng nhập</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-groups">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button" > Đăng nhập </button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>

                <div className="forgot-password-link">
                    <Link to="/forgot-password">Quên mật khẩu?</Link>
                </div>

                <div className="social-login">
                    <p>Hoặc đăng nhập với</p>
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => setError("Đăng nhập bằng Google thất bại.")}
                    />
                </div>

                <div className="switch-page-link">
                    Bạn chưa có tài khoản? <Link to="/signup">Đăng ký</Link>
                </div>
            </div>
            {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={hideToast}
        />
      )}
        </div>
    )
}

export default Login

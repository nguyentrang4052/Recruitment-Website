import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from "@react-oauth/google";
import { isTokenExpired } from '../../../utils/Auth';

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    useEffect(() => {
        const token = localStorage.getItem('token')
        const roleName = localStorage.getItem('roleName')

        if (token && !isTokenExpired(token)) {
            if (roleName === "applicant") {
                navigate('/dashboard', { replace: true })
            } else if (roleName === "employer") {
                navigate('/employer-dashboard', { replace: true })
            }
        }
    }, [navigate])


    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', { username, password })
            const { token, email, roleName, applicantID, employerID, employerName } = response.data

            localStorage.setItem('token', token)
            localStorage.setItem('email', email)
            localStorage.setItem('roleName', roleName)
            localStorage.setItem('username', username)
            if (applicantID) localStorage.setItem('applicantID', applicantID)
            if (employerID) {
                localStorage.setItem('employerID', employerID);
                localStorage.setItem('employerName', employerName);
            }

            if (roleName === "applicant") {
                navigate('/dashboard', { replace: true })
            } else if (roleName === "employer") {
                navigate('/employer-dashboard', { replace: true })
            }
            else if (roleName.toLowerCase() === "admin") {
                navigate('/admin', { replace: true })
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError(err.response.data?.message || "Sai tên người dùng hoặc mật khẩu")
            } else {
                setError("Có lỗi xảy ra. Vui lòng thử lại sau.")
            }
        } finally {
            setLoading(false)
        }
    }


    const handleGoogleLogin = async (response) => {
        console.log("Google login response:", response)
        const idToken = response?.credential

        if (!idToken) {
            setError("Không nhận được idToken từ Google")
            return
        }

        try {
            const res = await axios.post('http://localhost:8080/api/auth/google', { idToken })
            const { token, email, roleName, applicantID, employerID } = res.data

            if (!token) {
                setError("Backend không trả về token")
                return
            }

            localStorage.setItem('token', token)
            localStorage.setItem('email', email)
            localStorage.setItem('roleName', roleName)
            if (applicantID) localStorage.setItem('applicantID', applicantID)
            if (employerID) localStorage.setItem('employerID', employerID)

            if (roleName === "applicant") {
                navigate('/dashboard', { replace: true })
            } else if (roleName === "employer") {
                navigate('/employer-dashboard', { replace: true })
            } else {
                console.warn("Role không xác định, chuyển về login")
                navigate('/login')
            }
        } catch (err) {
            console.error("Đăng nhập bằng Google thất bại:", err)
            setError("Đăng nhập bằng Google thất bại. Vui lòng thử lại.")
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Đăng nhập</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-groups">
                        <label htmlFor="username">Tên người dùng</label>
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
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
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
        </div>
    )
}

export default Login
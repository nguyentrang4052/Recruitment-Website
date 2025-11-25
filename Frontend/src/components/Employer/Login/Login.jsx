import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from "@react-oauth/google"
import { isTokenExpired } from '../../../utils/Auth'

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
            const response = await axios.post('http://localhost:8080/api/auth/login', { 
                username, 
                password 
            })
            const { token, email, roleName, applicantID, employerID, employerName } = response.data

            localStorage.setItem('token', token)
            localStorage.setItem('email', email)
            localStorage.setItem('roleName', roleName)
            localStorage.setItem('username', username)
            if (applicantID) localStorage.setItem('applicantID', applicantID)
            if (employerID) {
                localStorage.setItem('employerID', employerID)
                localStorage.setItem('employerName', employerName)
            }

            if (roleName === "applicant") {
                navigate('/dashboard', { replace: true })
            } else if (roleName === "employer") {
                navigate('/employer-dashboard', { replace: true })
            } else if (roleName.toLowerCase() === "admin") {
                navigate('/admin', { replace: true })
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError(err.response.data?.message || "Tên đăng nhập hoặc mật khẩu không chính xác")
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
            setError("Không thể đăng nhập bằng Google. Vui lòng thử lại.")
            return
        }

        setLoading(true)
        setError('')

        try {
            const res = await axios.post('http://localhost:8080/api/auth/employer/google', { idToken })
            const { token, email, roleName, username, employerID, employerName } = res.data

            if (!token) {
                setError("Không thể xác thực. Vui lòng thử lại.")
                return
            }

            localStorage.setItem('token', token)
            localStorage.setItem('email', email)
            localStorage.setItem('roleName', roleName)
            localStorage.setItem('username', username)
            if (employerID) {
                localStorage.setItem('employerID', employerID)
                if (employerName) localStorage.setItem('employerName', employerName)
            }

            if (roleName === "employer") {
                navigate('/employer-dashboard', { replace: true })
            } else {
                console.warn("Role không xác định, chuyển về login")
                setError("Tài khoản Google này chưa được đăng ký với vai trò nhà tuyển dụng.")
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError(error.response.data)
            } else {
                setError("Đăng nhập với google thất bại. Vui lòng thử lại sau.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-emp-container">
            <div className="login-emp-card">
                <h2>Đăng Nhập Nhà Tuyển Dụng</h2>
                <p className="login-subtitle">Quản lý tuyển dụng IT chuyên nghiệp</p>
                
                <form onSubmit={handleLogin}>
                    <div className="form-groups">
                        <label htmlFor="username">Tên đăng nhập</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nhập tên đăng nhập"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="form-groups">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu"
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="forgot-password-link">
                        <Link to="/forgot-password">Quên mật khẩu?</Link>
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Đang xử lý..." : "Đăng Nhập"}
                    </button>
                    
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>

                <div className="social-login">
                    <p>Hoặc đăng nhập với</p>
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => setError("Đăng nhập bằng Google thất bại.")}
                        disabled={loading}
                    />
                </div>

                <div className="switch-page-link">
                    Chưa có tài khoản nhà tuyển dụng? <Link to="/signup">Đăng ký ngay</Link>
                </div>
            </div>
        </div>
    )
}

export default Login
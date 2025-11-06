<<<<<<< HEAD
import React, { useState } from 'react'
import axios from 'axios'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { GoogleLogin } from "@react-oauth/google";
import { isTokenExpired } from '../../../utils/Auth'

=======
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from "@react-oauth/google";
import { isTokenExpired } from '../../../utils/Auth';
>>>>>>> origin/Trong

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
<<<<<<< HEAD
    const navigate = useNavigate()

    const token = localStorage.getItem('token')
    const roleName = localStorage.getItem('roleName')
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
            // const token = response.data.token
            // const roleName = response.data.roleName
            // localStorage.setItem('email', response.data.email)
            localStorage.setItem('email', email)
            localStorage.setItem('token', token)
            localStorage.setItem('roleName', roleName)
            localStorage.setItem('applicantID', applicantID);
            if (roleName == "applicant") {
                navigate('/dashboard')
            }
            else if (roleName == "employer") {
                navigate('/employer-dashboard')
            }
        }
        catch (error) {
            if (error.response && error.response.status === 401) {
                setError(error.response.data)
            } else {
                setError("Có lỗi xảy ra. Vui lòng thử lại sau.")
            }
        }
    }

    const handleGoogleLogin = async (response) => {
        const idToken = response.credential;
        console.log("Google ID Token:", idToken);
        if (!idToken) {
            console.error("Không nhận được idToken từ Google");
            return;
        }

        try {
            const res = await axios.post('http://localhost:8080/api/auth/google', { idToken });

            const { token, email, roleName, applicantID } = res.data;

            if (!token) {
                console.error("Backend không trả về token");
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
                console.warn("Role không xác định, chuyển về login");
                navigate('/login');
            }

        } catch (err) {
            console.error("Đăng nhập bằng Google thất bại:", err);
            alert("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
        }
    };

=======
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    useEffect(() => {
        const token = localStorage.getItem('token')
        const roleName = localStorage.getItem('roleName')

        if (token && !isTokenExpired(token)) {
            if (roleName === "applicant") {
                navigate('/dashboard')
            } else if (roleName === "employer") {
                navigate('/employer-dashboard')
            }
        }
    }, [navigate])


    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', { username, password })
            const { token, email, roleName, applicantID, employerID } = response.data

            localStorage.setItem('token', token)
            localStorage.setItem('email', email)
            localStorage.setItem('roleName', roleName)
            if (applicantID) localStorage.setItem('applicantID', applicantID)
            if (employerID) localStorage.setItem('employerID', employerID)

            if (roleName === "applicant") {
                navigate('/dashboard')
            } else if (roleName === "employer") {
                navigate('/employer-dashboard')
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
                navigate('/dashboard')
            } else if (roleName === "employer") {
                navigate('/employer-dashboard')
            } else {
                console.warn("Role không xác định, chuyển về login")
                navigate('/login')
            }
        } catch (err) {
            console.error("Đăng nhập bằng Google thất bại:", err)
            setError("Đăng nhập bằng Google thất bại. Vui lòng thử lại.")
        }
    }
>>>>>>> origin/Trong

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
<<<<<<< HEAD
                    <button type="submit" className="login-button" > Đăng nhập </button>
=======
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
>>>>>>> origin/Trong
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

<<<<<<< HEAD
export default Login
=======
export default Login
>>>>>>> origin/Trong

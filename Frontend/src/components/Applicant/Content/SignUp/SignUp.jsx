import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from "axios"
import './SignUp.css'
import Footer from './../../Footer/Footer.jsx'
import Toast from '../../../Toast/Toast.jsx'
import useToast from '../../../../utils/useToast.js'

const API_URL = import.meta.env.VITE_API_URL;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
const usernameRegex = /^[a-z0-9]+$/

function validatePassword(password) {
    if (!passwordRegex.test(password)) {
        return "Mật khẩu phải >= 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
    }
    return null
}

function validateUsername(username) {
    if (!usernameRegex.test(username)) {
        return "Tên đăng nhập chỉ được chứa chữ thường và số, không có khoảng trắng hoặc ký tự đặc biệt."
    }
    return null
}

function SignUp() {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        applicantName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    })
    const navigate = useNavigate()
    const { toast, showError, hideToast } = useToast()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        hideToast()

        if (formData.password !== formData.confirmPassword) {
            showError("Mật khẩu và xác nhận mật khẩu không khớp")
            return
        }

        const usernameErr = validateUsername(formData.username)
        if (usernameErr) {
            showError(usernameErr)
            return
        }

        const passwordErr = validatePassword(formData.password)
        if (passwordErr) {
            showError(passwordErr)
            return
        }

        setIsLoading(true)

        try {
            const response = await axios.post(`${API_URL}/api/auth/signup`, formData)
            setIsLoading(false)

            if (!response.data.success) {
                showError(response.data.message || "Đăng ký thất bại")
                return
            }

            localStorage.setItem("signupEmail", formData.email)
            navigate("/verify-otp")

        } catch (err) {
            setIsLoading(false)

            if (err.response && err.response.data) {
                showError(err.response.data.message || "Lỗi không xác định.")
            } else {
                showError("Lỗi không xác định.")
            }
        }
    }

    return (
        <>
            <div className="signup-form">
                <h2>Đăng ký</h2>
                <form onSubmit={handleSubmit} >
                    <input type="text" placeholder="Họ và tên" name="applicantName" value={formData.applicantName} onChange={handleChange} required />
                    <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
                    <input type="text" placeholder="Tên đăng nhập" name="username" value={formData.username} onChange={handleChange} autoComplete="new-username" required />
                    <input type="password" placeholder="Mật khẩu" name="password" value={formData.password} onChange={handleChange} autoComplete="new-password" required />
                    <input type="password" placeholder="Xác nhận mật khẩu" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                    <button className="signup-btn" type="submit" disabled={isLoading}>
                        {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                    {isLoading && <div className="loading-spinner">Đang tải...</div>}
                    <p>Đã có tài khoản? <Link to="/applicant-login">Đăng nhập</Link></p>
                </form>
            </div>
            <Footer />
            {toast && (
                <Toast 
                    message={toast.message || "Thông báo"} 
                    type={toast.type} 
                    duration={toast.duration}
                    onClose={hideToast} 
                />
            )}
        </>
    )
}

export default SignUp

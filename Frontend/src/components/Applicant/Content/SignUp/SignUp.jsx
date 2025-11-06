import {Link, useNavigate} from 'react-router-dom'
import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import axios from "axios"
import './SignUp.css'
import Footer from './../../Footer/Footer.jsx'
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

function validatePassword(password) {
    if (!passwordRegex.test(password)) {
        return "Mật khẩu phải >= 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
    }
    return null
}

const usernameRegex = /^[a-z0-9]+$/
function validateUsername(username) {
    if (!usernameRegex.test(username)) {
        return "Tên đăng nhập chỉ được chứa chữ thường và số, không có khoảng trắng hoặc ký tự đặc biệt."
    }
    return null
}


function SignUp() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        applicantName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu và xác nhận mật khẩu không khớp")
            return
        }
        
        const usernameErr = validateUsername(formData.username)
        if (usernameErr)
        {
            setError(usernameErr)
            return
        }
        
        const passwordErr = validatePassword(formData.password)
        if (passwordErr)
        {
            setError(passwordErr)
            return
        }

        setIsLoading(true)
        setError(null)
        try {
            const response = await axios.post('http://localhost:8080/api/auth/signup', formData)
            
            setError(response.data.message)
            localStorage.setItem("signupEmail", formData.email)
            navigate("/verify-otp")
            setIsLoading(false)

        } catch (err) {
            setIsLoading(false)

            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message)
            } else {
                setError("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.")
            }
        }
    }

   
    return(
        <>
        <div className="signup-form">
            <h2>Đăng ký</h2>    
            <form onSubmit={handleSubmit} >
            <input type="text" placeholder="Họ và tên" name="applicantName" value={formData.applicantName} onChange={handleChange} required/>    
            <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required/>
            <input type="text" placeholder="Tên đăng nhập" name="username" value={formData.username} onChange={handleChange} autoComplete="new-username" required/>
            <input type="password" placeholder="Mật khẩu" name="password" value={formData.password} onChange={handleChange} autoComplete="new-password" required/>
            <input type="password" placeholder="Xác nhận mật khẩu" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required/>
            <button className="signup-btn" type="submit" disabled={isLoading}>
                    {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>
             {isLoading && <div className="loading-spinner">Đang tải...</div>}
             {error && <div className="error-message">{error}</div>}
            <p>Đã có tài khoản? <Link to = "/login">Đăng nhập</Link></p>

            </form>       
        </div>
        <Footer />
        </>
    )
 }

 export default SignUp
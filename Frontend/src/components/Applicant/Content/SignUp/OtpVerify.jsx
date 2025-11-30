import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OtpVerify.css'

function OtpVerifyPage() {
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()


  const handleVerify = async (e) => {

    e.preventDefault();
    const email = localStorage.getItem('signupEmail')
    
    if (!email || otp.length < 6) {
      setMessage("Vui lòng nhập OTP đầy đủ.")
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post('http://localhost:8080/api/auth/verify-email', { email, otp })

      const success = res.data.success;
      if (success) {
        navigate('/applicant-login')
        setLoading(true)
        window.location.reload(); 
      }
      else
        setError(res.data.message)

    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError(error.response.data);
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại sau.")
      }
    } finally {
      setLoading(false)
    }


  };

  return (
    <div className="otp-container">
      <h2>Xác minh OTP</h2>

      <form onSubmit={handleVerify} className="otp-form">
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          isInputNum
          shouldAutoFocus
          renderInput={(props) => <input {...props} className="otp-box" />}
        />


        <button type="submit" disabled={loading || otp.length < 6} className="otp-button">
          {loading ? 'Đang xác minh...' : 'Xác minh'}
        </button>
      </form>

      {message && <p className="otp-message">{message}</p>}
      {error && <p className="otp-message">{error}</p>}
    </div>
  )
}

export default OtpVerifyPage;

import React, { useState } from 'react';
import './ForgotPass.css';


function ForgotPass() {
    const [isSubmit, setIsSubmit] = useState(false);

    const handleSubmit = () =>{
        setIsSubmit(true);
    };

  return(
   <div className="forgotpass-form">
    {!isSubmit ? (
        <>
      <h2>Quên mật khẩu</h2> 
      <p>Vui lòng nhập email của bạn để nhận liên kết đặt lại mật khẩu.</p>           
      <input type="text" placeholder="Nhập email" />
      <div className='forgotpass-container'>
        <button className="forgotpass-btn" onClick={handleSubmit}>Gửi yêu cầu</button>
      </div>       
    </>
    ): 
    (
        <div className='submit-message'>
            <h2>Yêu cầu đã được gửi</h2> 
            <p>Vui lòng kiểm tra email của bạn để nhận liên kết đặt lại mật khẩu.</p>   
        </div>
    )}  
    </div>
    );
}
export default ForgotPass;
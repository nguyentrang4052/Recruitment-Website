import {Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
    const navigate = useNavigate();

    const handleSignUpClick = () => {
      navigate('/dashboard');
    };

    return(
        <div className="signup-form">
            <h2>Đăng ký</h2>        
            <input type="text" placeholder="Họ và tên" />    
            <input type="text" placeholder="Email" />
            <input type="text" placeholder="Tên đăng nhập" />
            <input type="password" placeholder="Mật khẩu" />
            <input type="password" placeholder="Xác nhận mật khẩu" />
            <button className="signup-btn" onClick={handleSignUpClick}>Đăng ký</button>
            <p>Đã có tài khoản? <Link to = "/login">Đăng nhập</Link></p>
            <div className="social-login">
                <button className="google-login">Google</button>
                <button className="facebook-login">Facebook</button>
            </div>      
        </div>
    );
 }

 export default SignUp;
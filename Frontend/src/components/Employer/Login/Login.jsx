import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Đăng nhập với:', { username, password });
        alert('Đăng nhập thành công!');
        navigate('/employer-dashboard');
    };

    const handleGoogleLogin = () => {
        console.log('Đăng nhập bằng Google');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Đăng nhập</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Tên người dùng</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Đăng nhập</button>
                </form>

                <div className="forgot-password-link">
                    <Link to="/forgot-password">Quên mật khẩu?</Link>
                </div>

                <div className="social-login">
                    <p>Hoặc đăng nhập với</p>
                    <button onClick={handleGoogleLogin} className="google-button">
                        <FontAwesomeIcon icon={faGoogle} />
                        Google
                    </button>
                </div>

                <div className="switch-page-link">
                    Bạn chưa có tài khoản? <Link to="/">Đăng ký</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;

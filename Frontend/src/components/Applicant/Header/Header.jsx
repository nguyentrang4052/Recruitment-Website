import React from 'react';
import './Header.css';  

function Header() {
  return (
    <div className="header">
      <div className="header-left">
        <img src="logo.png" alt="Logo" className="logo" />
        <nav className="nav-menu">
          <div className="nav-item">
            <a>Tìm việc làm</a>
            <ul className="dropdown">
              <li><a href="#">Việc làm IT</a></li>
              <li><a href="#">Việc làm Marketing</a></li>
              <li><a href="#">Việc làm Kinh doanh</a></li>
            </ul>
          </div>
          <div className="nav-item">
            <a>Công ty tuyển dụng </a>
            <ul className="dropdown">
              <li><a href="#">Giới thiệu</a></li>
              <li><a href="#">Đánh giá</a></li>
            </ul>
          </div>
          
        </nav>
      </div>
      <div className="header-right">
        <button className="signup-btn">Đăng ký</button>
        <button className="login-btn">Đăng nhập</button>
        <a href="#" className="employer-link">Nhà tuyển dụng</a>
      </div>
    </div>
  );
};

export default Header;

import React from 'react';
import './Footer.css'; // Make sure to create a CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-item">
        <div className="footer-section">
          <h3>Về GZCONNECT</h3>
          <ul>
            <li>Về chúng tôi</li>
            <li>Quy chế hoạt động</li>
            <li>Quy định bảo mật</li>
            <li>Thoả thuận sử dụng</li>
            <li>Liên hệ</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Dành cho ứng viên</h3>
          <ul>
            <li>Việc làm</li>
            <li>Tìm việc làm nhanh</li>
            <li>Công ty</li>
            <li>Mẫu CV xin việc</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Dành cho nhà tuyển dụng</h3>
          <ul>
            <li>Dịch vụ nhân sự cao cấp</li>
            <li>Cẩm nang tuyển dụng</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Việc làm theo khu vực</h3>
          <ul>
            <li>Hồ Chí Minh</li>
            <li>Hà Nội</li>
            <li>Đà Nẵng</li>
            <li>Hải Phòng</li>
            <li>Cần Thơ</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Việc làm theo vị trí tuyển dụng</h3>
          <ul>
            <li>IT - Phần mềm</li>
            <li>IT - Phần cứng / Mạng</li>
          </ul>
        </div>
        <div className="footer-section">
          <div className="social-media">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">TikTok</a>
            <a href="https://zalo.me" target="_blank" rel="noopener noreferrer">Zalo</a>
          </div>
        </div>
      </div>
      <div className="footer-item">
        <p>© 2024 GZCONNECT. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

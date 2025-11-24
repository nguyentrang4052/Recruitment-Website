import React from 'react';
import './Footer.css';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  // const scrollToSection = (sectionId) => {
  //   const element = document.getElementById(sectionId);
  //   if (element) {
  //     element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //   }
  // };
const scrollToSection = (sectionId) => {
  navigate('/about#' + sectionId, { state: { scrollTo: sectionId } });
};
  return (
    <footer className="footer">
      <div className="footer-item">
        <div className="footer-section">
          <h3>Về GZCONNECT</h3>
          <ul>
            <li onClick={() => scrollToSection('about')}>Về chúng tôi</li>
            <li onClick={() => scrollToSection('regulations')}>Quy chế hoạt động</li>
            <li onClick={() => scrollToSection('privacy')}>Quy định bảo mật</li>
            <li onClick={() => scrollToSection('terms')}>Thoả thuận sử dụng</li>
            <li onClick={() => scrollToSection('contact')}>Liên hệ</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Dành cho ứng viên</h3>
          <ul>
            <li onClick={() => navigate("/dashboard")}>Việc làm</li>
            <li onClick={() => navigate("/companies")}>Công ty</li>
            <li onClick={() => navigate("/cv-templates")}>Mẫu CV xin việc</li>
          </ul>
        </div>
        {/* <div className="footer-section">
          <h3>Dành cho nhà tuyển dụng</h3>
          <ul>
            <li>Dịch vụ nhân sự cao cấp</li>
            <li>Cẩm nang tuyển dụng</li>
          </ul>
        </div> */}
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
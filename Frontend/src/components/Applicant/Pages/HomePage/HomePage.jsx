import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './HomePage.css';
import Menu from '../../Header/Menu.jsx';
import homepageLogo from "../../../../assets/logoWeb.png"
import { NAVIGATE_MAP } from './../../../../utils/NavigateConfig.js'

const menuItems = [
  {
    label: 'Công ty',
    submenu: ['Giới thiệu công ty', 'Đánh giá công ty']
  }
];

function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/applicant-login');
    setMobileMenuOpen(false);
  };

  const handleSignUpClick = () => {
    navigate('/signup');
    setMobileMenuOpen(false);
  };

  const handleEmployerLinkClick = () => {
    navigate('/employer-link');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setOpenDropdown(null);
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleMobileSubmenuClick = (label, item) => {
    const key = `${label}-${item}`;
    if (NAVIGATE_MAP[key]) {
      navigate(NAVIGATE_MAP[key]);
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="main-homepage">
      <div className="homepage-container">
        <div className="homepage-header">
          <div className="home-header-left">
            <img src={homepageLogo} alt="Logo" className="homepage-logo" />
            
            <nav className="nav-menu">
              <Link to="/" className="all-buttons">
                Tất cả việc làm
              </Link>
              {menuItems.map((menu, index) => (
                <Menu 
                  key={index} 
                  label={menu.label} 
                  submenu={menu.submenu} 
                  navigateMap={NAVIGATE_MAP} 
                />
              ))}
              <Link to="/cv-templates" className="cv-button">
                Tạo CV xin việc
              </Link>
              <Link to="/about" className="about-link">
                Về chúng tôi
              </Link>
            </nav>
            
            {/* Hamburger Button */}
            <div 
              className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="home-header-right">
            <button className="home-signup-btn" onClick={handleSignUpClick}>
              Đăng ký
            </button>
            <button className="home-login-btn" onClick={handleLoginClick}>
              Đăng nhập
            </button>
            <Link to="/employer-link" onClick={handleEmployerLinkClick}>
              Nhà tuyển dụng
            </Link>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-nav-item">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              Tất cả việc làm
            </Link>
          </div>

          {menuItems.map((menu, index) => (
            <div 
              key={index} 
              className={`mobile-nav-item ${openDropdown === index ? 'open' : ''}`}
            >
              <a onClick={() => toggleDropdown(index)}>
                {menu.label} {menu.submenu.length > 0 && (openDropdown === index ? '▲' : '▼')}
              </a>
              {menu.submenu.length > 0 && (
                <div className="mobile-dropdown">
                  {menu.submenu.map((item, subIndex) => (
                    <a 
                      key={subIndex}
                      onClick={() => handleMobileSubmenuClick(menu.label, item)}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="mobile-nav-item">
            <Link to="/cv-templates" onClick={() => setMobileMenuOpen(false)}>
              Tạo CV xin việc
            </Link>
          </div>

          <div className="mobile-nav-item">
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
              Về chúng tôi
            </Link>
          </div>

          <div className="mobile-buttons">
            <button className="home-signup-btn" onClick={handleSignUpClick}>
              Đăng ký
            </button>
            <button className="home-login-btn" onClick={handleLoginClick}>
              Đăng nhập
            </button>
            <Link to="/employer-link" onClick={handleEmployerLinkClick}>
              Nhà tuyển dụng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
import './Header.css'
import Menu from './Menu'
import avt from '../../../assets/avtUser.png'
import homePageLogo from './../../../assets/logoWeb.png'
import {
  FaUser,
  FaBriefcase,
  FaBell,
  FaSignOutAlt
} from "react-icons/fa"
import { ImHeart } from "react-icons/im"
import { IoIosSettings } from "react-icons/io"
import { FaHouse } from "react-icons/fa6"
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { isTokenExpired } from './../../../utils/Auth'
import { NAVIGATE_MAP } from './../../../utils/NavigateConfig'
import axios from "axios";
import { goOrReload } from '../../../utils/NavigateConfig';

const menuItems = [
  {
    label: 'Công ty',
    submenu: ['Giới thiệu công ty', 'Đánh giá công ty']
  }
];

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      localStorage.clear();
      navigate("/applicant-login");
    }
  }, [navigate]);

  const handleLogoutClick = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        await axios.post("http://localhost:8080/api/logout", {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.clear();
      navigate("/");
    }
  };

  const reloadCurrentPage = () => window.location.reload();

  const handlePageSelect = (page) => {
    const currentPath = window.location.pathname;
    setMobileMenuOpen(false);

    switch (page) {
      case 'home': {
        const target = '/dashboard';
        if (currentPath === target) reloadCurrentPage();
        else navigate(target);
        break;
      }
      case 'profile': {
        const target = '/profile';
        if (currentPath === target) reloadCurrentPage();
        else navigate(target);
        break;
      }
      case 'save-jobs': {
        const target = '/save-jobs';
        if (currentPath === target) reloadCurrentPage();
        else navigate(target);
        break;
      }
      case 'apply-jobs': {
        const target = '/apply-jobs';
        if (currentPath === target) reloadCurrentPage();
        else navigate(target);
        break;
      }
      case 'notifications': {
        const target = '/notifications';
        if (currentPath === target) reloadCurrentPage();
        else navigate(target);
        break;
      }
      case 'settings': {
        const target = '/settings';
        if (currentPath === target) reloadCurrentPage();
        else navigate(target);
        break;
      }
      case 'logout': {
        handleLogoutClick();
        break;
      }
      default: {
        const fallback =
          localStorage.getItem('roleName') === 'applicant'
            ? '/dashboard'
            : '/employer-dashboard';
        goOrReload(fallback, navigate);
      }
    }
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
    <>
      <div className="header">
        <div className="header-left">
          <img 
            src={homePageLogo} 
            alt="Logo" 
            className="homepage-logo" 
            onClick={() => handlePageSelect("home")} 
          />
          
          {/* Desktop Navigation */}
          <nav className="nav-menu">
            <Link to="/dashboard" className="all-buttons">
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

        <div className="header-right">
          <img src={avt} alt="Avatar" className="avatar" />
          <div className="avt-dropdown-menu">
            <ul>
              <li onClick={() => handlePageSelect("home")}><FaHouse /> Trang chủ</li>
              <li onClick={() => handlePageSelect("profile")}><FaUser /> Quản lý hồ sơ</li>
              <li onClick={() => handlePageSelect("apply-jobs")}><FaBriefcase /> Việc làm đã ứng tuyển</li>
              <li onClick={() => handlePageSelect("save-jobs")}><ImHeart /> Việc làm đã lưu</li>
              <li onClick={() => handlePageSelect("notifications")}><FaBell /> Thông báo việc làm</li>
              <li onClick={() => handlePageSelect("settings")}><IoIosSettings /> Cài đặt</li>
              <li onClick={() => handlePageSelect("logout")}><FaSignOutAlt /> Đăng xuất</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-item">
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
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
      </div>
    </>
  );
}

export default Header;
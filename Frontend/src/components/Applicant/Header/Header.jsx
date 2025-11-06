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
import { useEffect  } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { isTokenExpired } from './../../../utils/Auth'
import { NAVIGATE_MAP } from './../../../utils/NavigateConfig'
import axios from "axios";

const menuItems = [
  {
    label: 'Tất cả việc làm',
    submenu: ['Theo kỹ năng', 'Theo cấp bậc', 'Theo địa điểm', 'Theo vị trí']
  },
  {
    label: 'Công ty',
    submenu: ['Giới thiệu công ty', 'Đánh giá công ty']
  }
];



function Header() {
   const navigate = useNavigate();
  useEffect(() => {
      const token = localStorage.getItem('token');
  
      if (!token || isTokenExpired(token)) {
        localStorage.clear();
        navigate("/login");
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
   
  const handlePageSelect = (page) => {
    switch (page) {
      case 'home':
        navigate('/dashboard');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'save-jobs':
        navigate('/save-jobs');
        break;
      case 'apply-jobs':
        navigate('/apply-jobs');
        break;
      case 'notifications':
        navigate('/notifications');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'logout':
        handleLogoutClick();
        break;
      default:
        navigate('/dashboard');
    }
  };
  return (
    <>
      <div className="header">
        <div className="header-left">
          <img src={homePageLogo} alt="Logo" className="homepage-logo" onClick={() => handlePageSelect("home")} />
          <nav className="nav-menu">
            {menuItems.map((menu, index) => (
              <Menu key={index} label={menu.label} submenu={menu.submenu} navigateMap={NAVIGATE_MAP}/>
            ))}
             <Link to="/cv-templates" className="cv-button">
                  Tạo CV xin việc
                </Link>
          </nav>
          
        </div>

        <div className="header-right" style={{ position: "relative" }}>
          <img
            src={avt}
            alt="Avatar"
            className="avatar"
          />

          <div className="avt-dropdown-menu">
            <ul>
              <li onClick={() => handlePageSelect("home")}><FaHouse />  Trang chủ</li>
              <li onClick={() => handlePageSelect("profile")}><FaUser />  Quản lý hồ sơ</li>
              <li onClick={() => handlePageSelect("apply-jobs")}><FaBriefcase /> Việc làm đã ứng tuyển</li>
              <li onClick={() => handlePageSelect("save-jobs")}><ImHeart /> Việc làm đã lưu</li>
              <li onClick={() => handlePageSelect("notifications")}><FaBell /> Thông báo việc làm</li>
              <li onClick={() => handlePageSelect("settings")}><IoIosSettings /> Cài đặt</li>
              <li onClick={() => handlePageSelect("logout")}><FaSignOutAlt />Đăng xuất</li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}

export default Header;

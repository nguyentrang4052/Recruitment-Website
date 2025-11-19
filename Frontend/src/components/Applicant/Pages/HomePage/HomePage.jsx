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

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/applicant-login');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleEmployerLinkClick = () => {
    navigate('/employer-link');
  }

  return (
    <>
      <div className="main-homepage">
        <div className="homepage-container">
          <div className="homepage-header">
            <div className="home-header-left">
              <img src={homepageLogo} alt="Logo" className="homepage-logo" />
              <Link to="/" className="all-buttons">
                 Tất cả việc làm
                </Link>
              <nav className="nav-menu">
                {menuItems.map((menu, index) => (<Menu key={index} label={menu.label} submenu={menu.submenu} navigateMap={NAVIGATE_MAP}/>))}
                <Link to="/cv-templates" className="cv-button">
                  Tạo CV xin việc
                </Link>
              </nav>
               <a href="/about" className="all-buttons">
            Về chúng tôi
         </a>
          {/* <a href="/contact" className="all-buttons">
            Liên hệ
         </a> */}
            </div>
            <div className="home-header-right">
              <button className="home-signup-btn" onClick={handleSignUpClick}>Đăng ký</button>
              <button className="home-login-btn" onClick={handleLoginClick}>Đăng nhập</button>
              <Link to="/employer-link" onClick={handleEmployerLinkClick}>Nhà tuyển dụng</Link>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default HomePage;

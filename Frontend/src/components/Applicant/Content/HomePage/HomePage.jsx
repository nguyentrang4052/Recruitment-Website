import { useNavigate, Link} from 'react-router-dom';
import './HomePage.css';  
import Menu from '../../Header/Menu.jsx';
import RecruimentNews from '../RecruimentNews/RecruimentNews.jsx';
import homepageLogo from "../../../../assets/logoWeb.png"

const menuItems = [{
  label: 'Tất cả việc làm',
  submenu: ['Theo kỹ năng', 'Theo cấp bậc', 'Theo địa điểm', 'Theo vị trí']
},
{ label: 'Công ty',
  submenu: ['Giới thiệu công ty','Đánh giá công ty']
},
];


function HomePage() {

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleEmployerLinkClick = () => {
    navigate('/employer-link');
  }
  
  return (
    <div className="homepage-container">
      <div className="homepage-header">
        <div className="home-header-left">
          <img src={homepageLogo} alt="Logo" className="homepage-logo" />
          <nav className="nav-menu">       
            {menuItems.map((menu, index) => (<Menu key={index} label={menu.label} submenu={menu.submenu} />))}
          </nav>
        </div>
        <div className="home-header-right">
          <button className="home-signup-btn" onClick={handleSignUpClick}>Đăng ký</button>
          <button className="home-login-btn" onClick={handleLoginClick}>Đăng nhập</button>
          <Link to="/employer-link" onClick={handleEmployerLinkClick}>Nhà tuyển dụng</Link>
        </div>
      </div>
      <RecruimentNews />
      
    </div>
  );
};

export default HomePage;

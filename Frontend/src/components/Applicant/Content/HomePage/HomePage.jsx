import { useNavigate } from 'react-router-dom';
import './HomePage.css';  
import Menu from '../../Header/Menu.jsx';
import RecruimentNews from '../RecruimentNews/RecruimentNews.jsx';

const menuItems = [{
  label: 'Tất cả việc làm',
  submenu: ['Công việc A', 'Công việc B', 'Công việc C', 'Công việc D', 'Công việc E']
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
  
  return (
    <div className="homepage-container">
      <div className="header">
        <div className="header-left">
          <img src="logo.png" alt="Logo" className="logo" />
          <nav className="nav-menu">       
            {menuItems.map((menu, index) => (<Menu key={index} label={menu.label} submenu={menu.submenu} />))}
          </nav>
        </div>
        <div className="header-right">
          <button className="home-signup-btn" onClick={handleSignUpClick}>Đăng ký</button>
          <button className="home-login-btn" onClick={handleLoginClick}>Đăng nhập</button>
          <a href="#" className="employer-link">Nhà tuyển dụng</a>
        </div>
      </div>
      <RecruimentNews />
      
    </div>
  );
};

export default HomePage;

import './Header.css';  
import Menu from './Menu';

const menuItems = [{
  label: 'Tất cả việc làm',
  submenu: ['Theo kỹ năng', 'Theo cấp bậc', 'Theo địa điểm', 'Theo vị trí']
},
{ label: 'Công ty',
  submenu: ['Giới thiệu công ty','Đánh giá công ty']
}
];
function Header() {
  return (
    <div className="header">
      <div className="header-left">
        <img src="logo.png" alt="Logo" className="logo" />
        <nav className="nav-menu">       
          {menuItems.map((menu, index) => (
            <Menu key={index} label={menu.label} submenu={menu.submenu} />
          ))}
        </nav>
      </div>
      <div className="header-right">
         <img src="avatar.jpg" alt="Avatar" className="avatar" />
      </div>
    </div>
  );
};

export default Header;

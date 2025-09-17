import './Header.css';  
import Menu from './Menu';

const menuItems = [{
  label: 'Tất cả việc làm',
  submenu: ['Công việc A', 'Công việc B', 'Công việc C', 'Công việc D', 'Công việc E','Công việc F','Công việc G','Công việc H','Công việc I','Công việc J']
},
{ label: 'Công ty',
  submenu: ['Công ty A', 'Công ty B', 'Công ty C', 'Công ty D', 'Công ty E']
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

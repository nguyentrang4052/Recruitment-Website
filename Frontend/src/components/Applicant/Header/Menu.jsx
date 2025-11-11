import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { goOrReload } from '../../../utils/NavigateConfig';

const Menu = ({ label, submenu, isSubmenu = false, navigateMap={} }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => setIsOpen(true)
  const handleMouseLeave = () => setIsOpen(false)

  const navigate = useNavigate()
   const handleLabelClick = () => {
    // if (navigateMap[label]) {
    //   navigate(navigateMap[label]);
    // }
     const path =navigateMap[label];
    if (!path) return;
    goOrReload(path, navigate);
  };

  const handleSubmenuClick = (item) => {
    const key = `${label}-${item}`;
    if (navigateMap[key]) {
      navigate(navigateMap[key]);
    }
  };

  return (
    <div className="nav-item" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <a className={`nav-link ${isSubmenu ? 'submenu-link' : ''}`} onClick={handleLabelClick}>{label}</a>
      {isOpen && (
        <ul className={`dropdown ${isSubmenu ? 'submenu' : ''}`}>
          {submenu.map((item, index) => (
            <li key={index}>
              <a href="#" onClick={(e) => { e.preventDefault(); handleSubmenuClick(item); }}>
                {item}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Menu;

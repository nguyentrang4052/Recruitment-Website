import React, { useState } from 'react';
<<<<<<< HEAD
import {useNavigate} from 'react-router-dom';

const Menu = ({ label, submenu, isSubmenu = false, navigateMap={} }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => setIsOpen(true)
  const handleMouseLeave = () => setIsOpen(false)

  const navigate = useNavigate()
   const handleLabelClick = () => {
    if (navigateMap[label]) {
      navigate(navigateMap[label]);
    }
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
=======

const Menu = ({ label, submenu, isSubmenu = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  return (
    <div className="nav-item" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <a className={`nav-link ${isSubmenu ? 'submenu-link' : ''}`}>{label}</a>
>>>>>>> origin/Trong
      {isOpen && (
        <ul className={`dropdown ${isSubmenu ? 'submenu' : ''}`}>
          {submenu.map((item, index) => (
            <li key={index}>
<<<<<<< HEAD
              <a href="#" onClick={(e) => { e.preventDefault(); handleSubmenuClick(item); }}>
                {item}
              </a>
=======
              <a href="#">{item}</a>
>>>>>>> origin/Trong
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Menu;

import React, { useState } from 'react';

const Menu = ({ label, submenu, isSubmenu = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  return (
    <div className="nav-item" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <a className={`nav-link ${isSubmenu ? 'submenu-link' : ''}`}>{label}</a>
      {isOpen && (
        <ul className={`dropdown ${isSubmenu ? 'submenu' : ''}`}>
          {submenu.map((item, index) => (
            <li key={index}>
              <a href="#">{item}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Menu;

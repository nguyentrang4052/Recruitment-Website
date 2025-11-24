import React from 'react';
import {useNavigate} from 'react-router-dom';
import { goOrReload } from '../../../utils/NavigateConfig';

const Menu = ({ label, submenu, navigateMap={} }) => {
  const navigate = useNavigate();

  const handleLabelClick = (e) => {
    const path = navigateMap[label];
    if (path) {
      e.preventDefault();
      goOrReload(path, navigate);
    }
  };

  const handleSubmenuClick = (item, e) => {
    e.preventDefault();
    const key = `${label}-${item}`;
    if (navigateMap[key]) navigate(navigateMap[key]);
  };

  return (
    <div className="nav-item">
      <a className="nav-link" onClick={handleLabelClick}>{label}</a>

      {/* LUÔN RENDER DROPDOWN */}
      {submenu?.length > 0 && (
        <ul className="dropdown">
          {submenu.map((item, index) => (
            <li key={index}>
              <a href="#" onClick={(e) => handleSubmenuClick(item, e)}>
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
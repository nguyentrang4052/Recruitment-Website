import React, { useState } from "react";
import {
  FaUser,
  FaBriefcase,
  FaBell,
  FaBuilding,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar({ onSelect }) {
  const [active, setActive] = useState("profile");
  const [openMenu, setOpenMenu] = useState(null);

  const menuItems = [
    { key: "profile", label: "Quản Lý Hồ Sơ", icon: <FaUser /> },
    {
      key: "jobs",
      label: "Việc Làm Của Tôi",
      icon: <FaBriefcase />,
      children: [
        { key: "saved-jobs", label: "Việc Làm Đã Ứng Tuyển" }, 
        { key: "loved-jobs", label: "Việc Làm Yêu Thích" }
      ]
    },
    { key: "notifications", label: "Thông Báo Việc Làm", icon: <FaBell /> },
    { 
      key: "companies", 
      label: "Nhà Tuyển Dụng Của Tôi", 
      icon: <FaBuilding />,
      children: [
        { key: "rated-companies", label: "Nhà Tuyển Dụng Đã Đánh Giá" },
        { key: "loved-companies", label: "Nhà Tuyển Dụng Yêu Thích" }
      ]
    },
    { key: "settings", label: "Cài Đặt", icon: <FaCog /> },
    { key: "logout", label: "Đăng Xuất", icon: <FaSignOutAlt /> }
  ];

  const toggleMenu = (key) => {
    setOpenMenu(openMenu === key ? null : key); 
  };

  const handleItemClick = (key) => {
    if (menuItems.find(item => item.key === key).children) {
      toggleMenu(key);
    } else {
      setActive(key); 
      setOpenMenu(null);
      onSelect(key);
    }
  };

  return (
    <aside className="sidebar-applicant">
      <div className="sidebar-applicant-header">My WEB</div>
      <nav className="sidebar-applicant-menu">
        {menuItems.map((item) => (
          <div key={item.key}>
            <button
              className={`menu-item ${active === item.key || openMenu === item.key ? "active" : ""}`}
              onClick={() => handleItemClick(item.key)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
              {item.children && (
                <span className={`arrow ${openMenu === item.key ? "up" : ""}`}>
                  {openMenu === item.key ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              )}
            </button>

            {item.children && openMenu === item.key && (
              <div className="submenu">
                {item.children.map((child) => (
                  <button
                    key={child.key}
                    className="submenu-item"
                    onClick={() => {
                      setActive(child.key);
                      onSelect(child.key);
                    }}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

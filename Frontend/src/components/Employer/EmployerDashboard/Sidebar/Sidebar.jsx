import React from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBuilding, faEdit, faSearch, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function Sidebar({ activeTab, setActiveTab }) {
    return (
        <div className="sidebar">
            <div className="logo">
                <img src="" alt="Logo" />
                <h3>Tên web</h3>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <div className="nav-link">
                            <FontAwesomeIcon icon={faHome} />
                            <span>Bảng tin hệ thống</span>
                        </div>
                    </li>
                    <li className={`nav-item ${activeTab === 'company' ? 'active' : ''}`} onClick={() => setActiveTab('company')}>
                        <div className="nav-link">
                            <FontAwesomeIcon icon={faBuilding} />
                            <span>Quản lý trang công ty</span>
                        </div>
                    </li>
                    <li className={`nav-item ${activeTab === 'post' ? 'active' : ''}`} onClick={() => setActiveTab('post')}>
                        <div className="nav-link">
                            <FontAwesomeIcon icon={faEdit} />
                            <span>Đăng tin tuyển dụng</span>
                        </div>
                    </li>
                    <li className={`nav-item ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
                        <div className="nav-link">
                            <FontAwesomeIcon icon={faSearch} />
                            <span>Tìm kiếm ứng viên</span>
                        </div>
                    </li>
                    <li className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                        <div className="nav-link">
                            <FontAwesomeIcon icon={faCog} />
                            <span>Cài đặt</span>
                        </div>
                    </li>
                    <li className="nav-item logout">
                        <div className="nav-link">
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            <span>Đăng xuất</span>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
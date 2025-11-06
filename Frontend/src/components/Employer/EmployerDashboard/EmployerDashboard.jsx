import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBuilding, faFileAlt, faSearch, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './EmployerDashboard.css';
import MainContent from './MainContent';
import EmployerSetting from '../EmployerSetting/EmployerSetting';
import CompanyManagement from '../../Employer/CompanyManagement/CompanyManagement';
import PostJob from '../../Employer/PostJob/PostJob';
import SearchApplicant from '../../Employer/SearchApplicant/SearchApplicant';
import NewApplicant from '../NewApplicant/NewApplicant';
import ActiveJobs from '../ActiveJobs/ActiveJobs';
import ProfileViewsStats from '../ProfileViewsStats/ProfileViewsStats';

import logo from '../../../assets/logo.png';

function EmployerDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const [username, setUsername] = useState(''); // Khởi tạo rỗng

    useEffect(() => {

        setUsername('EmployerUserName'); // Giả sử lấy từ API
    }, []);


    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <MainContent activeTab="dashboard" username={username} setActiveTab={setActiveTab} />
            case 'company':
                return <CompanyManagement activeTab="company" setActiveTab={setActiveTab} />;
            case 'post':
                return <PostJob activeTab="post" setActiveTab={setActiveTab} />;
            case 'search':
                return <SearchApplicant activeTab="search" setActiveTab={setActiveTab} />;
            case 'newApplicant':
                return <NewApplicant activeTab="newApplicant" setActiveTab={setActiveTab} />;
            case 'activeJobs':
                return <ActiveJobs setActiveTab={setActiveTab} />;
            case 'profileViewsStats':
                return <ProfileViewsStats setActiveTab={setActiveTab} />;
            case 'settings':
                return <EmployerSetting activeTab="settings" setActiveTab={setActiveTab} />;

            default:
                return <MainContent activeTab="dashboard" username={username} />;
        }
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="sidebar-header">
                    <img src={logo} alt="Website Logo" className="website-logo" />
                    <h3>Tên Web</h3>
                </div>
                <ul className="sidebar-menu">
                    <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                        <FontAwesomeIcon icon={faHome} /> Trang của tôi
                    </li>
                    <li className={activeTab === 'company' ? 'active' : ''} onClick={() => setActiveTab('company')}>
                        <FontAwesomeIcon icon={faBuilding} /> Quản lý trang công ty
                    </li>
                    <li className={activeTab === 'post' ? 'active' : ''} onClick={() => setActiveTab('post')}>
                        <FontAwesomeIcon icon={faFileAlt} /> Đăng tin tuyển dụng
                    </li>
                    <li className={activeTab === 'search' ? 'active' : ''} onClick={() => setActiveTab('search')}>
                        <FontAwesomeIcon icon={faSearch} /> Tìm kiếm ứng viên
                    </li>

                    <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
                        <FontAwesomeIcon icon={faCog} /> Quản lý tài khoản
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất
                    </li>
                </ul>
            </div>

            <div className="main-content-wrapper">
                {renderContent()}
            </div>
        </div>
    );
}

export default EmployerDashboard;
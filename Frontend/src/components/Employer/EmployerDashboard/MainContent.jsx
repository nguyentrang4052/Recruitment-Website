import './MainContent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faChartLine, faUserCircle } from '@fortawesome/free-solid-svg-icons';


function MainContent({ activeTab, username, setActiveTab }) {
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <>
                        <header className="main-header">
                            <h2>TRANG CỦA TÔI</h2>
                            <div className="user-info">
                                <FontAwesomeIcon icon={faUserCircle} />
                                <span>{username}</span>
                            </div>
                        </header>
                        <section className="dashboard-content">
                            <div className="welcome-card">
                                <h3>Chào mừng bạn đến với hệ thống quản lý tuyển dụng!</h3>
                                <p>Đây là nơi bạn có thể theo dõi tổng quan các hoạt động của mình.</p>
                            </div>
                            <div className="grid-container">
                                <div className="stat-card" onClick={() => setActiveTab('newApplicant')} style={{ cursor: 'pointer' }}>
                                    <h4>Ứng viên mới</h4>
                                    <p className="number">12</p>
                                </div>

                                <div className="stat-card" onClick={() => setActiveTab('activeJobs')}>
                                    <h4><FontAwesomeIcon icon={faBriefcase} /> Tin tuyển dụng đang hoạt động</h4>
                                    <p className="number">5</p>
                                </div>
                                <div className="stat-card" onClick={() => setActiveTab('profileViewsStats')}>
                                    <h4><FontAwesomeIcon icon={faChartLine} /> Lượt xem hồ sơ tuần này</h4>
                                    <p className="number">150</p>
                                </div>

                            </div>
                        </section>
                    </>
                );
            case 'company':
                return <h2>QUẢN LÝ TRANG CÔNG TY</h2>
            case 'post':
                return <h2>ĐĂNG TIN TUYÊN DỤNG</h2>

            case 'search':
                return <h2>TÌM KIẾM ỨNG VIÊN</h2>
            case 'newApplicant':
                return <h2>ỨNG VIÊN MỚI</h2>
            case 'settings':
                return <h2>CÀI ĐẶT</h2>
            default:
                return null;
        }
    };

    return (
        <div className="main-content">
            {renderContent()}
        </div>
    );
}

export default MainContent;
import './MainContent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faChartLine, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';

function MainContent({ activeTab, username, setActiveTab }) {
    const [stats, setStats] = useState({
        newApplicantsCount: 0,
        activeJobsCount: 0,
        weeklyProfileViews: 0
    });
    const [statsLoading, setStatsLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchDashboardStats();
        }
    }, [activeTab]);

    const fetchDashboardStats = async () => {
        setStatsLoading(true);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch('http://localhost:8080/api/employer/dashboard/stats', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) throw new Error(`Lỗi ${res.status}`);

            const data = await res.json();
            setStats({
                newApplicantsCount: data.newApplicantsCount || 0,
                activeJobsCount: data.activeJobsCount || 0,
                weeklyProfileViews: data.weeklyProfileViews || 0
            });
        } catch (err) {
            console.error("Lỗi tải thống kê:", err);
            setStats({ newApplicantsCount: 0, activeJobsCount: 0, weeklyProfileViews: 0 });
        } finally {
            setStatsLoading(false);
        }
    };

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
                                {/* <div
                                    className={`stat-card ${stats.newApplicantsCount === 0 ? 'disabled' : ''}`}
                                    onClick={() => {
                                        if (stats.newApplicantsCount === 0) {
                                            alert('Không có dữ liệu ứng viên mới');
                                            return;
                                        }
                                        setActiveTab('newApplicant');
                                    }}
                                    style={{ cursor: stats.newApplicantsCount === 0 ? 'not-allowed' : 'pointer' }}
                                >
                                    <h4><FontAwesomeIcon icon={faUserCircle} /> Ứng viên mới</h4>
                                    {statsLoading ? (
                                        <p className="loading">Đang tải...</p>
                                    ) : (
                                        <p className="number">{stats.newApplicantsCount}</p>
                                    )}
                                </div> */}

                                <div
                                    className={`stat-card ${stats.activeJobsCount === 0 ? 'disabled' : ''}`}
                                    onClick={() => {
                                        if (stats.activeJobsCount === 0) {
                                            alert('Không có tin tuyển dụng đang hoạt động');
                                            return;
                                        }
                                        setActiveTab('activeJobs');
                                    }}
                                    style={{ cursor: stats.activeJobsCount === 0 ? 'not-allowed' : 'pointer' }}
                                >
                                    <h4><FontAwesomeIcon icon={faBriefcase} /> Tin tuyển dụng đang hoạt động</h4>
                                    {statsLoading ? (
                                        <p className="loading">Đang tải...</p>
                                    ) : (
                                        <p className="number">{stats.activeJobsCount}</p>
                                    )}
                                </div>

                                <div
                                    className={`stat-card ${stats.weeklyProfileViews === 0 ? 'disabled' : ''}`}
                                    onClick={() => {
                                        if (stats.weeklyProfileViews === 0) {
                                            alert('Không có dữ liệu lượt xem hồ sơ');
                                            return;
                                        }
                                        setActiveTab('profileViewsStats');
                                    }}
                                    style={{ cursor: stats.weeklyProfileViews === 0 ? 'not-allowed' : 'pointer' }}
                                >
                                    <h4><FontAwesomeIcon icon={faChartLine} /> Lượt xem tin tuần này</h4>
                                    {statsLoading ? (
                                        <p className="loading">Đang tải...</p>
                                    ) : (
                                        <p className="number">{stats.weeklyProfileViews}</p>
                                    )}
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
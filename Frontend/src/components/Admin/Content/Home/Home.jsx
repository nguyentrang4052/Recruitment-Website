import { useState, useEffect } from 'react';
import './Home.css';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const token = localStorage.getItem('token');

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (cardType) => {
    setExpandedCard(expandedCard === cardType ? null : cardType);
  };

  if (loading) {
    return (
      <div className="home-wrapper">
        <div className="content-header">
          <h1 className="content-title">Chào mừng đến Hệ thống Quản trị</h1>
          <p className="content-subtitle">Hệ thống quản lý tuyển dụng và kỹ năng chuyên nghiệp</p>
        </div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-wrapper">
        <div className="content-header">
          <h1 className="content-title">Chào mừng đến Hệ thống Quản trị</h1>
          <p className="content-subtitle">Hệ thống quản lý tuyển dụng và kỹ năng chuyên nghiệp</p>
        </div>
        <p style={{ color: 'red' }}>Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="home-wrapper">
      <div className="content-header">
        <h1 className="content-title">Chào mừng đến Hệ thống Quản trị</h1>
        <p className="content-subtitle">Hệ thống quản lý tuyển dụng và kỹ năng chuyên nghiệp</p>
      </div>

      <div className="stats-grid">

        <div
          className="stat-card blue"
          onClick={() => handleCardClick('users')}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-card-header">
            <h3 className="stat-card-title">Tổng người dùng</h3>
          </div>
          <p className="stat-card-value">{stats?.totalUsers || 0}</p>
          {expandedCard === 'users' && (
            <div className="stat-card-details">
              <p>Ứng viên: &nbsp;<strong>{stats?.totalApplicants || 0}</strong></p>
              <p>Nhà tuyển dụng: &nbsp;<strong>{stats?.totalEmployers || 0}</strong></p>
            </div>
          )}
        </div>

        <div
          className="stat-card green"
          onClick={() => handleCardClick('recruitment')}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-card-header">
            <h3 className="stat-card-title">Tin tuyển dụng</h3>
          </div>
          <p className="stat-card-value">{stats?.totalRecruitmentNews || 0}</p>
          {expandedCard === 'recruitment' && (
            <div className="stat-card-details">
              <p>Đã duyệt: &nbsp;<strong style={{ color: '#10b981' }}>
                {stats?.recruitmentNewsStats?.approvedCount || 0}
              </strong></p>
              <p>Chờ duyệt: &nbsp;<strong style={{ color: '#f59e0b' }}>
                {stats?.recruitmentNewsStats?.pendingCount || 0}
              </strong></p>
              <p>Từ chối: &nbsp;<strong style={{ color: '#ef4444' }}>
                {stats?.recruitmentNewsStats?.rejectedCount || 0}
              </strong></p>
            </div>
          )}
        </div>


        <div className="stat-card purple">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Danh mục kỹ năng</h3>
          </div>
          <p className="stat-card-value">89</p>
        </div>
      </div>
    </div>
  );
}
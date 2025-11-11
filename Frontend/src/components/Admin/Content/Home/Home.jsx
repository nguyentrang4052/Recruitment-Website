import './Home.css';


export default function Home() {
  return (
    <div className="home-wrapper">
      <div className="content-header">
        <h1 className="content-title">Chào mừng đến Hệ thống Quản trị</h1>
        <p className="content-subtitle">Hệ thống quản lý tuyển dụng và kỹ năng chuyên nghiệp</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Tổng người dùng</h3>
          </div>
          <p className="stat-card-value">1,234</p>
        </div>

        <div className="stat-card green">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Tin tuyển dụng</h3>
          </div>
          <p className="stat-card-value">456</p>
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
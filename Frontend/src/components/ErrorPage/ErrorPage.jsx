
import React from 'react';
import { AlertCircle, Home, Search, ArrowLeft, Code2, Briefcase } from 'lucide-react';
import './ErrorPage.css';

export default function ErrorPage() {
  const [errorType] = React.useState('404'); 

  const errorMessages = {
    '404': {
      title: 'Không Tìm Thấy Trang',
      description: 'Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.',
      iconColor: 'blue'
    },
    '401': {
      title: 'Chưa Xác Thực',
      description: 'Bạn cần đăng nhập để truy cập trang này.',
      iconColor: 'yellow'
    },
    '403': {
      title: 'Truy Cập Bị Từ Chối',
      description: 'Bạn không có quyền truy cập vào trang này.',
      iconColor: 'red'
    },
    '500': {
      title: 'Lỗi Máy Chủ',
      description: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.',
      iconColor: 'gray'
    }
  };

  const currentError = errorMessages[errorType] || errorMessages['404'];

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleSearchJobs = () => {
    window.location.href = '/';
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-header">
          <div className="logo-wrapper">
            {/* <Code2 className="logo-icon" /> */}
            <h1 className="logo-text">GZCONNECT</h1>
          </div>
          <p className="tagline">Nền tảng tuyển dụng CNTT hàng đầu</p>
        </div>

        {/* Error Card */}
        <div className="error-card">
          <div className="error-content">
            <div className="icon-wrapper">
              <AlertCircle className={`error-icon icon-${currentError.iconColor}`} />
            </div>
            <h2 className="error-code">{errorType}</h2>
            <h3 className="error-title">{currentError.title}</h3>
            <p className="error-description">{currentError.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={handleGoBack} className="btn btn-secondary">
              <ArrowLeft className="btn-icon" />
              <span>Quay Lại</span>
            </button>

            <button onClick={handleGoHome} className="btn btn-primary">
              <Home className="btn-icon" />
              <span>Trang Chủ</span>
            </button>

            <button onClick={handleSearchJobs} className="btn btn-accent">
              <Search className="btn-icon" />
              <span>Tìm Việc</span>
            </button>
          </div>
        </div>

        {/* Suggestions */}
        {/* <div className="suggestions-card">
          <h4 className="suggestions-title">
            <Briefcase className="suggestions-icon" />
            Có thể bạn quan tâm
          </h4>
          <div className="suggestions-list">
            <a href="/jobs/frontend" className="suggestion-item suggestion-blue">
              <span className="suggestion-title">Frontend Developer</span>
              <span className="suggestion-count">• 150+ việc làm</span>
            </a>
            <a href="/jobs/backend" className="suggestion-item suggestion-purple">
              <span className="suggestion-title">Backend Developer</span>
              <span className="suggestion-count">• 200+ việc làm</span>
            </a>
            <a href="/jobs/fullstack" className="suggestion-item suggestion-green">
              <span className="suggestion-title">Fullstack Developer</span>
              <span className="suggestion-count">• 180+ việc làm</span>
            </a>
          </div>
        </div> */}

        {/* Footer */}
        <div className="error-footer">
          <p>© 2025 GZCONNECT. Kết nối nhân tài CNTT với cơ hội nghề nghiệp.</p>
        </div>
      </div>
    </div>
  );
}
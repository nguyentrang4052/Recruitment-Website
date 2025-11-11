import React, { useState } from 'react';
import { Send } from 'lucide-react';
import './ApplyJob.css';
import { useNavigate } from 'react-router-dom';

const AppliedJobs = () => {
  // Giả lập dữ liệu - thay đổi hasJobs để test 2 trạng thái
  const [hasJobs, setHasJobs] = useState(false);
  
  const appliedJobs = [
    {
      id: 1,
      title: 'Power BI- Intern',
      company: 'CÔNG TY TNHH THỰC PHẨM & NƯỚC GIẢI KHÁT Ý TƯỞNG VIỆT (STARBUCKS VIET NAM)',
      logo: 'https://via.placeholder.com/60x60/00704A/FFFFFF?text=SB',
      deadline: 'Hết hạn: 11 ngày tới'
    },
    // Thêm jobs khác nếu cần
  ];
    const navigate = useNavigate();
  const handleFindJob = () =>  {
    navigate("/dashboard")
  }

  return (
    <div className="applied-jobs-container">
      <div className="applied-jobs-header">
        <h1 className="applied-jobs-title">
          Việc đã ứng tuyển ({hasJobs ? appliedJobs.length : 0})
        </h1>
        {/* Nút toggle để test - xóa khi deploy production */}
        <button 
          className="toggle-btn" 
          onClick={() => setHasJobs(!hasJobs)}
        >
          {hasJobs ? 'Xem trạng thái rỗng' : 'Xem có việc'}
        </button>
      </div>

      {!hasJobs ? (
        // Trạng thái rỗng
        <div className="empty-state">
          <div className="empty-icon">
            <div className="send-circle">
              <Send size={50} className="send-icon" />
            </div>
          </div>
          <p className="empty-message">
            Bạn chưa nộp đơn cho việc làm nào...
          </p>
          <button className="find-jobs-btn" onClick={handleFindJob}>
            Đến trang tìm việc
          </button>
        </div>
      ) : (
        // Có việc đã ứng tuyển
        <div className="jobs-list-section">
          <p className="filter-label">Hôm nay</p>
          
          <div className="jobs-list">
            {appliedJobs.map((job) => (
              <div key={job.id} className="applied-job-card">
                <img 
                  src={job.logo} 
                  alt={job.company}
                  className="job-logo"
                />
                
                <div className="job-info">
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-company">{job.company}</p>
                </div>
                
                <div className="job-deadline">
                  <span className="deadline-text">{job.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
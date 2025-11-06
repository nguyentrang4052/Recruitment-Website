import React, { useState } from 'react';
import { Heart, Send } from 'lucide-react';
import './SaveJob.css'

const SavedJobs = () => {
  // Giả lập dữ liệu - thay đổi hasJobs để test 2 trạng thái
  const [hasJobs, setHasJobs] = useState(false);
  
  const savedJobs = [
    {
      id: 1,
      title: '[G5] Nhân Viên Chăm Sóc Khách Hàng Viettel (...',
      company: 'CÔNG TY CỔ PHẦN BELLSYSTEM24 VIỆT NAM',
      logo: 'https://via.placeholder.com/60x60/FF6B35/FFFFFF?text=BS24',
      deadline: 'Hết hạn: 21 ngày tới'
    },
    // Thêm jobs khác nếu cần
  ];

  return (
    <>
  

      <div className="saved-jobs-container">
        <div className="saved-jobs-header">
          <h1 className="saved-jobs-title">
            Công việc đã lưu ({hasJobs ? savedJobs.length : 0})
          </h1>
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
              <div className="heart-circle">
                <Heart size={48} className="heart-icon" />
              </div>
            </div>
            <p className="empty-message">
              Lưu lại việc làm bạn quan tâm để xem lại dễ dàng!
            </p>
            <button className="find-jobs-btn">
              Đến trang tìm việc
            </button>
          </div>
        ) : (
          // Có việc đã lưu
          <div className="jobs-list-section">
            <p className="filter-label">Hôm nay</p>
            
            <div className="jobs-list">
              {savedJobs.map((job) => (
                <div key={job.id} className="saved-job-card">
                  <button className="favorite-btn active">
                    {/* <Heart size={24} fill="#0d6efd" color="#0d6efd" /> */}
                    <Heart/>
                  </button>
                  
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
                  
                  <button className="apply-btn">
                    <Send size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SavedJobs;
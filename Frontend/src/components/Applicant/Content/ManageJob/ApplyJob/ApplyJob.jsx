import React, { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import './ApplyJob.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { formatDate } from '../../../../../utils/Format'

const AppliedJobs = () => {
  // const [hasJobs, setHasJobs] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([])

  const token = localStorage.getItem('token')
  const applicantID = localStorage.getItem('applicantID')
  useEffect(() => {
    const fetchAppliedJob = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/applicant/applied-job",
          {
            params: { id: applicantID },
            headers: {
              Authorization: `Bearer ${token}`,
            }
          },
        )
        setAppliedJobs(res.data)


      } catch {
        console.log('Khong co tin da ung tuyen')
      }
    };
    fetchAppliedJob([applicantID, token])
  })
  const navigate = useNavigate();
  const handleFindJob = () => {
    navigate("/dashboard")
  }
  const hasJobs = appliedJobs.length > 0;


  const viewDetail = (rnid) => {
    navigate(`/recruitment/${rnid}`);
  }
  return (
    <div className="applied-jobs-container">
      <div className="applied-jobs-header">
        <h1 className="applied-jobs-title">
          Việc đã ứng tuyển ({appliedJobs.length})
        </h1>
        {/* Nút toggle để test - xóa khi deploy production */}
        {/* <button
          className="toggle-btn"
          onClick={() => setHasJobs(!hasJobs)}
        >
          {hasJobs ? 'Xem trạng thái rỗng' : 'Xem có việc'}
        </button> */}
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
          {/* <p className="filter-label">Hôm nay</p> */}

          <div className="jobs-list">
            {appliedJobs.map((job) => (
              <div key={job.rnid} className="applied-job-card">
                <img
                  src={job.employer.logo}
                  alt={"logo"}
                  className="job-logo"
                />

                <div className="job-info">
                  <h3 className="job-title" onClick={() => viewDetail(job.rnid)}>{job.position}</h3>
                  <p className="job-company">{job.employer.name}</p>
                </div>

                <div className="job-deadline">
                  <span className="deadline-text">{formatDate(job.application.date)}</span>
                </div>
                <a href={`http://localhost:8080/uploads/cv/${job.application.cv}`}> <button className="view-cv-btn">Xem CV</button></a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
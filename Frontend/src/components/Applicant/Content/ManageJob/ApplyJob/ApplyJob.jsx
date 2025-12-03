import React, { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import './ApplyJob.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { formatDate } from '../../../../../utils/Format'

const AppliedJobs = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [appliedJobs, setAppliedJobs] = useState([])

  const token = localStorage.getItem('token')
  const applicantID = localStorage.getItem('applicantID')
  useEffect(() => {
    const fetchAppliedJob = async () => {
      const res = await axios.get(
        `${API_URL}/api/applicant/applied-job`,
        {
          params: { id: applicantID },
          headers: {
            Authorization: `Bearer ${token}`,
          }
        },
      )
      setAppliedJobs(res.data)

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
      </div>

      {!hasJobs ? (
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
        <div className="jobs-list-section">

          <div className="jobs-list">
            {appliedJobs.map((job) => (
              <div key={job.rnid} className="applied-job-card">
                <div className="applied-above">
                  <img
                    src={job.employer.logo}
                    alt={"logo"}
                    className="job-logo"
                  />

                  <div className="job-info">
                    <h3 className="job-title" onClick={() => viewDetail(job.rnid)}>{job.position}</h3>
                    <p className="job-company">{job.employer.name}</p>
                  </div>
                  <a href={`${API_URL}/uploads/cv/${job.application.cv}`}> <button className="view-cv-btn">CV đã nộp</button></a>
                </div>
                <div className="applied-below">

                  <div className="job-deadline">
                    <span className="deadline-text">Ngày nộp: {formatDate(job.application.date)}</span>
                  </div>

                  <div className="job-status">
                    <span className="status-text">{job.appStatus}</span>
                  </div>

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
import React, { useState, useEffect } from 'react';
import { Heart, Send } from 'lucide-react';
import { LuHeart } from "react-icons/lu";
import { FaHeart } from "react-icons/fa";
import './SaveJob.css'
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../../../utils/Format'

const SavedJobs = () => {
  const [savedJobs, setSaveJobs] = useState([])
  const applicantID = localStorage.getItem('applicantID')
  const token = localStorage.getItem('token')
  useEffect(() => {
    const fetchSaveJob = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/applicant/favourite-job",
          {
            params: { id: applicantID },
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );

        setSaveJobs(res.data)
        const savedIds = res.data.map(job => job.rnid);
        setFavoriteJobs(savedIds);
      } catch {
        console.log('Loi khi tai tin yeu thich')
      }


    }
    fetchSaveJob([applicantID, token])
  })
  const [favoriteJobs, setFavoriteJobs] = useState([]);
  const toggleFavorite = async (rnid) => {
    try {
      await axios.post(
        "http://localhost:8080/api/applicant/toggle",
        null,
        {
          params: { applicantID, rnid },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFavoriteJobs(prev =>
        prev.includes(rnid) ? prev.filter(id => id !== rnid) : [...prev, rnid]
      );
    } catch (err) {
      console.error("Lỗi khi lưu yêu thích:", err);
    }
  };

  const navigate = useNavigate();
  const handleFindJob = () => {
    navigate("/dashboard")
  }
  const hasJobs = savedJobs.length > 0;

  const onApply = (rnid) => {
    navigate(`/recruitment/${rnid}`);
  }

  const viewDetail = (rnid) => {
    navigate(`/recruitment/${rnid}`);
  }
  return (
    <>


      <div className="saved-jobs-container">
        <div className="saved-jobs-header">
          <h1 className="saved-jobs-title">
            Công việc đã lưu ({savedJobs.length})
          </h1>
        </div>

        {!hasJobs ? (
          <div className="empty-state">
            <div className="empty-icon">
              <div className="heart-circle">
                <Heart size={48} className="heart-icon" />
              </div>
            </div>
            <p className="empty-message">
              Lưu lại việc làm bạn quan tâm để xem lại dễ dàng!
            </p>
            <button className="find-jobs-btn" onClick={handleFindJob}>
              Đến trang tìm việc
            </button>
          </div>
        ) : (
          <div className="jobs-list-section">
            <div className="jobs-list">
              {savedJobs.map((job) => (
                <div key={job.rnid} className="saved-job-card">
                  <button
                    className={`favorite-btn ${favoriteJobs.includes(job.rnid) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(job.rnid)}
                  >
                    {favoriteJobs.includes(job.rnid) ? <FaHeart /> : <LuHeart />}
                  </button>

                  <div className="job-info-save">
                    <div className="job-info-item">
                      <img
                        src={job.employer.logo}
                        alt="logo"
                        className="job-logo"
                      />
                    </div>
                    <div className="job-info-item">
                      <h3 className="job-title" onClick={() => viewDetail(job.rnid)}>{job.position}</h3>
                      <p className="job-company">{job.employer.name}</p>
                    </div>
                  </div>

                  <div className="job-deadline">
                    <span className="deadline-text">Hạn nộp: {formatDate(job.deadline)}</span>
                  </div>

                  <button className="save-apply-btn" onClick={() => onApply(job.rnid)}>
                    <Send size={56} />
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
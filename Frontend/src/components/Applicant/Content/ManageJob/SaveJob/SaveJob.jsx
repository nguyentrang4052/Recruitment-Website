import React, { useState, useEffect } from 'react';
import { Heart, Send } from 'lucide-react';
import { LuHeart } from "react-icons/lu";
import { FaHeart } from "react-icons/fa";
import './SaveJob.css'
import axios from "axios"
import { useNavigate } from 'react-router-dom';

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
  const handleFindJob = () =>  {
    navigate("/dashboard")
  }
  const hasJobs = savedJobs.length > 0;
  return (
    <>


      <div className="saved-jobs-container">
        <div className="saved-jobs-header">
          <h1 className="saved-jobs-title">
            Công việc đã lưu ({savedJobs.length})
          </h1>
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
          // Có việc đã lưu
          <div className="jobs-list-section">
            <p className="filter-label">Hôm nay</p>

            <div className="jobs-list">
              {savedJobs.map((job) => (
                <div key={job.rnid} className="saved-job-card">

                    {/* <Heart size={24} fill="#0d6efd" color="#0d6efd" /> */}
                    {/* <button
                      className={`favorite-btn ${favoriteJobs.includes(job.rnid) ? 'active' : ''}`}
                      onClick={() => toggleFavorite(job.rnid)}
                    ></button>
                    <Heart /> */}
                    {/* <button
                      className={`favorite-btn ${favoriteJobs(job.rnid) ? 'active' : ''}`}
                      onClick={() => toggleFavorite(job.rnid)}
                    >
                      {favoriteJobs(job.rnid) ? <FaHeart /> : <LuHeart />}
                    </button> */}
                    <button
                      className={`favorite-btn ${favoriteJobs.includes(job.rnid) ? 'active' : ''}`}
                      onClick={() => toggleFavorite(job.rnid)}
                    >
                      {favoriteJobs.includes(job.rnid) ? <FaHeart /> : <LuHeart />}
                    </button>


                  <img
                    src={job.employer.logo}
                    alt="logo"
                    className="job-logo"
                  />

                  <div className="job-info">
                    <h3 className="job-title">{job.position}</h3>
                    <p className="job-company">{job.employer.name}</p>
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
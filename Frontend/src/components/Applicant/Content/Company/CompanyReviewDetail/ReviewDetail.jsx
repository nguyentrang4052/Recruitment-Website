import { MapPin, Briefcase, Star, Users } from 'lucide-react';
import './ReviewDetail.css';
import { StarRating } from '../StartRating';
import { useState, useEffect } from 'react';
import axios from "axios"
import { useNavigate, useParams } from 'react-router-dom';
import { formatDate, formatDateTime } from '../../../../../utils/Format';
import { BsCalendarDate } from "react-icons/bs";
import companyImage from '../../../../../assets/company-image.jpg'
import { formatRangeShort } from '../../../../../utils/formatSalary';
import useToast from '../../../../../utils/useToast.js';
import Toast from '../../../../Toast/Toast.jsx';

function CompanyReviews() {

  const { employerId } = useParams();

  const [company, setCompanies] = useState(null);
  const [jobListings, setJobListings] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [score, setScore] = useState(0);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const applicantID = localStorage.getItem('applicantID');

  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();

  const submit = async () => {

    hideToast();

    if (!score || !content.trim()) {
      showError('Vui lòng chọn sao và nhập nội dung!');
      return
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/applicant/companies/review",
        { employerID: employerId, score, content },
        {
          params: { applicantId: applicantID },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setCompanies(prev => ({
        ...prev,
        rating: [res.data, ...prev.rating],
        reviews: prev.reviews + 1
      }));

      setScore(0);
      setContent('');
      showSuccess('Gửi đánh giá thành công!');

    } catch {
      showError('Bạn đã đánh giá công ty này rồi');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteReview = (reviewId) => {
    showWarning(
      "Bạn chắc chắn muốn xoá đánh giá này?",
      () => {
        deleteReview(reviewId); 
        hideToast();
      },
      () => hideToast() 
    )

  };


  const deleteReview = async (reviewId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/applicant/companies/review/delete`,
        {
          params: {
            applicantID: applicantID,
            employerID: employerId
          },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCompanies(prev => ({
        ...prev,
        rating: prev.rating.filter(r => r.id !== reviewId),
        reviews: prev.reviews - 1
      }));

      showSuccess('Xoá đánh giá thành công!');
    } catch {
      showError('Không thể xoá đánh giá');
    }
  };

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const [res, jobRes] = await Promise.all([
          axios.get("http://localhost:8080/api/applicant/companies/detail", { params: { id: employerId } }),
          axios.get("http://localhost:8080/api/applicant/companies/job", { params: { id: employerId } })
        ]);

        setCompanies(res.data);
        setJobListings(jobRes.data);

      } catch {
        showError('Lỗi khi tải dữ liệu công ty');
      } finally {
        setLoading(false);
      }
    };
    if (employerId) fetchCompany();
  }, [employerId]);

  const viewDetail = (rnid) => {
    navigate(`/recruitment/${rnid}`);
  }

  const scrollToReview = () => {
    if (token)
      document.getElementById('review-anchor')?.scrollIntoView({ behavior: 'smooth' });
    else
      navigate("/applicant-login")
  };


  if (loading) return <div className="loading">Loading…</div>;
  if (!company) return <div>Không tìm thấy công ty</div>;

  return (
    <div className="company-reviews-page">

      <div className="company-banner">
        <div className="banner-image">
          {
            company.image && company.image ? (<img src={company.image} alt="company banner" />) : (<img src={companyImage} alt="default banner" />)
          }
        </div>
        <div className="banner-overlay">
          <div className="banner-content">
            <div className="company-header-info">
              <div className="company-logo-large">
                <div className="logo-box">
                  <img src={company.logo} alt="logo" />
                </div>
              </div>
              <div className="company-title-section">
                <h1 className="company-name-large">{company.name}</h1>
                <div className="company-quick-info">
                  <MapPin size={16} />
                  <span>{company.address}</span>

                </div>
                <div className="company-actions">
                  <button className="btn-write-review" onClick={scrollToReview}>Viết đánh giá</button>
                </div>
              </div>
            </div>
            <div className="company-stats">
              <div className="rating-box">
                <div className="rating-number">{company.ranking}</div>
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={`banner-star-${i}`} size={16} className="star-filled" />
                  ))}
                </div>
                <div className="rating-count">{company.reviews} đánh giá</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-grid">
          <div className="left-column">
            <div className="reviews-card">
              <h2 className="section-title">{company.reviews} người đánh giá</h2>

              <div className="reviews-list">
                {company.rating.slice(0, token ? company.rating.length : 3).map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-date">{formatDateTime(review.date)}</div>

                    <div className="review-rating">
                      <StarRating rating={review.score} />
                      <span className="rating-text">{review.score}</span>
                    </div>

                    <div className="review-content">
                      <div className="content-section">
                        <p className="content-text">{review.content}</p>
                      </div>
                    </div>
                    {token && review.applicantID == applicantID && (
                      <div className="review-actions">
                        <button className="btn-delete" onClick={() => confirmDeleteReview(review.id)}>
                          Xoá đánh giá
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {
                !token && (
                  <div className="sign-in-prompt">
                    <a href="/applicant-login" className="sign-in-link">Đăng nhập</a>
                    <span className="sign-in-text"> Để xem tất cả đánh giá</span>
                  </div>
                )
              }
            </div>


            {token && (<div id="review-anchor">
              <div className="write-review-mini">
                <h4>Viết đánh giá</h4>


                <div className="stars-wrapper">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className={`star ${s <= score ? 'filled' : ''}`}
                      onClick={() => setScore(s)}
                    >
                      ★
                    </span>
                  ))}
                </div>


                <textarea
                  className="review-textarea"
                  rows={4}
                  placeholder="Nhập nội dung đánh giá..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />

                <button className="btn-submit" onClick={submit} disabled={loading}>
                  {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </div>
            </div>)}

          </div>


          <div className="right-column">
            {jobListings && jobListings.length > 0 && (
              <div className="jobs-card">
                <h2 className="jobs-title">{company.jobs} tin đang tuyển</h2>
                <div className="jobs-list">
                  {jobListings.map((job) => (
                    <div key={job.rnid} className="job-card">
                      <h3 className="job-title-detail" onClick={() => viewDetail(job.rnid)}>{job.position}</h3>
                      <div className="job-posted">{job.postedDate}</div>

                      <div className="job-company">
                        <div className="job-company-logo">
                          <img src={job.employer.logo} alt="logo" />
                        </div>
                        <span className="job-company-name">{job.employer.name}</span>
                      </div>
                      <div className="job-salary">
                        <span className="salary-icon">💰</span>
                        <p className="salary">{formatRangeShort(job.salary)}</p>
                      </div>
                      <div className="job-meta">
                        <div className="job-benefit-text">
                          <Briefcase size={13} />
                          <span className="benefit-content">{job.benefit}</span>
                        </div>
                        <div className="job-meta-item">
                          <MapPin size={14} />
                          <span>{job.employer.address}</span>
                        </div>

                        <div className="job-posted-detail"><BsCalendarDate /> Hạn nộp {formatDate(job.deadline)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={hideToast}
          onConfirm={toast.onConfirm}
          onCancel={toast.onCancel}
          confirmText={toast.confirmText}
          cancelText={toast.cancelText}
        />
      )}

    </div>
  );
}

export default CompanyReviews;
// CompanyReviews.jsx
import { MapPin, Briefcase, Star, Users } from 'lucide-react';
import './ReviewDetail.css';
import { StarRating } from '../StartRating';
import { useState, useEffect } from 'react';
import axios from "axios"
import { useNavigate, useParams } from 'react-router-dom';
import { formatDate, formatDateTime } from '../../../../../utils/Format';
import { BsCalendarDate } from "react-icons/bs";
import companyImage from '../../../../../assets/company-image.jpg'


// const companies = [
//   {
//     id: 1,
//     name: 'MB Bank',
//     logo: '🏦',
//     rating: 4.9,
//     fullName: 'Ngân hàng TMCP Quân Đội (MB)',
//     location: 'Ha Noi',
//     jobs: 31,
//     reviews: 123,
//     image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop',
//     banner: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=300&fit=crop'
//   }
// ];

// const reviewsList = [
//   {
//     id: 1,
//     date: '12-2025',
//     rating: 4,
//     content: 'Công ty ngân hàng hàng đầu Việt Nam và tôi tin rằng mình có cơ hội khi làm việc ở nơi đây. Chính sách tốt, phúc lợi xã hội khá tốt. Đây là điều tôi cảm thấy hài lòng.\n Cần hỗ trợ phúc lợi, lương hữu cho nhân viên. Tăng lương nhân viên'

//   },
//   {
//     id: 2,
//     date: 'January 2025',
//     rating: 4.5,
//     content: 'Môi trường làm việc năng động, nhiều cơ hội phát triển bản thân.\n Cần cải thiện văn hóa công ty, tăng cường giao tiếp nội bộ'
//   },
//   {
//     id: 3,
//     date: 'December 2024',
//     rating: 5,
//     content: 'Lương thưởng hợp lý, đồng nghiệp thân thiện, được đào tạo bài bản.\n Áp lực công việc cao vào những thời điểm cuối tháng'
//   }
// ];

// const jobListings = [
//   {
//     id: 1,
//     title: 'Data Engineer (SQL/ PLSQL / NoSQL / Java)',
//     company: 'MB Bank',
//     logo: '🏦',
//     postedDate: 'Posted 4 days ago',
//     isHot: true,
//     location: 'Ha Noi',
//     workType: 'At office',
//     position: 'Data Engineer',
//     tags: ['SQL', 'Data Engineer', 'Tableau', 'Oracle', 'Java', '+1'],
//     benefits: [
//       'Mức lương cạnh tranh, hấp dẫn',
//       'Môi trường làm việc chuyên nghiệp, thân thiện',
//       'Được làm việc với các hệ thống hiện đại, tiên tiến'
//     ]
//   },
//   {
//     id: 2,
//     title: 'Full-Stack Developer - React & Node.js',
//     company: 'MB Bank',
//     logo: '🏦',
//     postedDate: 'Posted 6 days ago',
//     isHot: true,
//     location: 'Ha Noi',
//     workType: 'At office',
//     position: 'Full Stack Developer',
//     tags: ['React', 'Node.js', 'TypeScript', 'MongoDB', '+2'],
//     benefits: [
//       'Competitive salary package',
//       'Health insurance and annual health check',
//       'Professional training programs'
//     ]
//   }
// ];


function CompanyReviews() {

  const { employerId } = useParams();

  const [company, setCompanies] = useState(null);
  const [jobListings, setJobListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");


  // Chuyển thành định dạng ngày (chỉ lấy ngày, tháng, năm)


  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const [res, jobRes] = await Promise.all([
          axios.get("http://localhost:8080/api/applicant/companies/detail", { params: { id: employerId } }),
          axios.get("http://localhost:8080/api/applicant/companies/job", { params: { id: employerId } })
        ]);

        setCompanies(res.data);
        setJobListings(jobRes.data);

      } catch (thrown) {
        console.error("Chi tiết lỗi:", thrown);
      } finally {
        setLoading(false);
      }
    };
    if (employerId) fetchCompany();
  }, [employerId]);
  const viewDetail = (rnid) => {
    navigate(`/recruitment/${rnid}`);
  }


  if (loading) return <div className="loading">Loading…</div>;
  if (!company) return <div>Không tìm thấy công ty</div>;
  return (
    <div className="company-reviews-page">
      {/* Header Banner */}
      <div className="company-banner">
        <div className="banner-image">
          {
            company.image && company.image? ( <img src={company.image}/>): (<img src={companyImage}/>)
          }
         
        </div>
        <div className="banner-overlay">
          <div className="banner-content">
            <div className="company-header-info">
              <div className="company-logo-large">
                <div className="logo-box">
                  <img src={company.logo} alt="logo" /> </div>
              </div>
              <div className="company-title-section">
                <h1 className="company-name-large">{company.name}</h1>
                <div className="company-quick-info">
                  <MapPin size={16} />
                  <span>{company.address}</span>
                  <span className="separator">•</span>
                  <Briefcase size={16} />
                  <span>{company.jobs} job openings</span>
                </div>
                <div className="company-actions">
                  <button className="btn-write-review">Write review</button>
                  <button className="btn-follow">Follow</button>
                </div>
              </div>
            </div>
            <div className="company-stats">
              <div className="rating-box">
                <div className="rating-number">{company.ranking}</div>
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="star-filled" />
                  ))}
                </div>
                <div className="rating-count">{company.reviews} reviews</div>
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
                      {/* <div className="content-section">
                        <h4 className="content-label">What I liked:</h4>
                        <p className="content-text">{review.content.liked}</p>
                      </div> */}
                      <div className="content-section">
                        <p className="content-text">{review.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {
                !token && (
                  <div className="sign-in-prompt">
                    <a href="/applicant-login" className="sign-in-link">Sign in now</a>
                    <span className="sign-in-text"> to see all reviews.</span>
                  </div>
                )
              }

            </div>
          </div>

          {/* Right Column - Job Listings */}
          <div className="right-column">
            <div className="jobs-card">
              <h2 className="jobs-title">{company.jobs} job openings</h2>
              <div className="jobs-list">
                {jobListings.map((job) => (
                  <div key={job.employerId} className="job-card">
                    <h3 className="job-title-detail" onClick={() => viewDetail(job.rnid)}>{job.position}</h3>
                    <div className="job-posted">{job.postedDate}</div>
                    {/* <h3 className="job-title">{job.title}</h3> */}

                    <div className="job-company">
                      <div className="job-company-logo">
                        <img src={job.employer.logo} alt="logo" /></div>
                      <span className="job-company-name">{job.employer.name}</span>
                    </div>

                    {!token && (<div className="job-salary">
                      <span className="salary-icon">💰</span>
                      <a href="/applicant-login" className="salary-link">Đăng nhập để xem mức lương</a>
                    </div>
                    )}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyReviews;
import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Briefcase, Award, Star } from 'lucide-react';
import './CompanyReview.css';
import { Link } from 'react-router-dom'
import axios from "axios"
import companyImage from '../../../../../assets/company-image.jpg'


function CompanyPage() {
  const [companiesPerRow, setCompaniesPerRow] = useState(3);
  const reviews = [
    {
      id: 1,
      company: 'NAVER VIETNAM',
      logo: '🟢',
      rating: 5,
      text: 'Mình rất thích văn hóa làm việc cởi mở, đồng nghiệp thân...',
      time: '5 hours ago'
    },
    {
      id: 2,
      company: 'Rakuten Fintech Vietnam Co., Ltd.',
      logo: '🔴',
      rating: 5,
      text: 'All the colleagues are nice. They support me every time I needed....',
      time: '6 hours ago'
    },
    {
      id: 3,
      company: 'Thoughtworks Vietnam',
      logo: '🔵',
      rating: 4,
      text: 'Great learning environment and opportunities for growth...',
      time: '8 hours ago'
    },
    {
      id: 4,
      company: 'Samsung Vietnam',
      logo: '⚫',
      rating: 5,
      text: 'Excellent benefits and professional work environment...',
      time: '10 hours ago'
    }
  ];

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/applicant/companies");
        setCompanies(JSON.parse(typeof res.data === 'string' ? res.data : JSON.stringify(res.data)));
      } catch (thrown) {
        console.error("Chi tiết lỗi:", thrown);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);


  const StarRating = ({ rating }) => {
    return (
      <div className="star-rating">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'star-filled' : 'star-empty'}
          />
        ))}
      </div>
    );
  };


  if (loading) return <div>Loading...</div>;
  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="main-grid">
          {/* Left Section - Company Reviews */}
          <div className="companies-section">
            <div className="section-card">
              <h1 className="page-title">Công ty</h1>

              {/* Controls */}
              <div className="controls-wrapper">
                <div className="control-group">
                  <label className="control-label">
                    Số công ty mỗi hàng:
                  </label>
                  <select
                    value={companiesPerRow}
                    onChange={(e) => setCompaniesPerRow(Number(e.target.value))}
                    className="control-select"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </div>
              </div>

              {/* Company Grid */}
              <div
                className={`company-grid company-grid-${companiesPerRow}`}
              >
                {companies.map((company) => (
                  <div key={company.employerId} className="company-card-review">
                    {/* Company Image */}
                    <div className="company-image">
                      {
                        company.image && company.image ? (<img src={company.image} />) : (<img src={companyImage} />)
                      }
                    </div>

                    {/* Company Info */}
                    <div className="company-info">
                      <div className="company-header">
                        <div className="company-logo">
                          <img src={company.logo} alt={company.logo} />
                        </div>
                        <div className="company-title">
                          <h3 className="company-name-review"><Link to={`/companies/reviews/${company.employerId}`}>{company.name}</Link></h3>
                          <div className="company-rating">
                            <Star size={16} className="star-icon" />
                            <span className="rating-value">{company.ranking}</span>
                          </div>
                        </div>
                      </div>

                      {/* <p className="company-description">
                        {company.fullName}
                      </p> */}
                      {company.fullName && (
                        <p className="company-description">
                          {company.fullName}
                        </p>
                      )}

                      <div className="company-meta">
                        <div className="meta-item">
                          <MapPin size={14} />
                          <span>{company.address}</span>
                        </div>
                        <div className="meta-item">
                          <Briefcase size={14} />
                          <span>{company.jobs} tin tuyển dụng</span>
                        </div>
                      </div>

                      <div className="company-divider"></div>

                      <a href={`/companies/reviews/${company.employerId}`} className="company-reviews-link">
                        {company.reviews} đánh giá →
                      </a>

                      {/* <div className="company-badge">
                        <Award size={14} />
                        <span>Best about {company.bestAbout}</span>
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>

              {/* Share Section */}
             
            </div>
          </div>

          {/* Right Section - Newest Reviews */}
          <div className="reviews-section">
            <div className="reviews-card">
              <h2 className="reviews-title">Đánh giá gần nhất</h2>

              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-item">
                  
                    <div className="review-header">
                      <div className="review-logo">
                        {review.logo}
                      </div>
                      <div className="review-company-info">
                        <h3 className="review-company-name">
                          {review.company}
                        </h3>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>

                    <p className="review-text">
                      {review.text}
                    </p>

                    <span className="review-time">{review.time}</span>
                  </div>
                ))}
              </div>

              <button className="view-all-button">
                View All Reviews →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
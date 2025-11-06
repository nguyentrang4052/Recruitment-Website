// CompanyReviews.jsx
import { MapPin, Briefcase, Star, Users } from 'lucide-react';
import './CompanyReviews.css';
import { StarRating } from '../StartRating';


const companies = [
  {
    id: 1,
    name: 'MB Bank',
    logo: '🏦',
    rating: 4.9,
    fullName: 'Ngân hàng TMCP Quân Đội (MB)',
    location: 'Ha Noi',
    jobs: 31,
    reviews: 123,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=300&fit=crop'
  }
];

const reviewsList = [
  {
    id: 1,
    date: '12-2025',
    rating: 4,
    content: 'Công ty ngân hàng hàng đầu Việt Nam và tôi tin rằng mình có cơ hội khi làm việc ở nơi đây. Chính sách tốt, phúc lợi xã hội khá tốt. Đây là điều tôi cảm thấy hài lòng.\n Cần hỗ trợ phúc lợi, lương hữu cho nhân viên. Tăng lương nhân viên'

  },
  {
    id: 2,
    date: 'January 2025',
    rating: 4.5,
    content: 'Môi trường làm việc năng động, nhiều cơ hội phát triển bản thân.\n Cần cải thiện văn hóa công ty, tăng cường giao tiếp nội bộ'
  },
  {
    id: 3,
    date: 'December 2024',
    rating: 5,
    content: 'Lương thưởng hợp lý, đồng nghiệp thân thiện, được đào tạo bài bản.\n Áp lực công việc cao vào những thời điểm cuối tháng'
  }
];

const jobListings = [
  {
    id: 1,
    title: 'Data Engineer (SQL/ PLSQL / NoSQL / Java)',
    company: 'MB Bank',
    logo: '🏦',
    postedDate: 'Posted 4 days ago',
    isHot: true,
    location: 'Ha Noi',
    workType: 'At office',
    position: 'Data Engineer',
    tags: ['SQL', 'Data Engineer', 'Tableau', 'Oracle', 'Java', '+1'],
    benefits: [
      'Mức lương cạnh tranh, hấp dẫn',
      'Môi trường làm việc chuyên nghiệp, thân thiện',
      'Được làm việc với các hệ thống hiện đại, tiên tiến'
    ]
  },
  {
    id: 2,
    title: 'Full-Stack Developer - React & Node.js',
    company: 'MB Bank',
    logo: '🏦',
    postedDate: 'Posted 6 days ago',
    isHot: true,
    location: 'Ha Noi',
    workType: 'At office',
    position: 'Full Stack Developer',
    tags: ['React', 'Node.js', 'TypeScript', 'MongoDB', '+2'],
    benefits: [
      'Competitive salary package',
      'Health insurance and annual health check',
      'Professional training programs'
    ]
  }
];

const CompanyReviews = () => {
  // Nếu bạn dùng useParams, uncomment dòng dưới
  // const { id } = useParams();
  // const company = companies.find((c) => c.id === Number(id));

  const company = companies[0]; // Tạm thời dùng company đầu tiên
  if (!company) return <p>Không tìm thấy công ty.</p>;

  return (
    <div className="company-reviews-page">
      {/* Header Banner */}
      <div className="company-banner">
        <div className="banner-image">
          <img src={company.banner} alt={company.name} />
        </div>
        <div className="banner-overlay">
          <div className="banner-content">
            <div className="company-header-info">
              <div className="company-logo-large">
                <div className="logo-box">{company.logo}</div>
              </div>
              <div className="company-title-section">
                <h1 className="company-name-large">{company.name}</h1>
                <div className="company-quick-info">
                  <MapPin size={16} />
                  <span>{company.location}</span>
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
                <div className="rating-number">{company.rating}</div>
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

      {/* Main Content */}
      <div className="detail-content">
        <div className="detail-grid">
          {/* Left Column - Reviews List */}
          <div className="left-column">
            <div className="reviews-card">
              <h2 className="section-title">{company.reviews} người đánh giá</h2>

              <div className="reviews-list">
                {reviewsList.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-date">{review.date}</div>

                    <div className="review-rating">
                      <StarRating rating={review.rating} />
                      <span className="rating-text">{review.rating}</span>

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

              <div className="sign-in-prompt">
                <a href="#" className="sign-in-link">Sign in now</a>
                <span className="sign-in-text"> to see all reviews.</span>
              </div>
            </div>
          </div>

          {/* Right Column - Job Listings */}
          <div className="right-column">
            <div className="jobs-card">
              <h2 className="jobs-title">{company.jobs} job openings</h2>
              <div className="jobs-list">
                {jobListings.map((job) => (
                  <div key={job.id} className="job-card">
                    <div className="job-posted">{job.postedDate}</div>
                    <h3 className="job-title">{job.title}</h3>

                    <div className="job-company">
                      <div className="job-company-logo">{job.logo}</div>
                      <span className="job-company-name">{job.company}</span>
                    </div>

                    <div className="job-salary">
                      <span className="salary-icon">💰</span>
                      <a href="#" className="salary-link">Sign in to view salary</a>
                    </div>

                    <div className="job-meta">
                      <div className="job-meta-item">
                        <Briefcase size={14} />
                        <span>{job.position}</span>
                      </div>
                      <div className="job-meta-item">
                        <Users size={14} />
                        <span>{job.workType}</span>
                      </div>
                      <div className="job-meta-item">
                        <MapPin size={14} />
                        <span>{job.location}</span>
                      </div>
                    </div>

                    <div className="job-tags">
                      {job.tags.map((tag, index) => (
                        <span key={index} className="job-tag">{tag}</span>
                      ))}
                    </div>

                    <div className="job-benefits">
                      {job.benefits.map((benefit, index) => (
                        <div key={index} className="benefit-item">
                          <span className="benefit-dot">•</span>
                          <span>{benefit}</span>
                        </div>
                      ))}
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
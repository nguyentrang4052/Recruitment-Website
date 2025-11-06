// import React, { useState } from 'react';
import { MapPin, Briefcase, Star, Users, Calendar, Building2 } from 'lucide-react';
import './CompanyDetail.css';
import { useParams } from 'react-router-dom';

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
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'LG CNS Việt Nam',
      logo: '⭕',
      rating: 4.8,
      fullName: 'TOP 1 IT COMPANY IN KOREA',
      location: 'Ha Noi',
      jobs: 16,
      reviews: 50,
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'Bosch Global Software',
      logo: '🔧',
      rating: 3.3,
      fullName: 'The Bosch Group is a leading global supplier of technology and services',
      location: 'Ho Chi Minh',
      jobs: 12,
      reviews: 286,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop'
    },
    {
      id: 4,
      name: 'Viettel Group',
      logo: '📱',
      rating: 4.5,
      fullName: 'Tập đoàn Công nghiệp - Viễn thông Quân đội',
      location: 'Ha Noi',
      jobs: 45,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=200&fit=crop'
    },
    {
      id: 5,
      name: 'FPT Software',
      logo: '💻',
      rating: 4.2,
      fullName: 'Leading technology corporation in Vietnam',
      location: 'Da Nang',
      jobs: 28,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop'
    },
    {
      id: 6,
      name: 'VinGroup',
      logo: '🏢',
      rating: 4.1,
      fullName: 'Vietnam\'s leading private conglomerate',
      location: 'Ho Chi Minh',
      jobs: 52,
      reviews: 312,
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=200&fit=crop'
    }
  ];

const CompanyDetail = () => {
    //   const [activeTab, setActiveTab] = useState('overview');
    const {id} = useParams();
    const company = companies.find((c) => c.id === Number(id));
    if (!company) return <p>Không tìm thấy công ty.</p>;

    // const company = {
    //     id: 1,
    //     name: 'MB Bank',
    //     logo: '🏦',
    //     fullName: 'Ngân hàng TMCP Quân Đội (MB)',
    //     rating: 4.9,
    //     reviews: 123,
    //     recommendPercent: 96,
    //     locations: 'Ha Noi - Ho Chi Minh',
    //     address: 'Toà MB Sunny Tower, 259 Trần Hưng Đạo, District 1, Ho Chi Minh',
    //     jobs: 31,
    //     banner: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=300&fit=crop',
    //     type: 'IT Product',
    //     industry: 'Banking',
    //     size: '1000+ employees',
    //     country: 'Vietnam',
    //     workingDays: 'Monday - Friday'
    // };

    const jobListings = [
        {
            id: 1,
            title: 'Data Engineer (SQL/ PLSQL / NoSQL / Java)',
            company: 'MB Bank',
            logo: '🏦',
            postedDate: 'Posted 4 days ago',
            isHot: true,
            location: 'Ha Noi',
            address: 'Toà MB Sunny Tower, 259 Trần Hưng Đạo, District 1, Ho Chi Minh',
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
            address: 'Toà MB Sunny Tower, 259 Trần Hưng Đạo, District 1, Ho Chi Minh',
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


    return (
        <div className="company-detail-page">
            {/* Header Banner */}
            <div className="company-banner">
                <div className="banner-image">
                    <img src={company.banner} alt={company.name} />
                </div>
                <div className="banner-overlay">
                    <div className="banner-content">
                        <div className="company-header-info">
                            <div className="company-logo-large">
                                <div className="logo-box">
                                    {company.logo}
                                </div>
                            </div>
                            <div className="company-title-section">
                                <h1 className="company-name-large">{company.name}</h1>
                                <div className="company-quick-info">
                                    <MapPin size={16} />
                                    <span>{company.locations}</span>
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
                            {/* <div className="recommend-box">
                <div className="recommend-percent">{company.recommendPercent}%</div>
                <div className="recommend-text">Recommend working here to a friend</div>
              </div> */}
                            {/* <div className="award-badge">
                <div className="badge-ribbon">2025 WINNER!</div>
                <div className="badge-text">VIETNAM BEST IT COMPANIES™</div>
              </div> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            {/* <div className="company-nav">
        <div className="nav-container">
          <button
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`nav-tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
            <span className="tab-badge">{company.reviews}</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'articles' ? 'active' : ''}`}
            onClick={() => setActiveTab('articles')}
          >
            Articles
            <span className="tab-badge">4</span>
          </button>
        </div>
      </div> */}

            {/* Main Content */}
            <div className="detail-content">
                <div className="detail-grid">
                    {/* Left Column - Company Info */}
                    <div className="left-column">
                        {/* General Information */}
                        <div className="info-card">
                            <h2 className="section-title">General information</h2>
                            <div className="info-grid">
                                <div className="info-item">
                                    <div className="info-label">Company type</div>
                                    <div className="info-value">{company.type}</div>
                                </div>
                                <div className="info-item">
                                    <div className="info-label">Company industry</div>
                                    <div className="info-value">{company.industry}</div>
                                </div>
                                <div className="info-item">
                                    <div className="info-label">Company size</div>
                                    <div className="info-value">{company.size}</div>
                                </div>
                                <div className="info-item">
                                    <div className="info-label">Country</div>
                                    <div className="info-value">
                                        <span className="flag">🇻🇳</span> {company.country}
                                    </div>
                                </div>
                                <div className="info-item">
                                    <div className="info-label">Working days</div>
                                    <div className="info-value">{company.workingDays}</div>
                                </div>
                            </div>
                        </div>

                        {/* Company Overview */}
                        <div className="info-card">
                            <h2 className="section-title">Company overview</h2>
                            <div className="overview-content">
                                <h3 className="overview-subtitle">{company.fullName}</h3>
                                <h4 className="overview-heading">Về chúng tôi</h4>
                                <p className="overview-text">
                                    Với tầm nhìn "Trở thành Doanh nghiệp số, Tập đoàn tài chính dẫn đầu" cùng mục tiêu "Top 3 thị trường về
                                    hiệu quả, hướng đến Top đầu châu Á", MB đã và đang tiếp tục xây dựng, phát triển trong và ngoài nước,
                                    nhằm đáp ứng yêu cầu chuyển dịch số, mục tiêu tăng trưởng kinh doanh và nâng cao năng lực cạnh tranh.
                                </p>
                                <p className="overview-text">
                                    Sở hữu đội ngũ hơn 10.000 nhân sự, trong đó có hơn 1000 MBITers - chiếm 10% tổng nhân sự toàn Ngân hàng
                                    - năm trong top đầu các ngân hàng tại Việt Nam về tỉ lệ nhân sự thuộc nhóm Công nghệ và Đổi mới, MB
                                    đang không ngừng đầu tư mạnh mẽ cho hệ thống, con người và kinh doanh nền tảng nhằm đem đến những
                                    trải nghiệm xuất sắc nhất cho khách hàng, xây dựng môi trường làm việc hạnh phúc, bền vững cho người MB.
                                </p>
                                <p className="overview-text">
                                    Tự hào là Ngân hàng Số số 01 Việt Nam, được phục vụ hơn 30 triệu khách hàng cá nhân và doanh nghiệp.
                                </p>
                            </div>
                        </div>

                        {/* Location */}
                        {/* <div className="info-card">
              <h2 className="section-title">Địa chỉ</h2>
              <div className="location-content">
                {locations.map((location, index) => (
                  <div key={index} className="location-item">
                    <h3 className="location-city">{location.city}</h3>
                    <div className="location-address">
                      <MapPin size={16} />
                      <span>{location.address}</span>
                    </div>
                  </div>
             ))}  */}
                        <div className="info-card">
                            <h2 className="section-title">Địa chỉ</h2>
                            <div className="location-address">
                                <span>{company.address}</span>
                            </div>
                        </div>

                        <div className="map-container">
                            <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(company.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="map-link"
                            >
                                Xem trên Google Maps
                            </a>
                        </div>
                    </div>

            {/* Right Column - Job Listings */}
            <div className="right-column">
                <div className="jobs-card">
                    <h2 className="jobs-title">{company.jobs} job openings</h2>
                    <div className="jobs-list">
                        {jobListings.map((job) => (
                            <div key={job.id} className="job-card">
                                {/* {job.isHot && (
                      <div className="job-hot-badge">
                        🔥 SUPER HOT
                      </div>
                    )} */}
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

export default CompanyDetail;
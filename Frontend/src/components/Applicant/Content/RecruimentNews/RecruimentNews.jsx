import React, { useEffect, useState } from 'react';
import { LuHeart } from "react-icons/lu";
import { FaHeart } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { MdOutlineLocationOn, MdAttachMoney } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../../../../utils/Auth'
import axios from 'axios'
import './RecruimentNews.css';
import { formatDate } from '../../../../utils/Format'
import locations from '../../../../../data/provinces.json'


function ImageWithSearch({
    skillName,
    setSkillName,
    position,
    setPosition,
    level,
    setLevel,
    location,
    setLocation,
    onSearch
}) {
    const images = [
        "/images/introduce1.png",
        "/images/introduce2.png"
    ];
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage(prev => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    const levels = ['INTERN', 'FRESHER', 'JUNIOR', 'MID_LEVEL', 'SENIOR']

    const isDashboard = location.pathname === '/dashboard'

    return (
        <div className="image-search">
            <img src={images[currentImage]} alt={`Slrnide ${currentImage}`} />
            <div className={`search-container ${isDashboard ? 'dashboard' : ''}`}>
                <input placeholder="-- Vị trí -- " value={position} onChange={e => setPosition(e.target.value)} />

                <select value={level} onChange={e => setLevel(e.target.value)}>
                    <option value="">-- Chọn cấp bậc --</option>
                    {levels.map((loc, idx) => (
                        <option key={idx} value={loc}>{loc}</option>
                    ))}
                </select>

                <input placeholder="-- Kỹ năng -- " value={skillName} onChange={e => setSkillName(e.target.value)} />


                <select value={location} onChange={e => setLocation(e.target.value)}>
                    <option value="">-- Chọn địa điểm --</option>
                    {locations.map((loc, idx) => (
                        <option key={idx} value={loc.name}>{loc.name}</option>
                    ))}
                </select>
                <button className="search-btn" onClick={onSearch}>
                    <FaSearch />
                </button>
            </div>
        </div>
    );
}

function RecruimentNews() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    // const [favoriteJobs, setFavoriteJobs] = useState([]);
    const [skillName, setSkillName] = useState('');
    const [position, setPosition] = useState('');
    const [level, setLevel] = useState('');
    const [location, setLocation] = useState('');

    const recruimentPerPage = 10;



    const [recruitments, setRecruitments] = useState([]);
    useEffect(() => {
        const fetchRecruitments = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/");
                setRecruitments(JSON.parse(typeof res.data === 'string' ? res.data : JSON.stringify(res.data)));
            } catch (thrown) {
                console.error("Chi tiết lỗi:", thrown);
            } finally {
                setLoading(false);
            }
        };
        fetchRecruitments();
    }, []);




    const totalPages = Math.ceil(recruitments.length / recruimentPerPage);

    const displayrecruitments = recruitments.slice(
        (currentPage - 1) * recruimentPerPage,
        currentPage * recruimentPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        setCurrentPage(1);
    };

    const handleSearch = async () => {
        const params = new URLSearchParams();
        if (skillName.trim()) params.append('skillName', skillName.trim());
        if (position.trim()) params.append('position', position.trim());
        if (level.trim()) params.append('level', level.trim());
        if (location.trim()) params.append('location', location.trim());

        try {
            const res = await axios.get('http://localhost:8080/api/job/search', { params });
            console.log(res.data)
            setRecruitments(res.data);
            setCurrentPage(1);
        } catch {
            setRecruitments([]);
        }
    };


    const onApply = (rnid) => {
        navigate(`/recruitment/${rnid}`);
    }

    const viewDetail = (rnid) => {
        navigate(`/recruitment/${rnid}`);
    }


    const toggleFavorite = async (rnid) => {
        const token = localStorage.getItem('token');
        const applicantID = localStorage.getItem('applicantID')

        if (!token || isTokenExpired(token)) {
            navigate("/applicant-login");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:8080/api/applicant/toggle", null,
                {
                    params: { applicantID, rnid },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            console.log(res.data);

            setFavoriteJobs(prev =>
                prev.includes(rnid) ? prev.filter(id => id !== rnid) : [...prev, rnid]
            );
        } catch (err) {
            console.error("Lỗi khi lưu yêu thích:", err);
        }
    };

   const [favoriteJobs, setFavoriteJobs] = useState([]);

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
                  const savedIds = res.data.map(job => job.rnid);
            setFavoriteJobs(savedIds);
            } catch {
                console.log('Loi khi tai tin yeu thich')
            }


        }
        fetchSaveJob([applicantID, token])
    })




    // const isFavorite = (rnid) => {
    //     setSaveJobs(prev =>
    //         prev.includes(rnid) ? prev.filter(id => id !== rnid) : [...prev, rnid]
    //     );
    // }
    const isFavorite = (rnid) => { return favoriteJobs.includes(rnid); }


    if (loading) return <div>Loading...</div>;
    return (
        <div>
            <ImageWithSearch
                searchText={searchText}
                onSearchChange={handleSearchChange}
                skillName={skillName}
                setSkillName={setSkillName}
                position={position}
                setPosition={setPosition}
                level={level}
                setLevel={setLevel}
                location={location}
                setLocation={setLocation}
                onSearch={handleSearch}
            />
            <div className="recruimentnews-page">
                <div className="recruimentnews-container">
                    {displayrecruitments.map((recruiment, index) => (
                        <div key={index} className="recruimentnew-container">
                            <img src={recruiment.employer.logo} alt={`Logo của ${recruiment.employer.name}`} className="company-img" />
                            <div className="recruitment-content">
                                <h3 className="recruiment-position" onClick={() => viewDetail(recruiment.rnid)}>{recruiment.position}</h3>
                                <p><strong><span className="recruiment-value-emp">{recruiment.employer.name}</span></strong></p>
                                <div className="recruiment-info">
                                    <p><MdOutlineLocationOn /><span className="recruiment-value"> {recruiment.location}</span></p>
                                    <p><strong>Ngày đăng tin:</strong><span className="recruiment-value"> {formatDate(recruiment.postedAt)}</span></p>
                                </div>
                                <div className="recruiment-info">
                                    <p><MdAttachMoney /><span className="recruiment-value"> {recruiment.salary}</span></p>
                                    <p><strong>Hạn nộp hồ sơ:</strong><span className="recruiment-value"> {formatDate(recruiment.deadline)}</span></p>
                                </div>
                                <div className="end-card">
                                    <div className="skills-list">
                                        {recruiment.skill.map((skill, index) => (
                                            <span key={index} className="skill">{skill}</span>))
                                        }
                                    </div>
                                    <div className="recruit-btn">
                                        <button
                                            className={`favorite-btn ${isFavorite(recruiment.rnid) ? 'active' : ''}`}
                                            onClick={() => toggleFavorite(recruiment.rnid)}
                                        >
                                            {isFavorite(recruiment.rnid) ? <FaHeart /> : <LuHeart />}
                                        </button>
                                        <button className="apply-btn" onClick={() => onApply(recruiment.rnid)}>Ứng tuyển</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>

    );
}

export default RecruimentNews;

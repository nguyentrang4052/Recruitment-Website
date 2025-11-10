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

// const samplerecruitments = [
//     {
//         rnid: 1,
//         position: "Lập trình viên Frontend",
//         employer: {
//             name: "Công ty ABC",
//             logo: "/logo/bosch.png"
//         },
//         salary: "10-15 triệu VND",
//         location: "Hà Nội",
//         deadline: "30/09/2024",
//         postedAt: "01/09/2024",
//         skill: ["Java", "C#", "SQL", "Oracle", "React JS"]
//     },
//     {
//         rnid: 2,
//         position: "Lập trình viên Backend",
//         employer: {
//             name: "Công ty XYZ",
//             logo: "/logo/bosch.png"
//         },
//         salary: "8-12 triệu VND",
//         location: "TP. Hồ Chí Minh",
//         deadline: "15/10/2024",
//         postedAt: "05/09/2024",
//         skill: ["Java", "C#", "SQL"]
//     },
//     {
//         rnid: 3,
//         position: "Kỹ sư DevOps",
//         employer: {
//             name: "Công ty DEF",
//             logo: "/logo/bosch.png"
//         },
//         salary: "12-18 triệu VND",
//         location: "Đà Nẵng",
//         deadline: "20/10/2024",
//         postedAt: "10/09/2024",
//         skill: ["Java", "C#", "SQL"]
//     },
//     {
//         rnid: 4,
//         position: "Fullstack developer",
//         employer: {
//             name: "Công ty GHI",
//             logo: "/logo/bosch.png"
//         },
//         salary: "7-10 triệu VND",
//         location: "Hải Phòng",
//         deadline: "25/10/2024",
//         postedAt: "12/09/2024",
//         skill: ["Java", "C#", "SQL"]
//     },
//     {
//         rnid: 5,
//         position: "Thiết kế UI/UX",
//         employer: {
//             name: "Công ty JKL",
//             logo: "/logo/bosch.png"
//         },
//         salary: "9-14 triệu VND",
//         location: "Cần Thơ",
//         deadline: "30/10/2024",
//         postedAt: "15/09/2024",
//         skill: ["Java", "C#", "SQL"]
//     },
//     {
//         rnid: 6,
//         position: "Quản lý dự án",
//         employer: {
//             name: "Công ty MNO",
//             logo: "/logo/bosch.png"
//         },
//         salary: "15-20 triệu VND",
//         location: "Hà Nội",
//         deadline: "05/11/2024",
//         postedAt: "18/09/2024",
//         skill: ["Java", "C#", "SQL"]
//     },
//     {
//         rnid: 7,
//         position: "Chuyên viên An ninh Mạng",
//         employer: {
//             name: "Công ty PQR",
//             logo: "/logo/bosch.png"
//         },
//         salary: "10-13 triệu VND",
//         location: "TP. Hồ Chí Minh",
//         deadline: "10/11/2024",
//         postedAt: "20/09/2024",
//         skill: ["Java", "C#", "SQL"]
//     },
//     {
//         rnid: 8,
//         position: "Kỹ sư Mạng",
//         employer: {
//             name: "Công ty STU",
//             logo: "/logo/bosch.png"
//         },
//         salary: "11-16 triệu VND",
//         location: "Đà Nẵng",
//         deadline: "15/11/2024",
//         postedAt: "22/09/2024",
//         skill: ["Java", "C#", "SQL"]
//     },
//     {
//         rnid: 9,
//         position: "Chuyên viên Phân tích Dữ liệu",
//         employer: {
//             name: "Công ty YZ",
//             logo: "/logo/bosch.png"
//         },
//         salary: "13-17 triệu VND",
//         location: "Cần Thơ",
//         deadline: "25/11/2024",
//         postedAt: "28/09/2024",
//         skill: ["Java", "C#", "SQL"]
//     },
//     {
//         rnid: 10,
//         position: "Business Intelligence",
//         employer: {
//             name: "TEZ SK4",
//             logo: "/logo/bosch.png"
//         },
//         salary: "11-12 triệu VND",
//         location: "TP Hồ Chí Minh",
//         deadline: "23/10/2025",
//         postedAt: "23/09/2025",
//         skill: ["Java", "C#", "SQL"]
//     }
// ];
function ImageWithSearch({ searchText, onSearchChange, onSearch }) {
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

    const isDashboard = location.pathname === '/dashboard';

    return (
        <div className="image-search">
            <img src={images[currentImage]} alt={`Slrnide ${currentImage}`} />
            <div className={`search-container ${isDashboard ? 'dashboard' : ''}`}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={onSearchChange}
                />
                <button className="search-btn" onClick={() => onSearch()}>
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
    const [favoriteJobs, setFavoriteJobs] = useState([]);

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

    const token = localStorage.getItem('token')

    const onApply = (rnid) => {
        if (token && !isTokenExpired(token)) {
            navigate(`/recruitment/${rnid}`);
        }
        else
            navigate("/applicant-login");
    }

    const viewDetail = (rnid) => {
        navigate(`/recruitment/${rnid}`);
    }


    const toggleFavorite = (rnid) => {
        const token = localStorage.getItem('token');

        if (!token || isTokenExpired(token)) {
            navigate("/applicant-login");
            return;
        }

        setFavoriteJobs(prev => {
            let newFavorites;
            if (prev.includes(rnid)) {
                newFavorites = prev.filter(id => id !== rnid);
            } else {
                // Thêm favorite
                newFavorites = [...prev, rnid];
            }

            // Lưu vào localStorage
            // localStorage.setItem('favoriteJobs', JSON.stringify(newFavorites));
            return newFavorites;
        });
    }

    // Check xem job có được favorite không
    const isFavorite = (rnid) => {
        return favoriteJobs.includes(rnid);
    }

    if (loading) return <div>Loading...</div>;
    return (
        <div>
            <ImageWithSearch searchText={searchText} onSearchChange={handleSearchChange} />
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
                                    <div className="btn">
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

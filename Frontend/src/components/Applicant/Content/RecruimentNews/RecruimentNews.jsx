import React, { useEffect, useState } from 'react';
import { LuHeart } from "react-icons/lu";
import { FaSearch } from "react-icons/fa";
import { MdOutlineLocationOn, MdAttachMoney } from "react-icons/md";
import './RecruimentNews.css';

const sampleRecruiments = [
    {
        title: "Lập trình viên Frontend",
        employer: {
            name: "Công ty ABC",
            logo: "/logo/bosch.png"
        },
        salary: "10-15 triệu VND",
        location: "Hà Nội",
        deadline: "30/09/2024",
        postedAt: "01/09/2024",
        skill: ["Java", "C#", "SQL", "Oracle", "React JS"]
    },
    {
        title: "Lập trình viên Backend",
        employer: {
            name: "Công ty XYZ",
            logo: "/logo/bosch.png"
        },
        salary: "8-12 triệu VND",
        location: "TP. Hồ Chí Minh",
        deadline: "15/10/2024",
        postedAt: "05/09/2024",
        skill: ["Java", "C#", "SQL"]
    },
    {
        title: "Kỹ sư DevOps",
        employer: {
            name: "Công ty DEF",
            logo: "/logo/bosch.png"
        },
        salary: "12-18 triệu VND",
        location: "Đà Nẵng",
        deadline: "20/10/2024",
        postedAt: "10/09/2024",
        skill: ["Java", "C#", "SQL"]
    },
    {
        title: "Fullstack developer",
        employer: {
            name: "Công ty GHI",
            logo: "/logo/bosch.png"
        },
        salary: "7-10 triệu VND",
        location: "Hải Phòng",
        deadline: "25/10/2024",
        postedAt: "12/09/2024",
        skill: ["Java", "C#", "SQL"]
    },
    {
        title: "Thiết kế UI/UX",
        employer: {
            name: "Công ty JKL",
            logo: "/logo/bosch.png"
        },
        salary: "9-14 triệu VND",
        location: "Cần Thơ",
        deadline: "30/10/2024",
        postedAt: "15/09/2024",
        skill: ["Java", "C#", "SQL"]
    },
    {
        title: "Quản lý dự án",
        employer: {
            name: "Công ty MNO",
            logo: "/logo/bosch.png"
        },
        salary: "15-20 triệu VND",
        location: "Hà Nội",
        deadline: "05/11/2024",
        postedAt: "18/09/2024",
        skill: ["Java", "C#", "SQL"]
    },
    {
        title: "Chuyên viên An ninh Mạng",
        employer: {
            name: "Công ty PQR",
            logo: "/logo/bosch.png"
        },
        salary: "10-13 triệu VND",
        location: "TP. Hồ Chí Minh",
        deadline: "10/11/2024",
        postedAt: "20/09/2024",
        skill: ["Java", "C#", "SQL"]
    },
    {
        title: "Kỹ sư Mạng",
        employer: {
            name: "Công ty STU",
            logo: "/logo/bosch.png"
        },
        salary: "11-16 triệu VND",
        location: "Đà Nẵng",
        deadline: "15/11/2024",
        postedAt: "22/09/2024",
        skill: ["Java", "C#", "SQL"]
    },
    {
        title: "Chuyên viên Phân tích Dữ liệu",
        employer: {
            name: "Công ty YZ",
            logo: "/logo/bosch.png"
        },
        salary: "13-17 triệu VND",
        location: "Cần Thơ",
        deadline: "25/11/2024",
        postedAt: "28/09/2024",
        skill: ["Java", "C#", "SQL"]
    },
    {
        title: "Business Intelligence",
        employer: {
            name: "TEZ SK4",
            logo: "/logo/bosch.png"
        },
        salary: "11-12 triệu VND",
        location: "TP Hồ Chí Minh",
        deadline: "23/10/2025",
        postedAt: "23/09/2025",
        skill: ["Java", "C#", "SQL"]
    }
];
function ImageWithSearch({ recruiments = sampleRecruiments, searchText, onSearchChange, onSearch }) {
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

    return (
        <div className="image-search">
            <input type="text" placeholder="Search..." value={searchText} onChange={onSearchChange} />
            <button className="search-btn" onClick={() => onSearch(recruiments)}><FaSearch /></button>
            <img src={images[currentImage]} alt={`Slide ${currentImage}`} />

        </div>
    );
}

function RecruimentNews({ recruiments = sampleRecruiments, onFavourite, onApply, viewDetail }) {
    const [currentPage, setCurrentPage] = useState(1);
    const recruimentPerPage = 10;
    const [searchText, setSearchText] = useState('');

    const totalPages = Math.ceil(recruiments.length / recruimentPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const displayRecruiments = recruiments.slice(
        (currentPage - 1) * recruimentPerPage,
        currentPage * recruimentPerPage
    );

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div>
            <ImageWithSearch searchText={searchText} onSearchChange={handleSearchChange} />
            <div className="recruimentnews-page">
                <div className="recruimentnews-container">
                    {displayRecruiments.map((recruiment, index) => (
                        <div key={index} className="recruimentnew-container">
                            <img src={recruiment.employer.logo} alt={`Logo của ${recruiment.employer.name}`} className="company-logo" />
                            <div className="recruitment-content">
                                <h3 className="recruiment-title" onClick={() => viewDetail(recruiment)}>{recruiment.title}</h3>
                                <p><strong><span className="recruiment-value-emp">{recruiment.employer.name}</span></strong></p>
                                <div className="recruiment-info">
                                    <p><MdOutlineLocationOn /><span className="recruiment-value"> {recruiment.location}</span></p>
                                    <p><strong>Ngày đăng tin:</strong><span className="recruiment-value"> {recruiment.postedAt}</span></p>
                                </div>
                                <div className="recruiment-info">
                                    <p><MdAttachMoney /><span className="recruiment-value"> {recruiment.salary}</span></p>
                                    <p><strong>Hạn nộp hồ sơ:</strong><span className="recruiment-value"> {recruiment.deadline}</span></p>
                                </div>
                                <div className="end-card">
                                    <div className="skills-list">
                                        {recruiment.skill.map((skill, index) => (
                                            <span key={index} className="skill">{skill}</span>))
                                        }
                                    </div>
                                    <div className="btn">
                                        <button className="favorite-btn" onClick={() => onFavourite(recruiment)}><LuHeart /></button>
                                        <button className="apply-btn" onClick={() => onApply(recruiment)}>Ứng tuyển</button>
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

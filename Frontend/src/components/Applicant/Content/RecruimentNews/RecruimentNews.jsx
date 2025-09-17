import React, { useState } from 'react';
import { LuHeart } from "react-icons/lu";
import { MdOutlineLocationOn, MdAttachMoney } from "react-icons/md";
import './RecruimentNews.css';

const sampleRecruiments = [
    {
        title: "Lập trình viên Frontend",
        employer: "Công ty ABC",
        salary: "10-15 triệu VND",
        location: "Hà Nội",
        deadline: "30/09/2024",
        postedAt: "01/09/2024"
    },
    {
        title: "Lập trình viên Backend",
        employer: "Công ty XYZ",
        salary: "8-12 triệu VND",
        location: "TP. Hồ Chí Minh",
        deadline: "15/10/2024",
        postedAt: "05/09/2024"
    },
    {
        title: "Kỹ sư DevOps",
        employer: "Công ty DEF",
        salary: "12-18 triệu VND",
        location: "Đà Nẵng",
        deadline: "20/10/2024",
        postedAt: "10/09/2024"
    },
    {
        title: "Fullstack developer",
        employer: "Công ty GHI",   
        salary: "7-10 triệu VND",
        location: "Hải Phòng",
        deadline: "25/10/2024",
        postedAt: "12/09/2024"
    },
    {   title: "Thiết kế UI/UX",
        employer: "Công ty JKL",
        salary: "9-14 triệu VND",
        location: "Cần Thơ",
        deadline: "30/10/2024",
        postedAt: "15/09/2024"
    },
    {
        title: "Quản lý dự án",
        employer: "Công ty MNO",
        salary: "15-20 triệu VND",
        location: "Hà Nội",
        deadline: "05/11/2024",
        postedAt: "18/09/2024"
    },
    {
        title: "Chuyên viên An ninh Mạng",
        employer: "Công ty PQR",
        salary: "10-13 triệu VND",
        location: "TP. Hồ Chí Minh",
        deadline: "10/11/2024",
        postedAt: "20/09/2024"
    },
    {
        title: "Kỹ sư Mạng",
        employer: "Công ty STU",
        salary: "11-16 triệu VND",
        location: "Đà Nẵng",
        deadline: "15/11/2024",
        postedAt: "22/09/2024"
    },
    {
        title: "Chuyên viên Phân tích Dữ liệu",
        employer: "Công ty YZ",
        salary: "13-17 triệu VND",
        location: "Cần Thơ",
        deadline: "25/11/2024",
        postedAt: "28/09/2024"
    }
];
function RecruimentNews({ recruiments = sampleRecruiments, onFavourite, onApply, viewDetail }) {
    const [currentPage, setCurrentPage] = useState(1);
    const recruimentPerPage = 9; 

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

    return (
        <div className="recruimentnews-page">
            <div className="recruimentnews-container">
                {displayRecruiments.map((recruiment, index) => (
                    <div key={index} className="recruimentnew-container">
                        <div className="recruiment-card">
                            <h3 className="recruiment-title" onClick={() => viewDetail(recruiment)}>{recruiment.title}</h3>                          
                                <p><strong><span className="recruiment-value-emp">{recruiment.employer}</span></strong></p>
                            <div className="recruiment-info">
                                <p><MdOutlineLocationOn /><span className="recruiment-value"> {recruiment.location}</span></p>
                                <p><strong>Ngày đăng tin:</strong><span className="recruiment-value"> {recruiment.postedAt}</span></p>                            
                            </div>
                            <div className="recruiment-info">
                                <p><MdAttachMoney /><span className="recruiment-value"> {recruiment.salary}</span></p>
                                <p><strong>Hạn nộp hồ sơ:</strong><span className="recruiment-value"> {recruiment.deadline}</span></p>
                            </div>
                        <div className="btn">
                            <button className="favorite-btn" onClick={() => onFavourite(recruiment)}><LuHeart /></button>
                            <button className="apply-btn" onClick={() => onApply(recruiment)}>Ứng tuyển</button>
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
    );
}

export default RecruimentNews;

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './SearchApplicant.css';
import provincesData from '../../../../data/provinces.json';
import avatarPlaceholder from '../../../assets/avatar.png';


const API_BASE_URL = 'http://localhost:8080/api/employer';
const SKILLS_API_URL = 'http://localhost:8080/api/skills/list';
const DEFAULT_PAGE_SIZE = 4;



const SearchApplicant = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [location, setLocation] = useState('');
    const [experience, setExperience] = useState('Tất cả');

    const [candidates, setCandidates] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const [cities, setCities] = useState([]);
    const [availableSkills, setAvailableSkills] = useState([]);
    const [skillsLoading, setSkillsLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [skillSearchTerm, setSkillSearchTerm] = useState('');

    const experienceLevels = ["Tất cả", "Fresher", "Junior", "Mid-level", "Senior", "Manager"];

    const token = localStorage.getItem('token');


    useEffect(() => {
        setCities(provincesData);

        const fetchSkills = async () => {
            try {
                const res = await fetch(SKILLS_API_URL);
                if (!res.ok) throw new Error('Không thể tải danh sách kỹ năng');
                const data = await res.json();
                const skillNames = data
                    .map(skill => skill.skillName)
                    .filter(name => typeof name === 'string' && name.trim() !== '');
                setAvailableSkills(skillNames);
            } catch (err) {
                console.error("Lỗi khi tải kỹ năng:", err);
            } finally {
                setSkillsLoading(false);
            }
        };
        fetchSkills();
    }, []);


    const fetchCandidates = useCallback(async (page = 0) => {
        if (!token) {
            alert("Bạn cần đăng nhập với vai trò Nhà tuyển dụng để tìm kiếm ứng viên.");
            return;
        }

        setLoading(true);
        setCurrentPage(page);


        const searchPayload = {
            searchTerm: searchTerm || null,
            location: location || null,
            experience: experience === 'Tất cả' ? null : experience,
            skills: selectedSkills.length > 0 ? selectedSkills : null,
            page: page,
            size: DEFAULT_PAGE_SIZE,
        };

        try {
            const res = await fetch(`${API_BASE_URL}/search_applicant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(searchPayload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || `Lỗi ${res.status}: Không thể tìm kiếm ứng viên.`);
            }


            setCandidates(data.candidates || []);
            setTotalResults(data.totalResults || 0);
            setTotalPages(data.totalPages || 0);

        } catch (err) {
            console.error("Lỗi gọi API tìm kiếm:", err);
            alert(`Lỗi tìm kiếm: ${err.message}`);
            setCandidates([]);
            setTotalResults(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, location, experience, selectedSkills, token]);

    useEffect(() => {
        fetchCandidates(0);
    }, [fetchCandidates]);


    const handleSearch = (e) => {
        e.preventDefault();
        fetchCandidates(0);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            fetchCandidates(newPage);
        }
    };

    const handleSkillToggle = (skill) => {
        setSelectedSkills(prevSkills => {
            const isSelected = prevSkills.includes(skill);
            if (isSelected) {
                return prevSkills.filter(item => item !== skill);
            } else {
                return [...prevSkills, skill];
            }
        });
    };

    const filteredSkills = availableSkills.filter(skill =>
        skill.toLowerCase().includes(skillSearchTerm.toLowerCase())
    );


    return (
        <div className="search-applicant-container">
            <h3>TÌM KIẾM ỨNG VIÊN</h3>
            <form onSubmit={handleSearch} className="search-form">
                <div className="form-group-inline">
                    <div className="form-group search-field">
                        <label htmlFor="searchTerm">Từ khóa (Tên, chức danh)</label>
                        <input
                            type="text"
                            id="searchTerm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Nhập từ khóa tìm kiếm..."
                        />
                    </div>
                    <div className="form-group search-field">
                        <label htmlFor="location">Địa điểm</label>
                        <select
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        >
                            <option value="">Tất cả địa điểm</option>
                            {cities.map(loc => (
                                <option key={loc.code} value={loc.name}>{loc.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group-inline">
                    <div className="form-group search-field full-width">
                        <label>Kỹ năng</label>
                        <div className="custom-combobox" tabIndex="0" onBlur={() => setIsDropdownOpen(false)}>
                            <div
                                className="combobox-selected-display"
                                onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
                            >
                                {selectedSkills.length > 0 ? (
                                    selectedSkills.map(skill => (
                                        <span key={skill} className="selected-skill-tag">
                                            {skill}
                                            <button
                                                type="button"
                                                className="remove-skill"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSkillToggle(skill);
                                                }}
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))
                                ) : (
                                    <span className="combobox-placeholder">Chọn kỹ năng...</span>
                                )}
                            </div>
                            {isDropdownOpen && (
                                <div className="combobox-dropdown" onMouseDown={(e) => e.preventDefault()}>
                                    <input
                                        type="text"
                                        className="combobox-search-input"
                                        placeholder="Tìm kiếm..."
                                        value={skillSearchTerm}
                                        onChange={(e) => setSkillSearchTerm(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <ul className="combobox-list">
                                        {skillsLoading ? (
                                            <li className="combobox-placeholder">Đang tải...</li>
                                        ) : filteredSkills.length === 0 ? (
                                            <li className="combobox-placeholder">Không tìm thấy kỹ năng.</li>
                                        ) : (
                                            filteredSkills.map(skill => (
                                                <li
                                                    key={skill}
                                                    className={`combobox-item ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSkillToggle(skill);
                                                    }}
                                                >
                                                    {skill}
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="form-group search-field">
                        <label htmlFor="experience">Cấp bậc</label>
                        <select
                            id="experience"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                        >
                            {experienceLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button type="submit" className="search-button" disabled={loading}>
                    {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                </button>
            </form>

            <div className="search-results-container">
                <h4>Tìm thấy {totalResults} ứng viên phù hợp</h4>
                {loading ? (
                    <p className="loading-indicator">Đang tải danh sách ứng viên...</p>
                ) : candidates.length > 0 ? (
                    <div className="candidates-list">
                        {candidates.map(candidate => (
                            <div key={candidate.applicantID} className="candidate-card">
                                <img
                                    src={candidate.photo || avatarPlaceholder}
                                    alt="Avatar"
                                    className="candidate-avatar"
                                    onError={(e) => { e.target.onerror = null; e.target.src = avatarPlaceholder; }}
                                />
                                <div className="candidate-info">

                                    <h5 className="candidate-name">{candidate.applicantName}</h5>
                                    <p className="candidate-title">{candidate.jobTitle || "Chưa cập nhật chức danh"}</p>

                                    <div className="candidate-meta">
                                        <span><i className="fas fa-map-marker-alt"></i> {candidate.location || "Toàn quốc"}</span>
                                        <span><i className="fas fa-briefcase"></i> {candidate.experience || "Chưa rõ"}</span>
                                    </div>


                                    <div className="candidate-skills">
                                        {(candidate.skillNames || []).map((skill, index) => (
                                            <span key={index} className="skill-tag">{skill}</span>
                                        ))}

                                    </div>


                                    <p className="salary-expectation">Mức lương mong muốn: <strong>{candidate.desireSalary || "Thỏa thuận"}</strong></p>

                                    <Link
                                        to={`/employer/applicant/${candidate.applicantID}`}
                                        className="view-profile-button"
                                    >
                                        Xem hồ sơ
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-results">Không tìm thấy ứng viên phù hợp. Vui lòng thử lại với tiêu chí khác.</p>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0 || loading}
                    >
                        Trang trước
                    </button>
                    <span className="page-indicator">
                        Trang {currentPage + 1} / {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1 || loading}
                    >
                        Trang sau
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchApplicant;
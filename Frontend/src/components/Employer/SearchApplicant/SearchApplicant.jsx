<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import './SearchApplicant.css';
import provincesData from '../../../../data/provinces.json';
import avatar from '../../../assets/avatar.png';

// Giả lập dữ liệu ứng viên 
const allCandidates = [
    {
        id: 1,
        name: 'Nguyễn Văn An',
        title: 'Lập trình viên ReactJS',
        location: 'Hồ Chí Minh',
        skills: ['ReactJS', 'JavaScript', 'HTML/CSS', 'Node.js'],
        experience: 'Mid-level',
        salaryExpectation: '15,000,000 - 20,000,000 VND',
        avatar: avatar
    },
    {
        id: 2,
        name: 'Trần Thị Bình',
        title: 'Thiết kế UI/UX',
        location: 'Hà Nội',
        skills: ['UI/UX Design', 'Figma', 'Sketch', 'Adobe XD'],
        experience: 'Senior',
        salaryExpectation: '18,000,000 - 25,000,000 VND',
        avatar: avatar
    },
    {
        id: 3,
        name: 'Lê Văn Cường',
        title: 'Kỹ sư DevOps',
        location: 'Đà Nẵng',
        skills: ['DevOps', 'Cloud Computing', 'Docker', 'Kubernetes'],
        experience: 'Junior',
        salaryExpectation: '10,000,000 - 15,000,000 VND',
        avatar: avatar
    },
    {
        id: 4,
        name: 'Phạm Thị Duyên',
        title: 'Phân tích dữ liệu',
        location: 'Hồ Chí Minh',
        skills: ['Python', 'SQL', 'Data Analysis', 'Machine Learning'],
        experience: 'Mid-level',
        salaryExpectation: '16,000,000 - 22,000,000 VND',
        avatar: avatar
    },
    {
        id: 5,
        name: 'Hoàng Văn Em',
        title: 'Lập trình viên Node.js',
        location: 'Hà Nội',
        skills: ['Node.js', 'JavaScript', 'MongoDB', 'RESTful API'],
        experience: 'Senior',
        salaryExpectation: '20,000,000 - 28,000,000 VND',
        avatar: avatar
    },
];

const skillsData = [
    "ReactJS", "Node.js", "JavaScript", "Python", "Java", "C++",
    "HTML/CSS", "SQL", "Mobile Development", "DevOps", "AI/ML",
    "Cloud Computing", "UI/UX Design", "Project Management", "Figma", "Sketch", "Adobe XD", "Docker", "Kubernetes", "Data Analysis", "Machine Learning", "MongoDB", "RESTful API"
];
=======
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './SearchApplicant.css';
import provincesData from '../../../../data/provinces.json';
import avatarPlaceholder from '../../../assets/avatar.png';


const API_BASE_URL = 'http://localhost:8080/api/employer';
const SKILLS_API_URL = 'http://localhost:8080/api/skills/list';
const DEFAULT_PAGE_SIZE = 4;


>>>>>>> origin/Trong

const SearchApplicant = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [location, setLocation] = useState('');
<<<<<<< HEAD
    const [experience, setExperience] = useState('');
    const [searchResults, setSearchResults] = useState(allCandidates);
    const [cities, setCities] = useState([]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [skillSearchTerm, setSkillSearchTerm] = useState('');


    const [currentPage, setCurrentPage] = useState(1);
    const candidatesPerPage = 4;

    useEffect(() => {
        setCities(provincesData);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const filtered = allCandidates.filter(candidate => {
            const matchesKeyword = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                candidate.title.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesLocation = location === '' || candidate.location === location;

            const matchesSkills = selectedSkills.length === 0 || selectedSkills.every(skill =>
                candidate.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
            );

            const matchesExperience = experience === 'Tất cả' || experience === '' || candidate.experience === experience;

            return matchesKeyword && matchesLocation && matchesSkills && matchesExperience;
        });

        setSearchResults(filtered);
        setCurrentPage(1);
=======
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
>>>>>>> origin/Trong
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

<<<<<<< HEAD
    const experienceLevels = ["Tất cả", "Fresher", "Junior", "Mid-level", "Senior", "Manager"];

    const filteredSkills = skillsData.filter(skill =>
=======
    const filteredSkills = availableSkills.filter(skill =>
>>>>>>> origin/Trong
        skill.toLowerCase().includes(skillSearchTerm.toLowerCase())
    );


<<<<<<< HEAD
    const indexOfLastCandidate = currentPage * candidatesPerPage;
    const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
    const currentCandidates = searchResults.slice(indexOfFirstCandidate, indexOfLastCandidate);

    const totalPages = Math.ceil(searchResults.length / candidatesPerPage);

=======
>>>>>>> origin/Trong
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
<<<<<<< HEAD
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
=======
                                onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
>>>>>>> origin/Trong
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
<<<<<<< HEAD
                                <div className="combobox-dropdown">
=======
                                <div className="combobox-dropdown" onMouseDown={(e) => e.preventDefault()}>
>>>>>>> origin/Trong
                                    <input
                                        type="text"
                                        className="combobox-search-input"
                                        placeholder="Tìm kiếm..."
                                        value={skillSearchTerm}
                                        onChange={(e) => setSkillSearchTerm(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <ul className="combobox-list">
<<<<<<< HEAD
                                        {filteredSkills.map(skill => (
                                            <li
                                                key={skill}
                                                className={`combobox-item ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                                                onClick={() => handleSkillToggle(skill)}
                                            >
                                                {skill}
                                            </li>
                                        ))}
=======
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
>>>>>>> origin/Trong
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

<<<<<<< HEAD
                <button type="submit" className="search-button">Tìm kiếm</button>
            </form>

            <div className="search-results-container">
                <h4>Tìm thấy {searchResults.length} ứng viên phù hợp</h4>
                {currentCandidates.length > 0 ? (
                    <div className="candidates-list">
                        {currentCandidates.map(candidate => (
                            <div key={candidate.id} className="candidate-card">
                                <img src={candidate.avatar} alt="Avatar" className="candidate-avatar" />
                                <div className="candidate-info">
                                    <h5 className="candidate-name">{candidate.name}</h5>
                                    <p className="candidate-title">{candidate.title}</p>
                                    <div className="candidate-meta">
                                        <span><i className="fas fa-map-marker-alt"></i> {candidate.location}</span>
                                        <span><i className="fas fa-briefcase"></i> {candidate.experience}</span>
                                    </div>
                                    <div className="candidate-skills">
                                        {candidate.skills.map(skill => (
                                            <span key={skill} className="skill-tag">{skill}</span>
                                        ))}
                                    </div>
                                    <p className="salary-expectation">Mức lương: <strong>{candidate.salaryExpectation}</strong></p>
                                    <button onClick={() => alert(`Xem chi tiết hồ sơ của ${candidate.name}`)} className="view-profile-button">Xem hồ sơ</button>
=======
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
>>>>>>> origin/Trong
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-results">Không tìm thấy ứng viên phù hợp. Vui lòng thử lại với tiêu chí khác.</p>
                )}
            </div>

<<<<<<< HEAD

            {searchResults.length > candidatesPerPage && (
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        disabled={currentPage === 1}
=======
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0 || loading}
>>>>>>> origin/Trong
                    >
                        Trang trước
                    </button>
                    <span className="page-indicator">
<<<<<<< HEAD
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={currentPage === totalPages}
=======
                        Trang {currentPage + 1} / {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1 || loading}
>>>>>>> origin/Trong
                    >
                        Trang sau
                    </button>
                </div>
            )}
        </div>
    );
};

<<<<<<< HEAD
export default SearchApplicant;
=======
export default SearchApplicant;
>>>>>>> origin/Trong

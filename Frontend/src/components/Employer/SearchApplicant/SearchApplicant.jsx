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

const SearchApplicant = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [location, setLocation] = useState('');
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

    const experienceLevels = ["Tất cả", "Fresher", "Junior", "Mid-level", "Senior", "Manager"];

    const filteredSkills = skillsData.filter(skill =>
        skill.toLowerCase().includes(skillSearchTerm.toLowerCase())
    );


    const indexOfLastCandidate = currentPage * candidatesPerPage;
    const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
    const currentCandidates = searchResults.slice(indexOfFirstCandidate, indexOfLastCandidate);

    const totalPages = Math.ceil(searchResults.length / candidatesPerPage);

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
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
                                <div className="combobox-dropdown">
                                    <input
                                        type="text"
                                        className="combobox-search-input"
                                        placeholder="Tìm kiếm..."
                                        value={skillSearchTerm}
                                        onChange={(e) => setSkillSearchTerm(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <ul className="combobox-list">
                                        {filteredSkills.map(skill => (
                                            <li
                                                key={skill}
                                                className={`combobox-item ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                                                onClick={() => handleSkillToggle(skill)}
                                            >
                                                {skill}
                                            </li>
                                        ))}
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
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-results">Không tìm thấy ứng viên phù hợp. Vui lòng thử lại với tiêu chí khác.</p>
                )}
            </div>


            {searchResults.length > candidatesPerPage && (
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        disabled={currentPage === 1}
                    >
                        Trang trước
                    </button>
                    <span className="page-indicator">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Trang sau
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchApplicant;

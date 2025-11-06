import React, { useState } from 'react';
import './PostJob.css';

const PostJob = () => {
    // gọi API để lấy dữ liệu
    // Giả lập dữ liệu kỹ năng
    const skillsData = [
        "ReactJS", "Node.js", "JavaScript", "Python", "Java", "C++",
        "HTML/CSS", "SQL", "Mobile Development", "DevOps", "AI/ML",
        "Cloud Computing", "UI/UX Design", "Project Management"
    ];

    const [jobData, setJobData] = useState({
        jobTitle: '',
        jobDescription: '',
        requirements: [],
        minSalary: '',
        maxSalary: '',
        benefits: '',
        location: '',
        workType: 'Full-time',
        workSchedule: 'Giờ hành chính',
        howToApply: '',
        deadline: '',
    });

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJobData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSkillToggle = (skill) => {
        setJobData(prevData => {
            const currentSkills = prevData.requirements;
            const isSelected = currentSkills.includes(skill);

            if (isSelected) {
                return {
                    ...prevData,
                    requirements: currentSkills.filter(item => item !== skill)
                };
            } else {
                return {
                    ...prevData,
                    requirements: [...currentSkills, skill]
                };
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // API
        console.log('Dữ liệu tin tuyển dụng đã được lưu:', jobData);
        alert('Tin tuyển dụng đã được đăng thành công!');
        setJobData({
            jobTitle: '',
            jobDescription: '',
            requirements: [],
            minSalary: '',
            maxSalary: '',
            benefits: '',
            location: '',
            workType: 'Full-time',
            workSchedule: 'Giờ hành chính',
            howToApply: '',
            deadline: '',
        });
        setSearchTerm('');
        setIsDropdownOpen(false);
    };


    const filteredSkills = skillsData.filter(skill =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="post-job-container">
            <h3>ĐĂNG TIN TUYỂN DỤNG</h3>
            <form onSubmit={handleSubmit} className="post-job-form">
                <div className="form-group">
                    <label htmlFor="jobTitle">Vị trí tuyển dụng</label>
                    <input
                        type="text"
                        id="jobTitle"
                        name="jobTitle"
                        value={jobData.jobTitle}
                        onChange={handleInputChange}
                        required
                    />
                </div>


                <div className="form-group-inline">
                    <div className="form-group">
                        <label htmlFor="minSalary">Mức lương tối thiểu (VND)</label>
                        <input
                            type="number"
                            id="minSalary"
                            name="minSalary"
                            value={jobData.minSalary}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="maxSalary">Mức lương tối đa (VND)</label>
                        <input
                            type="number"
                            id="maxSalary"
                            name="maxSalary"
                            value={jobData.maxSalary}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="form-group-inline">
                    <div className="form-group">
                        <label htmlFor="location">Địa điểm làm việc</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={jobData.location}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="workType">Hình thức làm việc</label>
                        <select
                            id="workType"
                            name="workType"
                            value={jobData.workType}
                            onChange={handleInputChange}
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>
                </div>


                <div className="form-group-inline">
                    <div className="form-group">
                        <label htmlFor="workSchedule">Thời gian làm việc</label>
                        <select
                            id="workSchedule"
                            name="workSchedule"
                            value={jobData.workSchedule}
                            onChange={handleInputChange}
                        >
                            <option value="Giờ hành chính">Giờ hành chính</option>
                            <option value="Linh hoạt">Linh hoạt</option>
                            <option value="Theo ca">Theo ca</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="deadline">Hạn nộp hồ sơ</label>
                        <input
                            type="date"
                            id="deadline"
                            name="deadline"
                            value={jobData.deadline}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>


                <div className="form-group">
                    <label htmlFor="jobDescription">Mô tả công việc</label>
                    <textarea
                        id="jobDescription"
                        name="jobDescription"
                        value={jobData.jobDescription}
                        onChange={handleInputChange}
                        rows="6"
                        required
                    ></textarea>
                </div>


                <div className="form-group">
                    <label>Yêu cầu ứng viên (Kỹ năng)</label>
                    <div className="custom-combobox" tabIndex="0" onBlur={() => setIsDropdownOpen(false)}>
                        <div
                            className="combobox-selected-display"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {jobData.requirements.length > 0 ? (
                                jobData.requirements.map(skill => (
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
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <ul className="combobox-list">
                                    {filteredSkills.map(skill => (
                                        <li
                                            key={skill}
                                            className={`combobox-item ${jobData.requirements.includes(skill) ? 'selected' : ''}`}
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


                <div className="form-group">
                    <label htmlFor="benefits">Quyền lợi (Bảo hiểm, phụ cấp...)</label>
                    <textarea
                        id="benefits"
                        name="benefits"
                        value={jobData.benefits}
                        onChange={handleInputChange}
                        rows="4"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="howToApply">Cách thức ứng tuyển</label>
                    <textarea
                        id="howToApply"
                        name="howToApply"
                        value={jobData.howToApply}
                        onChange={handleInputChange}
                        rows="4"
                    ></textarea>
                </div>

                <div className="button-group">
                    <button type="submit" className="save-button">Đăng tin</button>
                    <button type="button" className="cancel-button" onClick={() => setJobData({
                        jobTitle: '',
                        jobDescription: '',
                        requirements: [],
                        minSalary: '',
                        maxSalary: '',
                        benefits: '',
                        location: '',
                        workType: 'Full-time',
                        workSchedule: 'Giờ hành chính',
                        howToApply: '',
                        deadline: '',
                    })}>Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default PostJob;
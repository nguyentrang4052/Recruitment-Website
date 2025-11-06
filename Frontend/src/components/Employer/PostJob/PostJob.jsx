<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from 'react';
import './PostJob.css';

const PostJob = () => {
    const initialJobData = {
        position: '',
        description: '',
        requirements: [],
        minSalary: '',
        maxSalary: '',
        benefit: '',
        location: '',
        formOfWork: 'FULL_TIME',
        workingTime: 'Giờ hành chính',
        applyBy: '',
        deadline: '',
        literacy: '',
        experience: '',
        level: '',
    };

    const [jobData, setJobData] = useState(initialJobData);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [availableSkills, setAvailableSkills] = useState([]);
    const [skillsLoading, setSkillsLoading] = useState(true);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/skills/list');
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJobData(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillToggle = (skill) => {
        setJobData(prev => {
            const skills = prev.requirements.includes(skill)
                ? prev.requirements.filter(s => s !== skill)
                : [...prev.requirements, skill];
            return { ...prev, requirements: skills };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn');
            setLoading(false);
            return;
        }


        const employerID = localStorage.getItem('employerID');
        if (!employerID) {
            alert('Không tìm thấy thông tin nhà tuyển dụng.');
            setLoading(false);
            return;
        }

        const payload = {
            ...jobData,
            employerID: parseInt(employerID),
            minSalary: jobData.minSalary ? parseFloat(jobData.minSalary) : null,
            maxSalary: jobData.maxSalary ? parseFloat(jobData.maxSalary) : null,
            numbers_of_views: 0,
            numbers_of_records: 0,
            posted_at: new Date().toISOString().split('T')[0],
            status: 'PENDING',
        };

        try {
            const res = await fetch('http://localhost:8080/api/employer/recruitment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const text = await res.text();
            let data = null;
            try { data = text ? JSON.parse(text) : null; } catch { console.warn('Response không phải JSON:', text); }

            if (!res.ok) throw new Error(data?.message || res.statusText || `Lỗi ${res.status}`);

            alert(data?.message || 'Đăng tin thành công!');
            setJobData(initialJobData);
            setIsDropdownOpen(false);
            setSearchTerm('');
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredSkills = availableSkills.filter(skill =>
>>>>>>> origin/Trong
        skill.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="post-job-container">
            <h3>ĐĂNG TIN TUYỂN DỤNG</h3>
            <form onSubmit={handleSubmit} className="post-job-form">
<<<<<<< HEAD
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
=======

                <div className="form-group">
                    <label>Vị trí tuyển dụng</label>
                    <input type="text" name="position" value={jobData.position} onChange={handleInputChange} required />
                </div>

                <div className="form-group-inline">
                    <div className="form-group">
                        <label>Trình độ học vấn</label>
                        <input type="text" name="literacy" value={jobData.literacy} onChange={handleInputChange} />
                    </div>
                    <div className="form-group-inline">
                        <div className="form-group full-width">
                            <label>Kinh nghiệm</label>
                            <input type="text" name="experience" value={jobData.experience} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Cấp bậc</label>
                        <input type="text" name="level" value={jobData.level} onChange={handleInputChange} />
>>>>>>> origin/Trong
                    </div>
                </div>

                <div className="form-group-inline">
                    <div className="form-group">
<<<<<<< HEAD
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
=======
                        <label>Mức lương tối thiểu (VND)</label>
                        <input type="number" name="minSalary" value={jobData.minSalary} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Mức lương tối đa (VND)</label>
                        <input type="number" name="maxSalary" value={jobData.maxSalary} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="form-group-inline">
                    <div className="form-group">
                        <label>Địa điểm làm việc</label>
                        <input type="text" name="location" value={jobData.location} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Hình thức làm việc</label>
                        <select name="formOfWork" value={jobData.formOfWork} onChange={handleInputChange}>
                            <option value="FULL_TIME">Full-time</option>
                            <option value="PART_TIME">Part-time</option>
                            <option value="REMOTE">Remote</option>
                            <option value="HYBRID">Hybrid</option>
>>>>>>> origin/Trong
                        </select>
                    </div>
                </div>

<<<<<<< HEAD

                <div className="form-group-inline">
                    <div className="form-group">
                        <label htmlFor="workSchedule">Thời gian làm việc</label>
                        <select
                            id="workSchedule"
                            name="workSchedule"
                            value={jobData.workSchedule}
                            onChange={handleInputChange}
                        >
=======
                <div className="form-group-inline">
                    <div className="form-group">
                        <label>Thời gian làm việc</label>
                        <select name="workingTime" value={jobData.workingTime} onChange={handleInputChange}>
>>>>>>> origin/Trong
                            <option value="Giờ hành chính">Giờ hành chính</option>
                            <option value="Linh hoạt">Linh hoạt</option>
                            <option value="Theo ca">Theo ca</option>
                        </select>
                    </div>
                    <div className="form-group">
<<<<<<< HEAD
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
=======
                        <label>Hạn nộp hồ sơ</label>
                        <input type="date" name="deadline" value={jobData.deadline} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label>Mô tả công việc</label>
                    <textarea name="description" value={jobData.description} onChange={handleInputChange} rows="6" required />
                </div>

                <div className="form-group">
                    <label>Yêu cầu ứng viên (Kỹ năng)</label>
                    <div className="custom-combobox" tabIndex="0">
                        <div className="combobox-selected-display" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                            {jobData.requirements.length > 0
                                ? jobData.requirements.map(skill => (
                                    <span key={skill} className="selected-skill-tag">
                                        {skill}
                                        <button type="button" className="remove-skill"
                                            onClick={(e) => { e.stopPropagation(); handleSkillToggle(skill); }}>&times;</button>
                                    </span>
                                ))
                                : <span className="combobox-placeholder">Chọn kỹ năng...</span>
                            }
                        </div>
                        {isDropdownOpen && (
                            <div className="combobox-dropdown">
                                {skillsLoading
                                    ? <div className="combobox-placeholder">Đang tải kỹ năng...</div>
                                    : <>
                                        <input type="text" className="combobox-search-input"
                                            placeholder="Tìm kiếm..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onClick={(e) => e.stopPropagation()} />
                                        <ul className="combobox-list">
                                            {filteredSkills.map(skill => (
                                                <li key={skill}
                                                    className={`combobox-item ${jobData.requirements.includes(skill) ? 'selected' : ''}`}
                                                    onClick={() => handleSkillToggle(skill)}>
                                                    {skill}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                }
>>>>>>> origin/Trong
                            </div>
                        )}
                    </div>
                </div>

<<<<<<< HEAD

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
=======
                <div className="form-group">
                    <label>Quyền lợi</label>
                    <textarea name="benefit" value={jobData.benefit} onChange={handleInputChange} rows="4" />
                </div>

                <div className="form-group">
                    <label>Cách thức ứng tuyển</label>
                    <input type="text" name="applyBy" value={jobData.applyBy} onChange={handleInputChange} />
                </div>

                <div className="button-group">
                    <button type="submit" className="save-button" disabled={loading || skillsLoading}>
                        {loading ? 'Đang lưu...' : 'Đăng tin'}
                    </button>
                    <button type="button" className="cancel-button" onClick={() => setJobData(initialJobData)}>
                        Hủy
                    </button>
>>>>>>> origin/Trong
                </div>
            </form>
        </div>
    );
};

<<<<<<< HEAD
export default PostJob;
=======
export default PostJob;
>>>>>>> origin/Trong

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
        quantity: '',
    };

    const [jobData, setJobData] = useState(initialJobData);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [availableSkills, setAvailableSkills] = useState([]);
    const [skillsLoading, setSkillsLoading] = useState(true);

    const levelOptions = [
        { value: 'INTERN', label: 'Intern' },
        { value: 'FRESHER', label: 'Fresher' },
        { value: 'JUNIOR', label: 'Junior' },
        { value: 'MID_LEVEL', label: 'Mid Level' },
        { value: 'SENIOR', label: 'Senior' }
    ];

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

    const handleTextareaKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const { name, value, selectionStart } = e.target;

            const newValue = value.substring(0, selectionStart) + '\n• ' + value.substring(selectionStart);

            setJobData(prev => ({ ...prev, [name]: newValue }));


            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = selectionStart + 3;
            }, 0);
        }
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

            try {
                data = text ? JSON.parse(text) : null;
            } catch {
                console.warn('Response không phải JSON:', text);
            }

            if (!res.ok) {

                const errorMessage = data?.message || res.statusText || `Lỗi ${res.status}`;


                if (errorMessage.includes('hết lượt đăng tin')) {
                    alert('⚠️ Bạn đã hết lượt đăng tin trong gói hiện tại.\n\nVui lòng nâng cấp gói dịch vụ để tiếp tục đăng tin tuyển dụng.');
                } else if (errorMessage.includes('hết hạn')) {
                    alert('⚠️ Gói dịch vụ của bạn đã hết hạn.\n\nVui lòng gia hạn để tiếp tục sử dụng.');
                } else if (errorMessage.includes('chưa kích hoạt')) {
                    alert('⚠️ Bạn chưa kích hoạt gói dịch vụ nào.\n\nVui lòng đăng ký gói dịch vụ để đăng tin tuyển dụng.');
                } else {
                    alert(`❌ ${errorMessage}`);
                }

                throw new Error(errorMessage);
            }

            alert('✅ ' + (data?.message || 'Đăng tin thành công!'));
            setJobData(initialJobData);
            setIsDropdownOpen(false);
            setSearchTerm('');

        } catch (err) {
            console.error('Lỗi khi đăng tin:', err);

        } finally {
            setLoading(false);
        }
    };

    const filteredSkills = availableSkills.filter(skill =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="post-job-container">
            <h3>ĐĂNG TIN TUYỂN DỤNG</h3>
            <form onSubmit={handleSubmit} className="post-job-form">
                <div className="form-group">
                    <label>Vị trí tuyển dụng</label>
                    <input type="text" name="position" value={jobData.position} onChange={handleInputChange} required />
                </div>

                <div className="form-group-inline">
                    <div className="form-group">
                        <label>Trình độ học vấn</label>
                        <input type="text" name="literacy" value={jobData.literacy} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Số năm kinh nghiệm</label>
                        <input type="text" name="experience" value={jobData.experience} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Cấp bậc</label>
                        <select name="level" value={jobData.level} onChange={handleInputChange}>
                            <option value="">Chọn cấp bậc</option>
                            {levelOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group-inline">
                    <div className="form-group">
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
                        </select>
                    </div>
                </div>

                <div className="form-group-inline">
                    <div className="form-group">
                        <label>Thời gian làm việc</label>
                        <select name="workingTime" value={jobData.workingTime} onChange={handleInputChange}>
                            <option value="Giờ hành chính">Giờ hành chính</option>
                            <option value="Linh hoạt">Linh hoạt</option>
                            <option value="Theo ca">Theo ca</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Hạn nộp hồ sơ</label>
                        <input type="date" name="deadline" value={jobData.deadline} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="form-group-inline">
                    <div className="form-group">
                        <label>Số lượng tuyển</label>
                        <input
                            type="number"
                            name="quantity"
                            value={jobData.quantity}
                            onChange={handleInputChange}
                            min="1"
                            placeholder="Nhập số lượng cần tuyển"
                        />
                    </div>
                    <div className="form-group">

                    </div>
                </div>

                <div className="form-group">
                    <label>Mô tả và yêu cầu công việc</label>
                    <textarea
                        name="description"
                        value={jobData.description}
                        onChange={handleInputChange}
                        onKeyDown={handleTextareaKeyDown}
                        placeholder="Nhập mô tả công việc (nhấn Enter để tự động thêm dấu •)"
                        rows="6"
                        required
                    />
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
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label>Quyền lợi</label>
                    <textarea
                        name="benefit"
                        value={jobData.benefit}
                        onChange={handleInputChange}
                        onKeyDown={handleTextareaKeyDown}
                        placeholder="Nhập quyền lợi (nhấn Enter để tự động thêm dấu •)"
                        rows="4"
                    />
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
                        Làm trống
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostJob;
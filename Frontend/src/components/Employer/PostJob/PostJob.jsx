import React, { useState, useEffect, useRef } from 'react';
import './PostJob.css';
import useToast from '../../../utils/useToast.js';
import Toast from '../../Toast/Toast.jsx';
const RichTextEditor = ({ name, value, onChange, placeholder }) => {
    const editorRef = useRef(null);
    const isComposingRef = useRef(false);

    useEffect(() => {
        if (editorRef.current && !isComposingRef.current) {
            const currentContent = editorRef.current.innerHTML;
            if (currentContent !== value) editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const handleCommand = (command) => {
        document.execCommand(command, false, null);
        editorRef.current.focus();
        handleInput();
    };

    const handleInput = () => {
        isComposingRef.current = true;
        onChange({ target: { name, value: editorRef.current.innerHTML } });
        setTimeout(() => (isComposingRef.current = false), 0);
    };

    return (
        <div className="rich-text-editor">
            <div className="editor-toolbar">
                <button type="button" onClick={() => handleCommand('bold')} title="In đậm"><b>B</b></button>
                <button type="button" onClick={() => handleCommand('italic')} title="In nghiêng"><i>I</i></button>
                <button type="button" onClick={() => handleCommand('underline')} title="Gạch chân"><u>U</u></button>
                <button type="button" onClick={() => handleCommand('insertUnorderedList')} title="Danh sách đấu">• List</button>
                <button type="button" onClick={() => handleCommand('insertOrderedList')} title="Danh sách số">1. List</button>
            </div>
            <div
                ref={editorRef}
                className="editor-content"
                contentEditable
                onInput={handleInput}
                onBlur={handleInput}
                suppressContentEditableWarning={true}
                data-placeholder={placeholder}
            />
        </div>
    );
};

const PostJob = () => {
    const initialJobData = {
        position: '',
        description: '',
        requirement: '',
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

    const { toast, hideToast, showSuccess, showError } = useToast();

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
                showError('Không thể tải danh sách kỹ năng');
            } finally {
                setSkillsLoading(false);
            }
        };
        fetchSkills();
    }, [showError]);

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

    const validateForm = () => {
        if (!jobData.position || jobData.position.trim() === '') {
            showError('Vui lòng nhập vị trí tuyển dụng!');
            return false;
        }
        if (!jobData.location || jobData.location.trim() === '') {
            showError('Vui lòng nhập địa điểm làm việc!');
            return false;
        }
        const descriptionText = jobData.description.replace(/<[^>]*>/g, '').trim();
        if (!descriptionText) {
            showError('Vui lòng nhập mô tả công việc!');
            return false;
        }
        const requirementText = jobData.requirement.replace(/<[^>]*>/g, '').trim();
        if (!requirementText) {
            showError('Vui lòng nhập yêu cầu công việc!');
            return false;
        }
        if (!jobData.deadline || jobData.deadline.trim() === '') {
            showError('Vui lòng chọn hạn nộp hồ sơ!');
            return false;
        }
        const selectedDate = new Date(jobData.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            showError('Hạn nộp hồ sơ phải lớn hơn ngày hiện tại!');
            return false;
        }
        if (!jobData.minSalary || jobData.minSalary.trim() === '') {
            showError('Vui lòng nhập mức lương tối thiểu!');
            return false;
        }
        if (!jobData.maxSalary || jobData.maxSalary.trim() === '') {
            showError('Vui lòng nhập mức lương tối đa!');
            return false;
        }
        if (jobData.minSalary !== '') {
            const minSal = parseFloat(jobData.minSalary);
            if (isNaN(minSal) || minSal < 0) {
                showError('Mức lương tối thiểu không được âm!');
                return false;
            }
        }
        if (jobData.maxSalary !== '') {
            const maxSal = parseFloat(jobData.maxSalary);
            if (isNaN(maxSal) || maxSal < 0) {
                showError('Mức lương tối đa không được âm!');
                return false;
            }
        }
        if (jobData.minSalary !== '' && jobData.maxSalary !== '') {
            const minSal = parseFloat(jobData.minSalary);
            const maxSal = parseFloat(jobData.maxSalary);
            if (minSal > maxSal) {
                showError('Mức lương tối thiểu phải nhỏ hơn hoặc bằng mức lương tối đa!');
                return false;
            }
        }
        if (!jobData.quantity || jobData.quantity.trim() === '') {
            showError('Vui lòng nhập số lượng tuyển!');
            return false;
        }
        const qty = parseInt(jobData.quantity);
        if (isNaN(qty) || qty <= 0) {
            showError('Số lượng tuyển phải lớn hơn 0!');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
            showError('Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn');
            setLoading(false);
            return;
        }

        const employerID = localStorage.getItem('employerID');
        if (!employerID) {
            showError('Không tìm thấy thông tin nhà tuyển dụng.');
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
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const text = await res.text();
            let data = null;
            try {
                data = text ? JSON.parse(text) : null;
            } catch {
                data = null;
            }

            if (!res.ok) {
                const msg = data?.message || res.statusText || `Lỗi ${res.status}`;
                if (msg.includes('hết lượt đăng tin')) showError('Bạn đã hết lượt đăng tin trong gói hiện tại. Vui lòng nâng cấp gói dịch vụ để tiếp tục.');
                else if (msg.includes('hết hạn')) showError('Gói dịch vụ của bạn đã hết hạn. Vui lòng gia hạn để tiếp tục.');
                else if (msg.includes('chưa kích hoạt')) showError('Bạn chưa kích hoạt gói dịch vụ nào. Vui lòng đăng ký gói dịch vụ để đăng tin.');
                else showError(msg);
                return;
            }

            showSuccess(data?.message || 'Đăng tin thành công!');
            setJobData(initialJobData);
            setIsDropdownOpen(false);
            setSearchTerm('');
        } catch (err) {
            console.error('Lỗi khi đăng tin:', err);
            showError('Không thể kết nối server. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const filteredSkills = availableSkills.filter(skill =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const today = new Date().toISOString().split('T')[0];

    return (
        <>
            <div className="post-job-container">
                <h3>ĐĂNG TIN TUYỂN DỤNG</h3>
                <form onSubmit={handleSubmit} className="post-job-form">
                    <div className="form-group">
                        <label>Vị trí tuyển dụng</label>
                        <input type="text" name="position" value={jobData.position} onChange={handleInputChange} />
                    </div>

                    <div className="form-group-inline">
                        <div className="form-group"><label>Trình độ học vấn</label><input type="text" name="literacy" value={jobData.literacy} onChange={handleInputChange} /></div>
                        <div className="form-group"><label>Số năm kinh nghiệm</label><input type="text" name="experience" value={jobData.experience} onChange={handleInputChange} /></div>
                        <div className="form-group">
                            <label>Cấp bậc</label>
                            <select name="level" value={jobData.level} onChange={handleInputChange}>
                                <option value="">Chọn cấp bậc</option>
                                {levelOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-group-inline">
                        <div className="form-group"><label>Mức lương tối thiểu (VND)</label><input type="number" name="minSalary" value={jobData.minSalary} onChange={handleInputChange} /></div>
                        <div className="form-group"><label>Mức lương tối đa (VND)</label><input type="number" name="maxSalary" value={jobData.maxSalary} onChange={handleInputChange} /></div>
                    </div>

                    <div className="form-group-inline">
                        <div className="form-group"><label>Địa điểm làm việc</label><input type="text" name="location" value={jobData.location} onChange={handleInputChange} /></div>
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
                            <input type="date" name="deadline" value={jobData.deadline} onChange={handleInputChange} min={today} />
                        </div>
                    </div>

                    <div className="form-group-inline">
                        <div className="form-group"><label>Số lượng tuyển</label><input type="number" name="quantity" value={jobData.quantity} onChange={handleInputChange} min="0" placeholder="Nhập số lượng cần tuyển" /></div>
                        <div className="form-group"></div>
                    </div>

                    <div className="form-group"><label>Mô tả công việc</label><RichTextEditor name="description" value={jobData.description} onChange={handleInputChange} placeholder="Nhập mô tả công việc..." /></div>
                    <div className="form-group"><label>Yêu cầu công việc</label><RichTextEditor name="requirement" value={jobData.requirement} onChange={handleInputChange} placeholder="Nhập yêu cầu công việc..." /></div>

                    <div className="form-group">
                        <label>Yêu cầu ứng viên (Kỹ năng)</label>
                        <div className="custom-combobox" tabIndex="0">
                            <div className="combobox-selected-display" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                {jobData.requirements.length > 0
                                    ? jobData.requirements.map(skill => (
                                        <span key={skill} className="selected-skill-tag">
                                            {skill}
                                            <button type="button" className="remove-skill" onClick={(e) => { e.stopPropagation(); handleSkillToggle(skill); }}>&times;</button>
                                        </span>
                                    ))
                                    : <span className="combobox-placeholder">Chọn kỹ năng...</span>}
                            </div>
                            {isDropdownOpen && (
                                <div className="combobox-dropdown">
                                    {skillsLoading
                                        ? <div className="combobox-placeholder">Đang tải kỹ năng...</div>
                                        : <>
                                            <input type="text" className="combobox-search-input" placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onClick={(e) => e.stopPropagation()} />
                                            <ul className="combobox-list">
                                                {filteredSkills.map(skill => (
                                                    <li key={skill} className={`combobox-item ${jobData.requirements.includes(skill) ? 'selected' : ''}`} onClick={() => handleSkillToggle(skill)}>{skill}</li>
                                                ))}
                                            </ul>
                                        </>
                                    }
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group"><label>Quyền lợi</label><RichTextEditor name="benefit" value={jobData.benefit} onChange={handleInputChange} placeholder="Nhập quyền lợi..." /></div>
                    <div className="form-group"><label>Cách thức ứng tuyển</label><input type="text" name="applyBy" value={jobData.applyBy} onChange={handleInputChange} /></div>

                    <div className="button-group">
                        <button type="submit" className="save-button" disabled={loading || skillsLoading}>{loading ? 'Đang lưu...' : 'Đăng tin'}</button>
                        <button type="button" className="cancel-button" onClick={() => setJobData(initialJobData)}>Làm trống</button>
                    </div>
                </form>
            </div>

            {toast && <Toast {...toast} onClose={hideToast} />}
        </>
    );
};

export default PostJob;
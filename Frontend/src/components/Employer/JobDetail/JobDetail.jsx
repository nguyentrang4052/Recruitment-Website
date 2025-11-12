import React, { useState, useEffect } from 'react';
import './JobDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faEdit,
    faTrash,
    faMapMarkerAlt,
    faClock,
    faBriefcase,
    faMoneyBill,
    faUsers,
    faEye,
    faFileAlt,
    faGraduationCap,
    faCalendar,
    faStar
} from '@fortawesome/free-solid-svg-icons';

const JobDetail = ({ jobId, onBack }) => {
    const [job, setJob] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Thay thế hàm fetchJobDetail trong JobDetail.jsx

    const fetchJobDetail = async () => {
        setLoading(true);

        // Mock data cho từng job ID
        const mockJobs = {
            1: {
                RNID: 1,
                position: 'Lập trình viên ReactJS',
                description: 'Chúng tôi đang tìm kiếm một lập trình viên ReactJS có kinh nghiệm để tham gia đội ngũ phát triển sản phẩm.\n\nTrách nhiệm công việc:\n- Phát triển và bảo trì ứng dụng web sử dụng ReactJS\n- Làm việc với team để thiết kế và triển khai tính năng mới\n- Tối ưu hiệu suất ứng dụng\n- Review code và hỗ trợ các thành viên khác',
                experience: '2+ năm kinh nghiệm với ReactJS',
                literacy: 'Cử nhân Công nghệ Thông tin hoặc tương đương',
                level: 'Middle/Senior',
                minSalary: 15000000,
                maxSalary: 25000000,
                benefit: 'Lương tháng 13, thưởng theo hiệu suất\nBảo hiểm đầy đủ theo luật\nĐào tạo và phát triển kỹ năng\nMôi trường làm việc trẻ trung, năng động',
                location: 'Hà Nội',
                formOfWork: 'FULL_TIME',
                workingTime: 'Giờ hành chính (8h-17h)',
                applyBy: 'Gửi CV qua email: [email protected]',
                postedAt: '2025-09-10',
                deadline: '2025-12-31',
                status: 'APPROVED',
                numbersOfViews: 156,
                numbersOfRecords: 12,
                skill: [
                    { skillID: 1, skillName: 'ReactJS' },
                    { skillID: 2, skillName: 'JavaScript' },
                    { skillID: 3, skillName: 'HTML/CSS' },
                    { skillID: 4, skillName: 'Redux' },
                    { skillID: 5, skillName: 'Git' }
                ]
            },
            2: {
                RNID: 2,
                position: 'Thiết kế UI/UX',
                description: 'Tìm kiếm UI/UX Designer sáng tạo và có kinh nghiệm.\n\nTrách nhiệm:\n- Thiết kế giao diện người dùng cho web và mobile app\n- Nghiên cứu trải nghiệm người dùng\n- Làm việc chặt chẽ với team developers\n- Tạo wireframes, prototypes và mockups',
                experience: '1-2 năm kinh nghiệm thiết kế UI/UX',
                literacy: 'Tốt nghiệp chuyên ngành Thiết kế, Mỹ thuật hoặc liên quan',
                level: 'Junior/Middle',
                minSalary: 12000000,
                maxSalary: 20000000,
                benefit: 'Lương tháng 13\nBảo hiểm đầy đủ\nMôi trường sáng tạo\nCông cụ làm việc hiện đại',
                location: 'Hồ Chí Minh',
                formOfWork: 'FULL_TIME',
                workingTime: 'Giờ hành chính (8h-17h)',
                applyBy: 'Gửi portfolio qua email: [email protected]',
                postedAt: '2025-09-12',
                deadline: '2025-12-31',
                status: 'APPROVED',
                numbersOfViews: 98,
                numbersOfRecords: 8,
                skill: [
                    { skillID: 6, skillName: 'Figma' },
                    { skillID: 7, skillName: 'Adobe XD' },
                    { skillID: 8, skillName: 'Sketch' },
                    { skillID: 9, skillName: 'Photoshop' }
                ]
            },
            3: {
                RNID: 3,
                position: 'Kỹ sư DevOps',
                description: 'Chúng tôi cần một DevOps Engineer để quản lý hạ tầng và tự động hóa quy trình.\n\nTrách nhiệm:\n- Xây dựng và quản lý CI/CD pipeline\n- Quản lý infrastructure as code\n- Monitoring và troubleshooting hệ thống\n- Đảm bảo security và performance',
                experience: '3+ năm kinh nghiệm DevOps',
                literacy: 'Cử nhân Công nghệ Thông tin',
                level: 'Senior',
                minSalary: 20000000,
                maxSalary: 35000000,
                benefit: 'Lương tháng 13, 14\nThưởng dự án\nBảo hiểm cao cấp\nĐào tạo chứng chỉ quốc tế',
                location: 'Đà Nẵng',
                formOfWork: 'HYBRID',
                workingTime: 'Linh hoạt',
                applyBy: 'Nộp hồ sơ qua: [email protected]',
                postedAt: '2025-09-14',
                deadline: '2025-12-31',
                status: 'APPROVED',
                numbersOfViews: 142,
                numbersOfRecords: 5,
                skill: [
                    { skillID: 10, skillName: 'Docker' },
                    { skillID: 11, skillName: 'Kubernetes' },
                    { skillID: 12, skillName: 'AWS' },
                    { skillID: 13, skillName: 'Jenkins' },
                    { skillID: 14, skillName: 'Terraform' }
                ]
            },
            4: {
                RNID: 4,
                position: 'Phân tích dữ liệu',
                description: 'Tuyển Data Analyst có khả năng phân tích và trực quan hóa dữ liệu.\n\nTrách nhiệm:\n- Phân tích dữ liệu kinh doanh\n- Tạo báo cáo và dashboard\n- Đưa ra insights và khuyến nghị\n- Làm việc với các bộ phận khác',
                experience: '2+ năm kinh nghiệm phân tích dữ liệu',
                literacy: 'Cử nhân Toán, Thống kê, CNTT hoặc liên quan',
                level: 'Middle',
                minSalary: 13000000,
                maxSalary: 22000000,
                benefit: 'Lương tháng 13\nBảo hiểm\nKhóa học nâng cao\nMôi trường data-driven',
                location: 'Hà Nội',
                formOfWork: 'FULL_TIME',
                workingTime: '8h-17h',
                applyBy: 'Email: [email protected]',
                postedAt: '2025-09-15',
                deadline: '2025-12-31',
                status: 'APPROVED',
                numbersOfViews: 87,
                numbersOfRecords: 7,
                skill: [
                    { skillID: 15, skillName: 'SQL' },
                    { skillID: 16, skillName: 'Python' },
                    { skillID: 17, skillName: 'Power BI' },
                    { skillID: 18, skillName: 'Excel' }
                ]
            },
            5: {
                RNID: 5,
                position: 'Tester Manual',
                description: 'Cần tuyển Manual Tester có tư duy phân tích tốt.\n\nTrách nhiệm:\n- Thực hiện test cases\n- Viết test plan và test report\n- Tìm và báo cáo bugs\n- Đảm bảo chất lượng sản phẩm',
                experience: '1+ năm kinh nghiệm testing',
                literacy: 'Tốt nghiệp Đại học',
                level: 'Junior/Middle',
                minSalary: 9000000,
                maxSalary: 15000000,
                benefit: 'Lương tháng 13\nBảo hiểm\nĐào tạo automation testing\nMôi trường năng động',
                location: 'Hồ Chí Minh',
                formOfWork: 'FULL_TIME',
                workingTime: '8h-17h',
                applyBy: 'Email: [email protected]',
                postedAt: '2025-09-16',
                deadline: '2025-12-31',
                status: 'APPROVED',
                numbersOfViews: 76,
                numbersOfRecords: 9,
                skill: [
                    { skillID: 19, skillName: 'Test Case Design' },
                    { skillID: 20, skillName: 'Bug Tracking' },
                    { skillID: 21, skillName: 'Jira' },
                    { skillID: 22, skillName: 'API Testing' }
                ]
            },
            6: {
                RNID: 6,
                position: 'Java Developer',
                description: 'Tuyển Java Developer có kinh nghiệm phát triển ứng dụng enterprise.\n\nTrách nhiệm:\n- Phát triển backend với Java Spring Boot\n- Thiết kế và tối ưu database\n- Viết unit test và integration test\n- Code review và mentoring',
                experience: '3+ năm kinh nghiệm Java',
                literacy: 'Cử nhân Công nghệ Thông tin',
                level: 'Senior',
                minSalary: 18000000,
                maxSalary: 30000000,
                benefit: 'Lương 13, 14 tháng\nThưởng dự án\nBảo hiểm cao cấp\nLàm việc với công nghệ mới',
                location: 'Hà Nội',
                formOfWork: 'FULL_TIME',
                workingTime: '8h-17h, linh hoạt',
                applyBy: 'Email: [email protected]',
                postedAt: '2025-09-17',
                deadline: '2025-12-31',
                status: 'APPROVED',
                numbersOfViews: 203,
                numbersOfRecords: 14,
                skill: [
                    { skillID: 23, skillName: 'Java' },
                    { skillID: 24, skillName: 'Spring Boot' },
                    { skillID: 25, skillName: 'MySQL' },
                    { skillID: 26, skillName: 'Microservices' },
                    { skillID: 5, skillName: 'Git' }
                ]
            },
            7: {
                RNID: 7,
                position: 'Mobile Developer',
                description: 'Tuyển Mobile Developer phát triển ứng dụng iOS/Android.\n\nTrách nhiệm:\n- Phát triển mobile app với React Native/Flutter\n- Tích hợp API và services\n- Tối ưu performance\n- Deploy app lên stores',
                experience: '2+ năm kinh nghiệm mobile development',
                literacy: 'Cử nhân Công nghệ Thông tin',
                level: 'Middle/Senior',
                minSalary: 16000000,
                maxSalary: 28000000,
                benefit: 'Lương tháng 13\nThưởng dự án\nBảo hiểm\nThiết bị làm việc cao cấp',
                location: 'Đà Nẵng',
                formOfWork: 'REMOTE',
                workingTime: 'Linh hoạt',
                applyBy: 'Email: [email protected]',
                postedAt: '2025-09-18',
                deadline: '2025-12-31',
                status: 'APPROVED',
                numbersOfViews: 134,
                numbersOfRecords: 6,
                skill: [
                    { skillID: 27, skillName: 'React Native' },
                    { skillID: 28, skillName: 'Flutter' },
                    { skillID: 2, skillName: 'JavaScript' },
                    { skillID: 29, skillName: 'iOS' },
                    { skillID: 30, skillName: 'Android' }
                ]
            }
        };

        setTimeout(() => {
            const mockData = mockJobs[jobId];
            if (mockData) {
                setJob(mockData);
                setEditData(mockData);
            } else {
                setJob(null);
            }
            setLoading(false);
        }, 500);
    };


    useEffect(() => {
        fetchJobDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobId]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const formatSalary = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getFormOfWorkText = (form) => {
        const forms = {
            'FULL_TIME': 'Full-time',
            'PART_TIME': 'Part-time',
            'REMOTE': 'Remote',
            'HYBRID': 'Hybrid'
        };
        return forms[form] || form;
    };

    const isExpired = () => {
        if (!job) return false;
        return new Date(job.deadline) < new Date();
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditData(job);
    };

    const handleSaveEdit = async () => {
        setLoading(true);

        try {
            // Gọi API để cập nhật
            // const response = await fetch(`/api/recruitment/${job.RNID}`, {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(editData)
            // });

            // Mock update
            setTimeout(() => {
                setJob(editData);
                setIsEditing(false);
                setLoading(false);
                alert('Cập nhật tin tuyển dụng thành công!');
            }, 500);
        } catch (error) {
            console.error('Error updating job:', error);
            alert('Có lỗi xảy ra khi cập nhật!');
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này?')) {
            return;
        }

        setLoading(true);

        try {
            // Gọi API để xóa
            // const response = await fetch(`/api/recruitment/${job.RNID}`, {
            //     method: 'DELETE'
            // });

            // Mock delete
            setTimeout(() => {
                alert('Đã xóa tin tuyển dụng thành công!');
                onBack();
            }, 500);
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Có lỗi xảy ra khi xóa!');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return (
            <div className="jd-container">
                <p style={{ textAlign: 'center', padding: '50px' }}>Đang tải thông tin...</p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="jd-container">
                <p style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy thông tin tin tuyển dụng.</p>
            </div>
        );
    }

    return (
        <div className="jd-container">
            <div className="jd-header">
                <h2>CHI TIẾT TIN TUYỂN DỤNG</h2>
                <div className="jd-actions">
                    <button className="jd-btn jd-btn-back" onClick={onBack}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
                    </button>
                    {!isEditing && (
                        <>
                            <button className="jd-btn jd-btn-edit" onClick={handleEdit}>
                                <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa
                            </button>
                            <button className="jd-btn jd-btn-delete" onClick={handleDelete}>
                                <FontAwesomeIcon icon={faTrash} /> Xóa
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="jd-content">
                <div className="jd-main">
                    {!isEditing ? (
                        <>
                            <div className="jd-title-section">
                                <h1 className="jd-title">{job.position}</h1>
                                <div className="jd-meta">
                                    <span className="jd-meta-item">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                                        {job.location}
                                    </span>
                                    <span className="jd-meta-item">
                                        <FontAwesomeIcon icon={faBriefcase} />
                                        {getFormOfWorkText(job.formOfWork)}
                                    </span>
                                    <span className="jd-meta-item">
                                        <FontAwesomeIcon icon={faClock} />
                                        {job.workingTime}
                                    </span>
                                    <span className="jd-meta-item">
                                        <FontAwesomeIcon icon={faCalendar} />
                                        Đăng: {formatDate(job.postedAt)}
                                    </span>
                                </div>
                            </div>

                            <div className="jd-section">
                                <h3 className="jd-section-title">
                                    <FontAwesomeIcon icon={faFileAlt} />
                                    Mô tả công việc
                                </h3>
                                <p className="jd-section-content">{job.description}</p>
                            </div>

                            {job.skill && job.skill.length > 0 && (
                                <div className="jd-section">
                                    <h3 className="jd-section-title">
                                        <FontAwesomeIcon icon={faStar} />
                                        Yêu cầu kỹ năng
                                    </h3>
                                    <div className="jd-skills">
                                        {job.skill.map(skill => (
                                            <span key={skill.skillID} className="jd-skill">
                                                {skill.skillName}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="jd-section">
                                <h3 className="jd-section-title">
                                    <FontAwesomeIcon icon={faGraduationCap} />
                                    Yêu cầu khác
                                </h3>
                                <div className="jd-section-content">
                                    <p><strong>Kinh nghiệm:</strong> {job.experience || 'Không yêu cầu'}</p>
                                    <p><strong>Học vấn:</strong> {job.literacy || 'Không yêu cầu'}</p>
                                    <p><strong>Cấp bậc:</strong> {job.level || 'Không yêu cầu'}</p>
                                </div>
                            </div>

                            {job.benefit && (
                                <div className="jd-section">
                                    <h3 className="jd-section-title">
                                        <FontAwesomeIcon icon={faMoneyBill} />
                                        Quyền lợi
                                    </h3>
                                    <p className="jd-section-content">{job.benefit}</p>
                                </div>
                            )}

                            <div className="jd-section">
                                <h3 className="jd-section-title">
                                    <FontAwesomeIcon icon={faFileAlt} />
                                    Cách thức ứng tuyển
                                </h3>
                                <p className="jd-section-content">{job.applyBy}</p>
                            </div>
                        </>
                    ) : (
                        <form className="jd-form">
                            <div className="jd-form-group">
                                <label>Vị trí tuyển dụng</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={editData.position}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="jd-form-row">
                                <div className="jd-form-group">
                                    <label>Địa điểm</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={editData.location}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="jd-form-group">
                                    <label>Hình thức làm việc</label>
                                    <select
                                        name="formOfWork"
                                        value={editData.formOfWork}
                                        onChange={handleInputChange}
                                    >
                                        <option value="FULL_TIME">Full-time</option>
                                        <option value="PART_TIME">Part-time</option>
                                        <option value="REMOTE">Remote</option>
                                        <option value="HYBRID">Hybrid</option>
                                    </select>
                                </div>
                            </div>

                            <div className="jd-form-row">
                                <div className="jd-form-group">
                                    <label>Lương tối thiểu</label>
                                    <input
                                        type="number"
                                        name="minSalary"
                                        value={editData.minSalary}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="jd-form-group">
                                    <label>Lương tối đa</label>
                                    <input
                                        type="number"
                                        name="maxSalary"
                                        value={editData.maxSalary}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="jd-form-row">
                                <div className="jd-form-group">
                                    <label>Kinh nghiệm</label>
                                    <input
                                        type="text"
                                        name="experience"
                                        value={editData.experience}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="jd-form-group">
                                    <label>Học vấn</label>
                                    <input
                                        type="text"
                                        name="literacy"
                                        value={editData.literacy}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="jd-form-row">
                                <div className="jd-form-group">
                                    <label>Cấp bậc</label>
                                    <input
                                        type="text"
                                        name="level"
                                        value={editData.level}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="jd-form-group">
                                    <label>Hạn nộp hồ sơ</label>
                                    <input
                                        type="date"
                                        name="deadline"
                                        value={editData.deadline}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="jd-form-group">
                                <label>Thời gian làm việc</label>
                                <input
                                    type="text"
                                    name="workingTime"
                                    value={editData.workingTime}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="jd-form-group">
                                <label>Mô tả công việc</label>
                                <textarea
                                    name="description"
                                    value={editData.description}
                                    onChange={handleInputChange}
                                    rows="6"
                                    required
                                />
                            </div>

                            <div className="jd-form-group">
                                <label>Quyền lợi</label>
                                <textarea
                                    name="benefit"
                                    value={editData.benefit}
                                    onChange={handleInputChange}
                                    rows="4"
                                />
                            </div>

                            <div className="jd-form-group">
                                <label>Cách thức ứng tuyển</label>
                                <input
                                    type="text"
                                    name="applyBy"
                                    value={editData.applyBy}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="jd-form-actions">
                                <button type="button" className="jd-btn jd-btn-save" onClick={handleSaveEdit}>
                                    Lưu thay đổi
                                </button>
                                <button type="button" className="jd-btn jd-btn-cancel" onClick={handleCancelEdit}>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Sidebar */}
                <div className="jd-sidebar">
                    <div className="jd-card">
                        <h3>Thông tin chung</h3>
                        <div className="jd-info-row">
                            <span className="jd-label">Mức lương:</span>
                            <span className="jd-value">
                                {formatSalary(job.minSalary)} - {formatSalary(job.maxSalary)}
                            </span>
                        </div>
                        <div className="jd-info-row">
                            <span className="jd-label">Hạn nộp:</span>
                            <span className="jd-value">{formatDate(job.deadline)}</span>
                        </div>
                        <div className="jd-info-row">
                            <span className="jd-label">Trạng thái:</span>
                            <span className={`jd-status ${isExpired() ? 'jd-status-expired' : 'jd-status-active'}`}>
                                {isExpired() ? 'Hết hạn' : 'Đang tuyển'}
                            </span>
                        </div>
                    </div>

                    <div className="jd-card jd-stats">
                        <h3>Thống kê</h3>
                        <div className="jd-stat-item">
                            <span className="jd-stat-label">
                                <FontAwesomeIcon icon={faEye} />
                                Lượt xem
                            </span>
                            <span className="jd-stat-value">{job.numbersOfViews}</span>
                        </div>
                        <div className="jd-stat-item">
                            <span className="jd-stat-label">
                                <FontAwesomeIcon icon={faUsers} />
                                Ứng viên
                            </span>
                            <span className="jd-stat-value">{job.numbersOfRecords}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;
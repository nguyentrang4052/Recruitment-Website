import './Profile.css';
import { useEffect, useState } from 'react';
import axios from "axios"
import { formatDate } from '../../../../utils/Format';
import { MdModeEdit } from "react-icons/md";
import { useRef } from 'react';
import locations from '../../../../../data/provinces.json'
import { formatCurrencyShort } from '../../../../utils/formatSalary';
import Toast from '../../../Toast/Toast.jsx'
import useToast from '../../../../utils/useToast.js'

function Profile() {
    const level = ['Tất cả', 'Fresher', 'Junior', 'Mid-level', 'Senior', 'Manager'];
    const timeWork = ['PART_TIME', 'FULL_TIME', 'REMOTE', 'HYBRID'];
    const [applicant, setApplicant] = useState({});

    const [editingSection, setEditingSection] = useState(null);
    const [formData, setFormData] = useState({});
    const [goalForm, setGoalForm] = useState({});

    const [expForm, setExpForm] = useState({});
    const [eduForm, setEduForm] = useState({});
    const [skillsForm, setSkillsForm] = useState([]);
    const [careerInfoForm, setCareerInfoForm] = useState({});
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    const [skillList, setSkillList] = useState([])

    const { toast, showSuccess, showError, hideToast } = useToast();

    const fetchApplicant = async () => {
        const email = localStorage.getItem('email');
        const res = await axios.get('http://localhost:8080/api/applicant/profile/info', {
            params: { email },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setApplicant(res.data);

    };

    useEffect(() => {
        fetchApplicant();
    }, []);

    useEffect(() => {
        const fetchSkill = async () => {
            const res = await axios.get('http://localhost:8080/api/skills/list')
            setSkillList(res.data)


        };
        fetchSkill();

    }, [])

    const uploadImage = async file => {
        const formData = new FormData();
        formData.append('photo', file);
        const email = localStorage.getItem('email');
        const res = await axios.post(
            `http://localhost:8080/api/applicant/profile/upload-photo/${email}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        return res.data.photo;
    };

    const handleImageClick = () => fileInputRef.current?.click();
    const handleFileChange = async e => {
        const file = e.target.files[0];
        if (!file) return;
        const previewURL = URL.createObjectURL(file);
        setPreview(previewURL);
        const newPhoto = await uploadImage(file);
        setApplicant(prev => ({ ...prev, photo: newPhoto }));
    };

    const handleEditPersonal = () => {
        setFormData({
            applicantName: applicant.applicantName || '',
            phone: applicant.phone || '',
            address: applicant.address || '',
            birthday: applicant.birthday || '',
        });
        setEditingSection('personal');
    };

    const handleEditGoal = () => {
        setGoalForm({ goal: applicant.goal || '' });
        setEditingSection('goal');
    };


    const handleEditExp = () => {
        const parts = (applicant.experience || '').split(' - ');
        setExpForm({
            company: parts[0] || '',
            position: parts[1] || '',
        });
        setEditingSection('exp');
    };

    const handleEditEdu = () => {
        const parts = (applicant.literacy || '').split(' - ');
        setEduForm({
            school: parts[0] || '',
            major: parts[1] || '',
        });
        setEditingSection('edu');
    };

    const handleEditSkills = () => {
        setSkillsForm(applicant.skills || []);
        setEditingSection('skills');
    };

    const handleEditCareer = () => {
        setCareerInfoForm({
            title: applicant.title || '',
            desireLevel: applicant.desireLevel || '',
            desireSalary: applicant.desireSalary || '',
            formOfWork: applicant.formOfWork || '',
            location: applicant.location || '',
        });
        setEditingSection('career-info');
    };


    const handleSkillChange = (skill) => {
        setSkillsForm(prev =>
            prev.some(s => s.skillID === skill.skillID)
                ? prev.filter(s => s.skillID !== skill.skillID)
                : [...prev, skill]
        );
    };


    const handleSave = async () => {
        if (editingSection === 'personal') {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(formData.phone)) {
                showError('Số điện thoại không hợp lệ!');
                return;
            }
        }

        if (editingSection === 'career-info') {
            const salary = parseFloat(careerInfoForm.desireSalary);
            if (isNaN(salary) || salary <= 0) {
                showError('Mức lương phải là số dương!');
                return;
            }
        }
        try {
            const applicantID = localStorage.getItem('applicantID');
            let payload = {};
            if (editingSection === 'personal') {
                payload = {
                    applicantName: formData.applicantName,
                    phone: formData.phone,
                    address: formData.address,
                    birthday: formData.birthday,
                    gender: formData.gender,
                    photo: applicant.photo,
                };
            } else if (editingSection === 'goal') {
                payload = { goal: goalForm.goal };
            } else if (editingSection === 'exp') {
                const expString = `${expForm.company || ''} - ${expForm.position || ''}`.trim();
                payload = { experience: expString };
            } else if (editingSection === 'edu') {
                const eduString = `${eduForm.school || ''} - ${eduForm.major || ''}`.trim();
                payload = { literacy: eduString };
            } else if (editingSection === 'skills') {
                payload = { skills: skillsForm };
            } else if (editingSection === 'career-info') {
                payload = {
                    title: careerInfoForm.title,
                    desireLevel: careerInfoForm.desireLevel,
                    desireSalary: careerInfoForm.desireSalary,
                    formOfWork: careerInfoForm.formOfWork,
                    location: careerInfoForm.location,
                };
            }

            const res = await axios.put(
                `http://localhost:8080/api/applicant/profile/update/${applicantID}`,
                payload,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setApplicant(prev => ({ ...prev, ...res.data }));
            await fetchApplicant();
            setEditingSection(null);
            showSuccess('Cập nhật thành công!');
        } catch {
            showError('Cập nhật thất bại!');
        }
    };

    const handleCancel = () => setEditingSection(null);

    const handleDeleteImage = async () => {
        try {
            const email = localStorage.getItem('email');
            await axios.delete('http://localhost:8080/api/applicant/delete/photo', {
                params: { email },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setApplicant(prev => ({ ...prev, photo: null }));
            setPreview(null);
        } catch {
            showError('Xóa ảnh thất bại!');
        }
    };

    return (
        <div className="page-wrapper">
            <h2>HỒ SƠ CÁ NHÂN</h2>
            <p>Quản lý thông tin hồ sơ để ứng tuyển dễ dàng hơn</p>

            <div className="profile-container">
                <div className="profile-section">
                    <h3>Thông tin cá nhân</h3>
                    <div className="profile-left">
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <img
                            src={preview || (applicant.photo ? `http://localhost:8080/uploads/cv/${applicant.photo}` : 'avatar.png') || 'avatar.png'}
                            alt="Avatar"
                            className="pr-avatar"
                            onClick={() => editingSection === 'personal' && handleImageClick()}
                            style={{ cursor: editingSection === 'personal' ? 'pointer' : 'default' }}
                        />
                        {editingSection === 'personal' && (applicant.photo || preview) && (
                            <button onClick={handleDeleteImage} className="delete-photo-btn">
                                Xóa ảnh
                            </button>
                        )}
                    </div>

                    <div className="profile-right">
                        {editingSection === 'personal' ? (
                            <>
                                <div className="form-group-pr">
                                    <label>Họ và tên</label>
                                    <input
                                        value={formData.applicantName || ''}
                                        onChange={e => setFormData({ ...formData, applicantName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group-pr">
                                    <label>Email</label>
                                    <input value={applicant.email || ''} disabled readOnly />
                                </div>
                                <div className="form-group-pr">
                                    <label>Số điện thoại</label>
                                    <input
                                        value={formData.phone || ''}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="form-group-pr">
                                    <label>Địa chỉ</label>
                                    <input
                                        value={formData.address || ''}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div className="form-group-pr">
                                    <label>Ngày sinh</label>
                                    <input
                                        type="date"
                                        value={formData.birthday || ''}
                                        onChange={e => setFormData({ ...formData, birthday: e.target.value })}
                                    />
                                </div>
                                <div className="form-group-pr">
                                    <label>Giới tính</label>
                                    <select
                                        value={formData.gender || ''}
                                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                    </select>
                                </div>
                                <div style={{ marginTop: '1rem' }}>
                                    <button onClick={handleSave}>Lưu</button>
                                    <button onClick={handleCancel} style={{ marginLeft: '0.5rem' }}>
                                        Hủy
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="form-group-pr">
                                    <p><strong>Họ và tên:</strong> {applicant.applicantName}</p>
                                </div>
                                <div className="form-group-pr">
                                    <p><strong>Email:</strong> {applicant.email}</p>
                                </div>
                                <div className="form-group-pr">
                                    <p><strong>Số điện thoại:</strong> {applicant.phone}</p>
                                </div>
                                <div className="form-group-pr">
                                    <p><strong>Địa chỉ:</strong> {applicant.address}</p>
                                </div>
                                <div className="form-group-pr">
                                    <p><strong>Ngày sinh:</strong> {formatDate(applicant.birthday)}</p>
                                </div>
                                <div className="form-group-pr">
                                    <p><strong>Giới tính:</strong> {applicant.gender}</p>
                                </div>
                                <button className="edit-profile" onClick={handleEditPersonal}>
                                    <MdModeEdit /> Chỉnh sửa
                                </button>
                            </>
                        )}
                    </div>
                </div>


                <div className="profile-section">
                    <h3>Mục tiêu nghề nghiệp</h3>
                    {editingSection === 'goal' ? (
                        <>
                            <div className="form-group-pr">
                                <textarea
                                    placeholder="Nhập mục tiêu nghề nghiệp"
                                    value={goalForm.goal || ''}
                                    onChange={e => setGoalForm({ ...goalForm, goal: e.target.value })}
                                />
                            </div>
                            <button onClick={handleSave}>Lưu</button>
                            <button onClick={handleCancel} style={{ marginLeft: '0.5rem' }}>
                                Hủy
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="form-group-pr">
                                <p>{applicant.goal || 'Chưa có mục tiêu'}</p>
                            </div>
                            <button className="edit-goal" onClick={handleEditGoal}>
                                <MdModeEdit /> Chỉnh sửa
                            </button>
                        </>
                    )}
                </div>
                <div className="profile-section">
                    <h3>Kinh nghiệm làm việc</h3>
                    {editingSection === 'exp' ? (
                        <>
                            <div className="form-group-pr">
                                <label>Công ty</label>
                                <input value={expForm.company || ''} onChange={e => setExpForm({ ...expForm, company: e.target.value })} />
                            </div>
                            <div className="form-group-pr">
                                <label>Vị trí</label>
                                <input value={expForm.position || ''} onChange={e => setExpForm({ ...expForm, position: e.target.value })} />
                            </div>
                            <button onClick={handleSave}>Lưu</button>
                            <button onClick={handleCancel} style={{ marginLeft: '0.5rem' }}>Hủy</button>
                        </>
                    ) : (
                        <>
                            <p>{applicant.experience || 'Chưa có kinh nghiệm'}</p>
                            <button className="edit-goal" onClick={handleEditExp}><MdModeEdit /> Chỉnh sửa</button>
                        </>
                    )}
                </div>
                <div className="profile-section">
                    <h3>Trình độ học vấn</h3>
                    {editingSection === 'edu' ? (
                        <>
                            <div className="form-group-pr">
                                <label>Trường</label>
                                <input value={eduForm.school || ''} onChange={e => setEduForm({ ...eduForm, school: e.target.value })} />
                            </div>
                            <div className="form-group-pr">
                                <label>Chuyên ngành</label>
                                <input value={eduForm.major || ''} onChange={e => setEduForm({ ...eduForm, major: e.target.value })} />
                            </div>
                            <button onClick={handleSave}>Lưu</button>
                            <button onClick={handleCancel} style={{ marginLeft: '0.5rem' }}>Hủy</button>
                        </>
                    ) : (
                        <>
                            <p>{applicant.literacy || 'Chưa có thông tin'}</p>
                            <button className="edit-goal" onClick={handleEditEdu}><MdModeEdit /> Chỉnh sửa</button>
                        </>
                    )}
                </div>
                <div className="profile-section">
                    <h3>Kỹ năng</h3>
                    {editingSection === 'skills' ? (
                        <>
                            <div className="skills-grid-profile">
                                {skillList.map(skill => (
                                    <label key={skill.skillID} className="skill-item-profile" style={{ display: 'block', marginBottom: 4 }}>
                                        <input
                                            type="checkbox"
                                            checked={skillsForm.some(s => s.skillID === skill.skillID)}
                                            onChange={() => handleSkillChange(skill)}
                                        />
                                        {skill.skillName}
                                    </label>
                                ))}
                            </div>
                            <button onClick={handleSave}>Lưu</button>
                            <button onClick={handleCancel} style={{ marginLeft: '0.5rem' }}>Hủy</button>
                        </>
                    ) : (
                        <>
                            <p>
                                {applicant.skills?.map(s => s.skillName).join(', ') || 'Chưa có kỹ năng'}
                            </p>
                            <button className="edit-goal" onClick={handleEditSkills}><MdModeEdit /> Chỉnh sửa</button>
                        </>
                    )}
                </div>

                <div className="profile-section">
                    <h3>Thông tin nghề nghiệp</h3>
                    {editingSection === 'career-info' ? (
                        <>
                            <div className="form-group-pr">
                                <label>Vị trí muốn ứng tuyển</label>
                                <input type="text"
                                    placeholder="Nhập vị trí muốn ứng tuyển"
                                    value={careerInfoForm.title || ''}
                                    onChange={e => setCareerInfoForm({ ...careerInfoForm, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group-pr">
                                <label>Cấp bậc mong muốn</label>
                                <select
                                    value={careerInfoForm.desireLevel || ''}
                                    onChange={e => setCareerInfoForm({ ...careerInfoForm, desireLevel: e.target.value })}
                                >
                                    <option value="">Chọn cấp bậc</option>
                                    {level.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                            <div className="form-group-pr">
                                <label>Mức lương mong muốn</label>
                                <input
                                    type="number"
                                    placeholder="Nhập mức lương mong muốn"
                                    value={careerInfoForm.desireSalary}
                                    onChange={e =>
                                        setCareerInfoForm({ ...careerInfoForm, desireSalary: e.target.value })
                                    }
                                />
                            </div>
                            <div className="form-group-pr">
                                <label>Hình thức làm việc</label>
                                <select
                                    value={careerInfoForm.formOfWork || ''}
                                    onChange={e => setCareerInfoForm({ ...careerInfoForm, formOfWork: e.target.value })}
                                >
                                    <option value="">Chọn hình thức làm việc</option>
                                    {timeWork.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                            <div className="form-group-pr">
                                <label>Địa điểm làm việc mong muốn</label>
                                <select
                                    value={careerInfoForm.location || ''}
                                    onChange={e => setCareerInfoForm({ ...careerInfoForm, location: e.target.value })}
                                >
                                    <option value="">Chọn địa điểm</option>
                                    {locations.map((loc, idx) => (
                                        <option key={idx} value={loc.name}>{loc.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <button onClick={handleSave}>Lưu</button>
                                <button onClick={handleCancel} style={{ marginLeft: '0.5rem' }}>
                                    Hủy
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="career-info-display">
                                <div className="form-group-pr">
                                    <p><strong>- Vị trí muốn ứng tuyển:</strong> {applicant.title || 'Chưa cập nhật'}</p>
                                </div>
                                <div className="form-group-pr">
                                    <p><strong>- Cấp bậc mong muốn:</strong> {applicant.desireLevel || 'Chưa cập nhật'}</p>
                                </div>
                                <div className="form-group-pr">
                                    <p><strong>- Mức lương mong muốn:</strong> {formatCurrencyShort(applicant.desireSalary) || 'Chưa cập nhật'}</p>
                                </div>
                                <div className="form-group-pr">
                                    <p><strong>- Hình thức làm việc:</strong> {applicant.formOfWork || 'Chưa cập nhật'}</p>
                                </div>
                                <div className="form-group-pr">
                                    <p><strong>- Địa điểm làm việc:</strong> {applicant.location || 'Chưa cập nhật'}</p>
                                </div>
                            </div>
                            <button className="edit-goal" onClick={handleEditCareer}>
                                <MdModeEdit /> Chỉnh sửa
                            </button>
                        </>
                    )}
                </div>
            </div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={hideToast}
                />
            )}
        </div>
    );
}
export default Profile;
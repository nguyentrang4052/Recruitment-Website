import './Profile.css';
import { useState } from 'react';
function Profile() {

        const [selectedLevel, setSelectedLevel] = useState('');

        const level = ['Tất cả', 'Fresher','Junior','Mid-level','Senior','Manager']

        const handleLevelChange = (e) => {
            setSelectedLevel(e.target.value);
        };

  return (
    <div className="page-wrapper">
      <h2>HỒ SƠ CÁ NHÂN</h2>
        <p>Quản lý thông tin hồ sơ để ứng tuyển dễ dàng hơn</p>
        <div className="profile-container">
            <div className="profile-section">
                <h3>Thông tin cá nhân</h3>        
                <div className="profile-left">
                    <img src="avatar.png" alt="Avatar" className="pr-avatar" />
                    <input type="file" />
                </div>
                <div className="profile-right">
                    <div className="form-group-pr">
                        <label>Họ và tên</label>
                        <input type="text" placeholder="Nhập họ và tên" />
                    </div>
                    <div className="form-group-pr">
                        <label>Email</label>
                        <input type="email" placeholder="Nhập email" />
                    </div>
                    <div className="form-group-pr">
                        <label>Số điện thoại</label>
                        <input type="text" placeholder="Nhập số điện thoại" />
                    </div>
                    <div className="form-group-pr">
                        <label>Địa chỉ</label>
                        <input type="text" placeholder="Nhập địa chỉ" />
                    </div>
                    <div className="form-group-pr">
                        <label>Ngày sinh</label>
                        <input type="date" />
                    </div>
            </div>
               
            </div>
            <div className="profile-section">
                <h3>Mục tiêu nghề nghiệp</h3>
                <div className="form-group-pr">
                    <textarea placeholder="Nhập mục tiêu nghề nghiệp"></textarea>
                </div>
            </div>
            <div className="profile-section">
                <h3>Kinh nghiệm làm việc</h3>
                <div className="form-group-pr-exp">
                    <label>Công ty</label>
                    <input type="text" placeholder="Nhập tên công ty" />
                    <button className="add-experience-btn">Thêm kinh nghiệm</button>
                </div>
            </div>
            <div className="profile-section">
                <h3>Trình độ học vấn</h3>
                <div className="form-group-pr-exp">
                    <label>Trường</label>
                    <input type="text" placeholder="Nhập tên trường" />
                    <button className="add-education-btn">Thêm học vấn</button>
                </div>
            </div>
            <div className="profile-section">
                <h3>Kỹ năng</h3>
                <div className="form-group-pr-exp">
                    <label>Kỹ năng</label>
                    <input type="text" placeholder="Nhập kỹ năng" />
                    <button className="add-skill-btn">Thêm kỹ năng</button>
                </div>
            </div>
            <div className="profile-section">
                <h3>Cấp bậc</h3>
                <div className="form-group-pr-exp">
                    <label>Cấp bậc</label>
                    <select value={selectedLevel} onChange={handleLevelChange}>
                        <option value="">Chọn cấp bậc</option>
                        {level.map((lvl, index) => (
                            <option key={index} value={lvl}>{lvl}</option>
                        ))}
                    </select>
                    <button className="add-level-btn"> Chọn cấp bậc</button>
                </div>
            </div>

            <div className="profile-section">
                <h3>CV</h3>
                <div className="form-group-pr-exp">
                    <input type="file" />
                    <button className="upload-cv-btn">Tải lên CV</button>
                </div>
            </div>
        </div>
        <button className="save-profile-btn">Lưu thay đổi</button>

    </div>
  );
}
export default Profile;
import React, { useState } from "react";
import '../../Employer/EmployerSetting/EmployerSetting.css';

export default function EmployerSetting() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    email: ""
  });

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(password);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handlePasswordUpdate = () => {
    let newErrors = { password: "", confirmPassword: "", email: "" };

    if (!validatePassword(newPassword)) {
      newErrors.password =
        "Mật khẩu phải ≥ 8 ký tự, có ít nhất 1 chữ hoa và 1 ký tự đặc biệt.";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    setErrors(newErrors);

    if (!newErrors.password && !newErrors.confirmPassword) {
      alert("Cập nhật mật khẩu thành công!");
    }
  };

  const handleEmailUpdate = () => {
    let newErrors = { ...errors, email: "" };

    if (!validateEmail(newEmail)) {
      newErrors.email = "Email không hợp lệ. Vui lòng nhập đúng định dạng!";
    }

    setErrors(newErrors);

    if (!newErrors.email) {
      alert("Cập nhật email thành công!");
    }
  };

  return (
    <div className="setting-container">
      <h2 className="setting-title">QUẢN LÝ TÀI KHOẢN</h2>
      <div className="setting-row">

        <div className="setting-col">
          <h3>Thay đổi mật khẩu</h3>
          <div className="form-emp">
            <input
              type="password"
              placeholder="Nhập mật khẩu cũ"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="form-emp">
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>
          <div className="form-emp">
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}
          </div>
          <div className="button-group">
            <button onClick={handlePasswordUpdate} className="btn-update">
              CẬP NHẬT
            </button>
            <button className="btn-skip">BỎ QUA</button>
          </div>
        </div>

        <div className="setting-col">
          <h3>Thay đổi địa chỉ Email</h3>
          <div className="form-emp">
            <input
              type="email"
              placeholder="Nhập email mới"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          <div className="button-group">
            <button onClick={handleEmailUpdate} className="btn-update">
              CẬP NHẬT
            </button>
            <button className="btn-skip">BỎ QUA</button>
          </div>
        </div>
      </div>
    </div>
  );
}

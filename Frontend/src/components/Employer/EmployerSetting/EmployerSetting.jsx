import React, { useState } from 'react';
import axios from "axios";
import '../../Employer/EmployerSetting/EmployerSetting.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import useToast from '../../../utils/useToast.js';
import Toast from '../../Toast/Toast.jsx';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default function EmployerSetting() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { toast, hideToast, showSuccess, showError } = useToast();

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const toggleShow = (field) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  const validatePassword = (p) =>
    /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/.test(p);

  const handlePasswordUpdate = async () => {
    const err = { password: "", confirmPassword: "" };
    if (!validatePassword(newPassword))
      err.password = "Mật khẩu ≥ 8 ký tự, có ít nhất 1 chữ hoa và 1 ký tự đặc biệt.";
    if (newPassword !== confirmPassword)
      err.confirmPassword = "Mật khẩu xác nhận không khớp.";
    setErrors(err);

    if (!err.password && !err.confirmPassword) {
      try {
        await api.patch("/api/employer/settings/password", { oldPassword, newPassword });
        showSuccess("Cập nhật mật khẩu thành công!");
        setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      } catch (e) {
        showError(e.response?.data?.message || "Mật khẩu cũ không đúng. Vui lòng thử lại.");
      }
    }
  };

  return (
    <>
      <div className="setting-emp-container">
        <h2 className="setting-title">ĐỔI MẬT KHẨU</h2>

        <div className="setting-single-col">
          <div className="setting-box">
            <h3>Mật khẩu mới</h3>

            <div className="form-emp">
              <input
                type={showPassword.old ? "text" : "password"}
                placeholder="Mật khẩu cũ"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />

            </div>

            <div className="form-emp">
              <input
                type={showPassword.new ? "text" : "password"}
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span onClick={() => toggleShow("new")}>
                <i className={`fa ${showPassword.new ? "fa-eye" : "fa-eye-slash"}`} />
              </span>
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>

            <div className="form-emp">
              <input
                type={showPassword.confirm ? "text" : "password"}
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span onClick={() => toggleShow("confirm")}>
                <i className={`fa ${showPassword.confirm ? "fa-eye" : "fa-eye-slash"}`} />
              </span>
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
            </div>

            <div className="button-group">
              <button onClick={handlePasswordUpdate} className="btn-update">
                CẬP NHẬT
              </button>
              <button type="button" className="btn-cancel" onClick={() => { setOldPassword(""); setNewPassword(""); setConfirmPassword(""); setErrors({}); }}>
                LÀM TRỐNG
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast {...toast} onClose={hideToast} />}
    </>
  );
}
import React, { useState, useEffect } from "react";
import axios from "axios";
import '../../Employer/EmployerSetting/EmployerSetting.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

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
  const [newEmail, setNewEmail] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    email: ""
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const toggleShow = (field) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/employer/settings/info");
        setCurrentEmail(data.email);
      } catch {
        alert("Không thể lấy thông tin email");
      }
    })();
  }, []);


  const validatePassword = (p) =>
    /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/.test(p);
  const validateEmail = (e) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);


  const handlePasswordUpdate = async () => {
    const err = { password: "", confirmPassword: "", email: "" };
    if (!validatePassword(newPassword))
      err.password = "Mật khẩu ≥ 8 ký tự, có ít nhất 1 chữ hoa và 1 ký tự đặc biệt.";
    if (newPassword !== confirmPassword)
      err.confirmPassword = "Mật khẩu xác nhận không khớp.";
    setErrors(err);

    if (!err.password && !err.confirmPassword) {
      try {
        await api.patch("/api/employer/settings/password", { newPassword });
        alert("✅ Cập nhật mật khẩu thành công!");
        setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      } catch (e) {
        alert("❌ " + (e.response?.data?.message || "Cập nhật mật khẩu thất bại"));
      }
    }
  };

  const handleEmailUpdate = async () => {
    const err = { ...errors, email: "" };
    if (!validateEmail(newEmail))
      err.email = "Email không hợp lệ. Vui lòng nhập đúng định dạng!";
    setErrors(err);

    if (!err.email) {
      try {
        await api.patch("/api/employer/settings/email", { newEmail });
        alert("✅ Cập nhật email thành công!");
        setCurrentEmail(newEmail); setNewEmail("");
      } catch (e) {
        alert("❌ " + (e.response?.data?.message || "Cập nhật email thất bại"));
      }
    }
  };


  return (
    <div className="setting-container">
      <h2 className="setting-title">QUẢN LÝ TÀI KHOẢN</h2>
      <div className="setting-row">

        <div className="setting-col">
          <h3>Thay đổi mật khẩu</h3>

          <div className="form-emp" style={{ position: "relative" }}>
            <input
              type={showPassword.old ? "text" : "password"}
              placeholder="Nhập mật khẩu cũ"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />

          </div>


          <div className="form-emp">
            <input
              type={showPassword.new ? "text" : "password"}
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span onClick={() => toggleShow("new")}>
              <i className={`fa ${showPassword.new ? "fa-eye-slash" : "fa-eye"}`} />
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
              <i className={`fa ${showPassword.confirm ? "fa-eye-slash" : "fa-eye"}`} />
            </span>
            {errors.password && <p className="error-message">{errors.password}</p>}
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
          <p style={{ marginBottom: 8, fontSize: 14, color: "#555" }}>
            Email hiện tại: <strong>{currentEmail}</strong>
          </p>
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
import React, { useState } from "react";
import "./Setting.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from "axios";
// import { useEffect } from "react";
import Toast from '../../../Toast/Toast';
import useToast from '../../../../utils/useToast';

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: API_URL,
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
export default function Setting() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [newEmail, setNewEmail] = useState("");

  // const [currentEmail, setCurrentEmail] = useState("");

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const toggleShow = (field) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  const { toast, showSuccess, showError, hideToast } = useToast();

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const { data } = await api.get("/api/applicant/settings/info");
  //       setCurrentEmail(data.email);
  //     } catch {
  //       showError("Không thể lấy thông tin email");
  //     }
  //   })();
  // }, []);


  const validatePassword = (p) =>
    /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/.test(p);
  // const validateEmail = (e) =>
  //   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handlePasswordUpdate = async () => {
    const err = { password: "", confirmPassword: "", email: "" };
    if (!validatePassword(newPassword)){
      showError("Mật khẩu ≥ 8 ký tự, có ít nhất 1 chữ hoa và 1 ký tự đặc biệt.");
      return;
    }
    
    if (newPassword !== confirmPassword){
      showError("Mật khẩu xác nhận không khớp.");
      return;
    }
      

    if (!err.password && !err.confirmPassword) {
      try {
        const res = await api.patch("/api/applicant/settings/password",  { oldPassword, newPassword });
        showSuccess(res?.data?.message );
        setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      } catch (e) {
       
          showError(e.response?.data?.message);
      }
    }
  };

  // const handleEmailUpdate = async () => {
  //   if (!validateEmail(newEmail))
  //   {
  //     showError( "Email không hợp lệ. Vui lòng nhập đúng định dạng!");
  //     return;
  //   }  
  //     try {
  //       await api.patch("/api/applicant/settings/email", { newEmail });
  //       showSuccess("Cập nhật email thành công!");
  //       setCurrentEmail(newEmail); setNewEmail("");
  //     } catch (e) {
  //       showError(e.response?.data?.message || "Cập nhật email thất bại");
  //     }
  // };

  return (
    <div className="main-layout" >
      <div className="setting-container">
        <h2 className="setting-title">QUẢN LÝ TÀI KHOẢN</h2>
        <div className="setting-row">
          <div className="setting-col">
            <h3>Thay đổi mật khẩu</h3>
            <div className="form-group-setting">
              <input type="password" placeholder="Nhập mật khẩu cũ" value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)} />
            </div>

            <div className="form-group-setting">
              <input
                type={showPassword.new ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span onClick={() => toggleShow("new")}>
                <i className={`fa ${showPassword.new ? "fa-eye" : "fa-eye-slash"}`} />
              </span>
            </div>

            <div className="form-group-setting">
              <input
                type={showPassword.confirm ? "text" : "password"}
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span onClick={() => toggleShow("confirm")}>
                <i className={`fa ${showPassword.confirm ? "fa-eye" : "fa-eye-slash"}`} />
              </span>
             
            </div>

            <div className="button-group">
              <button onClick={handlePasswordUpdate} className="btn-update">CẬP NHẬT</button>
              <button className="btn-skip">BỎ QUA</button>
            </div>
          </div>

          {/* <div className="setting-col">
            <h3>Thay đổi địa chỉ Email</h3>
            <p style={{ marginBottom: 8, fontSize: 14, color: "#555" }}>
              Email hiện tại: <strong>{currentEmail}</strong>
            </p>

            <div className="form-group-setting">
              <input type="email" placeholder="Nhập email mới" value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)} />
            </div>

            <div className="button-group">
              <button onClick={handleEmailUpdate} className="btn-update">CẬP NHẬT</button>
              <button className="btn-skip">BỎ QUA</button>
            </div>

          </div> */}
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

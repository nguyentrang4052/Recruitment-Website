import React, { useState } from "react";
import "./Setting.css";

export default function Setting() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handlePasswordUpdate = () => {
    setMessage("Mật khẩu đã được câp nhật!");
    setShowMessage(true);
  };
  
  const handleEmailUpdate = () => {
    setMessage("Email đã được câp nhật!");
    setShowMessage(true);
  };

  const closeMessage = () => {
    setShowMessage(false);
  }

  return (
    <div className="main-layout" >
      <div className="setting-container">
      <h2 className="setting-title">QUẢN LÝ TÀI KHOẢN</h2>
      <div className="setting-row">
        <div className="setting-col">
            <h3>Thay đổi mật khẩu</h3>
                <div className="form-group-setting">
                    <input type="password" placeholder="Nhập mật khẩu cũ" value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}/>
                </div>
                <div className="form-group-setting">
                  <input type="password" placeholder="Nhập mật khẩu mới" value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}/>
                </div>
                <div className="form-group-setting">
                  <input type="password" placeholder="Xác nhận mật khẩu mới" value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}/>
                </div>
                <div className="button-group">
                  <button onClick={handlePasswordUpdate} className="btn-update">CẬP NHẬT</button>
                  <button className="btn-skip">BỎ QUA</button>
                </div>
        </div>

        <div className="setting-col">
            <h3>Thay đổi địa chỉ Email</h3>
                <div className="form-group-setting">
                  <input type="email" placeholder="Nhập email mới" value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}/>
                </div>
                <div className="button-group">
                  <button onClick={handleEmailUpdate} className="btn-update">CẬP NHẬT</button>
                  <button className="btn-skip">BỎ QUA</button>
                </div>
        </div>
      </div>
      {showMessage && (
        <div className="popup-message">
          <p>{message}</p>
          <button onClick={closeMessage} className="btn-close">Đóng</button>  
        </div>
      )}
    </div>
    </div>
  );
}

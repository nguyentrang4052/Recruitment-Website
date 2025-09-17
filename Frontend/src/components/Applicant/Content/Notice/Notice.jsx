import React, { useState } from 'react';
import './Notice.css';

const NoticeTable = () => {
  const [notice, setNotice] = useState([]);


  return (
    <div className="notice-container">
      <h2 className="notice-title">QUẢN LÝ THÔNG BÁO VIỆC LÀM</h2>
      <table className="notice-table">
        <thead>
          <tr>
            <th>Tên Thông Báo</th>
            <th>Ngày Tạo</th>
            <th>Công Việc Phù Hợp</th>
            <th>Nhận Email</th>
          </tr>
        </thead>
        <tbody>
          {notice.map((notification, index) => (
            <tr key={index}>
              <td>{notification.name}</td>
              <td>{notification.createdDate}</td>
              <td>{notification.matchingJobs}</td>
              <td>
                <input
                  type="checkbox"
                  checked={notification.emailNotice}
                  onChange={() => {
                    const updatedNotice = [...notice];
                    updatedNotice[index].emailNotification = !updatedNotice[index].emailNotice;
                    setNotice(updatedNotice);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn-create">Tạo Mới</button>
    </div>
  );
};

export default NoticeTable;

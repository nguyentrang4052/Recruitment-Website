// src/components/Employer/Employers.jsx
import './Employer.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Employers({ onViewDetail }) {
  const [employers, setEmployers] = useState([]);
   const token = localStorage.getItem("token");
   console.log(token);
   useEffect(() => {
 
     axios.get('http://localhost:8080/api/admin/employer', {
       headers: { Authorization: `Bearer ${token}` }
     })
       .then(res => setEmployers(res.data))
       .catch(err => console.error(err));
   }, []);
 
   const deleteEmployer = async (id) => {
     try {
       const res = await axios.post(`http://localhost:8080/api/admin/employer/delete`, null, {
         headers: { Authorization: `Bearer ${token}` },
         params: { id }
       });
      alert(res.data);

      // update trạng thái trong state
      setEmployers(prev => prev.map(a =>
        a.employerId === id ? { ...a, active: 'Bị khóa' } : a
      ));
     } catch (err) {
       console.error(err);
       alert("Xóa thất bại");
     }
   };

  return (
    <div className="employers-wrapper">
      <h1 className="content-title">Quản lý Nhà tuyển dụng</h1>
      <div className="card">
        {/* <div className="table-toolbar">
          <input type="text" placeholder="Tìm kiếm nhà tuyển dụng..." className="table-search" />
        </div> */}

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên công ty</th>
              <th>Người đại diện</th>
              <th>Số điện thoại</th>
              <th>Website công ty</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {employers.map((emp) => (
              <tr key={emp.employerId}>
                <td>{emp.employerId}</td>
                <td>{emp.name}</td>
                <td>{emp.representative}</td>
                <td>{emp.phone}</td>
                <td><a href={emp.companyWebsite} target="_blank" rel="noopener noreferrer">{emp.companyWebsite}</a></td>
                {/* <td><span className="status-badge active">{emp.active}</span></td> */}
                <td>
                  <span className={`status-badge ${emp.active ? 'Hoạt động' : 'Bị khóa'}`}>
                    {emp.active}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="btn-view"
                      onClick={() => onViewDetail(emp)}
                    >
                      Xem
                    </button>
                     {emp.active !== 'Bị khoá' && (
                    <button className="btn-delete" onClick={() => deleteEmployer(emp.employerId)}>Xóa</button>)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

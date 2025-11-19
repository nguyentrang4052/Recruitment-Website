// src/components/ProfileViewsStats.jsx
import React, { useState, useEffect } from 'react';
import './ProfileViewsStats.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
});
api.interceptors.request.use((cfg) => {
    const t = localStorage.getItem('token');
    if (t) cfg.headers.Authorization = `Bearer ${t}`;
    return cfg;
});

const ProfileViewsStats = ({ setActiveTab }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get('/api/employer/views/stats?days=7');
                setData(res.data); // [{day:"Thứ 2",views:20}, ...]
            } catch (e) {
                console.error('❌ Lỗi tải thống kê:', e);
                setError(e.response?.data?.message || 'Không thể tải dữ liệu');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <p style={{ textAlign: 'center', padding: 40 }}>⏳ Đang tải...</p>;
    if (error) return (
        <div className="profile-views-container">
            <div className="header-row">
                <button className="back-button" onClick={() => setActiveTab('dashboard')}>← Quay lại</button>
            </div>
            <p style={{ color: 'red', textAlign: 'center', padding: 40 }}>❌ {error}</p>
        </div>
    );

    return (
        <div className="profile-views-container">
            <div className="header-row">
                <button className="back-button" onClick={() => setActiveTab('dashboard')}>← Quay lại</button>
                <h2 className="page-title">LƯỢT XEM HỒ SƠ TUẦN NÀY</h2>
            </div>

            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="views" fill="#007bff" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {data.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: 20 }}>Không có dữ liệu lượt xem trong tuần này.</p>
            )}
        </div>
    );
};

export default ProfileViewsStats;
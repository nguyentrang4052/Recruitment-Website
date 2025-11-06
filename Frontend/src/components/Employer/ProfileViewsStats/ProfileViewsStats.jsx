import React, { useState } from 'react';
import './ProfileViewsStats.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const sampleData = [
    { day: 'Thứ 2', views: 20 },
    { day: 'Thứ 3', views: 35 },
    { day: 'Thứ 4', views: 28 },
    { day: 'Thứ 5', views: 40 },
    { day: 'Thứ 6', views: 25 },
    { day: 'Thứ 7', views: 15 },
    { day: 'CN', views: 10 },
];

const ProfileViewsStats = ({ setActiveTab }) => {
    const [data] = useState(sampleData);

    return (
        <div className="profile-views-container">
            <div className="header-row">
                <button className="back-button" onClick={() => setActiveTab('dashboard')}>
                    ← Quay lại
                </button>
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
        </div>
    );
};

export default ProfileViewsStats;

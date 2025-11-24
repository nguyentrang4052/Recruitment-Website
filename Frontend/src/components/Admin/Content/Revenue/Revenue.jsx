import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './Revenue.css';

function Revenue() {
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('line');
  const [revenueData, setRevenueData] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyGrowth: 0,
    totalOrders: 0,
    avgOrderValue: 0
  });

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const token = localStorage.getItem('token');
        const year = new Date().getFullYear();
        const res = await fetch(
          `http://localhost:8080/api/admin/revenue?year=${year}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error('Không lấy được doanh thu');
        const data = await res.json();
        setStats(data.summary);
        setRevenueData(data.monthly);
        setPackageData(data.byPackage);
      } catch (e) {
        console.error(e);
      }
    };
    fetchRevenue();
  }, []);


  const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);

  const formatNumber = (value) =>
    new Intl.NumberFormat('vi-VN').format(value);

  return (
    <div className="revenue-container">
      <h1 className="revenue-title">Thống kê Doanh thu</h1>


      <div className="stats-grid">
        <div className="stat-card stat-card-purple">
          <div className="stat-label">Tổng doanh thu</div>
          <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
          <div className="stat-change">↑ {stats.monthlyGrowth}% so với tháng trước</div>
        </div>

        <div className="stat-card stat-card-pink">
          <div className="stat-label">Tổng đơn hàng</div>
          <div className="stat-value">{formatNumber(stats.totalOrders)}</div>
          <div className="stat-change">↑ 8.2% so với tháng trước</div>
        </div>

        <div className="stat-card stat-card-blue">
          <div className="stat-label">Giá trị TB/Đơn</div>
          <div className="stat-value">{formatCurrency(stats.avgOrderValue)}</div>
          <div className="stat-change">↑ 4.1% so với tháng trước</div>
        </div>
      </div>


      <div className="chart-section">
        <div className="chart-header">
          <h2 className="chart-title">Biểu đồ Doanh thu</h2>
          <div className="chart-controls">
            <select
              className="chart-select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">7 ngày qua</option>
              <option value="month">Tháng này</option>
              <option value="quarter">Quý này</option>
              <option value="year">Năm nay</option>
            </select>
            <select
              className="chart-select"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="line">Biểu đồ đường</option>
              <option value="bar">Biểu đồ cột</option>
            </select>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          {chartType === 'line' ? (
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} />
              <Tooltip
                formatter={(v) => formatCurrency(v)}
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Doanh thu"
                stroke="#667eea"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          ) : (
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} />
              <Tooltip
                formatter={(v) => formatCurrency(v)}
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="revenue" name="Doanh thu" fill="#667eea" radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>


      <div className="package-section">
        <h2 className="package-title">Doanh thu theo Gói dịch vụ</h2>
        <div className="package-grid">
          {packageData.map((pkg, idx) => (
            <div key={idx} className="package-card">
              <div className="package-header">
                <div>
                  <h3 className="package-name">{pkg.packageName}</h3>
                  <p className="package-orders">{formatNumber(pkg.orders)} đơn hàng</p>
                </div>
                <div className="package-revenue-info">
                  <div className="package-revenue">{formatCurrency(pkg.revenue)}</div>
                  <div className="package-percentage">{pkg.percentage}% tổng DT</div>
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${pkg.percentage}%`, background: pkg.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Revenue;
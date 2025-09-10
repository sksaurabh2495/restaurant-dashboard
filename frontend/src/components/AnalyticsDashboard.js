import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const AnalyticsDashboard = ({ analytics, restaurant }) => {
  return (
    <div className="analytics-dashboard">
      <h2>Analytics for {restaurant.name}</h2>
      
      <div className="charts">
        <div className="chart-container">
          <h3>Daily Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="order_count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h3>Daily Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h3>Average Order Value</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avg_order_value" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="analytics-table">
        <h3>Detailed Analytics</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Orders</th>
              <th>Revenue</th>
              <th>Avg Order Value</th>
              <th>Peak Hour</th>
            </tr>
          </thead>
          <tbody>
            {analytics.map(day => (
              <tr key={day.date}>
                <td>{day.date}</td>
                <td>{day.order_count}</td>
                <td>₹{day.total_revenue.toFixed(2)}</td>
                <td>₹{day.avg_order_value.toFixed(2)}</td>
                <td>{day.peak_hour}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
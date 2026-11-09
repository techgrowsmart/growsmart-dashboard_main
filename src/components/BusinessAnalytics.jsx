import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useState, useEffect } from 'react';

const BusinessAnalytics = () => {
  const [salesData, setSalesData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [funnelData, setFunnelData] = useState([]);
  const [regionalData, setRegionalData] = useState([]);
  const [conversionData, setConversionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API calls
    // fetchSalesData();
    // fetchRevenueData();
    // fetchFunnelData();
    // fetchRegionalData();
    // fetchConversionData();
    setLoading(false);
  }, []);

  const COLORS = ['#0ea5e9', '#a855f7', '#ec4899', '#f97316', '#22c55e'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-dark-border">
          <p className="text-sm font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Business Analytics</h2>
          <p className="text-dark-muted mt-1">Comprehensive business insights and metrics</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">Export Report</button>
          <button className="btn-primary">Customize</button>
        </div>
      </div>

      {/* Sales Performance */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Sales Performance</h3>
        {salesData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-dark-muted">
            <p>No sales data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
              <XAxis dataKey="month" stroke="#71717a" />
              <YAxis stroke="#71717a" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="sales" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorSales)" name="Sales" />
              <Area type="monotone" dataKey="target" stroke="#a855f7" fillOpacity={1} fill="url(#colorTarget)" name="Target" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue vs Expenses</h3>
          {revenueData.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-dark-muted">
              <p>No revenue data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis dataKey="month" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} name="Revenue" />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                <Line type="monotone" dataKey="profit" stroke="#0ea5e9" strokeWidth={2} name="Profit" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Customer Acquisition Funnel */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Acquisition Funnel</h3>
          {funnelData.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-dark-muted">
              <p>No funnel data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis type="number" stroke="#71717a" />
                <YAxis dataKey="stage" type="category" stroke="#71717a" width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#0ea5e9" radius={[0, 4, 4, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Performance */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Regional Performance</h3>
          {regionalData.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-dark-muted">
              <p>No regional data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis dataKey="region" stroke="#71717a" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#71717a" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="revenue" fill="#0ea5e9" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="users" fill="#a855f7" name="Users" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Lead Conversion Metrics */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Lead Conversion by Channel</h3>
          <div className="space-y-4">
            {conversionData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-dark-muted">
                <p>No conversion data available</p>
              </div>
            ) : (
              conversionData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{item.channel}</span>
                    <span className="text-dark-muted">{item.rate}% conversion</span>
                  </div>
                  <div className="h-3 bg-dark-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                      style={{ width: `${item.rate * 10}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-dark-muted mt-1">
                    <span>{item.visitors.toLocaleString()} visitors</span>
                    <span>{item.conversions.toLocaleString()} conversions</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Monthly Performance Comparison */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Performance Comparison</h3>
        {salesData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-dark-muted">
            <p>No performance data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
              <XAxis dataKey="month" stroke="#71717a" />
              <YAxis stroke="#71717a" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="sales" fill="#0ea5e9" name="Current Year" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="#a855f7" name="Previous Year" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default BusinessAnalytics;

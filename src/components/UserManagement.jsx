import { useState } from 'react';
import { Search, Filter, MoreVertical, Mail, Phone, Calendar, Shield, Activity } from 'lucide-react';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  const users = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@company.com', phone: '+1 234 567 8901', plan: 'Enterprise', regDate: '2024-01-15', status: 'Active', activity: 'Online' },
    { id: 2, name: 'Michael Chen', email: 'michael@startup.io', phone: '+1 234 567 8902', plan: 'Pro', regDate: '2024-02-20', status: 'Active', activity: 'Online' },
    { id: 3, name: 'Emily Davis', email: 'emily@agency.com', phone: '+1 234 567 8903', plan: 'Basic', regDate: '2024-03-10', status: 'Active', activity: 'Offline' },
    { id: 4, name: 'James Wilson', email: 'james@corp.net', phone: '+1 234 567 8904', plan: 'Enterprise', regDate: '2024-01-05', status: 'Inactive', activity: 'Offline' },
    { id: 5, name: 'Lisa Anderson', email: 'lisa@tech.co', phone: '+1 234 567 8905', plan: 'Pro', regDate: '2024-02-28', status: 'Active', activity: 'Online' },
    { id: 6, name: 'David Brown', email: 'david@business.com', phone: '+1 234 567 8906', plan: 'Basic', regDate: '2024-03-15', status: 'Pending', activity: 'Offline' },
    { id: 7, name: 'Jennifer Taylor', email: 'jennifer@org.org', phone: '+1 234 567 8907', plan: 'Enterprise', regDate: '2024-01-20', status: 'Active', activity: 'Online' },
    { id: 8, name: 'Robert Martinez', email: 'robert@firm.com', phone: '+1 234 567 8908', plan: 'Pro', regDate: '2024-02-05', status: 'Active', activity: 'Offline' },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesPlan = planFilter === 'all' || user.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusBadge = (status) => {
    const badges = {
      Active: 'badge-success',
      Inactive: 'badge-warning',
      Pending: 'badge-info',
    };
    return badges[status] || 'badge-info';
  };

  const getActivityBadge = (activity) => {
    return activity === 'Online' ? 'badge-success' : 'badge-warning';
  };

  const getPlanBadge = (plan) => {
    const badges = {
      Enterprise: 'bg-accent-500/20 text-accent-400 border border-accent-500/30',
      Pro: 'bg-primary-500/20 text-primary-400 border border-primary-500/30',
      Basic: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
    };
    return badges[plan] || 'badge-info';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-dark-muted mt-1">Manage and monitor all users</p>
        </div>
        <button className="btn-primary w-full sm:w-auto">+ Add New User</button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={20} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Plans</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Pro">Pro</option>
              <option value="Basic">Basic</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Plan</th>
                <th>Registration Date</th>
                <th>Status</th>
                <th>Activity</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-dark-border/50 transition-colors">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-dark-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} className="text-dark-muted" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-dark-muted" />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getPlanBadge(user.plan)}`}>{user.plan}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={14} className="text-dark-muted" />
                      {user.regDate}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(user.status)}`}>{user.status}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.activity === 'Online' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                      <span className={`badge ${getActivityBadge(user.activity)}`}>{user.activity}</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <button className="p-2 hover:bg-dark-border rounded-lg transition-colors">
                      <MoreVertical size={18} className="text-dark-muted" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-dark-muted">Showing {filteredUsers.length} of {users.length} users</p>
          <div className="flex gap-2">
            <button className="btn-secondary px-3">Previous</button>
            <button className="btn-primary px-3">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

import { useState, useEffect } from 'react';
import { Search, Filter, Mail, Phone, Calendar, Shield, Activity, Eye, X, User, MapPin, Briefcase, Clock, ChevronDown, ChevronUp, Send, MessageSquare, Trash2, Ban, Unlock } from 'lucide-react';
import apiService from '../services/api';

const AdminActions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [dashboardUsers, setDashboardUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [expandedRows, setExpandedRows] = useState({});
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [sendingNotification, setSendingNotification] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deletingUser, setDeletingUser] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockingUser, setBlockingUser] = useState(false);

  useEffect(() => {
    fetchDashboardUsers();
  }, []);

  const fetchDashboardUsers = async () => {
    try {
      setLoading(true);
      // Since we don't have a specific API endpoint for dashboard_users yet,
      // we'll use mock data based on the provided SQL output
      const mockData = [
        {
          id: '51aace73-636e-4919-ac2f-65a4d617edb0',
          actions: null,
          created_at: '2026-05-25 02:14:57.215000+0000',
          department: 'Stakeholder',
          email: 'contact@gogrowsmart.com',
          location: 'Pan India',
          name: 'Admin',
          phonenumber: '7063992249',
          role: 'superadmin',
          status: 'active'
        },
        {
          id: '7bd4d718-c74f-4471-81ab-12ba032a9da3',
          actions: null,
          created_at: '2026-05-26 03:29:59.481000+0000',
          department: null,
          email: 'joi@gmail.com',
          location: null,
          name: 'joi',
          phonenumber: null,
          role: 'admin',
          status: 'active'
        },
        {
          id: '79f4c703-e2d4-4277-92ad-902c7ff91ce4',
          actions: ['{"type":"accept","targetEmail":"matulchaubey669-4@yiv6t665.com","targetName":"Saptash Chaubey","timestamp":"2026-05-25T02:42:03.974Z"}'],
          created_at: '2026-05-25 02:32:31.476000+0000',
          department: null,
          email: 'sethroll6@gmail.com',
          location: null,
          name: 'sethroll6',
          phonenumber: null,
          role: 'admin',
          status: 'active'
        },
        {
          id: '913ef068-16c1-49b7-9e93-6e2ac51ba9d8',
          actions: null,
          created_at: '2026-05-25 02:21:57.723000+0000',
          department: 'ECE',
          email: 'seth@gmail.com',
          location: 'Oan',
          name: 'seth',
          phonenumber: '7063992239',
          role: 'moderator',
          status: 'active'
        },
        {
          id: '1fe3f2b3-8471-4f3f-8821-82937b04acff',
          actions: null,
          created_at: '2026-05-25 02:17:09.170000+0000',
          department: 'ECE',
          email: 'sethroll669@gmail.com',
          location: 'andaman',
          name: 'sethroll669',
          phonenumber: '7063992249',
          role: 'moderator',
          status: 'active'
        },
        {
          id: 'dd8037d0-7586-4665-82d8-2bc473802ce6',
          actions: null,
          created_at: '2026-05-25 07:53:53.139000+0000',
          department: null,
          email: 'bsurfi@gmail.com',
          location: null,
          name: 'bsurfi',
          phonenumber: null,
          role: 'admin',
          status: 'active'
        }
      ];
      
      setDashboardUsers(mockData);
      console.log(`✅ Loaded ${mockData.length} dashboard users`);
    } catch (error) {
      console.error('❌ Error fetching dashboard users:', error);
      setDashboardUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = dashboardUsers.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, roleFilter]);

  const toggleRow = (userId) => {
    setExpandedRows(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const openNotificationModal = (user) => {
    setSelectedUser(user);
    setNotificationMessage('');
    setShowNotificationModal(true);
  };

  const closeNotificationModal = () => {
    setShowNotificationModal(false);
    setSelectedUser(null);
    setNotificationMessage('');
    setSenderName('');
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const openBlockModal = (user) => {
    setUserToBlock(user);
    setShowBlockModal(true);
  };

  const closeBlockModal = () => {
    setShowBlockModal(false);
    setUserToBlock(null);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setDeletingUser(true);
      const response = await apiService.deleteUser(userToDelete.id);

      if (response.success) {
        setDashboardUsers(prev => prev.filter(u => u.id !== userToDelete.id));
        closeDeleteModal();
      } else {
        alert('Failed to delete user: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    } finally {
      setDeletingUser(false);
    }
  };

  const handleBlockUser = async () => {
    if (!userToBlock) return;

    try {
      setBlockingUser(true);
      const response = await apiService.blockUser(userToBlock.id);

      if (response.success) {
        setDashboardUsers(prev => prev.map(u =>
          u.id === userToBlock.id
            ? { ...u, status: userToBlock.status === 'inactive' ? 'active' : 'inactive' }
            : u
        ));
        closeBlockModal();
      } else {
        alert('Failed to update user status: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status. Please try again.');
    } finally {
      setBlockingUser(false);
    }
  };

  const sendNotification = async () => {
    if (!notificationMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    if (!senderName.trim()) {
      alert('Please enter sender name');
      return;
    }

    try {
      setSendingNotification(true);
      const response = await apiService.sendNotification({
        message: notificationMessage,
        target_user_email: selectedUser.email,
        sender_name: senderName
      });

      if (response.success) {
        alert('Notification sent successfully!');
        closeNotificationModal();
      } else {
        alert('Failed to send notification: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification. Please try again.');
    } finally {
      setSendingNotification(false);
    }
  };

  const parseActions = (actions) => {
    if (!actions || actions.length === 0) return [];
    return actions.map(actionStr => {
      try {
        return JSON.parse(actionStr);
      } catch (e) {
        console.error('Error parsing action:', actionStr, e);
        return null;
      }
    }).filter(action => action !== null);
  };

   const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-success',
      inactive: 'badge-danger',
      pending: 'badge-info',
      suspended: 'badge-danger',
      Active: 'badge-success',
      Inactive: 'badge-danger',
      Pending: 'badge-info',
    };
    return badges[status] || 'badge-info';
  };

  const getRoleBadge = (role) => {
    const badges = {
      superadmin: 'bg-red-500/20 text-red-400 border border-red-500/30',
      admin: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      moderator: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    };
    return badges[role] || 'badge-info';
  };

  const getActionTypeBadge = (type) => {
    const badges = {
      accept: 'badge-success',
      reject: 'badge-danger',
      approve: 'badge-success',
      deny: 'badge-danger',
      update: 'badge-info',
      delete: 'badge-danger',
    };
    return badges[type] || 'badge-info';
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
          <h2 className="text-2xl font-bold">Admin Actions</h2>
          <p className="text-dark-muted mt-1">View dashboard users and their action history</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dashboard Users Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table w-full min-w-[1200px]">
            <thead>
              <tr>
                <th className="w-[200px] min-w-[180px]">User</th>
                <th className="w-[250px] min-w-[220px]">Contact</th>
                <th className="w-[120px] min-w-[100px]">Role</th>
                <th className="w-[150px] min-w-[130px]">Department</th>
                <th className="w-[150px] min-w-[130px]">Location</th>
                <th className="w-[180px] min-w-[160px]">Created At</th>
                <th className="w-[100px] min-w-[80px]">Status</th>
                <th className="w-[100px] min-w-[80px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-dark-muted">
                    <p>No dashboard users found</p>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <>
                    <tr key={user.id} className="hover:bg-dark-border/50 transition-colors">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm truncate">{user.name || 'Unknown'}</p>
                            <p className="text-xs text-dark-muted truncate">{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail size={14} className="text-dark-muted flex-shrink-0" />
                            <span className="truncate">{user.email || 'Not provided'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone size={14} className="text-dark-muted flex-shrink-0" />
                            <span className="truncate">{user.phonenumber || 'Not provided'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getRoleBadge(user.role)}`}>{user.role}</span>
                      </td>
                      <td>
                        <span className="text-sm">{user.department || 'Not provided'}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={14} className="text-dark-muted flex-shrink-0" />
                          <span className="truncate">{user.location || 'Not provided'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} className="text-dark-muted flex-shrink-0" />
                          <span className="truncate">
                            {user.created_at ? new Date(user.created_at).toLocaleString() : 'Not provided'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(user.status)}`}>{user.status}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => toggleRow(user.id)}
                            className="p-2 hover:bg-dark-border rounded-lg transition-colors"
                            title="View Actions"
                          >
                            {expandedRows[user.id] ? <ChevronUp size={18} className="text-dark-muted" /> : <ChevronDown size={18} className="text-dark-muted" />}
                          </button>
                          <button 
                            onClick={() => openNotificationModal(user)}
                            className="p-2 hover:bg-dark-border rounded-lg transition-colors"
                            title="Send Notification"
                          >
                            <MessageSquare size={18} className="text-dark-muted" />
                          </button>
                          <button 
                            onClick={() => openBlockModal(user)}
                            className="p-2 hover:bg-dark-border rounded-lg transition-colors"
                            title={user.status === 'inactive' ? 'Unblock User' : 'Block User'}
                          >
                            {user.status === 'inactive' ? (
                              <Unlock size={18} className="text-green-400" />
                            ) : (
                              <Ban size={18} className="text-orange-400" />
                            )}
                          </button>
                          <button 
                            onClick={() => openDeleteModal(user)}
                            className="p-2 hover:bg-dark-border rounded-lg transition-colors"
                            title="Remove User"
                          >
                            <Trash2 size={18} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRows[user.id] && (
                      <tr key={`${user.id}-actions`}>
                        <td colSpan="8" className="p-4 bg-dark-border/30">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                              <Activity size={16} />
                              Action History
                            </h4>
                            {user.actions && user.actions.length > 0 ? (
                              <div className="space-y-2">
                                {parseActions(user.actions).map((action, idx) => (
                                  <div key={idx} className="glass-card p-3 text-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className={`badge ${getActionTypeBadge(action.type)}`}>
                                        {action.type}
                                      </span>
                                      <span className="text-dark-muted text-xs flex items-center gap-1">
                                        <Clock size={12} />
                                        {action.timestamp ? new Date(action.timestamp).toLocaleString() : 'No timestamp'}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                      {action.targetEmail && (
                                        <div className="flex items-center gap-2">
                                          <Mail size={12} className="text-dark-muted" />
                                          <span className="text-dark-muted">Target Email:</span>
                                          <span className="font-medium">{action.targetEmail}</span>
                                        </div>
                                      )}
                                      {action.targetName && (
                                        <div className="flex items-center gap-2">
                                          <User size={12} className="text-dark-muted" />
                                          <span className="text-dark-muted">Target Name:</span>
                                          <span className="font-medium">{action.targetName}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-dark-muted text-sm">No actions recorded</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-dark-muted">
            Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
          </p>
          <div className="flex items-center gap-2">
            <button 
              className="btn-secondary px-3"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    className={`px-3 py-1 rounded ${currentPage === pageNum ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button 
              className="btn-secondary px-3"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      {showNotificationModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card w-full max-w-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-border">
              <h3 className="text-xl font-bold">Send Notification</h3>
              <button 
                onClick={closeNotificationModal}
                className="p-2 hover:bg-dark-border rounded-lg transition-colors"
              >
                <X size={20} className="text-dark-muted" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-dark-border/30 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
                  {selectedUser.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-semibold">{selectedUser.name || 'Unknown'}</p>
                  <p className="text-sm text-dark-muted">{selectedUser.email}</p>
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  placeholder="Enter your notification message..."
                  className="input-field w-full h-32 resize-none"
                  rows={4}
                />
              </div>

              {/* Sender Name Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Sender Name</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Enter sender name..."
                  className="input-field w-full"
                />
              </div>

              {/* Target Info */}
              <div className="text-xs text-dark-muted">
                <p>This notification will be sent to: <span className="font-medium">{selectedUser.email}</span></p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-dark-border">
              <button
                onClick={closeNotificationModal}
                className="btn-secondary"
                disabled={sendingNotification}
              >
                Cancel
              </button>
              <button
                onClick={sendNotification}
                className="btn-primary flex items-center gap-2"
                disabled={sendingNotification || !notificationMessage.trim()}
              >
                {sendingNotification ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Notification
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Remove User</h3>
              <p className="text-dark-muted mb-6">
                Are you sure you want to remove <span className="font-semibold text-dark">{userToDelete.name || userToDelete.email}</span> from the database? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="btn-secondary"
                  disabled={deletingUser}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="btn-primary bg-red-500 hover:bg-red-600 flex items-center gap-2"
                  disabled={deletingUser}
                >
                  {deletingUser ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Removing...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Remove
                    </>
                  )}
                </button>
              </div>
            </div>
         </div>
         </div>
       )}

         {/* Block/Unblock User Confirmation Modal */}
         {showBlockModal && userToBlock && (
           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
             <div className="glass-card w-full max-w-md">
               <div className="p-6 text-center">
                 <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                   <Ban size={24} className="text-orange-400" />
                 </div>
                 <h3 className="text-xl font-bold mb-2">
                   {userToBlock.status === 'inactive' ? 'Unblock User' : 'Block User'}
                 </h3>
                 <p className="text-dark-muted mb-6">
                   Are you sure you want to {userToBlock.status === 'inactive' ? 'unblock' : 'block'} <span className="font-semibold text-dark">{userToBlock.name || userToBlock.email}</span>?
                 </p>
                 <div className="flex items-center justify-center gap-3">
                   <button
                     onClick={closeBlockModal}
                     className="btn-secondary"
                     disabled={blockingUser}
                   >
                     Cancel
                   </button>
                   <button
                     onClick={handleBlockUser}
                     className="btn-primary bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
                     disabled={blockingUser}
                   >
                     {blockingUser ? (
                       <>
                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          {userToBlock.status === 'inactive' ? 'Unblocking...' : 'Blocking...'}
                       </>
                     ) : (
                       <>
                        <Ban size={16} />
                        {userToBlock.status === 'inactive' ? 'Unblock' : 'Block'}
                       </>
                     )}
                   </button>
                 </div>
               </div>
             </div>
           </div>
         )}
     </div>
  );
};

export default AdminActions;

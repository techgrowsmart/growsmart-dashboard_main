import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Mail, Phone, Calendar, Shield, Activity, Eye, X, User, MapPin, Briefcase, BookOpen, Award, Trash2, Ban, Unlock } from 'lucide-react';
import apiService from '../services/api';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deletingUser, setDeletingUser] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockingUser, setBlockingUser] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllUsers();
      
      if (response.success) {
        // Extract users from the correct path in the response
        const allUsers = response.data?.users || response.data || [];
        
        // Transform user data to match frontend expectations
        const transformedUsers = allUsers.map(user => ({
          ...user,
          fullName: user.name || user.full_name || user.email?.split('@')[0] || 'Unknown',
          joinDate: user.created_at || user.joinDate || new Date(),
          lastActive: user.last_active || user.lastActive || new Date(),
          location: user.location || user.address || 'Not provided',
          phone: user.phonenumber || user.phone || 'Not provided',
          profileImage: user.profileImage || user.profileimage || null,
          status: user.status || 'active',
          role: user.role || 'student'
        }));
        
        setUsers(transformedUsers);
        const teachersCount = transformedUsers.filter(u => u.role === 'teacher').length;
        const studentsCount = transformedUsers.filter(u => u.role === 'student').length;
        const adminsCount = transformedUsers.filter(u => u.role === 'admin' || u.role === 'superadmin').length;
        console.log(`✅ Loaded ${transformedUsers.length} users (${teachersCount} teachers, ${studentsCount} students, ${adminsCount} admins)`);
      } else {
        throw new Error(response.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesPlan = planFilter === 'all' || user.role === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, planFilter]);

  // Add CSS styles to prevent layout shifts
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .data-table td {
        vertical-align: middle;
        padding: 12px 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      .data-table th {
        vertical-align: middle;
        padding: 12px 16px;
        border-bottom: 2px solid rgba(255, 255, 255, 0.2);
        font-weight: 600;
        text-align: left;
      }
      .badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-success',
      inactive: 'badge-danger',
      pending: 'badge-info',
      Active: 'badge-success',
      Inactive: 'badge-danger',
      Pending: 'badge-info',
    };
    return badges[status] || 'badge-info';
  };

  const getActivityBadge = (activity) => {
    return activity === 'Online' ? 'badge-success' : 'badge-warning';
  };

  const getRoleBadge = (role) => {
    const badges = {
      teacher: 'bg-primary-500/20 text-primary-400 border border-primary-500/30',
      student: 'bg-accent-500/20 text-accent-400 border border-accent-500/30',
      admin: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    };
    return badges[role] || 'badge-info';
  };

  const openProfileModal = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setSelectedUser(null);
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

  const handleBlockUser = async () => {
    if (!userToBlock) return;

    try {
      setBlockingUser(true);
      const response = await apiService.blockUser(userToBlock.id);

      if (response.success) {
        setUsers(prev => prev.map(u =>
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

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setDeletingUser(true);
      const response = await apiService.deleteUser(userToDelete.id);

      if (response.success) {
        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold">User Management</h2>
        <p className="text-dark-muted mt-1">Manage and monitor all users</p>
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
	               <option value="all">All Roles</option>
	               <option value="teacher">Teachers</option>
	               <option value="student">Students</option>
	             </select>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="glass-card">
        <div className="overflow-x-auto">
          <table className="data-table w-full min-w-[800px]">
            <thead>
              <tr>
                <th className="w-[300px] min-w-[250px]">User</th>
                <th className="w-[250px] min-w-[200px]">Contact</th>
                <th className="w-[100px] min-w-[80px]">Role</th>
                <th className="w-[150px] min-w-[120px]">Registration Date</th>
                <th className="w-[100px] min-w-[80px]">Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-dark-muted">
                    <p>No users found</p>
                    <button className="btn-primary mt-4">Add First User</button>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                <tr key={user.uniqueKey || user.id} className="hover:bg-dark-border/50 transition-colors">
                  <td className="w-[300px] min-w-[250px]">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.email.split('@')[0] || 'User')}&background=6366f1&color=fff&size=40`}
                          alt={user.fullName || 'User'}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.email.split('@')[0] || 'User')}&background=6366f1&color=fff&size=40`;
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm truncate">{user.fullName}</p>
                        <p className="text-xs text-dark-muted truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="w-[250px] min-w-[200px]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} className="text-dark-muted flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-dark-muted flex-shrink-0" />
                        <span className="truncate">{user.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="w-[100px] min-w-[80px]">
                    <span className={`badge ${getRoleBadge(user.role)}`}>{user.role}</span>
                  </td>
                  <td className="w-[150px] min-w-[120px]">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={14} className="text-dark-muted flex-shrink-0" />
                      <span className="truncate">{new Date(user.joinDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="w-[100px] min-w-[80px]">
                    <span className={`badge ${getStatusBadge(user.status)}`}>{user.status}</span>
                  </td>
                   <td className="whitespace-nowrap px-2">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => openProfileModal(user)}
                          className="p-2 hover:bg-dark-border rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye size={18} className="text-dark-muted" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(user)}
                          className="p-2 hover:bg-dark-border rounded-lg transition-colors"
                          title="Remove User"
                        >
                          <Trash2 size={18} className="text-red-400" />
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
                      </div>
                    </td>
                </tr>
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

        {/* User Profile Modal */}
        {showProfileModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-border">
              <h3 className="text-xl font-bold">User Profile</h3>
              <button 
                onClick={closeProfileModal}
                className="p-2 hover:bg-dark-border rounded-lg transition-colors"
              >
                <X size={20} className="text-dark-muted" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <img 
                  src={selectedUser.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.fullName || selectedUser.email.split('@')[0] || 'User')}&background=6366f1&color=fff&size=96`}
                  alt={selectedUser.fullName || 'User'}
                  className="w-24 h-24 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.fullName || selectedUser.email.split('@')[0] || 'User')}&background=6366f1&color=fff&size=96`;
                  }}
                />
                <div className="flex-1">
                  <h4 className="text-2xl font-bold">{selectedUser.fullName}</h4>
                  <p className="text-dark-muted">{selectedUser.email}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`badge ${getRoleBadge(selectedUser.role)}`}>
                      {selectedUser.role}
                    </span>
                    <span className={`badge ${getStatusBadge(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h5 className="font-semibold flex items-center gap-2">
                    <Mail size={16} />
                    Contact Information
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-dark-muted" />
                      {selectedUser.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-dark-muted" />
                      {selectedUser.phone || 'Not provided'}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-dark-muted" />
                      {selectedUser.location || 'Not provided'}
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <h5 className="font-semibold flex items-center gap-2">
                    <Calendar size={16} />
                    Account Information
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-dark-muted" />
                      Joined: {new Date(selectedUser.joinDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity size={14} className="text-dark-muted" />
                      Last Active: {new Date(selectedUser.lastActive).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-dark-muted" />
                      Status: {selectedUser.status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Role-specific Information */}
              {selectedUser.role === 'teacher' && (
                <div className="space-y-4">
                  <h5 className="font-semibold flex items-center gap-2">
                    <Briefcase size={16} />
                    Professional Information
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-dark-muted">Category:</span>
                      <p className="font-medium">{selectedUser.category || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-dark-muted">Experience:</span>
                      <p className="font-medium">{selectedUser.experience || 0} years</p>
                    </div>
                    <div>
                      <span className="text-dark-muted">Rating:</span>
                      <p className="font-medium">{selectedUser.rating || 0}/5</p>
                    </div>
                    <div>
                      <span className="text-dark-muted">Students:</span>
                      <p className="font-medium">{selectedUser.studentsCount || 0}</p>
                    </div>
                  </div>
                  {selectedUser.qualifications && selectedUser.qualifications.length > 0 && (
                    <div>
                      <span className="text-dark-muted">Qualifications:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedUser.qualifications.map((qual, index) => (
                          <span key={index} className="badge badge-info text-xs">
                            {qual}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedUser.role === 'student' && (
                <div className="space-y-4">
                  <h5 className="font-semibold flex items-center gap-2">
                    <BookOpen size={16} />
                    Academic Information
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-dark-muted">Grade:</span>
                      <p className="font-medium">{selectedUser.grade || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-dark-muted">Classes:</span>
                      <p className="font-medium">{selectedUser.classesCount || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bio */}
              {selectedUser.bio && (
                <div className="space-y-4">
                  <h5 className="font-semibold flex items-center gap-2">
                    <User size={16} />
                    About
                  </h5>
                  <p className="text-sm text-dark-muted">{selectedUser.bio}</p>
                </div>
              )}
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
                  Are you sure you want to remove <span className="font-semibold text-dark">{userToDelete.fullName}</span> from the database? This action cannot be undone.
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
                   Are you sure you want to {userToBlock.status === 'inactive' ? 'unblock' : 'block'} <span className="font-semibold text-dark">{userToBlock.fullName}</span>?
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
    </div>
  );
};

export default UserManagement;

import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, User, Calendar, Clock, RefreshCw, AlertCircle, DollarSign, MapPin, CheckCircle, XCircle } from 'lucide-react';
import apiService from '../services/api';

const CreateClassData = () => {
  const [activeTab, setActiveTab] = useState('tuitions');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tuitions, setTuitions] = useState([]);
  const [publishedSubjects, setPublishedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingSubjectId, setUpdatingSubjectId] = useState(null);
  const [stats, setStats] = useState({
    published: { total: 0, pending: 0, approved: 0, rejected: 0 },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tuitionsResponse, publishedResponse] = await Promise.all([
        apiService.getAllSubjects(),
        apiService.getPublishedSubjects()
      ]);
      
      if (tuitionsResponse.success) {
        setTuitions(tuitionsResponse.subjects || []);
      }
      
      if (publishedResponse.success) {
        setPublishedSubjects(publishedResponse.subjects || []);
        const normalizeStatus = (s) => s === 'accepted' ? 'approved' : s;
        setStats(prev => ({
          ...prev,
          published: {
            total: publishedResponse.total || 0,
            pending: (publishedResponse.subjects || []).filter(s => normalizeStatus(s.status) === 'pending').length,
            approved: (publishedResponse.subjects || []).filter(s => normalizeStatus(s.status) === 'approved').length,
            rejected: (publishedResponse.subjects || []).filter(s => normalizeStatus(s.status) === 'rejected').length,
          }
        }));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (subjectId, newStatus) => {
    try {
      setUpdatingSubjectId(subjectId);
      const result = await apiService.updateSubjectStatus(subjectId, newStatus);
      if (result.success) {
        fetchData();
      }
    } catch (err) {
      console.error('Error updating subject status:', err);
    } finally {
      setUpdatingSubjectId(null);
    }
  };

  const filteredTuitions = tuitions.filter(subject => {
    const matchesSearch = 
      (subject.subject_title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (subject.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (subject.teacher_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (subject.teacher_email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (subject.class_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
       (subject.board?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const filteredPublished = publishedSubjects.filter(subject => {
    const matchesSearch =
      (subject.subject_title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (subject.teacher_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (subject.teacher_email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (subject.class_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (subject.board?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const normalizedStatus = subject.status === 'accepted' ? 'approved' : subject.status;
    const matchesStatus = statusFilter === 'all' || normalizedStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const normalizedStatus = status === 'accepted' ? 'approved' : status;
    const statusStyles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    const statusIcons = {
      pending: <Clock size={14} />,
      approved: <CheckCircle size={14} />,
      rejected: <XCircle size={14} />,
    };

    const displayStatus = normalizedStatus === 'approved' ? 'Accepted' : normalizedStatus === 'rejected' ? 'Rejected' : 'Pending';

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${statusStyles[normalizedStatus] || statusStyles.pending}`}>
        {statusIcons[normalizedStatus] || statusIcons.pending}
        {displayStatus}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-primary-500" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="text-red-500" size={48} />
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Create Class Data</h2>
          <p className="text-dark-muted mt-1">View all classes/subjects created by teachers</p>
        </div>
        <button
          onClick={fetchData}
          className="p-2 hover:bg-dark-border rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw className="text-dark-muted" size={20} />
        </button>
      </div>

      {/* Tuitions Tab */}
      {activeTab === 'tuitions' && (
        <>
          {/* Filters */}
          <div className="glass-card rounded-xl p-4 border border-dark-border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={20} />
                <input
                  type="text"
                  placeholder="Search by subject, skill, teacher, class, board, or university..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field w-full pl-10"
                />
              </div>
            </div>
          </div>

           {/* Tuitions Table */}
           <div className="glass-card rounded-xl border border-dark-border overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full">
                 <thead>
                   <tr className="border-b border-dark-border bg-dark-border/30">
                     <th className="text-left p-4 text-dark-muted font-medium">Subject</th>
                     <th className="text-left p-4 text-dark-muted font-medium">Teacher</th>
                    <th className="text-left p-4 text-dark-muted font-medium">Board/Class</th>
                     <th className="text-left p-4 text-dark-muted font-medium">Status</th>
                     <th className="text-left p-4 text-dark-muted font-medium">Created</th>
                   </tr>
                 </thead>
                 <tbody>
                   {filteredTuitions.length === 0 ? (
                     <tr>
                      <td colSpan={5} className="p-8 text-center text-dark-muted">
                          No subjects found
                        </td>
                      </tr>
                    ) : (
                      filteredTuitions.map((subject) => {
                       const isSkill = subject.teaching_category === 'Skill Teacher' || subject.teaching_category === 'Skill teacher';
                       const isUniversity = subject.board?.toLowerCase().includes('university');
                       
                       return (
                         <tr key={subject.subject_id} className="border-b border-dark-border hover:bg-dark-border/20 transition-colors">
                           <td className="p-4">
                             <div className="flex items-start gap-3">
                               <div className={`w-10 h-10 rounded-lg ${isSkill ? 'bg-purple-500/20' : 'bg-primary-500/20'} flex items-center justify-center flex-shrink-0`}>
                                 {isSkill ? (
                                   <User className="text-purple-500" size={20} />
                                 ) : (
                                   <BookOpen className="text-primary-500" size={20} />
                                 )}
                               </div>
                               <div>
                                 <p className="font-medium text-white">{subject.subject_title || 'Untitled Subject'}</p>
                                 <p className="text-sm text-dark-muted mt-1 line-clamp-2">
                                   {subject.description || 'No description'}
                                 </p>
                               </div>
                             </div>
                           </td>
                           <td className="p-4">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
                                 {subject.teacher_name?.charAt(0)?.toUpperCase() || 'T'}
                               </div>
                               <div>
                                 <p className="font-medium text-white">{subject.teacher_name || 'Unknown'}</p>
                                 <p className="text-sm text-dark-muted">{subject.teacher_email || ''}</p>
                               </div>
                             </div>
                           </td>
                            <td className="p-4">
                              <div>
                                {isSkill ? (
                                  <p className="text-sm text-white">{subject.class_category || '-'}</p>
                                ) : isUniversity ? (
                                 <>
                                   <p className="text-sm text-white">{subject.board || '-'}</p>
                                 </>
                               ) : (
                                 <>
                                   <p className="text-sm text-white">{subject.class_name || '-'}</p>
                                   <p className="text-xs text-dark-muted">{subject.board || '-'}</p>
                                 </>
                               )}
                             </div>
                           </td>
                           <td className="p-4">
                             {subject.status === 'pending' ? (
                               <div className="flex items-center gap-2">
                                 {getStatusBadge(subject.status)}
                                 <button
                                   onClick={() => handleStatusUpdate(subject.subject_id, 'accepted')}
                                   disabled={updatingSubjectId === subject.subject_id}
                                   className="p-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors disabled:opacity-50"
                                   title="Accept"
                                 >
                                   <CheckCircle size={14} />
                                 </button>
                                 <button
                                   onClick={() => handleStatusUpdate(subject.subject_id, 'rejected')}
                                   disabled={updatingSubjectId === subject.subject_id}
                                   className="p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                   title="Reject"
                                 >
                                   <XCircle size={14} />
                                 </button>
                               </div>
                             ) : (
                               <div className="flex items-center gap-2">
                                 {getStatusBadge(subject.status)}
                                 {subject.status !== 'accepted' && (
                                   <button
                                     onClick={() => handleStatusUpdate(subject.subject_id, 'accepted')}
                                     disabled={updatingSubjectId === subject.subject_id}
                                     className="p-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors disabled:opacity-50"
                                     title="Accept"
                                   >
                                     <CheckCircle size={14} />
                                   </button>
                                 )}
                                 {subject.status !== 'rejected' && (
                                   <button
                                     onClick={() => handleStatusUpdate(subject.subject_id, 'rejected')}
                                     disabled={updatingSubjectId === subject.subject_id}
                                     className="p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                     title="Reject"
                                   >
                                     <XCircle size={14} />
                                   </button>
                                 )}
                               </div>
                             )}
                           </td>
                           <td className="p-4">
                             <div className="flex items-center gap-2 text-dark-muted text-sm">
                               <Calendar size={16} />
                               {subject.created_at ? new Date(subject.created_at).toLocaleDateString() : 'N/A'}
                             </div>
                           </td>
                         </tr>
                       );
                     })
                   )}
                 </tbody>
               </table>
             </div>
           </div>
        </>
      )}

      {/* Published Subjects Tab */}
      {activeTab === 'published' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card rounded-xl p-6 border border-dark-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-muted text-sm">Total Subjects</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.published.total}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center">
                  <BookOpen className="text-primary-500" size={24} />
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 border border-dark-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-muted text-sm">Pending</p>
                  <p className="text-3xl font-bold text-yellow-400 mt-1">{stats.published.pending}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="text-yellow-500" size={24} />
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 border border-dark-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-muted text-sm">Approved</p>
                  <p className="text-3xl font-bold text-green-400 mt-1">{stats.published.approved}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="text-green-500" size={24} />
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 border border-dark-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-muted text-sm">Rejected</p>
                  <p className="text-3xl font-bold text-red-400 mt-1">{stats.published.rejected}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <XCircle className="text-red-500" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="glass-card rounded-xl p-4 border border-dark-border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={20} />
                <input
                  type="text"
                  placeholder="Search by subject, teacher, class, or board..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field w-full pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Published Subjects Table */}
          <div className="glass-card rounded-xl border border-dark-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border bg-dark-border/30">
                    <th className="text-left p-4 text-dark-muted font-medium">Subject</th>
                    <th className="text-left p-4 text-dark-muted font-medium">Teacher</th>
                    <th className="text-left p-4 text-dark-muted font-medium">Class/Board</th>
                    <th className="text-left p-4 text-dark-muted font-medium">Status</th>
                    <th className="text-left p-4 text-dark-muted font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPublished.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-dark-muted">
                        No subjects found
                      </td>
                    </tr>
                  ) : (
                    filteredPublished.map((subject) => {
                      const isSkill = subject.teaching_category === 'Skill Teacher' || subject.teaching_category === 'Skill teacher';
                      const isUniversity = subject.board?.toLowerCase().includes('university');
                      const boardParts = subject.board?.split(' - ') || [];
                      const universityName = isUniversity ? boardParts[0] : null;
                      const boardName = isUniversity ? boardParts[1] || subject.board : subject.board;
                      
                      return (
                        <tr key={subject.subject_id} className="border-b border-dark-border hover:bg-dark-border/20 transition-colors">
                          <td className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg ${isSkill ? 'bg-purple-500/20' : 'bg-primary-500/20'} flex items-center justify-center flex-shrink-0`}>
                                {isSkill ? (
                                  <User className="text-purple-500" size={20} />
                                ) : (
                                  <BookOpen className="text-primary-500" size={20} />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-white">{subject.subject_title || 'Untitled'}</p>
                                <p className="text-sm text-dark-muted mt-1 line-clamp-2">
                                  {subject.description || 'No description'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {subject.teacher_profilepic ? (
                                <img
                                  src={subject.teacher_profilepic}
                                  alt={subject.teacher_name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
                                  {subject.teacher_name?.charAt(0)?.toUpperCase() || 'T'}
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-white">{subject.teacher_name || 'Unknown'}</p>
                                <p className="text-sm text-dark-muted">{subject.teacher_email || ''}</p>
                              </div>
                            </div>
                          </td>
                            <td className="p-4">
                              <div>
                                {isSkill ? (
                                <p className="text-sm text-white">{subject.class_category || '-'}</p>
                              ) : isUniversity ? (
                                <>
                                  <p className="text-sm text-white">{universityName || '-'}</p>
                                  <p className="text-xs text-dark-muted">Year: {subject.class_name || '-'}</p>
                                </>
                              ) : (
                                <>
                                  <p className="text-sm text-white">{subject.class_name || '-'}</p>
                                  <p className="text-xs text-dark-muted">{boardName || '-'}</p>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            {subject.status === 'pending' ? (
                              <div className="flex items-center gap-2">
                                {getStatusBadge(subject.status)}
                                <button
                                  onClick={() => handleStatusUpdate(subject.subject_id, 'accepted')}
                                  disabled={updatingSubjectId === subject.subject_id}
                                  className="p-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors disabled:opacity-50"
                                  title="Accept"
                                >
                                  <CheckCircle size={14} />
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(subject.subject_id, 'rejected')}
                                  disabled={updatingSubjectId === subject.subject_id}
                                  className="p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                  title="Reject"
                                >
                                  <XCircle size={14} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                {getStatusBadge(subject.status)}
                                {subject.status !== 'accepted' && (
                                  <button
                                    onClick={() => handleStatusUpdate(subject.subject_id, 'accepted')}
                                    disabled={updatingSubjectId === subject.subject_id}
                                    className="p-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors disabled:opacity-50"
                                    title="Accept"
                                  >
                                    <CheckCircle size={14} />
                                  </button>
                                )}
                                {subject.status !== 'rejected' && (
                                  <button
                                    onClick={() => handleStatusUpdate(subject.subject_id, 'rejected')}
                                    disabled={updatingSubjectId === subject.subject_id}
                                    className="p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                    title="Reject"
                                  >
                                    <XCircle size={14} />
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-dark-muted text-sm">
                              <Calendar size={16} />
                              {subject.created_at ? new Date(subject.created_at).toLocaleDateString() : 'N/A'}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateClassData;

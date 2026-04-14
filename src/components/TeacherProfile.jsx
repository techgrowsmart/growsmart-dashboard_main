import { useState } from 'react';
import { Search, Filter, FileText, User, CreditCard, GraduationCap, Camera, CheckCircle, XCircle, MoreVertical, Eye, Download, Calendar, Phone, Mail, MapPin, Briefcase, Clock } from 'lucide-react';

const TeacherProfile = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [documentStatuses, setDocumentStatuses] = useState({});

  const documentOptions = {
    bankAccount: [
      'Pending Review',
      'Account Number Verified',
      'IFSC Verified',
      'Name Match Confirmed',
      'Bank Details Incomplete',
      'Invalid IFSC Code',
      'Name Mismatch',
      'Re-upload Required',
      'Approved',
      'Rejected'
    ],
    panCard: [
      'Pending Review',
      'PAN Number Verified',
      'Name Verified',
      'Document Blur / Unclear',
      'Invalid PAN Format',
      'Name Mismatch',
      'Expired / Invalid Document',
      'Re-upload Required',
      'Approved',
      'Rejected'
    ],
    aadharCard: [
      'Pending Review',
      'Aadhaar Number Verified',
      'Name & DOB Verified',
      'Address Verified',
      'Document Blur / Unclear',
      'Invalid Aadhaar Number',
      'Name Mismatch',
      'Re-upload Required',
      'Approved',
      'Rejected'
    ],
    kycSelfie: [
      'Pending Review',
      'Face Match Verified',
      'Aadhaar Match Verified',
      'Selfie Blur',
      'Face Mismatch',
      'Low Image Quality',
      'Re-upload Required',
      'Approved',
      'Rejected'
    ],
    degree: [
      'Pending Review',
      'Certificate Verified',
      'University Verified',
      'Passing Year Verified',
      'Degree Name Verified',
      'Invalid Certificate',
      'Name Mismatch',
      'Duplicate Upload',
      'Re-upload Required',
      'Approved',
      'Rejected'
    ]
  };

  const teachers = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@university.edu',
      phone: '+91 98765 43210',
      address: '123, Education Lane, New Delhi, India',
      qualification: 'Ph.D. in Computer Science',
      experience: '12 years',
      specialization: 'Machine Learning, AI',
      university: 'IIT Delhi',
      status: 'Pending',
      appliedDate: '2024-04-10',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      documents: {
        bankAccount: {
          accountNumber: 'XXXX XXXX 1234',
          bankName: 'State Bank of India',
          ifscCode: 'SBIN0001234',
          accountType: 'Savings',
          documentUrl: '#'
        },
        panCard: {
          panNumber: 'ABCDE1234F',
          name: 'RAJESH KUMAR',
          documentUrl: '#'
        },
        aadharCard: {
          aadharNumber: 'XXXX XXXX XXXX',
          documentUrl: '#'
        },
        degrees: [
          { name: 'Ph.D. Computer Science', university: 'IIT Delhi', year: '2012', documentUrl: '#' },
          { name: 'M.Tech Computer Science', university: 'IIT Bombay', year: '2008', documentUrl: '#' },
          { name: 'B.Tech Computer Science', university: 'IIT Madras', year: '2006', documentUrl: '#' }
        ],
        kycSelfie: {
          documentUrl: '#'
        }
      }
    },
    {
      id: 2,
      name: 'Prof. Priya Sharma',
      email: 'priya.sharma@college.edu',
      phone: '+91 87654 32109',
      address: '456, Knowledge Park, Mumbai, India',
      qualification: 'M.Tech in Data Science',
      experience: '8 years',
      specialization: 'Data Analytics, Python',
      university: 'BITS Pilani',
      status: 'Pending',
      appliedDate: '2024-04-08',
      profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      documents: {
        bankAccount: {
          accountNumber: 'XXXX XXXX 5678',
          bankName: 'HDFC Bank',
          ifscCode: 'HDFC0005678',
          accountType: 'Current',
          documentUrl: '#'
        },
        panCard: {
          panNumber: 'FGHIJ5678K',
          name: 'PRIYA SHARMA',
          documentUrl: '#'
        },
        aadharCard: {
          aadharNumber: 'XXXX XXXX XXXX',
          documentUrl: '#'
        },
        degrees: [
          { name: 'M.Tech Data Science', university: 'BITS Pilani', year: '2016', documentUrl: '#' },
          { name: 'B.Tech Computer Science', university: 'DTU', year: '2014', documentUrl: '#' }
        ],
        kycSelfie: {
          documentUrl: '#'
        }
      }
    },
    {
      id: 3,
      name: 'Dr. Amit Patel',
      email: 'amit.patel@institute.edu',
      phone: '+91 76543 21098',
      address: '789, Academic Street, Bangalore, India',
      qualification: 'Ph.D. in Mathematics',
      experience: '15 years',
      specialization: 'Statistics, Calculus',
      university: 'IISc Bangalore',
      status: 'Approved',
      appliedDate: '2024-04-05',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      documents: {
        bankAccount: {
          accountNumber: 'XXXX XXXX 9012',
          bankName: 'ICICI Bank',
          ifscCode: 'ICIC0009012',
          accountType: 'Savings',
          documentUrl: '#'
        },
        panCard: {
          panNumber: 'KLMNO9012P',
          name: 'AMIT PATEL',
          documentUrl: '#'
        },
        aadharCard: {
          aadharNumber: 'XXXX XXXX XXXX',
          documentUrl: '#'
        },
        degrees: [
          { name: 'Ph.D. Mathematics', university: 'IISc Bangalore', year: '2009', documentUrl: '#' },
          { name: 'M.Sc Mathematics', university: 'IIT Delhi', year: '2005', documentUrl: '#' }
        ],
        kycSelfie: {
          documentUrl: '#'
        }
      }
    },
    {
      id: 4,
      name: 'Ms. Sunita Reddy',
      email: 'sunita.reddy@school.edu',
      phone: '+91 65432 10987',
      address: '321, Teaching Road, Hyderabad, India',
      qualification: 'M.A. in English',
      experience: '5 years',
      specialization: 'English Literature, Communication',
      university: 'University of Hyderabad',
      status: 'Rejected',
      appliedDate: '2024-04-03',
      profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
      documents: {
        bankAccount: {
          accountNumber: 'XXXX XXXX 3456',
          bankName: 'Axis Bank',
          ifscCode: 'UTIB0003456',
          accountType: 'Savings',
          documentUrl: '#'
        },
        panCard: {
          panNumber: 'QRSTU3456V',
          name: 'SUNITA REDDY',
          documentUrl: '#'
        },
        aadharCard: {
          aadharNumber: 'XXXX XXXX XXXX',
          documentUrl: '#'
        },
        degrees: [
          { name: 'M.A. English', university: 'University of Hyderabad', year: '2019', documentUrl: '#' },
          { name: 'B.A. English', university: 'Osmania University', year: '2017', documentUrl: '#' }
        ],
        kycSelfie: {
          documentUrl: '#'
        }
      }
    },
    {
      id: 5,
      name: 'Dr. Vikram Singh',
      email: 'vikram.singh@college.edu',
      phone: '+91 54321 09876',
      address: '654, Professor Lane, Chennai, India',
      qualification: 'Ph.D. in Physics',
      experience: '10 years',
      specialization: 'Quantum Mechanics, Thermodynamics',
      university: 'IIT Madras',
      status: 'Pending',
      appliedDate: '2024-04-12',
      profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      documents: {
        bankAccount: {
          accountNumber: 'XXXX XXXX 7890',
          bankName: 'Bank of Baroda',
          ifscCode: 'BARB0007890',
          accountType: 'Savings',
          documentUrl: '#'
        },
        panCard: {
          panNumber: 'VWXYZ7890A',
          name: 'VIKRAM SINGH',
          documentUrl: '#'
        },
        aadharCard: {
          aadharNumber: 'XXXX XXXX XXXX',
          documentUrl: '#'
        },
        degrees: [
          { name: 'Ph.D. Physics', university: 'IIT Madras', year: '2014', documentUrl: '#' },
          { name: 'M.Sc Physics', university: 'IIT Kanpur', year: '2010', documentUrl: '#' },
          { name: 'B.Sc Physics', university: 'Delhi University', year: '2008', documentUrl: '#' }
        ],
        kycSelfie: {
          documentUrl: '#'
        }
      }
    },
  ];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || teacher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const badges = {
      Pending: 'badge-warning',
      Approved: 'badge-success',
      Rejected: 'badge-danger',
    };
    return badges[status] || 'badge-info';
  };

  const handleStatusChange = (teacherId, newStatus) => {
    // In a real app, this would make an API call
    console.log(`Teacher ${teacherId} status changed to ${newStatus}`);
    setSelectedTeacher(null);
    setShowDetailModal(false);
  };

  const handleDocumentStatusChange = (docType, newStatus) => {
    setDocumentStatuses(prev => ({
      ...prev,
      [docType]: newStatus
    }));
    console.log(`Document ${docType} status changed to ${newStatus}`);
  };

  const openDetailModal = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDetailModal(true);
  };

  const DocumentViewer = ({ title, icon: Icon, data, fields, docType, options }) => (
    <div className="glass-card p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-500/20 text-primary-400">
            <Icon size={20} />
          </div>
          <h4 className="font-semibold">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge ${documentStatuses[docType] === 'Approved' ? 'badge-success' : documentStatuses[docType] === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
            {documentStatuses[docType] || 'Pending Review'}
          </span>
        </div>
      </div>
      {fields.map((field, index) => (
        <div key={index} className="flex justify-between py-2 border-b border-dark-border last:border-0">
          <span className="text-dark-muted">{field.label}</span>
          <span className="font-medium">{field.value}</span>
        </div>
      ))}
      <div className="flex flex-col gap-3 mt-3">
        <div className="flex gap-2">
          <button className="btn-secondary text-xs flex items-center gap-2">
            <Eye size={14} />
            View Document
          </button>
          <button className="btn-secondary text-xs flex items-center gap-2">
            <Download size={14} />
            Download
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-dark-muted">Verification Status:</label>
          <select
            value={documentStatuses[docType] || 'Pending Review'}
            onChange={(e) => handleDocumentStatusChange(docType, e.target.value)}
            className="input-field text-xs py-1"
          >
            {options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Teacher Profile Management</h2>
          <p className="text-dark-muted mt-1">Review and manage teacher applications</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">Export Data</button>
          <button className="btn-primary">+ Manual Add</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', value: teachers.length, icon: User, color: 'primary' },
          { label: 'Pending Review', value: teachers.filter(t => t.status === 'Pending').length, icon: Clock, color: 'yellow' },
          { label: 'Approved', value: teachers.filter(t => t.status === 'Approved').length, icon: CheckCircle, color: 'green' },
          { label: 'Rejected', value: teachers.filter(t => t.status === 'Rejected').length, icon: XCircle, color: 'red' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card p-4 glass-card-hover">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-${stat.color}-500/20 text-${stat.color}-400`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-dark-muted">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={20} />
            <input
              type="text"
              placeholder="Search teachers by name or email..."
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
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teacher Applications Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Actions</th>
                <th>Qualification</th>
                <th>Experience</th>
                <th>Specialization</th>
                <th>Applied Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-dark-border/50 transition-colors">
                  <td>
                    <div className="flex items-center gap-3">
                      <img 
                        src={teacher.profilePicture} 
                        alt={teacher.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold">{teacher.name}</p>
                        <p className="text-xs text-dark-muted">{teacher.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <button 
                      onClick={() => openDetailModal(teacher)}
                      className="btn-primary text-sm font-bold px-4 py-2"
                    >
                      Take Action
                    </button>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <p className="font-medium">{teacher.qualification}</p>
                      <p className="text-xs text-dark-muted">{teacher.university}</p>
                    </div>
                  </td>
                  <td>{teacher.experience}</td>
                  <td>{teacher.specialization}</td>
                  <td>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={14} className="text-dark-muted" />
                      {teacher.appliedDate}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(teacher.status)}`}>{teacher.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-dark-muted">Showing {filteredTeachers.length} of {teachers.length} applications</p>
          <div className="flex gap-2">
            <button className="btn-secondary px-3">Previous</button>
            <button className="btn-primary px-3">Next</button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin animate-fade-in">
            <div className="sticky top-0 glass-card border-b border-dark-border p-6 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold">Teacher Application Details</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-dark-border rounded-lg transition-colors"
              >
                <XCircle size={20} className="text-dark-muted" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Action Buttons - Moved to top for immediate visibility */}
              <div className="flex flex-col gap-6 pb-6 border-b-2 border-dark-border">
                <div>
                  <label className="block text-sm font-medium mb-2">Application Status</label>
                  <select
                    value={selectedTeacher.status}
                    onChange={(e) => handleStatusChange(selectedTeacher.id, e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="Pending">Pending Review</option>
                    <option value="Approved">Approve Application</option>
                    <option value="Rejected">Reject Application</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleStatusChange(selectedTeacher.id, 'Approved')}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg shadow-green-500/50 hover:shadow-green-500/70 transition-all duration-300 transform hover:scale-105 border-2 border-green-400/30"
                  >
                    <CheckCircle size={24} />
                    Approve
                  </button>
                  <button 
                    onClick={() => handleStatusChange(selectedTeacher.id, 'Rejected')}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl shadow-lg shadow-red-500/50 hover:shadow-red-500/70 transition-all duration-300 transform hover:scale-105 border-2 border-red-400/30"
                  >
                    <XCircle size={24} />
                    Reject
                  </button>
                </div>
              </div>

              {/* Profile Header */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <img 
                  src={selectedTeacher.profilePicture} 
                  alt={selectedTeacher.name}
                  className="w-32 h-32 rounded-2xl object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-2xl font-bold">{selectedTeacher.name}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={16} className="text-dark-muted" />
                      {selectedTeacher.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={16} className="text-dark-muted" />
                      {selectedTeacher.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} className="text-dark-muted" />
                      {selectedTeacher.address}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap size={16} className="text-dark-muted" />
                      {selectedTeacher.qualification}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase size={16} className="text-dark-muted" />
                      {selectedTeacher.experience} experience
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-dark-muted" />
                      Applied: {selectedTeacher.appliedDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-primary-400" />
                  Submitted Documents
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bank Account */}
                  <DocumentViewer
                    title="Bank Account Details"
                    icon={CreditCard}
                    docType="bankAccount"
                    options={documentOptions.bankAccount}
                    fields={[
                      { label: 'Account Number', value: selectedTeacher.documents.bankAccount.accountNumber },
                      { label: 'Bank Name', value: selectedTeacher.documents.bankAccount.bankName },
                      { label: 'IFSC Code', value: selectedTeacher.documents.bankAccount.ifscCode },
                      { label: 'Account Type', value: selectedTeacher.documents.bankAccount.accountType },
                    ]}
                  />

                  {/* PAN Card */}
                  <DocumentViewer
                    title="PAN Card"
                    icon={FileText}
                    docType="panCard"
                    options={documentOptions.panCard}
                    fields={[
                      { label: 'PAN Number', value: selectedTeacher.documents.panCard.panNumber },
                      { label: 'Name as per PAN', value: selectedTeacher.documents.panCard.name },
                    ]}
                  />

                  {/* Aadhar Card */}
                  <DocumentViewer
                    title="Aadhar Card"
                    icon={FileText}
                    docType="aadharCard"
                    options={documentOptions.aadharCard}
                    fields={[
                      { label: 'Aadhar Number', value: selectedTeacher.documents.aadharCard.aadharNumber },
                    ]}
                  />

                  {/* KYC Selfie */}
                  <DocumentViewer
                    title="KYC Selfie with Aadhar"
                    icon={Camera}
                    docType="kycSelfie"
                    options={documentOptions.kycSelfie}
                    fields={[
                      { label: 'Document Type', value: 'Selfie with Aadhar Card' },
                      { label: 'Status', value: 'Uploaded' },
                    ]}
                  />
                </div>

                {/* Degrees */}
                <div className="glass-card p-4 mt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-accent-500/20 text-accent-400">
                      <GraduationCap size={20} />
                    </div>
                    <h4 className="font-semibold">Degree Certificates</h4>
                  </div>
                  <div className="space-y-3">
                    {selectedTeacher.documents.degrees.map((degree, index) => (
                      <div key={index} className="p-3 rounded-xl bg-dark-bg/50 border border-dark-border">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{degree.name}</p>
                            <p className="text-sm text-dark-muted">{degree.university}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="badge badge-info">{degree.year}</span>
                            <span className={`badge ${documentStatuses[`degree_${index}`] === 'Approved' ? 'badge-success' : documentStatuses[`degree_${index}`] === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                              {documentStatuses[`degree_${index}`] || 'Pending Review'}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                          <div className="flex gap-2">
                            <button className="btn-secondary text-xs flex items-center gap-2">
                              <Eye size={14} />
                              View Certificate
                            </button>
                            <button className="btn-secondary text-xs flex items-center gap-2">
                              <Download size={14} />
                              Download
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-dark-muted">Verification Status:</label>
                            <select
                              value={documentStatuses[`degree_${index}`] || 'Pending Review'}
                              onChange={(e) => handleDocumentStatusChange(`degree_${index}`, e.target.value)}
                              className="input-field text-xs py-1"
                            >
                              {documentOptions.degree.map((option, optIndex) => (
                                <option key={optIndex} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;

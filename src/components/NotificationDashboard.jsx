import { useState, useEffect } from 'react';
import { Bell, Send, X, Search, Filter, User, Clock, CheckCircle, AlertTriangle, Info, Trash2, RefreshCw, MessageSquare } from 'lucide-react';
import apiService from '../services/api';

const NotificationDashboard = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [targetUserEmail, setTargetUserEmail] = useState('');
  const [specificEmail, setSpecificEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [senderName, setSenderName] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminNotifications();
      if (response.success) {
        setNotifications(response.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await apiService.getAdminUnreadCount();
      if (response.success) {
        setUnreadCount(response.count || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const sendNotification = async () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    if (!senderName.trim()) {
      alert('Please enter sender name');
      return;
    }

    const target = specificEmail.trim() || targetUserEmail;

    if (!target) {
      alert('Please select a target or enter a specific email');
      return;
    }

    try {
      setSending(true);
      const response = await apiService.sendNotification({
        message,
        target_user_email: target,
        sender_name: senderName
      });

      if (response.success) {
        alert('Notification sent successfully');
        setMessage('');
        setTargetUserEmail('');
        setSpecificEmail('');
        setSenderName('');
        fetchNotifications();
      } else {
        alert('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await apiService.markNotificationAsRead(notificationId);
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                          (filterStatus === 'unread' && !notification.is_read) ||
                          (filterStatus === 'read' && notification.is_read);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-dark-border rounded-lg transition-colors">
            <X size={20} className="text-dark-muted" />
          </button>
          <div>
            <h2 className="text-2xl font-bold">Notification Dashboard</h2>
            <p className="text-dark-muted mt-1">Send and manage notifications</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-info">{unreadCount} unread</span>
          <button onClick={fetchNotifications} className="btn-secondary flex items-center gap-2">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Send Notification Section */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Send size={20} className="text-primary-400" />
          Send New Notification
        </h3>
        <div className="space-y-4">
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
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your notification message..."
              className="input-field w-full h-32 resize-none"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Broadcast Target</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTargetUserEmail('ALL')}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${targetUserEmail === 'ALL' ? 'bg-primary-500 text-white border-primary-500' : 'border-dark-border text-dark-muted hover:border-primary-400'}`}
              >
                All Users
              </button>
              <button
                type="button"
                onClick={() => setTargetUserEmail('ALL_TEACHERS')}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${targetUserEmail === 'ALL_TEACHERS' ? 'bg-primary-500 text-white border-primary-500' : 'border-dark-border text-dark-muted hover:border-primary-400'}`}
              >
                All Teachers
              </button>
              <button
                type="button"
                onClick={() => setTargetUserEmail('ALL_STUDENTS')}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${targetUserEmail === 'ALL_STUDENTS' ? 'bg-primary-500 text-white border-primary-500' : 'border-dark-border text-dark-muted hover:border-primary-400'}`}
              >
                All Students
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Or send to a specific email</label>
            <input
              type="email"
              value={specificEmail}
              onChange={(e) => setSpecificEmail(e.target.value)}
              placeholder="Enter email address..."
              className="input-field w-full"
            />
          </div>
        </div>
        <button
          onClick={sendNotification}
          disabled={sending}
          className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
        >
          {sending ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
          {sending ? 'Sending...' : 'Send Notification'}
        </button>
      </div>

    </div>
  );
};

export default NotificationDashboard;

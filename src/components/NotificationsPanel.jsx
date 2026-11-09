import { Bell, AlertTriangle, Info, CheckCircle, X, CreditCard, User, Settings, MessageSquare, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

const NotificationsPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [pendingActions, setPendingActions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // TODO: Replace with actual API calls
      // fetchNotifications();
      // fetchPendingActions();
      // fetchAnnouncements();
      setLoading(false);
    }
  }, [isOpen]);

  const getIconColor = (color) => {
    const colors = {
      red: 'bg-red-500/20 text-red-400',
      green: 'bg-green-500/20 text-green-400',
      primary: 'bg-primary-500/20 text-primary-400',
      blue: 'bg-blue-500/20 text-blue-400',
      yellow: 'bg-yellow-500/20 text-yellow-400',
      purple: 'bg-purple-500/20 text-purple-400',
    };
    return colors[color] || 'bg-gray-500/20 text-gray-400';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      High: 'badge-danger',
      Medium: 'badge-warning',
      Low: 'badge-info',
    };
    return badges[priority] || 'badge-info';
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 glass-card border-l border-dark-border z-50 animate-slide-in overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-full sm:w-96 glass-card border-l border-dark-border z-50 animate-slide-in overflow-y-auto scrollbar-thin">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-dark-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-500/20 text-primary-400">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Notifications</h3>
              <p className="text-xs text-dark-muted">{notifications.length} new notifications</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-dark-border rounded-lg transition-colors"
          >
            <X size={20} className="text-dark-muted" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Pending Actions */}
          <div className="p-4 border-b border-dark-border">
            <h4 className="text-sm font-semibold text-dark-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock size={14} />
              Pending Actions
            </h4>
            <div className="space-y-3">
              {pendingActions.length === 0 ? (
                <div className="text-center py-8 text-dark-muted">
                  <p>No pending actions</p>
                </div>
              ) : (
                pendingActions.map((action) => (
                  <div key={action.id} className="p-3 rounded-xl bg-dark-bg/50 border border-dark-border hover:border-primary-500/30 transition-all duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-sm">{action.title}</h5>
                      <span className={`badge ${getPriorityBadge(action.priority)}`}>{action.priority}</span>
                    </div>
                    <p className="text-xs text-dark-muted">{action.description}</p>
                    <div className="flex gap-2 mt-3">
                      <button className="btn-primary text-xs px-3 py-1">Action</button>
                      <button className="btn-secondary text-xs px-3 py-1">Snooze</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Announcements */}
          <div className="p-4 border-b border-dark-border">
            <h4 className="text-sm font-semibold text-dark-muted uppercase tracking-wider mb-3">Announcements</h4>
            <div className="space-y-3">
              {announcements.length === 0 ? (
                <div className="text-center py-8 text-dark-muted">
                  <p>No announcements</p>
                </div>
              ) : (
                announcements.map((announcement) => (
                  <div key={announcement.id} className="p-3 rounded-xl bg-accent-500/10 border border-accent-500/30">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-sm text-accent-400">{announcement.title}</h5>
                      <span className="text-xs text-dark-muted">{announcement.date}</span>
                    </div>
                    <p className="text-xs text-dark-muted">{announcement.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="p-4">
            <h4 className="text-sm font-semibold text-dark-muted uppercase tracking-wider mb-3">Recent Alerts</h4>
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-dark-muted">
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                  <div 
                    key={notification.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-dark-bg/50 border border-dark-border hover:border-primary-500/30 transition-all duration-200 cursor-pointer"
                  >
                    <div className={`p-2 rounded-lg ${getIconColor(notification.color)} flex-shrink-0`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-sm truncate">{notification.title}</h5>
                      <p className="text-xs text-dark-muted line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-dark-muted mt-1 flex items-center gap-1">
                        <Clock size={10} />
                        {notification.time}
                      </p>
                    </div>
                  </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-dark-border">
          <button className="btn-secondary w-full text-sm">Mark All as Read</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;

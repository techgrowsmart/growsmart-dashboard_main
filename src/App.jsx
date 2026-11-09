import { useState } from 'react';
import { Menu, Bell, Search, User, ChevronDown, LogOut } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ExecutiveOverview from './components/ExecutiveOverview';
import UserManagement from './components/UserManagement';
import BusinessAnalytics from './components/BusinessAnalytics';
import OperationsDashboard from './components/OperationsDashboard';
import FinanceBilling from './components/FinanceBilling';
import NotificationDashboard from './components/NotificationDashboard';
import AdminActions from './components/AdminActions';
import CreateClassData from './components/CreateClassData';
import AdvertisementManagement from './components/AdvertisementManagement';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';

// Main App component with authentication
function AppContent() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <ExecutiveOverview />;
      case 'users':
        return <UserManagement />;
      case 'createClassData':
        return <CreateClassData />;
      case 'analytics':
        return <BusinessAnalytics />;
      case 'operations':
        return <OperationsDashboard />;
      case 'finance':
        return <FinanceBilling />;
      case 'advertisements':
        return <AdvertisementManagement />;
      case 'notifications':
        return <NotificationDashboard onClose={() => setActiveSection('overview')} />;
      case 'admin':
        return <AdminActions />;
      default:
        return <ExecutiveOverview />;
    }
  };

  const handleLogout = () => {
    setIsMobileOpen(false);
    setActiveSection('overview');
    logout();
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-dark-bg">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 glass-card border-b border-dark-border z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 hover:bg-dark-border rounded-lg transition-colors"
          >
            <Menu size={24} className="text-dark-text" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-bold text-gradient">GrowSmart</span>
          </div>
          <button
            onClick={() => setActiveSection('notifications')}
            className="p-2 hover:bg-dark-border rounded-lg transition-colors relative"
          >
            <Bell size={24} className="text-dark-text" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 h-screen overflow-hidden flex flex-col">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between p-6 border-b border-dark-border shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={20} />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="input-field w-80 pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveSection('notifications')}
                className="relative p-2 hover:bg-dark-border rounded-lg transition-colors"
              >
                <Bell size={20} className="text-dark-muted" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-dark-border">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="hidden md:block">
                  <p className="font-medium text-sm">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-dark-muted">{user?.role || 'Admin'}</p>
                </div>
                <ChevronDown size={16} className="text-dark-muted hidden md:block cursor-pointer" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 hover:bg-dark-border rounded-lg transition-colors ml-2"
                  title="Logout"
                >
                  <LogOut size={16} className="text-dark-muted" />
                </button>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-4 lg:p-6 pt-20 lg:pt-6 flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

// Main App wrapper with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

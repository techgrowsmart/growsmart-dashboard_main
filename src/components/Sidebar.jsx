import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  ClipboardList,
  DollarSign,
  Bell,
  Menu,
  X,
  Settings,
  LogOut,
  Shield,
  BookOpen,
  Megaphone
} from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection, isMobileOpen, setIsMobileOpen, onLogout }) => {
  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Executive Overview' },
    { id: 'users', icon: Users, label: 'User Management' },
    { id: 'createClassData', icon: BookOpen, label: 'Create Class Data' },
    { id: 'analytics', icon: BarChart3, label: 'Business Analytics' },
    { id: 'operations', icon: ClipboardList, label: 'Operations' },
    { id: 'finance', icon: DollarSign, label: 'Finance & Billing' },
    { id: 'advertisements', icon: Megaphone, label: 'Advertisement Mgmt' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full w-64 glass-card border-r border-dark-border z-50
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:fixed lg:z-30
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-dark-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center glow">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">GrowSmart</h1>
                <p className="text-xs text-dark-muted">Admin Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`sidebar-item w-full ${
                    activeSection === item.id 
                      ? 'sidebar-item-active' 
                      : 'sidebar-item-inactive'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="p-4 border-t border-dark-border space-y-2">
            <button className="sidebar-item sidebar-item-inactive w-full">
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsMobileOpen(false);
                onLogout?.();
              }}
              className="sidebar-item sidebar-item-inactive w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

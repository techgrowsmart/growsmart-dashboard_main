import { useState } from 'react';
import { User, Lock, AlertCircle, Eye, EyeOff, ShieldAlert, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnHoldModal, setShowOnHoldModal] = useState(false);
  
  const { login, error, accountStatus, onHoldMessage } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await login(email, password);
    
    if (!result.success) {
      setIsLoading(false);
      if (result.accountStatus === 'inactive' && result.onHoldMessage) {
        setShowOnHoldModal(true);
      }
    }
  };

  const closeOnHoldModal = () => {
    setShowOnHoldModal(false);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="font-bold text-2xl text-gradient">GrowSmart</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-dark-muted">Sign in to access the admin panel</p>
        </div>

        {/* Error Message */}
        {error && accountStatus !== 'inactive' && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-400" size={20} />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={import.meta.env.VITE_ADMIN_EMAIL || 'admin@gogrowsmart.com'}
                className="input-field w-full pl-10"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input-field w-full pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Credentials */}
 
      </div>

      {/* Account On Hold Modal */}
      {showOnHoldModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="text-red-400" size={24} />
                <h3 className="text-xl font-bold text-red-400">Account On Hold</h3>
              </div>
              <button
                onClick={closeOnHoldModal}
                className="p-1 hover:bg-dark-border rounded-lg transition-colors"
              >
                <X size={20} className="text-dark-muted" />
              </button>
            </div>
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-red-300 text-sm leading-relaxed">
                {onHoldMessage || 'due to some violations your account is on hold Try contacting admin of growsmart'}
              </p>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={closeOnHoldModal}
                className="btn-primary bg-red-500 hover:bg-red-600"
              >
                OK, I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

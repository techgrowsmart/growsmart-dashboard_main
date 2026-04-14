import { Users, TrendingUp, DollarSign, UserPlus, Percent, RefreshCw } from 'lucide-react';

const ExecutiveOverview = () => {
  const metrics = [
    {
      title: 'Total Users',
      value: '24,589',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'primary',
    },
    {
      title: 'Active Customers',
      value: '18,234',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'accent',
    },
    {
      title: 'New Sign-ups',
      value: '1,429',
      change: '+23.1%',
      trend: 'up',
      icon: UserPlus,
      color: 'green',
    },
    {
      title: 'Monthly Revenue',
      value: '$284,500',
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'yellow',
    },
    {
      title: 'Conversion Rate',
      value: '4.8%',
      change: '+0.5%',
      trend: 'up',
      icon: Percent,
      color: 'blue',
    },
    {
      title: 'Retention Rate',
      value: '92.4%',
      change: '+2.1%',
      trend: 'up',
      icon: RefreshCw,
      color: 'purple',
    },
    {
      title: 'Growth Rate',
      value: '34.2%',
      change: '+5.8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'pink',
    },
  ];

  const colorClasses = {
    primary: 'from-primary-500/20 to-primary-600/10 border-primary-500/30',
    accent: 'from-accent-500/20 to-accent-600/10 border-accent-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    pink: 'from-pink-500/20 to-pink-600/10 border-pink-500/30',
  };

  const iconColorClasses = {
    primary: 'bg-primary-500/20 text-primary-400',
    accent: 'bg-accent-500/20 text-accent-400',
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    pink: 'bg-pink-500/20 text-pink-400',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Executive Overview</h2>
          <p className="text-dark-muted mt-1">Key business metrics at a glance</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">Last 7 Days</button>
          <button className="btn-primary">Last 30 Days</button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className="metric-card glass-card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[metric.color]} opacity-50 rounded-2xl`} />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${iconColorClasses[metric.color]}`}>
                    <Icon size={24} />
                  </div>
                  <span className={`badge badge-success flex items-center gap-1`}>
                    {metric.change}
                  </span>
                </div>
                <h3 className="text-dark-muted text-sm font-medium mb-1">{metric.title}</h3>
                <p className="text-3xl font-bold">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
          <div className="space-y-4">
            {[
              { label: 'Revenue Growth', value: '23.4%', progress: 78 },
              { label: 'User Engagement', value: '89.2%', progress: 89 },
              { label: 'Customer Satisfaction', value: '94.5%', progress: 94 },
              { label: 'Market Share', value: '12.8%', progress: 45 },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dark-muted">{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
                <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-1000"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {[
              { icon: '🎯', title: 'Reached 25K users milestone', time: '2 hours ago' },
              { icon: '💰', title: 'Record monthly revenue', time: '1 day ago' },
              { icon: '⭐', title: '4.9/5 customer rating', time: '2 days ago' },
              { icon: '🚀', title: 'Launched new features', time: '3 days ago' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-dark-bg/50 border border-dark-border hover:border-primary-500/30 transition-all duration-200">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-dark-muted">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveOverview;

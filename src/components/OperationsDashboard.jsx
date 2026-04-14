import { Clock, CheckCircle, AlertCircle, Users, Calendar, TrendingUp, PlayCircle, PauseCircle } from 'lucide-react';

const OperationsDashboard = () => {
  const projects = [
    { id: 1, name: 'Website Redesign', team: 'Design Team', progress: 75, status: 'In Progress', deadline: '2024-04-20', priority: 'High' },
    { id: 2, name: 'Mobile App Development', team: 'Dev Team', progress: 45, status: 'In Progress', deadline: '2024-05-15', priority: 'High' },
    { id: 3, name: 'Marketing Campaign', team: 'Marketing', progress: 90, status: 'Review', deadline: '2024-04-10', priority: 'Medium' },
    { id: 4, name: 'Database Migration', team: 'Engineering', progress: 30, status: 'In Progress', deadline: '2024-06-01', priority: 'High' },
    { id: 5, name: 'Customer Portal', team: 'Dev Team', progress: 60, status: 'In Progress', deadline: '2024-05-01', priority: 'Medium' },
  ];

  const tasks = [
    { id: 1, title: 'Design homepage mockup', project: 'Website Redesign', assignee: 'Sarah J.', status: 'Completed', dueDate: '2024-04-05' },
    { id: 2, title: 'Implement authentication', project: 'Mobile App', assignee: 'Mike C.', status: 'In Progress', dueDate: '2024-04-12' },
    { id: 3, title: 'Create ad creatives', project: 'Marketing Campaign', assignee: 'Emily D.', status: 'Completed', dueDate: '2024-04-03' },
    { id: 4, title: 'API integration', project: 'Customer Portal', assignee: 'James W.', status: 'Pending', dueDate: '2024-04-18' },
    { id: 5, title: 'User testing', project: 'Website Redesign', assignee: 'Lisa A.', status: 'In Progress', dueDate: '2024-04-15' },
  ];

  const approvals = [
    { id: 1, type: 'Budget Request', title: 'Q2 Marketing Budget', requester: 'Marketing Team', amount: '$50,000', date: '2024-04-08' },
    { id: 2, type: 'Feature Request', title: 'New dashboard widgets', requester: 'Product Team', amount: '-', date: '2024-04-07' },
    { id: 3, type: 'Hiring Request', title: 'Senior Developer', requester: 'Engineering', amount: '$120,000/yr', date: '2024-04-06' },
    { id: 4, type: 'Vendor Contract', title: 'Cloud Services', requester: 'IT Team', amount: '$15,000/mo', date: '2024-04-05' },
  ];

  const activities = [
    { id: 1, action: 'Project milestone completed', details: 'Website Redesign - Phase 1', time: '10 minutes ago', icon: CheckCircle, color: 'green' },
    { id: 2, action: 'New task assigned', details: 'API integration to James W.', time: '25 minutes ago', icon: Users, color: 'blue' },
    { id: 3, action: 'Deadline approaching', details: 'Marketing Campaign review due', time: '1 hour ago', icon: AlertCircle, color: 'yellow' },
    { id: 4, action: 'Team meeting scheduled', details: 'Sprint planning at 2 PM', time: '2 hours ago', icon: Calendar, color: 'purple' },
    { id: 5, action: 'Project updated', details: 'Mobile App progress to 45%', time: '3 hours ago', icon: TrendingUp, color: 'primary' },
  ];

  const getPriorityBadge = (priority) => {
    const badges = {
      High: 'badge-danger',
      Medium: 'badge-warning',
      Low: 'badge-success',
    };
    return badges[priority] || 'badge-info';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'In Progress': 'badge-info',
      'Completed': 'badge-success',
      'Pending': 'badge-warning',
      'Review': 'badge-warning',
    };
    return badges[status] || 'badge-info';
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'from-green-500 to-emerald-500';
    if (progress >= 50) return 'from-primary-500 to-blue-500';
    if (progress >= 25) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Operations Dashboard</h2>
          <p className="text-dark-muted mt-1">Track projects, tasks, and team activities</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">View All</button>
          <button className="btn-primary">+ New Project</button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ongoing Projects', value: projects.length, icon: PlayCircle, color: 'primary' },
          { label: 'Completed Tasks', value: '24', icon: CheckCircle, color: 'green' },
          { label: 'Pending Approvals', value: approvals.length, icon: AlertCircle, color: 'yellow' },
          { label: 'Active Teams', value: '8', icon: Users, color: 'accent' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card p-4 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-500/20 text-${stat.color}-400`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-dark-muted">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ongoing Projects */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Ongoing Projects</h3>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="p-4 rounded-xl bg-dark-bg/50 border border-dark-border hover:border-primary-500/30 transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{project.name}</h4>
                    <p className="text-sm text-dark-muted">{project.team}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`badge ${getPriorityBadge(project.priority)}`}>{project.priority}</span>
                    <span className={`badge ${getStatusBadge(project.status)}`}>{project.status}</span>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-dark-muted">Progress</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getProgressColor(project.progress)} rounded-full transition-all duration-500`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-dark-muted">
                  <Clock size={14} />
                  <span>Deadline: {project.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl bg-dark-bg/50 border border-dark-border hover:border-primary-500/30 transition-all duration-200">
                  <div className={`p-2 rounded-lg bg-${activity.color}-500/20 text-${activity.color}-400 mt-1`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-dark-muted">{activity.details}</p>
                    <p className="text-xs text-dark-muted mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4 p-3 rounded-xl bg-dark-bg/50 border border-dark-border hover:border-primary-500/30 transition-all duration-200">
                <div className={`p-2 rounded-lg ${task.status === 'Completed' ? 'bg-green-500/20 text-green-400' : task.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {task.status === 'Completed' && <CheckCircle size={16} />}
                  {task.status === 'In Progress' && <PlayCircle size={16} />}
                  {task.status === 'Pending' && <PauseCircle size={16} />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{task.title}</p>
                  <p className="text-xs text-dark-muted">{task.project}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{task.assignee}</p>
                  <span className={`badge ${getStatusBadge(task.status)}`}>{task.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Pending Approvals</h3>
          <div className="space-y-3">
            {approvals.map((approval) => (
              <div key={approval.id} className="p-4 rounded-xl bg-dark-bg/50 border border-dark-border hover:border-primary-500/30 transition-all duration-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="badge badge-info text-xs">{approval.type}</span>
                    <h4 className="font-semibold mt-2">{approval.title}</h4>
                    <p className="text-sm text-dark-muted">{approval.requester}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-400">{approval.amount}</p>
                    <p className="text-xs text-dark-muted">{approval.date}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="btn-primary text-xs px-3 py-1">Approve</button>
                  <button className="btn-secondary text-xs px-3 py-1">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsDashboard;

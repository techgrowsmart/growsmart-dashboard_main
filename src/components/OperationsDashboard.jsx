import { Clock, CheckCircle, AlertCircle, Users, Calendar, TrendingUp, PlayCircle, PauseCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const OperationsDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API calls
    // fetchProjects();
    // fetchTasks();
    // fetchApprovals();
    // fetchActivities();
    setLoading(false);
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

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
          { label: 'Completed Tasks', value: '0', icon: CheckCircle, color: 'green' },
          { label: 'Pending Approvals', value: approvals.length, icon: AlertCircle, color: 'yellow' },
          { label: 'Active Teams', value: '0', icon: Users, color: 'accent' },
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
            {projects.length === 0 ? (
              <div className="text-center py-8 text-dark-muted">
                <p>No ongoing projects</p>
                <button className="btn-primary mt-4">Create New Project</button>
              </div>
            ) : (
              projects.map((project) => (
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
              ))
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-dark-muted">
                <p>No recent activities</p>
              </div>
            ) : (
              activities.map((activity) => {
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
              })
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-dark-muted">
                <p>No recent tasks</p>
              </div>
            ) : (
              tasks.map((task) => (
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
              ))
            )}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Pending Approvals</h3>
          <div className="space-y-3">
            {approvals.length === 0 ? (
              <div className="text-center py-8 text-dark-muted">
                <p>No pending approvals</p>
              </div>
            ) : (
              approvals.map((approval) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsDashboard;

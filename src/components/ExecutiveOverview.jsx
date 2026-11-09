import UserAnalytics from './UserAnalytics';
import SiteVisitorStats from './SiteVisitorStats';

const ExecutiveOverview = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Executive Overview</h2>
          <p className="text-dark-muted mt-1">User growth, roles and state-wise distribution</p>
        </div>

        {/* gogrowsmart.com live + total visitors */}
        <SiteVisitorStats />
      </div>

      {/* User Analytics */}
      <UserAnalytics />
    </div>
  );
};

export default ExecutiveOverview;

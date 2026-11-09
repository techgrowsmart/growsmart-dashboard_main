import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Users, GraduationCap, BookOpen, MapPin, RefreshCw, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import {
  format,
  subDays,
  startOfDay,
  startOfWeek,
  startOfMonth,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval
} from 'date-fns';
import apiService from '../services/api';

// Fixed per-entity colors (validated for CVD separation on the dark card surface)
const ROLE_COLORS = {
  student: '#0284c7',
  teacher: '#ea580c',
};

const ROLE_LABELS = {
  student: 'Students',
  teacher: 'Teachers',
};

const ROLES = ['student', 'teacher'];

const RANGES = [
  { key: '7d', label: '7D', days: 7 },
  { key: '30d', label: '30D', days: 30 },
  { key: '90d', label: '90D', days: 90 },
  { key: 'all', label: 'All', days: null },
];

const GRANULARITIES = {
  day: { label: 'Daily', start: startOfDay, each: eachDayOfInterval, fmt: 'dd MMM' },
  week: { label: 'Weekly', start: (d) => startOfWeek(d, { weekStartsOn: 1 }), each: (i) => eachWeekOfInterval(i, { weekStartsOn: 1 }), fmt: 'dd MMM' },
  month: { label: 'Monthly', start: startOfMonth, each: eachMonthOfInterval, fmt: 'MMM yyyy' },
};

const NO_STATE = '__none__';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-dark-border">
        <p className="text-sm font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm text-dark-text flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color || entry.payload?.fill }} />
            {entry.name}: {Number(entry.value).toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ChartTypeToggle = ({ value, onChange }) => (
  <div className="flex bg-dark-bg border border-dark-border rounded-lg p-1">
    {[
      { key: 'line', icon: LineChartIcon, label: 'Line' },
      { key: 'bar', icon: BarChart3, label: 'Bar' },
    ].map(({ key, icon: Icon, label }) => (
      <button
        key={key}
        onClick={() => onChange(key)}
        title={`${label} chart`}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
          value === key ? 'bg-primary-500/20 text-primary-400' : 'text-dark-muted hover:text-dark-text'
        }`}
      >
        <Icon size={14} />
        {label}
      </button>
    ))}
  </div>
);

const SegmentedControl = ({ options, value, onChange }) => (
  <div className="flex bg-dark-bg border border-dark-border rounded-lg p-1">
    {options.map((opt) => (
      <button
        key={opt.key}
        onClick={() => onChange(opt.key)}
        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
          value === opt.key ? 'bg-primary-500/20 text-primary-400' : 'text-dark-muted hover:text-dark-text'
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

// Renders the same data as either a line or a bar chart
const SwitchableChart = ({ type, data, xKey, series, height = 300, xAngle = 0, colorByCell }) => {
  const common = (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
      <XAxis
        dataKey={xKey}
        stroke="#71717a"
        tick={{ fontSize: 12 }}
        interval={xAngle ? 0 : 'preserveStartEnd'}
        angle={xAngle}
        textAnchor={xAngle ? 'end' : 'middle'}
        height={xAngle ? 90 : 30}
      />
      <YAxis stroke="#71717a" allowDecimals={false} tick={{ fontSize: 12 }} width={40} />
      <Tooltip content={<CustomTooltip />} cursor={type === 'bar' ? { fill: '#1e1e2e', opacity: 0.6 } : { stroke: '#71717a', strokeDasharray: '3 3' }} />
      {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12, color: '#e4e4e7' }} />}
    </>
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      {type === 'line' ? (
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          {common}
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2, fill: '#12121a' }}
              activeDot={{ r: 5, stroke: '#12121a', strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      ) : (
        <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }} barGap={2}>
          {common}
          {series.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[4, 4, 0, 0]} maxBarSize={40}>
              {colorByCell && data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Bar>
          ))}
        </BarChart>
      )}
    </ResponsiveContainer>
  );
};

const ChartCard = ({ title, subtitle, chartType, onChartTypeChange, children, className = '' }) => (
  <div className={`glass-card p-6 ${className}`}>
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle && <p className="text-xs text-dark-muted mt-1">{subtitle}</p>}
      </div>
      {onChartTypeChange && <ChartTypeToggle value={chartType} onChange={onChartTypeChange} />}
    </div>
    {children}
  </div>
);

const EmptyState = ({ text }) => (
  <div className="flex items-center justify-center h-64 text-dark-muted">
    <p>{text}</p>
  </div>
);

const UserAnalytics = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [roleFilter, setRoleFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [range, setRange] = useState('all');
  const [granularity, setGranularity] = useState('week');

  // Per-chart line/bar switches
  const [chartTypes, setChartTypes] = useState({
    signups: 'bar',
    growth: 'line',
    states: 'bar',
    roles: 'bar',
  });
  const setChartType = (key) => (type) => setChartTypes((prev) => ({ ...prev, [key]: type }));

  const fetchData = async (refresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getUserAnalytics({ refresh });
      // Only students and teachers are tracked in analytics
      setUsers((res?.data?.users || []).filter((u) => ROLES.includes(u.role)));
    } catch (err) {
      setError(err.message || 'Failed to load user analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // States available across students and teachers, with counts
  const availableStates = useMemo(() => {
    const map = new Map();
    users.forEach((u) => {
      if (!u.state) return;
      const entry = map.get(u.state) || { state: u.state, student: 0, teacher: 0 };
      entry[u.role] += 1;
      map.set(u.state, entry);
    });
    return [...map.values()]
      .map((e) => ({ ...e, total: e.student + e.teacher }))
      .sort((a, b) => b.total - a.total || a.state.localeCompare(b.state));
  }, [users]);

  const missingState = useMemo(() => ({
    student: users.filter((u) => u.role === 'student' && !u.state).length,
    teacher: users.filter((u) => u.role === 'teacher' && !u.state).length,
  }), [users]);

  // Role + state filters (date range applied separately so cumulative growth stays correct)
  const roleStateFiltered = useMemo(() => users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (stateFilter === NO_STATE) return !u.state;
    if (stateFilter !== 'all' && u.state !== stateFilter) return false;
    return true;
  }), [users, roleFilter, stateFilter]);

  const rangeStart = useMemo(() => {
    const r = RANGES.find((x) => x.key === range);
    return r?.days ? startOfDay(subDays(new Date(), r.days - 1)) : null;
  }, [range]);

  const filtered = useMemo(() => roleStateFiltered.filter((u) => {
    if (!rangeStart) return true;
    return u.created_at && new Date(u.created_at) >= rangeStart;
  }), [roleStateFiltered, rangeStart]);

  const visibleRoles = roleFilter === 'all' ? ROLES : [roleFilter];
  const roleSeries = visibleRoles.map((r) => ({ key: r, name: ROLE_LABELS[r], color: ROLE_COLORS[r] }));

  // Signups per time bucket + cumulative totals
  const { signupData, growthData } = useMemo(() => {
    const g = GRANULARITIES[granularity];
    const dated = roleStateFiltered.filter((u) => u.created_at).map((u) => ({ ...u, date: new Date(u.created_at) }));
    if (dated.length === 0) return { signupData: [], growthData: [] };

    const earliest = new Date(Math.min(...dated.map((u) => u.date)));
    const start = g.start(rangeStart || earliest);
    const end = g.start(new Date());
    const buckets = g.each({ start, end });

    const rows = buckets.map((b) => {
      const row = { period: format(b, g.fmt), _ts: +b };
      ROLES.forEach((r) => { row[r] = 0; });
      return row;
    });
    const indexByTs = new Map(rows.map((r, i) => [r._ts, i]));

    // Baseline: users created before the visible window count toward cumulative growth
    const baseline = Object.fromEntries(ROLES.map((r) => [r, 0]));
    dated.forEach((u) => {
      const ts = +g.start(u.date);
      if (ts < +start) baseline[u.role] = (baseline[u.role] || 0) + 1;
      else if (indexByTs.has(ts)) rows[indexByTs.get(ts)][u.role] += 1;
    });

    const running = { ...baseline };
    const growth = rows.map((row) => {
      const out = { period: row.period };
      ROLES.forEach((r) => {
        running[r] += row[r];
        out[r] = running[r];
      });
      return out;
    });

    return { signupData: rows, growthData: growth };
  }, [roleStateFiltered, rangeStart, granularity]);

  // Users by state (students vs teachers) within current filters
  const stateData = useMemo(() => {
    const map = new Map();
    filtered.forEach((u) => {
      if (!u.state) return;
      const entry = map.get(u.state) || { state: u.state, student: 0, teacher: 0 };
      entry[u.role] += 1;
      map.set(u.state, entry);
    });
    return [...map.values()].sort((a, b) => (b.student + b.teacher) - (a.student + a.teacher));
  }, [filtered]);

  const roleData = useMemo(() => visibleRoles.map((r) => ({
    role: ROLE_LABELS[r],
    users: filtered.filter((u) => u.role === r).length,
    color: ROLE_COLORS[r],
  })), [filtered, roleFilter]);

  const kpis = [
    { title: 'Students + Teachers', value: filtered.length, icon: Users, color: 'primary' },
    { title: 'Students', value: filtered.filter((u) => u.role === 'student').length, icon: GraduationCap, color: 'blue' },
    { title: 'Teachers', value: filtered.filter((u) => u.role === 'teacher').length, icon: BookOpen, color: 'yellow' },
    { title: 'States Covered', value: new Set(filtered.map((u) => u.state).filter(Boolean)).size, icon: MapPin, color: 'accent' },
  ];

  const iconColorClasses = {
    primary: 'bg-primary-500/20 text-primary-400',
    accent: 'bg-accent-500/20 text-accent-400',
    blue: 'bg-blue-500/20 text-blue-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={() => fetchData(true)} className="btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="glass-card p-4 flex flex-col xl:flex-row xl:items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs text-dark-muted uppercase tracking-wide">Role</span>
          <SegmentedControl
            value={roleFilter}
            onChange={setRoleFilter}
            options={[
              { key: 'all', label: 'All' },
              { key: 'student', label: 'Students' },
              { key: 'teacher', label: 'Teachers' },
            ]}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-dark-muted uppercase tracking-wide">State</span>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="input-field py-1.5 text-sm min-w-[200px]"
          >
            <option value="all">All states</option>
            {availableStates.map((s) => (
              <option key={s.state} value={s.state}>
                {s.state} ({s.student} S / {s.teacher} T)
              </option>
            ))}
            <option value={NO_STATE}>State not provided</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-dark-muted uppercase tracking-wide">Range</span>
          <SegmentedControl value={range} onChange={setRange} options={RANGES} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-dark-muted uppercase tracking-wide">Group</span>
          <SegmentedControl
            value={granularity}
            onChange={setGranularity}
            options={Object.entries(GRANULARITIES).map(([key, g]) => ({ key, label: g.label }))}
          />
        </div>
        <button onClick={() => fetchData(true)} className="btn-secondary flex items-center gap-2 xl:ml-auto" title="Refresh">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.title} className="glass-card p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${iconColorClasses[k.color]}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-dark-muted text-sm">{k.title}</p>
                <p className="text-2xl font-bold">{k.value.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 1. New signups over time */}
      <ChartCard
        title="New User Signups"
        subtitle={`${GRANULARITIES[granularity].label} registrations from the users table, by role`}
        chartType={chartTypes.signups}
        onChartTypeChange={setChartType('signups')}
      >
        {signupData.length === 0 ? (
          <EmptyState text="No signups for the selected filters" />
        ) : (
          <SwitchableChart type={chartTypes.signups} data={signupData} xKey="period" series={roleSeries} />
        )}
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2. Cumulative growth */}
        <ChartCard
          title="Total User Growth"
          subtitle="Cumulative users at the end of each period"
          chartType={chartTypes.growth}
          onChartTypeChange={setChartType('growth')}
        >
          {growthData.length === 0 ? (
            <EmptyState text="No growth data for the selected filters" />
          ) : (
            <SwitchableChart type={chartTypes.growth} data={growthData} xKey="period" series={roleSeries} />
          )}
        </ChartCard>

        {/* 3. Users by role */}
        <ChartCard
          title="Users by Role"
          subtitle="Role column of the users table"
          chartType={chartTypes.roles}
          onChartTypeChange={setChartType('roles')}
        >
          {filtered.length === 0 ? (
            <EmptyState text="No users for the selected filters" />
          ) : (
            <SwitchableChart
              type={chartTypes.roles}
              data={roleData}
              xKey="role"
              series={[{ key: 'users', name: 'Users', color: ROLE_COLORS.student }]}
              colorByCell
            />
          )}
        </ChartCard>
      </div>

      {/* 4. Students vs teachers by state */}
      <ChartCard
        title="Students & Teachers by State"
        subtitle="Student state from the student table · teacher state from tutor registration (teachers1 has no state column)"
        chartType={chartTypes.states}
        onChartTypeChange={setChartType('states')}
      >
        {stateData.length === 0 ? (
          <EmptyState text="No state data for the selected filters" />
        ) : (
          <SwitchableChart
            type={chartTypes.states}
            data={stateData}
            xKey="state"
            series={roleSeries}
            height={360}
            xAngle={-35}
          />
        )}
      </ChartCard>

      {/* Available states table */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-1">Available States</h3>
        <p className="text-xs text-dark-muted mb-4">
          {availableStates.length} states have at least one student or teacher. Click a row to filter the charts.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-dark-muted border-b border-dark-border">
                <th className="py-2 pr-4 font-medium">State</th>
                <th className="py-2 px-4 font-medium text-right">Students</th>
                <th className="py-2 px-4 font-medium text-right">Teachers</th>
                <th className="py-2 pl-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {availableStates.map((s) => (
                <tr
                  key={s.state}
                  onClick={() => setStateFilter(stateFilter === s.state ? 'all' : s.state)}
                  className={`border-b border-dark-border/50 cursor-pointer transition-colors hover:bg-dark-border/40 ${
                    stateFilter === s.state ? 'bg-primary-500/10' : ''
                  }`}
                >
                  <td className="py-2 pr-4">{s.state}</td>
                  <td className="py-2 px-4 text-right tabular-nums">{s.student}</td>
                  <td className="py-2 px-4 text-right tabular-nums">{s.teacher}</td>
                  <td className="py-2 pl-4 text-right tabular-nums font-semibold">{s.total}</td>
                </tr>
              ))}
              <tr
                onClick={() => setStateFilter(stateFilter === NO_STATE ? 'all' : NO_STATE)}
                className={`cursor-pointer text-dark-muted transition-colors hover:bg-dark-border/40 ${
                  stateFilter === NO_STATE ? 'bg-primary-500/10' : ''
                }`}
              >
                <td className="py-2 pr-4 italic">State not provided</td>
                <td className="py-2 px-4 text-right tabular-nums">{missingState.student}</td>
                <td className="py-2 px-4 text-right tabular-nums">{missingState.teacher}</td>
                <td className="py-2 pl-4 text-right tabular-nums">{missingState.student + missingState.teacher}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;

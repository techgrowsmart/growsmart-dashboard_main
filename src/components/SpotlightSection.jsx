import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useState, useMemo } from 'react';
import { MapPin, RefreshCw, ChevronDown } from 'lucide-react';

// Rows shown before the table collapses behind "Show more"
const VISIBLE_ROWS = 5;

const TYPE_STYLES = {
  subject: { label: 'Subject', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  skill: { label: 'Skill', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  both: { label: 'Both', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
};

const STATUS_BADGES = {
  Paid: 'badge-success',
  Free: 'badge-success',
  Pending: 'badge-warning',
  Overdue: 'badge-danger',
};

const TypeBadge = ({ type }) => {
  const style = TYPE_STYLES[String(type || '').toLowerCase()];
  if (!style) return <span className="text-sm text-dark-muted">—</span>;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.className}`}>
      {style.label}
    </span>
  );
};

// Group purchases into one point per day
const aggregateByDay = (purchases) => {
  const buckets = {};
  purchases.forEach((p) => {
    const d = new Date(p.date);
    if (isNaN(d)) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    buckets[key] = (buckets[key] || 0) + 1;
  });
  return Object.entries(buckets)
    .map(([key, count]) => {
      const [year, month, day] = key.split('-');
      const monthName = new Date(key).toLocaleString('default', { month: 'short' });
      return {
        key,
        year: Number(year),
        month: Number(month),
        day: Number(day),
        label: `${monthName} ${day}, ${year}`,
        date: key,
        users: count,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Spotlight graph + table card.
 * variant 'purchase' shows the paid amount; 'referral' shows the free reward duration instead.
 */
const SpotlightSection = ({
  title,
  chartTitle,
  icon: Icon,
  color,
  purchases,
  loading,
  onRefresh,
  variant = 'purchase',
  emptyText,
  tooltipLabel = 'Users',
  fallbackChartData,
}) => {
  const [chartType, setChartType] = useState('line');
  const [expanded, setExpanded] = useState(false);
  const isReferral = variant === 'referral';

  const chartData = useMemo(() => {
    const agg = aggregateByDay(purchases);
    if (agg.length > 0) return agg;
    return fallbackChartData || [];
  }, [purchases, fallbackChartData]);

  // Newest first in the table
  const rows = useMemo(
    () => [...purchases].sort((a, b) => String(b.date).localeCompare(String(a.date))),
    [purchases]
  );
  const visibleRows = expanded ? rows : rows.slice(0, VISIBLE_ROWS);
  const hiddenCount = rows.length - VISIBLE_ROWS;

  const ChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-dark-border">
          <p className="text-sm font-semibold mb-2">{label}</p>
          <p className="text-sm" style={{ color }}>
            {tooltipLabel}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const xAxis = (
    <XAxis
      dataKey="label"
      stroke="#71717a"
      tick={{ fontSize: 11 }}
      tickFormatter={(value) => {
        const parts = value.split(' ');
        return `${parts[0]} ${parts[1]}`;
      }}
    />
  );
  const yAxis = (
    <YAxis
      stroke="#71717a"
      tick={{ fontSize: 11 }}
      tickFormatter={(value) => Number(value).toFixed(0)}
      allowDecimals={false}
      domain={[0, 'dataMax + 5']}
      label={{
        value: 'Number of Users',
        angle: -90,
        position: 'insideLeft',
        offset: 10,
        fill: '#71717a',
        style: { fontSize: 11 },
      }}
    />
  );

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Icon size={20} style={{ color }} />
          {title}
          {!loading && (
            <span className="text-xs font-medium text-dark-muted bg-dark-bg/50 border border-dark-border rounded-full px-2 py-0.5">
              {purchases.length}
            </span>
          )}
        </h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-primary-400 text-sm hover:text-primary-300 flex items-center gap-1"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        )}
      </div>

      {/* Graph */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 gap-3">
          <h4 className="text-md font-semibold">{chartTitle}</h4>
          <div className="flex items-center gap-1 bg-dark-bg/50 rounded-lg p-1">
            {['line', 'bar'].map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                  chartType === type ? 'text-white' : 'text-dark-muted'
                }`}
                style={chartType === type ? { backgroundColor: color } : undefined}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-dark-muted text-sm rounded-xl border border-dashed border-dark-border">
            {loading ? 'Loading…' : 'No data to chart yet'}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                {xAxis}
                {yAxis}
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke={color}
                  strokeWidth={2}
                  dot={{ r: 4, fill: color }}
                  activeDot={{ r: 6, fill: color }}
                  name={tooltipLabel}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                {xAxis}
                {yAxis}
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="users" fill={color} radius={[4, 4, 0, 0]} name={tooltipLabel} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
        {chartData.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-dark-muted">
            <span>Year: {chartData[0]?.year ?? '—'}</span>
            <span>Month: {chartData[0]?.month ?? '—'}</span>
            <span>Days: {chartData.length}</span>
          </div>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-8 text-dark-muted">
          <p>{emptyText}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-muted">Teacher</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-muted">Home State</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-muted">
                    {isReferral ? 'Spotlight State' : 'Purchase State'}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-muted">Type</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-dark-muted">
                    {isReferral ? 'Reward' : 'Amount'}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-muted">Date</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-dark-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((purchase, index) => (
                  <tr
                    key={`${purchase.invoiceId}-${purchase.purchaseState}-${index}`}
                    className="border-b border-dark-border hover:bg-dark-bg/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0"
                          style={{ backgroundColor: `${color}33`, color }}
                        >
                          {(purchase.teacherName || purchase.teacherEmail || '?').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{purchase.teacherName}</p>
                          <p className="text-xs text-dark-muted truncate">{purchase.teacherEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-dark-muted shrink-0" />
                        <span className="text-sm whitespace-nowrap">{purchase.homeState}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="shrink-0" style={{ color }} />
                        <span className="text-sm font-medium whitespace-nowrap">{purchase.purchaseState}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <TypeBadge type={purchase.spotlightType} />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {isReferral ? (
                        <span className="font-semibold text-sm">
                          {purchase.rewardMonths ? `${purchase.rewardMonths} months free` : 'Free'}
                        </span>
                      ) : (
                        <span className="font-semibold text-sm">
                          {purchase.currency} {Number(purchase.amount || 0).toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-dark-muted whitespace-nowrap">{purchase.date}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`badge ${STATUS_BADGES[purchase.status] || 'badge-info'}`}>{purchase.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {hiddenCount > 0 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dark-border bg-dark-bg/50 text-sm font-medium text-dark-muted hover:text-white hover:border-primary-500/30 transition-all"
              aria-expanded={expanded}
            >
              {expanded ? 'Show less' : `Show ${hiddenCount} more`}
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default SpotlightSection;

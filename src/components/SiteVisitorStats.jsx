import { useCallback, useEffect, useRef, useState } from 'react';
import { Globe, Users } from 'lucide-react';
import apiService from '../services/api';

const REFRESH_MS = 15000;

const formatNumber = (n) => (typeof n === 'number' ? n.toLocaleString('en-IN') : '—');

const formatDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Hover text explaining where the all-time totals come from.
const totalsTooltip = (stats) => {
  if (!stats) return undefined;
  const lines = [`${formatNumber(stats.totalVisitors)} visitors · ${formatNumber(stats.totalVisits)} visits (all time)`];
  if (stats.history) {
    lines.push(
      `Before live tracking: ${formatNumber(stats.history.visitors)} visitors · ${formatNumber(stats.history.visits)} visits` +
        (stats.history.from ? ` (from ${formatDate(stats.history.from)})` : '')
    );
  }
  if (typeof stats.trackedVisitors === 'number') {
    lines.push(
      `Live tracking: ${formatNumber(stats.trackedVisitors)} visitors · ${formatNumber(stats.trackedVisits)} visits` +
        (stats.trackingSince ? ` (since ${formatDate(stats.trackingSince)})` : '')
    );
  }
  return lines.join('\n');
};

// Earliest date the totals cover.
const countingSince = (stats) => formatDate(stats?.history?.from || stats?.trackingSince);

/**
 * Live + total visitor counts for gogrowsmart.com.
 * Refreshes every 15s while this tab is visible.
 */
const SiteVisitorStats = () => {
  const [stats, setStats] = useState(null);
  const [failed, setFailed] = useState(false);
  const inFlight = useRef(false);

  const load = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const data = await apiService.getSiteAnalytics();
      if (data && data.success !== false) {
        setStats(data);
        setFailed(false);
      }
    } catch {
      // Keep showing the last known numbers; just flag that they may be stale.
      setFailed(true);
    } finally {
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    let timer;
    const start = () => {
      load();
      clearInterval(timer);
      timer = setInterval(load, REFRESH_MS);
    };
    const stop = () => clearInterval(timer);
    const onVisibility = () => (document.visibilityState === 'visible' ? start() : stop());

    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [load]);

  const loading = !stats && !failed;
  const live = stats?.liveNow;

  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:items-stretch sm:justify-end">
      {/* Live now */}
      <div
        className="glass-card px-4 py-3 flex items-center gap-3 sm:min-w-[150px]"
        title={stats ? `People with gogrowsmart.com open in the last ${stats.liveWindowSeconds}s` : undefined}
      >
        {/* <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 relative">
          <Users size={18} />
          {live > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
          )}
        </div> */}
        {/* <div>
          <p className="text-dark-muted text-xs uppercase tracking-wide">Live now</p>
          <p className="text-xl font-bold leading-tight">
            {loading ? <span className="inline-block w-8 h-5 bg-dark-border rounded animate-pulse align-middle" /> : formatNumber(live)}
          </p>
        </div> */}
      </div>

      {/* Total visitors */}
      <div
        className="glass-card px-4 py-3 flex items-center gap-3 sm:min-w-[190px]"
        title={totalsTooltip(stats)}
      >
        {/* <div className="p-2.5 rounded-xl bg-primary-500/15 text-primary-400">
          <Globe size={18} />
        </div> */}
        <div>
          {/* <p className="text-dark-muted text-xs uppercase tracking-wide">Website visitors</p> */}
          {/* <p className="text-xl font-bold leading-tight">
            {loading ? <span className="inline-block w-12 h-5 bg-dark-border rounded animate-pulse align-middle" /> : formatNumber(stats?.totalVisitors)}
          </p> */}
          {/* <p className="text-[11px] text-dark-muted mt-0.5">
            {failed
              ? 'Couldn’t refresh — retrying'
              : stats
              ? `${formatNumber(stats.visitorsToday)} today · ${formatNumber(stats.totalVisits)} visits`
              : 'gogrowsmart.com'}
          </p>
          {!failed && stats && countingSince(stats) && (
            <p className="text-[11px] text-dark-muted">
              Since {countingSince(stats)}
              {stats.history?.visitors ? ` · incl. ${formatNumber(stats.history.visitors)} earlier` : ''}
            </p>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default SiteVisitorStats;

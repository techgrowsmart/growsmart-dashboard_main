import { useState, useEffect, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  ShoppingBag,
  Gift,
} from 'lucide-react';
import apiService from '../services/api';
import SpotlightSection from './SpotlightSection';

// Const sample values for Spotlights Purchased chart (year, months, days)
const constSpotlightData = [
  { key: '2025-10-15', year: 2025, month: 10, day: 15, label: 'Oct 15, 2025', date: '2025-10-15', users: 12 },
  { key: '2025-10-16', year: 2025, month: 10, day: 16, label: 'Oct 16, 2025', date: '2025-10-16', users: 18 },
  { key: '2025-10-17', year: 2025, month: 10, day: 17, label: 'Oct 17, 2025', date: '2025-10-17', users: 15 },
  { key: '2025-10-18', year: 2025, month: 10, day: 18, label: 'Oct 18, 2025', date: '2025-10-18', users: 22 },
  { key: '2025-10-19', year: 2025, month: 10, day: 19, label: 'Oct 19, 2025', date: '2025-10-19', users: 19 },
  { key: '2025-10-20', year: 2025, month: 10, day: 20, label: 'Oct 20, 2025', date: '2025-10-20', users: 25 },
  { key: '2025-10-21', year: 2025, month: 10, day: 21, label: 'Oct 21, 2025', date: '2025-10-21', users: 17 },
];

const FinanceBilling = () => {
  const [invoices, setInvoices] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [profitLoss, setProfitLoss] = useState([]);
   const [spotlightPurchases, setSpotlightPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spotlightLoading, setSpotlightLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API calls
    // fetchInvoices();
    // fetchSubscriptions();
    // fetchPaymentHistory();
    // fetchProfitLoss();
    fetchSpotlightPurchases();
    setLoading(false);
  }, []);

  const fetchSpotlightPurchases = async () => {
    try {
      setSpotlightLoading(true);
      const data = await apiService.getSpotlightPurchases();
      if (data.success) {
        setSpotlightPurchases(data.purchases || []);
      }
    } catch (err) {
      console.error('Error fetching spotlight purchases:', err);
    } finally {
      setSpotlightLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Paid: 'badge-success',
      Pending: 'badge-warning',
      Overdue: 'badge-danger',
    };
    return badges[status] || 'badge-info';
  };

  // Paid spotlights (Spotlight screen) vs free ones redeemed through referral milestones
  const paidSpotlights = useMemo(
    () => spotlightPurchases.filter((p) => p.source !== 'referral'),
    [spotlightPurchases]
  );
  const referralSpotlights = useMemo(
    () => spotlightPurchases.filter((p) => p.source === 'referral'),
    [spotlightPurchases]
  );

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
          <h2 className="text-2xl font-bold">Finance & Billing</h2>
          <p className="text-dark-muted mt-1">Manage invoices, payments, and financial metrics</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            Export Report
          </button>
          <button className="btn-primary">+ New Invoice</button>
        </div>
      </div>

      {/* Spotlight Purchases – paid through the Spotlight screen */}
      <SpotlightSection
        title="Spotlight Purchases"
        chartTitle="Spotlights Purchased"
        icon={ShoppingBag}
        color="#0ea5e9"
        purchases={paidSpotlights}
        loading={spotlightLoading}
        onRefresh={fetchSpotlightPurchases}
        variant="purchase"
        emptyText="No spotlight purchase data available"
        fallbackChartData={constSpotlightData}
      />

      {/* Referral Spotlights – free rewards redeemed from the Share screen */}
      <SpotlightSection
        title="Referral Spotlights"
        chartTitle="Spotlights Redeemed via Referrals"
        icon={Gift}
        color="#a855f7"
        purchases={referralSpotlights}
        loading={spotlightLoading}
        variant="referral"
        emptyText="No referral spotlights redeemed yet"
        tooltipLabel="Redemptions"
      />

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '$0', change: '+0%', icon: DollarSign, color: 'green' },
          { label: 'Outstanding Dues', value: '$0', change: '+0%', icon: AlertTriangle, color: 'yellow' },
          { label: 'Monthly Recurring Revenue', value: '$0', change: '+0%', icon: TrendingUp, color: 'primary' },
          { label: 'Net Profit', value: '$0', change: '+0%', icon: CreditCard, color: 'accent' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card p-4 glass-card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-xl bg-${stat.color}-500/20 text-${stat.color}-400`}>
                  <Icon size={20} />
                </div>
                <span className={`badge ${stat.change.startsWith('+') ? 'badge-success' : 'badge-danger'} flex items-center gap-1`}>
                  {stat.change.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.change}
                </span>
              </div>
              <p className="text-dark-muted text-sm">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoices */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Invoices</h3>
            <button className="text-primary-400 text-sm hover:text-primary-300">View All</button>
          </div>
          <div className="space-y-3">
            {invoices.length === 0 ? (
              <div className="text-center py-8 text-dark-muted">
                <p>No invoices found</p>
                <button className="btn-primary mt-4">Create First Invoice</button>
              </div>
            ) : (
              invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-bg/50 border border-dark-border hover:border-primary-500/30 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-500/20 text-primary-400">
                      <DollarSign size={18} />
                    </div>
                    <div>
                      <p className="font-semibold">{invoice.client}</p>
                      <p className="text-xs text-dark-muted">{invoice.id} • {invoice.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${invoice.amount.toLocaleString()}</p>
                    <span className={`badge ${getStatusBadge(invoice.status)}`}>{invoice.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment History */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Payment History</h3>
            <button className="text-primary-400 text-sm hover:text-primary-300">View All</button>
          </div>
          <div className="space-y-3">
            {paymentHistory.length === 0 ? (
              <div className="text-center py-8 text-dark-muted">
                <p>No payment history found</p>
              </div>
            ) : (
              paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-bg/50 border border-dark-border hover:border-primary-500/30 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${payment.status === 'Success' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <p className="font-semibold">{payment.client}</p>
                      <p className="text-xs text-dark-muted">{payment.method} • {payment.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${payment.amount.toLocaleString()}</p>
                    <span className={`badge ${getStatusBadge(payment.status)}`}>{payment.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Subscription Plans Revenue</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subscriptions.length === 0 ? (
            <div className="col-span-full text-center py-8 text-dark-muted">
              <p>No subscription data available</p>
            </div>
          ) : (
            subscriptions.map((sub) => (
              <div key={sub.id} className="p-4 rounded-xl bg-dark-bg/50 border border-dark-border hover:border-primary-500/30 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{sub.name}</h4>
                  <span className="badge badge-success">{sub.growth}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-muted">Price</span>
                    <span className="font-medium">${sub.price}/mo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-muted">Active Users</span>
                    <span className="font-medium">{sub.users}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-muted">Monthly Revenue</span>
                    <span className="font-bold text-primary-400">${sub.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Profit & Loss Table */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Profit & Loss Statement</h3>
        {profitLoss.length === 0 ? (
          <div className="text-center py-8 text-dark-muted">
            <p>No profit & loss data available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4">Month</th>
                  <th className="text-right py-3 px-4">Revenue</th>
                  <th className="text-right py-3 px-4">Expenses</th>
                  <th className="text-right py-3 px-4">Profit</th>
                  <th className="text-right py-3 px-4">Margin</th>
                </tr>
              </thead>
              <tbody>
                {profitLoss.map((item) => (
                  <tr key={item.month} className="border-b border-dark-border">
                    <td className="py-3 px-4 font-medium">{item.month}</td>
                    <td className="text-right py-3 px-4">${item.revenue.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">${item.expenses.toLocaleString()}</td>
                    <td className="text-right py-3 px-4 font-semibold">${item.profit.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">
                      <span className={`badge ${item.profit > 0 ? 'badge-success' : 'badge-danger'}`}>
                        {((item.profit / item.revenue) * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Outstanding Dues */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Outstanding Dues</h3>
        <div className="space-y-3">
          {invoices.filter(inv => inv.status !== 'Paid').length === 0 ? (
            <div className="text-center py-8 text-dark-muted">
              <p>No outstanding dues</p>
            </div>
          ) : (
            invoices.filter(inv => inv.status !== 'Paid').map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 rounded-xl bg-dark-bg/50 border border-dark-border hover:border-red-500/30 transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">{invoice.client}</p>
                    <p className="text-sm text-dark-muted">{invoice.id} • Due: {invoice.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xl font-bold text-red-400">${invoice.amount.toLocaleString()}</p>
                    <span className={`badge ${getStatusBadge(invoice.status)}`}>{invoice.status}</span>
                  </div>
                  <button className="btn-primary">Send Reminder</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceBilling;

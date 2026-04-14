import { DollarSign, CreditCard, TrendingUp, AlertTriangle, Download, FileText, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const FinanceBilling = () => {
  const invoices = [
    { id: 'INV-001', client: 'Acme Corporation', amount: 15000, status: 'Paid', date: '2024-04-01', dueDate: '2024-04-15' },
    { id: 'INV-002', client: 'TechStart Inc', amount: 8500, status: 'Pending', date: '2024-04-05', dueDate: '2024-04-20' },
    { id: 'INV-003', client: 'Global Solutions', amount: 22000, status: 'Paid', date: '2024-03-28', dueDate: '2024-04-12' },
    { id: 'INV-004', client: 'Innovate Labs', amount: 12000, status: 'Overdue', date: '2024-03-15', dueDate: '2024-03-30' },
    { id: 'INV-005', client: 'Digital Dynamics', amount: 18500, status: 'Pending', date: '2024-04-08', dueDate: '2024-04-22' },
  ];

  const subscriptions = [
    { id: 1, name: 'Enterprise Plan', price: 299, users: 50, revenue: 14950, growth: '+12%' },
    { id: 2, name: 'Pro Plan', price: 99, users: 200, revenue: 19800, growth: '+18%' },
    { id: 3, name: 'Basic Plan', price: 29, users: 450, revenue: 13050, growth: '+8%' },
  ];

  const paymentHistory = [
    { id: 1, client: 'Acme Corporation', amount: 15000, method: 'Wire Transfer', date: '2024-04-02', status: 'Success' },
    { id: 2, client: 'Global Solutions', amount: 22000, method: 'Credit Card', date: '2024-03-30', status: 'Success' },
    { id: 3, client: 'TechStart Inc', amount: 8500, method: 'PayPal', date: '2024-04-06', status: 'Processing' },
    { id: 4, client: 'Digital Dynamics', amount: 18500, method: 'Wire Transfer', date: '2024-04-09', status: 'Success' },
  ];

  const profitLoss = [
    { month: 'Jan', revenue: 284500, expenses: 145200, profit: 139300 },
    { month: 'Feb', revenue: 312000, expenses: 158400, profit: 153600 },
    { month: 'Mar', revenue: 298500, expenses: 162300, profit: 136200 },
    { month: 'Apr', revenue: 335000, expenses: 171500, profit: 163500 },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      Paid: 'badge-success',
      Pending: 'badge-warning',
      Overdue: 'badge-danger',
      Success: 'badge-success',
      Processing: 'badge-info',
    };
    return badges[status] || 'badge-info';
  };

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
            Export
          </button>
          <button className="btn-primary">+ Create Invoice</button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '$1,230,000', change: '+15.3%', icon: DollarSign, color: 'green' },
          { label: 'Outstanding Dues', value: '$40,500', change: '-5.2%', icon: AlertTriangle, color: 'yellow' },
          { label: 'Monthly Recurring Revenue', value: '$47,800', change: '+12.1%', icon: TrendingUp, color: 'primary' },
          { label: 'Net Profit', value: '$592,600', change: '+18.7%', icon: CreditCard, color: 'accent' },
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
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-bg/50 border border-dark-border hover:border-primary-500/30 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/20 text-primary-400">
                    <FileText size={18} />
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
            ))}
          </div>
        </div>

        {/* Payment History */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Payment History</h3>
            <button className="text-primary-400 text-sm hover:text-primary-300">View All</button>
          </div>
          <div className="space-y-3">
            {paymentHistory.map((payment) => (
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
                  <p className="font-bold">${payment.amount.toLocaleString()}</p>
                  <span className={`badge ${getStatusBadge(payment.status)}`}>{payment.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Subscription Plans Revenue</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subscriptions.map((sub) => (
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
          ))}
        </div>
      </div>

      {/* Profit & Loss Summary */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Profit & Loss Summary</h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue</th>
                <th>Expenses</th>
                <th>Profit</th>
                <th>Margin</th>
              </tr>
            </thead>
            <tbody>
              {profitLoss.map((pl, index) => (
                <tr key={index} className="hover:bg-dark-border/50 transition-colors">
                  <td className="font-medium">{pl.month}</td>
                  <td className="text-green-400">${pl.revenue.toLocaleString()}</td>
                  <td className="text-red-400">${pl.expenses.toLocaleString()}</td>
                  <td className="text-primary-400 font-semibold">${pl.profit.toLocaleString()}</td>
                  <td>
                    <span className="badge badge-success">
                      {((pl.profit / pl.revenue) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Outstanding Dues */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Outstanding Dues</h3>
        <div className="space-y-3">
          {invoices.filter(inv => inv.status !== 'Paid').map((invoice) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinanceBilling;

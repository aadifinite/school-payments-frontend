import clsx from 'clsx';

const headers = [
  { key: 'collect_id', label: 'Collect ID', sortable: true },
  { key: 'school_id', label: 'School ID', sortable: true },
  { key: 'gateway', label: 'Gateway', sortable: true },
  { key: 'order_amount', label: 'Order Amount', sortable: true },
  { key: 'transaction_amount', label: 'Txn Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'custom_order_id', label: 'Custom Order ID', sortable: true }
];

const StatusBadge = ({ status }) => {
  const statusText = typeof status === 'string' ? status : 'Unknown';

  const statusConfig = {
    Success: { color: 'bg-green-100 text-green-800', icon: '✓' },
    Pending: { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
    Failed: { color: 'bg-red-100 text-red-800', icon: '✗' },
    Cancelled: { color: 'bg-gray-100 text-gray-800', icon: '✗' },
    Unknown: { color: 'bg-gray-200 text-gray-600', icon: '?' }
  };

  const config = statusConfig[statusText] || statusConfig.Unknown;

  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', config.color)}>
      <span>{config.icon}</span>
      {statusText}
    </span>
  );
};

export default function TransactionsTable({ data = [], sort, onSort, loading }) {
  const toggleSort = (key) => {
    if (!onSort) return;
    if (!sort || sort.key !== key) return onSort({ key, dir: 'asc' });
    onSort({ key, dir: sort.dir === 'asc' ? 'desc' : 'asc' });
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              {headers.map((h) => (
                <th
                  key={h.key}
                  className={clsx(
                    'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider',
                    h.sortable && 'cursor-pointer'
                  )}
                  onClick={h.sortable ? () => toggleSort(h.key) : undefined}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={headers.length} className="px-6 py-12 text-center">Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={headers.length} className="px-6 py-12 text-center">No transactions found</td></tr>
            ) : (
              data.map((row, index) => (
                <tr key={`${row.collect_id}-${index}`}>
                  <td className="px-6 py-4">{row.collect_id}</td>
                  <td className="px-6 py-4">{row.school_id}</td>
                  <td className="px-6 py-4">{row.gateway}</td>
                  <td className="px-6 py-4">{formatCurrency(row.order_amount)}</td>
                  <td className="px-6 py-4">{formatCurrency(row.transaction_amount)}</td>
                  <td className="px-6 py-4"><StatusBadge status={row.status} /></td>
                  <td className="px-6 py-4">{row.custom_order_id}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

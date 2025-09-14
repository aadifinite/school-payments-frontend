import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const STATUS_OPTIONS = [
  { label: 'Success', value: 'Success', color: 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' },
  { label: 'Pending', value: 'Pending', color: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800' },
  { label: 'Failed', value: 'Failed', color: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' },
  { label: 'Cancelled', value: 'Cancelled', color: 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800' }
];

export default function FiltersBar({ onChange }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);

  const [status, setStatus] = useState(() => searchParams.getAll('status'));
  const [schoolId, setSchoolId] = useState(() => searchParams.get('schoolId') || '');
  const [startDate, setStartDate] = useState(() => searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(() => searchParams.get('endDate') || '');
  const [query, setQuery] = useState(() => searchParams.get('q') || '');

  const filters = useMemo(
    () => ({ status, schoolId, startDate, endDate, q: query }),
    [status, schoolId, startDate, endDate, query]
  );

  const activeFiltersCount = status.length + (schoolId ? 1 : 0) + (startDate ? 1 : 0) + (endDate ? 1 : 0) + (query ? 1 : 0);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (schoolId) params.set('schoolId', schoolId);
    status.forEach((s) => params.append('status', s));
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);

    // only update if something changed
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
    if (onChange) onChange(filters);
  }, [filters, onChange, searchParams, setSearchParams]);

  const toggleStatus = (value) => {
    setStatus((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const reset = () => {
    setStatus([]);
    setSchoolId('');
    setStartDate('');
    setEndDate('');
    setQuery('');
  };

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Search and School ID Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="searchOrderId" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Search Order ID
              </label>
              <input
                id="searchOrderId"
                name="searchOrderId"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter custom order ID..."
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="schoolId" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                School ID
              </label>
              <input
                id="schoolId"
                name="schoolId"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                placeholder="Enter school ID..."
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="startDate" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate || undefined}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Transaction Status
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    name="status"
                    checked={status.includes(opt.value)}
                    onChange={() => toggleStatus(opt.value)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {activeFiltersCount > 0 && `${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} applied`}
            </div>
            <button
              onClick={reset}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

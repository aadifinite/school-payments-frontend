import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import FiltersBar from '../components/FiltersBar.jsx';
import TransactionsTable from '../components/TransactionsTable.jsx';
import Pagination from '../components/Pagination.jsx';
import qs from 'qs';

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');

  const page = Number(searchParams.get('page') || 1);
  const pageSize = Number(searchParams.get('pageSize') || 10);
  const sortKey = searchParams.get('sortKey') || '';
  const sortDir = searchParams.get('sortDir') || 'asc';

  const sort = useMemo(() => (sortKey ? { key: sortKey, dir: sortDir } : null), [sortKey, sortDir]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        limit: pageSize,
        sortBy: sort?.key || 'createdAt',
        order: sort?.dir || 'desc',
        q: searchParams.get('q') || undefined,
        schoolId: searchParams.get('schoolId') || undefined,
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined,
        status: searchParams.getAll('status') || undefined
      };
      const query = qs.stringify(params, { arrayFormat: 'repeat', skipNulls: true });
      const { data } = await api.get(`/transactions?${query}`);
      setRows(data?.data || data?.items || data?.results || data?.transactions || []);
      setTotal(data?.total || data?.count || 0);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || 'Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sort, searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onFiltersChange = () => {
  };

  const onSort = (next) => {
    const params = new URLSearchParams(searchParams);
    if (next) {
      params.set('sortKey', next.key);
      params.set('sortDir', next.dir);
    } else {
      params.delete('sortKey');
      params.delete('sortDir');
    }
    setSearchParams(params);
  };

  const onPageChange = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(p));
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">DAV School Payment Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">View and manage all school payment transactions</p>
          </div>
        </div>
        
        {total > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Transactions</p>
                  <p className="text-2xl font-semibold text-blue-900 dark:text-blue-100">{total.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">Success Rate</p>
                  <p className="text-2xl font-semibold text-green-900 dark:text-green-100">
                    {rows.filter(r => r.status === 'Success').length > 0 
                      ? Math.round((rows.filter(r => r.status === 'Success').length / rows.length) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Total Amount</p>
                  <p className="text-2xl font-semibold text-purple-900 dark:text-purple-100">
                    ₹{rows.reduce((sum, r) => sum + Number(r.transaction_amount || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <FiltersBar onChange={onFiltersChange} />
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading data</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</div>
              <div className="mt-4">
                <button
                  onClick={fetchData}
                  className="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-200 dark:bg-red-800 dark:text-red-200 dark:hover:bg-red-700"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <TransactionsTable data={rows} sort={sort} onSort={onSort} loading={loading} />
      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={onPageChange} />
    </div>
  );
}

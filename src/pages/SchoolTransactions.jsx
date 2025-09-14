import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import TransactionsTable from '../components/TransactionsTable.jsx';
import Pagination from '../components/Pagination.jsx';
import { useSearchParams } from 'react-router-dom';
import qs from 'qs';

export default function SchoolTransactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [schoolId, setSchoolId] = useState(searchParams.get('schoolId') || '');
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);

  const page = Number(searchParams.get('page') || 1);
  const pageSize = Number(searchParams.get('pageSize') || 10);

  // Fetch available schools from transactions data
  useEffect(() => {
    const fetchSchools = async () => {
      setSchoolsLoading(true);
      try {
        // Get all transactions to extract unique school IDs
        const { data } = await api.get('/transactions?page=1&limit=1000');
        const transactions = data?.data || [];
        const uniqueSchools = [...new Set(transactions.map(t => t.school_id))]
          .map(schoolId => ({
            id: schoolId,
            school_id: schoolId,
            name: `School ${schoolId}`
          }));
        setSchools(uniqueSchools);
      } catch (e) {
        console.log('Could not fetch schools from transactions');
        setSchools([]);
      } finally {
        setSchoolsLoading(false);
      }
    };
    fetchSchools();
  }, []);

  useEffect(() => {
    const fetchBySchool = async () => {
      if (!schoolId) {
        setRows([]);
        setTotal(0);
        return;
      }
      setLoading(true);
      try {
        // Use the main transactions endpoint with school filter
        const query = qs.stringify({ page, pageSize, schoolId }, { skipNulls: true });
        const { data } = await api.get(`/transactions?${query}`);
        setRows(data?.data || []);
        setTotal(data?.total || 0);
      } catch (e) {
        console.error('Failed to fetch school transactions:', e);
        setRows([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchBySchool();
  }, [schoolId, page, pageSize]);

  const onSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (schoolId) params.set('schoolId', schoolId);
    else params.delete('schoolId');
    params.set('page', '1');
    setSearchParams(params);
  };

  const selectedSchool = schools.find(s => s.id === schoolId || s.school_id === schoolId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">DAV School Transactions</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">View transactions for a specific school</p>
          </div>
        </div>

        {/* School Selection */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select School
              </label>
              {schools.length > 0 ? (
                <select
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                >
                  <option value="">Choose a school...</option>
                  {schools.map((school) => (
                    <option key={school.id || school.school_id} value={school.id || school.school_id}>
                      {school.name || school.school_name || `School ${school.id || school.school_id}`}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="relative">
                  <input
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    placeholder="Enter school ID manually..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                  />
                  {schoolsLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={!schoolId || loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {loading ? 'Loading...' : 'Load Transactions'}
              </button>
            </div>
          </div>
        </form>

        {/* Selected School Info */}
        {selectedSchool && (
          <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Selected: {selectedSchool.name || selectedSchool.school_name || `School ${selectedSchool.id || selectedSchool.school_id}`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {schoolId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Transaction Results
              {total > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({total} total)
                </span>
              )}
            </h2>
          </div>
          
          <TransactionsTable data={rows} loading={loading} />
          
          {total > 0 && (
            <Pagination 
              page={page} 
              pageSize={pageSize} 
              total={total} 
              onPageChange={(p) => {
                const params = new URLSearchParams(searchParams);
                params.set('page', String(p));
                setSearchParams(params);
              }} 
            />
          )}
        </div>
      )}

      {/* Empty State */}
      {!schoolId && (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No school selected</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Choose a school from the dropdown above to view its transactions.
          </p>
        </div>
      )}
    </div>
  );
}

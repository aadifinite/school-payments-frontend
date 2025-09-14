import { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function BackendCheck() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setError('');
      try {
        const { data } = await api.get('/health');
        setStatus(data);
      } catch (e) {
        setError(e.response?.data?.message || 'Backend not reachable');
      }
    })();
  }, []);

  return (
    <div className="rounded border border-gray-200 bg-white p-3 text-xs dark:border-gray-800 dark:bg-gray-800">
      <div className="mb-2 font-medium">Backend</div>
      {status && (
        <pre className="overflow-auto">{JSON.stringify(status, null, 2)}</pre>
      )}
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
}




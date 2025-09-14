import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../api/axios.js';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        // Check if token exists and try to make a request
        const token = localStorage.getItem('token');
        if (!token) {
          if (mounted) setIsAuthed(false);
          return;
        }
        // Try to fetch transactions to verify token
        await api.get('/transactions?page=1&limit=1');
        if (mounted) setIsAuthed(true);
      } catch {
        if (mounted) setIsAuthed(false);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-4 text-sm opacity-75">Checking auth...</div>;
  if (!isAuthed) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}




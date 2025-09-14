import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

export default function AuthStatus() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      // Check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }
      // Try to fetch user data by making a simple API call
      await api.get('/transactions?page=1&limit=1');
      // If successful, we have a valid token, show as logged in
      setUser({ username: 'User', email: 'user@davschool.com' });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const logout = async () => {
    try {
      // Backend doesn't have logout endpoint, just clear local storage
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    } catch {}
  };

  if (loading) return <span className="text-sm opacity-75">...</span>;

  if (!user) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Link className="hover:underline" to="/login">Login</Link>
        <span>·</span>
        <Link className="hover:underline" to="/register">Register</Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="opacity-90">{user.name || user.email || 'Signed in'}</span>
      <button className="btn-secondary" onClick={logout}>Logout</button>
    </div>
  );
}




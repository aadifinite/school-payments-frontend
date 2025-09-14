import { NavLink, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import SchoolTransactions from './pages/SchoolTransactions.jsx';
import StatusCheckPage from './pages/StatusCheckPage.jsx';
import DarkModeToggle from './components/DarkModeToggle.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AuthStatus from './components/AuthStatus.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Logo from './components/Logo.jsx';
import CreatePayment from './pages/CreatePayment.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Logo className="h-10 w-auto" />
          <nav className="flex items-center gap-1">
            <NavLink 
              to="/"
              className={({isActive}) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100'
              }`} 
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/by-school"
              className={({isActive}) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100'
              }`} 
            >
              By School
            </NavLink>
            <NavLink 
              to="/status-check"
              className={({isActive}) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100'
              }`} 
            >
              Status Check
            </NavLink>
            <NavLink 
              to="/create-payment"
              className={({isActive}) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100'
              }`} 
            >
              Create Payment
            </NavLink>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
            <DarkModeToggle />
            <AuthStatus />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/by-school" element={<ProtectedRoute><SchoolTransactions /></ProtectedRoute>} />
          <Route path="/status-check" element={<StatusCheckPage />} />
          <Route path="/create-payment" element={<ProtectedRoute><CreatePayment /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

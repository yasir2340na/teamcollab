import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Cleanup effect for animation
  useEffect(() => {
    return () => document.body.classList.remove('animate-fade-in');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-xl">
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          TeamCollab
        </motion.div>
        
        <div className="flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link to="/" className="flex items-center space-x-2 hover:text-blue-300 transition-colors">
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-red-500/90 hover:bg-red-600 px-4 py-2 rounded-lg font-medium shadow-md transition-all"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <div className="flex space-x-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link to="/login" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                  Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link 
                  to="/signup" 
                  className="bg-blue-500/90 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium shadow-md transition-all"
                >
                  Sign Up
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full"
                >
                  <Dashboard />
                </motion.div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/tasks/:projectId"
            element={
              isLoggedIn ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full"
                >
                  <TasksPage />
                </motion.div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              !isLoggedIn ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Login />
                </motion.div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !isLoggedIn ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Signup />
                </motion.div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}

// Wrap App with BrowserRouter
export default function WrappedApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
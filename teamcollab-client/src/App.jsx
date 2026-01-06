import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import NotificationBell from './components/NotificationBell';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
  HomeIcon, 
  ArrowRightOnRectangleIcon, 
  SparklesIcon,
  Bars3Icon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Cleanup effect for animation
  useEffect(() => {
    return () => document.body.classList.remove('animate-fade-in');
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Enhanced Navbar with glassmorphism */}
      <nav className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div className="h-10 w-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  TeamCollab
                </span>
              </motion.div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                      to="/" 
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/20 text-white transition-all duration-300"
                    >
                      <HomeIcon className="h-5 w-5" />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                  </motion.div>
                  <NotificationBell />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-5 py-2.5 rounded-xl font-medium shadow-lg transition-all text-white"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>Logout</span>
                  </motion.button>
                </>
              ) : (
                <div className="flex space-x-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                      to="/login" 
                      className="px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all text-white font-medium"
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                      to="/signup" 
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 px-5 py-2.5 rounded-xl font-medium shadow-lg transition-all text-white"
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-white/20 bg-white/5 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {isLoggedIn ? (
                  <>
                    <Link 
                      to="/" 
                      className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-white/20 text-white transition-all"
                    >
                      <HomeIcon className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 px-4 py-3 rounded-lg font-medium text-white"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="block px-4 py-3 rounded-lg hover:bg-white/20 text-white transition-all"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signup" 
                      className="block bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3 rounded-lg font-medium text-white text-center"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
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
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
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
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Signup />
                  </motion.div>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
        />
      </div>
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
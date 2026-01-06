// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  BellIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Tasks',
      description: 'Get intelligent task suggestions using advanced AI to break down your projects'
    },
    {
      icon: BoltIcon,
      title: 'Real-time Collaboration',
      description: 'Work together seamlessly with live updates and instant synchronization'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Team Comments',
      description: 'Discuss tasks with your team through threaded comments and mentions'
    },
    {
      icon: ChartBarIcon,
      title: 'Advanced Analytics',
      description: 'Track progress with priority statistics and completion metrics'
    },
    {
      icon: BellIcon,
      title: 'Smart Notifications',
      description: 'Stay updated with in-app notifications for important team activities'
    },
    {
      icon: ClockIcon,
      title: 'Activity Timeline',
      description: 'Complete history of all project events and team member actions'
    }
  ];

  const stats = [
    { number: '10x', label: 'Faster Setup' },
    { number: '100%', label: 'Free & Open Source' },
    { number: '24/7', label: 'Real-time Sync' },
    { number: '∞', label: 'Unlimited Projects' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
              <RocketLaunchIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">TeamCollab</span>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-white font-semibold hover:text-purple-300 transition-colors"
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl text-white font-semibold shadow-2xl hover:shadow-purple-500/50 transition-all"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="inline-block mb-4"
              >
                <span className="px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 text-sm font-semibold">
                  ✨ AI-Powered Project Management
                </span>
              </motion.div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Manage Projects
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Like Never Before
                </span>
              </h1>
              
              <p className="text-xl text-white/70 mb-8 leading-relaxed">
                Experience the future of team collaboration with AI-powered task management, 
                real-time updates, and beautiful modern design. Everything you need to succeed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl text-white text-lg font-bold shadow-2xl hover:shadow-purple-500/50 transition-all"
                >
                  Start Free Today
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-xl text-white text-lg font-bold hover:bg-white/20 transition-all"
                >
                  Login
                </motion.button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mt-12">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-xs sm:text-sm text-white/60">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Animated Dashboard Preview */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative">
                {/* Floating Cards */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [-2, 2, -2]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-0 right-0 w-48 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-2xl p-4 border border-white/20"
                >
                  <CheckCircleIcon className="h-8 w-8 text-white mb-2" />
                  <div className="text-white font-semibold mb-1">Tasks Done</div>
                  <div className="text-3xl font-bold text-white">47</div>
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 20, 0],
                    rotate: [2, -2, 2]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute bottom-0 left-0 w-48 h-32 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl shadow-2xl p-4 border border-white/20"
                >
                  <UserGroupIcon className="h-8 w-8 text-white mb-2" />
                  <div className="text-white font-semibold mb-1">Team Members</div>
                  <div className="text-3xl font-bold text-white">12</div>
                </motion.div>

                {/* Center Main Card */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative mx-auto w-64 h-80 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                    <div>
                      <div className="h-3 w-24 bg-white/30 rounded-full" />
                      <div className="h-2 w-16 bg-white/20 rounded-full mt-2" />
                    </div>
                  </div>
                  
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.2 }}
                      className="bg-white/5 rounded-xl p-3 mb-3"
                    >
                      <div className="h-2 bg-white/40 rounded-full mb-2" />
                      <div className="h-2 w-3/4 bg-white/20 rounded-full" />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Everything You Need to <span className="text-purple-400">Succeed</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Powerful features designed for modern teams who want to move fast and stay organized
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-purple-400/50 transition-all group"
              >
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-12 text-center shadow-2xl"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of teams already using TeamCollab to build amazing projects together
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/signup')}
            className="px-12 py-5 bg-white text-purple-600 rounded-xl text-xl font-bold shadow-2xl hover:shadow-white/50 transition-all"
          >
            Get Started - It's Free! 🚀
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <RocketLaunchIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TeamCollab</span>
          </div>
          <p className="text-white/50 mb-4">
            Built with ❤️ using React, Node.js, MongoDB, and Mistral AI
          </p>
          <p className="text-white/30 text-sm">
            © 2026 TeamCollab. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

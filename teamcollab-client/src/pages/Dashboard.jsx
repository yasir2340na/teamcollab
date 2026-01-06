import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SparklesIcon, 
  ArrowRightIcon, 
  LightBulbIcon, 
  PlusIcon,
  FolderIcon,
  ChartBarIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';
import { suggestTasks } from '../services/ai';

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [suggestions, setSuggestions] = useState({});
  const [loadingSuggestions, setLoadingSuggestions] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleSuggestTasks = async (project) => {
    try {
      setLoadingSuggestions((prev) => ({ ...prev, [project._id]: true }));
      const tasks = await suggestTasks(project.name, project.description);
      setSuggestions((prev) => ({ ...prev, [project._id]: tasks }));
    } catch (err) {
      setSuggestions((prev) => ({ ...prev, [project._id]: '⚠️ Failed to generate tasks.' }));
      console.error('Suggestion error:', err);
    } finally {
      setLoadingSuggestions((prev) => ({ ...prev, [project._id]: false }));
    }
  };

  const handleCreate = async () => {
    if (!newProject.name) return;
    try {
      await api.post('/projects', newProject);
      setNewProject({ name: '', description: '' });
      setShowCreateForm(false);
      fetchProjects();
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`);
      fetchProjects();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status !== 'completed').length,
    completed: projects.filter(p => p.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Stats */}
        <div className="mb-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
          >
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 flex items-center gap-3">
                <SparklesIcon className="h-10 w-10 text-purple-400" />
                Your Projects
              </h1>
              <p className="text-purple-300">Manage and track all your projects in one place</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 px-6 py-3 rounded-xl font-semibold shadow-2xl transition-all text-white"
            >
              <PlusIcon className="h-5 w-5" />
              New Project
            </motion.button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              { label: 'Total Projects', value: stats.total, icon: FolderIcon, color: 'from-blue-500 to-cyan-500' },
              { label: 'Active', value: stats.active, icon: ChartBarIcon, color: 'from-purple-500 to-pink-500' },
              { label: 'Completed', value: stats.completed, icon: SparklesIcon, color: 'from-green-500 to-emerald-500' }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`h-14 w-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Create Project Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <PlusIcon className="h-6 w-6 text-purple-400" />
                    Create New Project
                  </h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/90 font-medium mb-2">Project Name *</label>
                    <input
                      type="text"
                      placeholder="Enter project name"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all text-white placeholder-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/90 font-medium mb-2">Description</label>
                    <textarea
                      placeholder="What's this project about?"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all text-white placeholder-white/50 h-32 resize-none"
                    />
                  </div>
                  <motion.button
                    onClick={handleCreate}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!newProject.name}
                    className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-xl font-semibold shadow-xl transition-all"
                  >
                    Create Project
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 max-w-md mx-auto">
              <FolderIcon className="h-20 w-20 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No projects yet</h3>
              <p className="text-white/70 mb-6">Create your first project to get started! 🚀</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 rounded-xl font-semibold text-white shadow-xl"
              >
                Create Project
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-purple-400/50"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                    <p className="text-white/70 text-sm line-clamp-2 mb-4">
                      {project.description || 'No description'}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setDeleteConfirm(project._id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </motion.button>
                </div>

                {/* Delete Confirmation */}
                <AnimatePresence>
                  {deleteConfirm === project._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3"
                    >
                      <p className="text-white text-sm mb-2">Delete this project?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        >
                          Yes, delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/tasks/${project._id}`)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-400/30 text-white rounded-xl transition-all duration-300 group/btn"
                  >
                    <span className="font-medium">View Tasks</span>
                    <ArrowRightIcon className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSuggestTasks(project)}
                    disabled={loadingSuggestions[project._id]}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-yellow-400/50 hover:border-yellow-400 hover:bg-yellow-400/10 text-yellow-300 rounded-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {loadingSuggestions[project._id] ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <LightBulbIcon className="h-5 w-5" />
                        <span>AI Suggest Tasks</span>
                      </>
                    )}
                  </motion.button>

                  {suggestions[project._id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-xl text-sm text-yellow-200">
                        <div className="font-medium mb-2 flex items-center gap-2">
                          <LightBulbIcon className="h-4 w-4" />
                          AI Suggestions:
                        </div>
                        <div className="whitespace-pre-wrap text-yellow-100/90">{suggestions[project._id]}</div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
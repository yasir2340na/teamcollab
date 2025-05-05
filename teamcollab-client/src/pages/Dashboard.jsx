import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, ArrowRightIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import { suggestTasks } from '../services/ai';

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [suggestions, setSuggestions] = useState({});
  const [loadingSuggestions, setLoadingSuggestions] = useState({});

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
      fetchProjects();
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          <SparklesIcon className="h-8 w-8 inline-block mr-3 text-blue-500" />
          Your Projects
        </motion.h1>

        {/* Add new project card */}
        <motion.div 
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl shadow-blue-100/50 mb-8"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700">➕ New Project</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
            <textarea
              placeholder="Project description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 h-32"
            />
            <motion.button
              onClick={handleCreate}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              Create Project
            </motion.button>
          </div>
        </motion.div>

        {/* Projects grid */}
        <AnimatePresence>
          {projects.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-center py-12"
            >
              No projects found. Let's create one! 🚀
            </motion.p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{project.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate(`/tasks/${project._id}`)}
                      className="w-full flex items-center justify-between px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-300"
                    >
                      <span>View Tasks</span>
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </button>

                    <button
                      onClick={() => handleSuggestTasks(project)}
                      className="w-full flex items-center justify-center px-4 py-2 border border-yellow-500 hover:border-yellow-600 text-yellow-600 rounded-lg transition-all duration-300 hover:bg-yellow-50"
                    >
                      <LightBulbIcon className="h-5 w-5 mr-2" />
                      {loadingSuggestions[project._id] ? 'Generating...' : 'Suggest Tasks'}
                    </button>

                    {loadingSuggestions[project._id] && (
                      <div className="flex justify-center items-center py-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
                      </div>
                    )}

                    {suggestions[project._id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800 border border-yellow-100"
                      >
                        {suggestions[project._id]}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
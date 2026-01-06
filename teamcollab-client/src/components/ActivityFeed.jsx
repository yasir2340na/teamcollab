import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClockIcon, UserCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

export default function ActivityFeed({ projectId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/activities/${projectId}`);
      setActivities(res.data);
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) fetchActivities();
  }, [projectId, fetchActivities]);

  const getActivityIcon = (action) => {
    switch (action) {
      case 'created':
        return <SparklesIcon className="h-4 w-4" />;
      case 'updated':
        return <ClockIcon className="h-4 w-4" />;
      default:
        return <UserCircleIcon className="h-4 w-4" />;
    }
  };

  const getActivityColor = (action) => {
    switch (action) {
      case 'created':
        return 'from-green-400 to-emerald-500';
      case 'updated':
        return 'from-blue-400 to-purple-500';
      case 'deleted':
        return 'from-red-400 to-pink-500';
      default:
        return 'from-gray-400 to-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <ClockIcon className="h-5 w-5 text-purple-400 animate-pulse" />
          <h3 className="text-white font-bold">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-white/10 rounded w-3/4" />
                <div className="h-2 bg-white/10 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-purple-400" />
          Recent Activity
        </h3>
        <span className="text-white/50 text-sm">{activities.length} events</span>
      </div>
      
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-white/50">
            <ClockIcon className="h-12 w-12 mb-2 opacity-30" />
            <p className="text-sm text-center">No activity yet.<br />Start working on tasks!</p>
          </div>
        ) : (
          <AnimatePresence>
            {activities.map((activity, index) => (
              <motion.div
                key={activity._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3 group hover:bg-white/5 p-2 rounded-lg transition-all"
              >
                {/* Avatar with Gradient */}
                <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${getActivityColor(activity.action)} flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg`}>
                  {getActivityIcon(activity.action)}
                </div>
                
                {/* Activity Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-white/90 text-sm font-medium">
                        <span className="text-purple-300 font-semibold">
                          {activity.user?.name || 'Someone'}
                        </span>
                        {' '}
                        <span className="text-white/70">{activity.description}</span>
                      </p>
                      <p className="text-white/40 text-xs mt-1 flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        {new Date(activity.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    
                    {/* Activity Type Badge */}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getActivityColor(activity.action)} text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity`}>
                      {activity.action}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </div>
  );
}

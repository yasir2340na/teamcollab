import { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

export default function TaskCommentsModal({ task, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchComments = useCallback(async () => {
    try {
      const res = await api.get(`/comments/${task._id}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  }, [task._id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await api.post('/comments', { taskId: task._id, text: newComment });
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Delete this comment?')) return;

    try {
      await api.delete(`/comments/${commentId}`);
      fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Failed to delete comment');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-800/95 backdrop-blur-xl rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col border border-white/20 shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
              <ChatBubbleLeftIcon className="h-6 w-6 text-purple-400" />
              Comments
            </h2>
            <p className="text-white/60 text-sm">{task.title}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 custom-scrollbar">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/50">
              <ChatBubbleLeftIcon className="h-16 w-16 mb-3 opacity-30" />
              <p className="text-center">No comments yet.<br />Be the first to share your thoughts!</p>
            </div>
          ) : (
            <AnimatePresence>
              {comments.map((comment) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">
                      {comment.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    
                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-white font-semibold">{comment.user?.name || 'Unknown'}</p>
                        {comment.user?._id === currentUser.id && (
                          <button
                            onClick={() => handleDelete(comment._id)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all p-1 hover:bg-red-400/10 rounded"
                            title="Delete comment"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-white/50 text-xs mb-2">
                        {new Date(comment.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-white/90 break-words">{comment.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            disabled={loading}
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all disabled:opacity-50"
          />
          <motion.button
            type="submit"
            disabled={!newComment.trim() || loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transition-all"
          >
            {loading ? 'Sending...' : 'Send'}
          </motion.button>
        </form>
      </motion.div>

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
    </motion.div>
  );
}

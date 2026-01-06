import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  ChatBubbleLeftIcon,
  TagIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import TaskCommentsModal from '../components/TaskCommentsModal';
import ActivityFeed from '../components/ActivityFeed';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://teamcollab-1-gbpq.onrender.com';
const socket = io(SOCKET_URL);

export default function TasksPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [selectedTaskForComments, setSelectedTaskForComments] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showActivityFeed, setShowActivityFeed] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchProjectName();
    
    socket.on('tasksUpdated', (updatedProjectId) => {
      if (updatedProjectId === projectId) fetchTasks();
    });
    
    return () => socket.off('tasksUpdated');
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks/${projectId}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const fetchProjectName = async () => {
    try {
      const res = await api.get('/projects');
      const project = res.data.find(p => p._id === projectId);
      setProjectName(project?.name || 'Project');
    } catch (err) {
      console.error('Error fetching project:', err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    if (confirm('Delete this task?')) {
      await api.delete(`/tasks/${taskId}`);
      socket.emit('tasksUpdated', projectId);
      fetchTasks();
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    
    const updatedTask = tasks.find(task => task._id === draggableId);
    updatedTask.status = destination.droppableId;
    await api.put(`/tasks/${draggableId}`, updatedTask);
    socket.emit('tasksUpdated', projectId);
    fetchTasks();
  };

  // Priority Colors
  const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  };

  const priorityTextColors = {
    low: 'text-green-300',
    medium: 'text-yellow-300',
    high: 'text-red-300'
  };

  // Filter and Search Tasks
  const filteredTasks = tasks.filter(task => {
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  
  const columns = {
    todo: { 
      name: 'To Do', 
      tasks: sortedTasks.filter(t => t.status === 'todo'),
      color: 'from-blue-500 to-cyan-500',
      icon: ClockIcon
    },
    inprogress: { 
      name: 'In Progress', 
      tasks: sortedTasks.filter(t => t.status === 'inprogress'),
      color: 'from-purple-500 to-pink-500',
      icon: ChartBarIcon
    },
    done: { 
      name: 'Done', 
      tasks: sortedTasks.filter(t => t.status === 'done'),
      color: 'from-green-500 to-emerald-500',
      icon: CheckCircleIcon
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      todo: 'bg-blue-500',
      inprogress: 'bg-purple-500',
      done: 'bg-green-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -5 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Dashboard
          </motion.button>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{projectName}</h1>
              <p className="text-purple-300">Manage your tasks with drag & drop</p>
            </motion.div>
            
            <div className="flex gap-2">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowActivityFeed(!showActivityFeed)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl font-semibold shadow-xl transition-all text-white border border-white/20"
              >
                <ClockIcon className="h-5 w-5" />
                Activity
              </motion.button>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { 
                  setEditingTask(null); 
                  setShowForm(!showForm); 
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 px-6 py-3 rounded-xl font-semibold shadow-2xl transition-all text-white"
              >
                <PlusIcon className="h-5 w-5" />
                Add Task
              </motion.button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
            <p className="text-white/70 text-sm">Total</p>
            <p className="text-2xl font-bold text-white">{tasks.length}</p>
          </div>
          <div className="bg-red-500/20 backdrop-blur-xl rounded-xl p-4 border border-red-400/30">
            <p className="text-red-200 text-sm">High Priority</p>
            <p className="text-2xl font-bold text-white">{tasks.filter(t => t.priority === 'high').length}</p>
          </div>
          <div className="bg-yellow-500/20 backdrop-blur-xl rounded-xl p-4 border border-yellow-400/30">
            <p className="text-yellow-200 text-sm">Medium Priority</p>
            <p className="text-2xl font-bold text-white">{tasks.filter(t => t.priority === 'medium').length}</p>
          </div>
          <div className="bg-green-500/20 backdrop-blur-xl rounded-xl p-4 border border-green-400/30">
            <p className="text-green-200 text-sm">Low Priority</p>
            <p className="text-2xl font-bold text-white">{tasks.filter(t => t.priority === 'low').length}</p>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <AnimatePresence>
          {showActivityFeed && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <ActivityFeed projectId={projectId} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          {/* Search Bar */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex gap-2 items-center">
            <FunnelIcon className="h-5 w-5 text-white/70" />
            {['all', 'high', 'medium', 'low'].map(priority => (
              <button
                key={priority}
                onClick={() => setPriorityFilter(priority)}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  priorityFilter === priority
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
                }`}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Task Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingTask(null);
                    }}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <Formik
                  enableReinitialize
                  initialValues={{
                    title: editingTask?.title || '',
                    description: editingTask?.description || '',
                    status: editingTask?.status || 'todo',
                    dueDate: editingTask?.dueDate?.slice(0, 10) || '',
                    assignedTo: editingTask?.assignedTo || '',
                    priority: editingTask?.priority || 'medium',
                    tags: editingTask?.tags?.join(', ') || ''
                  }}
                  validationSchema={Yup.object({
                    title: Yup.string().required('Title is required'),
                    dueDate: Yup.date().required('Due date is required')
                  })}
                  onSubmit={async (values, { resetForm }) => {
                    const taskData = {
                      ...values,
                      tags: values.tags ? values.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                      project: projectId
                    };
                    
                    if (editingTask) {
                      await api.put(`/tasks/${editingTask._id}`, taskData);
                    } else {
                      await api.post('/tasks', taskData);
                    }
                    resetForm();
                    fetchTasks();
                    setShowForm(false);
                    setEditingTask(null);
                    socket.emit('tasksUpdated', projectId);
                  }}
                >
                  <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-white/90 font-medium mb-2">Title *</label>
                      <Field 
                        name="title" 
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/50 transition-all"
                        placeholder="Task title"
                      />
                      <ErrorMessage name="title">
                        {msg => <div className="text-red-300 text-sm mt-1">{msg}</div>}
                      </ErrorMessage>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white/90 font-medium mb-2">Description</label>
                      <Field 
                        as="textarea" 
                        name="description" 
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/50 transition-all min-h-[100px] resize-none"
                        placeholder="Task description"
                      />
                    </div>

                    <div>
                      <label className="block text-white/90 font-medium mb-2">Status</label>
                      <Field 
                        as="select" 
                        name="status" 
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 text-white transition-all"
                      >
                        <option value="todo" className="bg-slate-800">To Do</option>
                        <option value="inprogress" className="bg-slate-800">In Progress</option>
                        <option value="done" className="bg-slate-800">Done</option>
                      </Field>
                    </div>

                    <div>
                      <label className="block text-white/90 font-medium mb-2">Priority *</label>
                      <Field 
                        as="select" 
                        name="priority" 
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 text-white transition-all"
                      >
                        <option value="low" className="bg-slate-800">🟢 Low</option>
                        <option value="medium" className="bg-slate-800">🟡 Medium</option>
                        <option value="high" className="bg-slate-800">🔴 High</option>
                      </Field>
                    </div>

                    <div>
                      <label className="block text-white/90 font-medium mb-2">Due Date *</label>
                      <Field 
                        type="date" 
                        name="dueDate" 
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 text-white transition-all"
                      />
                      <ErrorMessage name="dueDate">
                        {msg => <div className="text-red-300 text-sm mt-1">{msg}</div>}
                      </ErrorMessage>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white/90 font-medium mb-2">Assigned To</label>
                      <Field 
                        name="assignedTo" 
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/50 transition-all"
                        placeholder="Assignee name"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white/90 font-medium mb-2 flex items-center gap-2">
                        <TagIcon className="h-5 w-5 text-purple-400" />
                        Tags (comma-separated)
                      </label>
                      <Field 
                        name="tags" 
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/50 transition-all"
                        placeholder="frontend, urgent, bug-fix"
                      />
                      <p className="text-white/50 text-xs mt-1">Separate multiple tags with commas</p>
                    </div>

                    <div className="md:col-span-2">
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold shadow-xl transition-all"
                      >
                        {editingTask ? 'Update Task' : 'Create Task'}
                      </motion.button>
                    </div>
                  </Form>
                </Formik>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(columns).map(([columnId, column]) => (
              <Droppable droppableId={columnId} key={columnId}>
                {(provided, snapshot) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col"
                  >
                    {/* Column Header */}
                    <div className={`bg-gradient-to-r ${column.color} rounded-t-2xl p-4 mb-2`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white">
                          <column.icon className="h-5 w-5" />
                          <h3 className="font-bold">{column.name}</h3>
                        </div>
                        <span className="bg-white/30 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {column.tasks.length}
                        </span>
                      </div>
                    </div>

                    {/* Column Content */}
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 bg-white/5 backdrop-blur-sm rounded-b-2xl border-2 border-t-0 ${
                        snapshot.isDraggingOver ? 'border-purple-400' : 'border-white/10'
                      } p-4 min-h-[400px] transition-colors`}
                    >
                      <AnimatePresence>
                        {column.tasks.map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <motion.div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ scale: 1.02 }}
                                className={`bg-white/10 backdrop-blur-xl rounded-xl p-4 mb-3 border border-white/20 shadow-lg ${
                                  snapshot.isDragging ? 'shadow-2xl ring-2 ring-purple-400' : ''
                                } transition-all cursor-move`}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-white pr-2 mb-2">
                                      {task.title}
                                    </h4>
                                    {/* Priority & Tags */}
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className={`${priorityColors[task.priority || 'medium']} px-2 py-1 rounded-full text-xs font-semibold text-white shadow-md`}>
                                        {(task.priority || 'medium').toUpperCase()}
                                      </span>
                                      {task.tags && task.tags.length > 0 && task.tags.map((tag, idx) => (
                                        <span key={idx} className="bg-purple-500/30 border border-purple-400/50 px-2 py-1 rounded-full text-xs text-purple-200 flex items-center gap-1">
                                          <TagIcon className="h-3 w-3" />
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                
                                {task.description && (
                                  <p className="text-white/70 text-sm mb-3 line-clamp-2">
                                    {task.description}
                                  </p>
                                )}
                                
                                <div className="space-y-2 mb-3">
                                  <div className="flex items-center gap-2 text-white/70 text-sm">
                                    <ClockIcon className="h-4 w-4" />
                                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                  </div>
                                  {task.assignedTo && (
                                    <div className="flex items-center gap-2 text-white/70 text-sm">
                                      <UserIcon className="h-4 w-4" />
                                      <span>{task.assignedTo}</span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex gap-2 pt-3 border-t border-white/10">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setSelectedTaskForComments(task)}
                                    className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm transition-colors"
                                  >
                                    <ChatBubbleLeftIcon className="h-4 w-4" />
                                    Comments
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleEdit(task)}
                                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                    Edit
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDelete(task._id)}
                                    className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm transition-colors"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                    Delete
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}
                          </Draggable>
                        ))}
                      </AnimatePresence>
                      {provided.placeholder}
                      
                      {column.tasks.length === 0 && (
                        <div className="flex items-center justify-center h-40 text-white/50 text-sm">
                          No tasks yet
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        {/* Task Comments Modal */}
        <AnimatePresence>
          {selectedTaskForComments && (
            <TaskCommentsModal
              task={selectedTaskForComments}
              onClose={() => setSelectedTaskForComments(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
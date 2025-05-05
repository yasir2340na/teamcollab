import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';

const socket = io('http://localhost:5000');

export default function TasksPage() {
  // ▼▼▼ ORIGINAL LOGIC STARTS ▼▼▼
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
    socket.on('tasksUpdated', (updatedProjectId) => {
      if (updatedProjectId === projectId) fetchTasks();
    });
    return () => socket.off('tasksUpdated');
  }, [projectId]);

  const fetchTasks = async () => {
    const res = await api.get(`/tasks/${projectId}`);
    setTasks(res.data);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    if (confirm('Are you sure?')) {
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

  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const columns = {
    todo: { name: 'To Do', tasks: sortedTasks.filter(t => t.status === 'todo') },
    inprogress: { name: 'In Progress', tasks: sortedTasks.filter(t => t.status === 'inprogress') },
    done: { name: 'Done', tasks: sortedTasks.filter(t => t.status === 'done') }
  };
  // ▲▲▲ ORIGINAL LOGIC ENDS ▲▲▲

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-blue-50">
      {/* ▼▼▼ Original Dashboard Summary - Styled ▼▼▼ */}
      <div className="mb-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-xl shadow-lg flex gap-6 justify-around text-center">
        <div>📋 Total: {tasks.length}</div>
        <div>🕒 To Do: {columns.todo.tasks.length}</div>
        <div>⚙️ In Progress: {columns.inprogress.tasks.length}</div>
        <div>✅ Done: {columns.done.tasks.length}</div>
      </div>

      {/* ▼▼▼ Original Header & Button - Styled ▼▼▼ */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setEditingTask(null); setShowForm(!showForm); }}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-700 transition-all"
        >
          + Add Task
        </motion.button>
      </div>

      {/* ▼▼▼ Original Form - Styled ▼▼▼ */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-6 rounded-xl shadow-lg mb-6"
          >
            <Formik
              enableReinitialize
              initialValues={{
                title: editingTask?.title || '',
                description: editingTask?.description || '',
                status: editingTask?.status || 'todo',
                dueDate: editingTask?.dueDate?.slice(0, 10) || '',
                assignedTo: editingTask?.assignedTo || ''
              }}
              validationSchema={Yup.object({
                title: Yup.string().required('Required'),
                dueDate: Yup.date().required('Required')
              })}
              onSubmit={async (values, { resetForm }) => {
                if (editingTask) {
                  await api.put(`/tasks/${editingTask._id}`, { ...values, project: projectId });
                } else {
                  await api.post('/tasks', { ...values, project: projectId });
                }
                resetForm();
                fetchTasks();
                setShowForm(false);
                setEditingTask(null);
                socket.emit('tasksUpdated', projectId);
              }}
            >
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* All original form fields with styling */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <Field 
                    name="title" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Field 
                    as="select" 
                    name="status" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Done</option>
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <Field 
                    as="textarea" 
                    name="description" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <Field 
                    type="date" 
                    name="dueDate" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <ErrorMessage name="dueDate" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <Field 
                    name="assignedTo" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </motion.button>
                </div>
              </Form>
            </Formik>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ▼▼▼ Original Columns - Styled ▼▼▼ */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(columns).map(([columnId, column]) => (
            <Droppable droppableId={columnId} key={columnId}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-50 p-4 rounded-xl shadow-inner"
                >
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">{column.name}</h3>
                  {column.tasks.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <motion.div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white p-4 rounded-lg shadow-sm mb-3 border border-gray-200"
                        >
                          <div className="font-medium text-gray-800">{task.title}</div>
                          <div className="text-sm text-gray-600 mt-2">{task.description}</div>
                          <div className="mt-2 text-xs text-gray-500">
                            <div>📅 {new Date(task.dueDate).toLocaleDateString()}</div>
                            <div>👤 {task.assignedTo || 'Unassigned'}</div>
                          </div>
                          <div className="mt-2 flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => handleEdit(task)}
                              className="text-purple-600 hover:text-purple-800 text-sm"
                            >
                              ✏️ Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => handleDelete(task._id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              🗑️ Delete
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
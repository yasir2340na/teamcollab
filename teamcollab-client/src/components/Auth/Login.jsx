import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EnvelopeIcon, LockClosedIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import {  Link } from 'react-router-dom';

export default function Login() {
  const nav = useNavigate();

  const loginSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email required'),
    password: Yup.string().min(6, 'Min 6 characters').required('Password required'),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-white/30"
      >
        <div className="px-8 py-12">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center mb-8"
          >
            <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <div className="h-9 w-9 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <LockClosedIcon className="h-5 w-5 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
            <p className="text-white/80 text-center">Please sign in to continue</p>
          </motion.div>
          

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
              try {
                const res = await api.post('/auth/login', values);
                localStorage.setItem('token', res.data.token);
                // Force reload to ensure App.jsx picks up the token
                window.location.href = '/dashboard';
              } catch (err) {
                setErrors({ email: 'Invalid credentials' });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <div className="relative">
                    <EnvelopeIcon className="h-5 w-5 text-white absolute left-4 top-1/2 -translate-y-1/2" />
                    <Field
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 focus:border-white/50 focus:ring-2 focus:ring-white/30 text-white placeholder-white/70 transition-all duration-300"
                    />
                  </div>
                  <ErrorMessage name="email">
                    {(msg) => <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-200 text-sm mt-2 ml-2">{msg}</motion.div>}
                  </ErrorMessage>
                </div>

                <div>
                  <div className="relative">
                    <LockClosedIcon className="h-5 w-5 text-white absolute left-4 top-1/2 -translate-y-1/2" />
                    <Field
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 focus:border-white/50 focus:ring-2 focus:ring-white/30 text-white placeholder-white/70 transition-all duration-300"
                    />
                  </div>
                  <ErrorMessage name="password">
                    {(msg) => <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-200 text-sm mt-2 ml-2">{msg}</motion.div>}
                  </ErrorMessage>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3.5 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    'Sign In'
                  )}
                </motion.button>

                <div className="text-center mt-6">
                <Link 
                 to="/signup" 
                 className="text-white/80 hover:text-white underline text-sm transition-colors"
>                Don't have an account? Register here
                </Link>
                 
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </motion.div>
    </div>
  );
}
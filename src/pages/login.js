import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  // Validation Schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API}/api/user/login`, values);
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userinfo', JSON.stringify(response.data.data));
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid Credential';
      setErrors({ password: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background Car Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/backgroung.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>
      </div>

      {/* Form Container - SaaS-like improvements */}
      <div className="relative z-10 bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-6 sm:p-8 lg:p-10 max-w-xs w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-md border border-gray-100">
        <div className="text-center mb-6 sm:mb-8">
          <div className="mx-auto w-20 h-20 bg-white/20 border border-white/30 rounded-xl flex items-center justify-center mb-4">
            <img 
              src="/logo.png" 
              alt="Car Logo" 
              className="h-24 w-24 object-contain"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Sign in to your account
          </p>
        </div>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5 sm:space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="Enter your email"
                />
                 <ErrorMessage name="email" component="p" className="text-xs text-red-500 mt-2  font-medium text-center" />
               
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="Enter your password"
                />

               
                <ErrorMessage name="password" component="p" className="text-xs text-red-500 mt-2  font-medium text-center" />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href='/register' className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline">
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

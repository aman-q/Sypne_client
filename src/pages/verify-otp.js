import React, { useState, useRef, useEffect } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputRefs = useRef([]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' });

  // Get email from multiple sources with priority
  const getEmailFromStorage = () => {
    // First try to get from location state (passed from registration)
    if (location.state?.email) {
      return location.state.email;
    }

    // Then try localStorage for 'emailuser'
    const emailUser = localStorage.getItem('emailuser');
    if (emailUser) {
      return emailUser;
    }

    // Try to get from userinfo in localStorage
    const userInfo = localStorage.getItem('userinfo');
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        if (parsedUserInfo.email) {
          return parsedUserInfo.email;
        }
      } catch (error) {
        console.error('Error parsing userinfo from localStorage:', error);
      }
    }

    // Try to get from token (if email is encoded in token)
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // Decode JWT token to get email (if stored in token)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decodedToken = JSON.parse(jsonPayload);
        if (decodedToken.email) {
          return decodedToken.email;
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    return '';
  };

  const [email, setEmail] = useState(getEmailFromStorage());

  // Save email to localStorage when component mounts
  useEffect(() => {
    const currentEmail = getEmailFromStorage();
    if (currentEmail && !localStorage.getItem('emailuser')) {
      localStorage.setItem('emailuser', currentEmail);
    }
    setEmail(currentEmail);
  }, []);

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Auto-hide alert after 5 seconds
  useEffect(() => {
    if (alertMessage.message) {
      const timer = setTimeout(() => {
        setAlertMessage({ type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  // Show alert function
  const showAlert = (type, message) => {
    setAlertMessage({ type, message });
  };

  // Validation schema - Fixed to work with the joined OTP string
  const validationSchema = Yup.object({
    otpCode: Yup.string()
      .length(6, 'OTP must be 6 digits')
      .matches(/^\d{6}$/, 'OTP must contain only numbers')
      .required('OTP is required'),
  });

  // Handle OTP input change - Fixed to properly sync with Formik
  const handleOtpChange = (element, index, setFieldValue) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Update Formik field value immediately
    const otpString = newOtp.join('');
    setFieldValue('otpCode', otpString);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  // Handle backspace - Fixed to properly sync with Formik
  const handleKeyDown = (e, index, setFieldValue) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index] === '' && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1].focus();
        newOtp[index - 1] = '';
      } else {
        newOtp[index] = '';
      }
      setOtp(newOtp);
      
      // Update Formik field value immediately
      const otpString = newOtp.join('');
      setFieldValue('otpCode', otpString);
    }
  };

  // Handle paste - Fixed to properly sync with Formik
  const handlePaste = (e, setFieldValue) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (pastedData.length === 6 && /^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      setFieldValue('otpCode', pastedData);
      inputRefs.current[5].focus();
    }
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    if (!email) {
      setErrors({ otpCode: 'Email not found. Please go back to registration.' });
      showAlert('error', 'Email not found. Please return to registration.');
      setSubmitting(false);
      return;
    }

    try {
      const otpCode = values.otpCode; // Use the Formik value directly

      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/user/verify-otp`,
        {
          email: email,
          otp: otpCode,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Store auth token and navigate to dashboard
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      if (response.data.data) {
        localStorage.setItem('userinfo', JSON.stringify(response.data.data));
      }
      
      // Clear emailuser from localStorage after successful verification
      localStorage.removeItem('emailuser');
      
      // Show success alert
      showAlert('success', 'Email verified successfully! Redirecting to login...');
      
      // Delay navigation to show success message
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid OTP. Please try again.';
      setErrors({ otpCode: errorMessage });
      showAlert('error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (!email) {
      console.error('Email not found for resending OTP');
      showAlert('error', 'Email not found. Cannot resend OTP.');
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API}/api/user/resend-otp`,
        { 
          email: email 
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setResendTimer(60);
      setCanResend(false);
      setOtp(new Array(6).fill(''));
      
      // Show success alert
      showAlert('success', 'Verification code resent successfully! Please check your email.');
      console.log('OTP resent successfully');
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP. Please try again.';
      showAlert('error', errorMessage);
    }
  };

  // Alert Component
  const AlertComponent = () => {
    if (!alertMessage.message) return null;

    return (
      <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ${
        alertMessage.type === 'success' 
          ? 'bg-green-50 border-green-500 text-green-800' 
          : 'bg-red-50 border-red-500 text-red-800'
      }`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {alertMessage.type === 'success' ? (
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{alertMessage.message}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => setAlertMessage({ type: '', message: '' })}
              className={`inline-flex ${
                alertMessage.type === 'success' ? 'text-green-600 hover:text-green-500' : 'text-red-600 hover:text-red-500'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Alert Component */}
      <AlertComponent />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-indigo-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-indigo-400/60 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400/60 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-pink-400/60 rounded-full animate-bounce delay-500"></div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/25">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-8 w-8 object-contain"
              />
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/20 p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4 shadow-lg shadow-green-500/25">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Verify Your Email
              </h1>
              <p className="text-gray-600 text-sm mb-4">
                We've sent a 6-digit verification code to
              </p>
              <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                <span className="text-blue-700 font-medium text-sm">
                  {email || 'Please check your email'}
                </span>
              </div>
              {!email && (
                <p className="text-red-500 text-xs mt-2">
                  Email not found. Please return to registration.
                </p>
              )}
            </div>

            <Formik
              initialValues={{ otpCode: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form className="space-y-6">
                  {/* OTP Input Fields */}
                  <div>
                    <div className="flex justify-center gap-3 mb-4">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          maxLength="1"
                          className="w-12 h-12 text-center text-xl font-bold bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 outline-none hover:border-gray-300 hover:shadow-md"
                          value={digit}
                          onChange={(e) => handleOtpChange(e.target, index, setFieldValue)}
                          onKeyDown={(e) => handleKeyDown(e, index, setFieldValue)}
                          onPaste={(e) => handlePaste(e, setFieldValue)}
                          disabled={!email}
                        />
                      ))}
                    </div>
                    <ErrorMessage name="otpCode" component="p" className="text-sm text-red-500 text-center font-medium" />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || values.otpCode.length !== 6 || !email}
                    className="group relative w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {isSubmitting ? (
                      <span className="flex items-center justify-center relative z-10">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      <span className="relative z-10">Verify & Continue</span>
                    )}
                  </button>
                </Form>
              )}
            </Formik>

            {/* Resend Section */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-3">
                Didn't receive the code?
              </p>
              {canResend ? (
                <button
                  onClick={handleResendOTP}
                  disabled={!email}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 disabled:text-gray-400 font-semibold text-sm transition-colors hover:underline disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Resend Code
                </button>
              ) : (
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resend in {resendTimer}s
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <a
                  href="/login"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors group"
                >
                  <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Sign In
                </a>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/50 backdrop-blur-sm border border-white/20 rounded-full shadow-sm">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-600 font-medium">Secured with 256-bit encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;

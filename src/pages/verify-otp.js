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

  // Get email from location state (passed from registration)
  const email = location.state?.email || '';

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Validation schema
  const validationSchema = Yup.object({
    otpCode: Yup.string()
      .length(6, 'OTP must be 6 digits')
      .matches(/^\d{6}$/, 'OTP must contain only numbers')
      .required('OTP is required'),
  });

  // Handle OTP input change
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1].focus();
        newOtp[index - 1] = '';
      } else {
        newOtp[index] = '';
      }
      setOtp(newOtp);
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (pastedData.length === 6 && /^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5].focus();
    }
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const otpCode = otp.join('');
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/user/verify-otp`,
        {
          email: email,
          otp: otpCode,
        }
      );

      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userinfo', JSON.stringify(response.data.data));
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid OTP. Please try again.';
      setErrors({ otpCode: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/api/user/resend-otp`,
        { email: email }
      );
      setResendTimer(60);
      setCanResend(false);
      setOtp(new Array(6).fill(''));
    } catch (error) {
      console.error('Failed to resend OTP:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Column - Premium Car Rental Branding */}
        <div className="relative hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:items-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-12 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>
          
          {/* Floating car icons */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-10 text-white/20 text-6xl animate-bounce">🚗</div>
            <div className="absolute bottom-1/3 right-16 text-white/20 text-4xl animate-bounce delay-700">🏎️</div>
            <div className="absolute top-2/3 left-1/3 text-white/20 text-5xl animate-bounce delay-300">🚙</div>
          </div>

          <div className="relative z-10 text-center max-w-md animate-fade-in">
            <div className="mb-8">
              <div className="mx-auto w-20 h-20 bg-white/20 border border-white/30 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm shadow-2xl">
                <img 
                  src="/logo.png" 
                  alt="Premium Car Rental Logo" 
                  className="h-12 w-12 object-contain"
                />
              </div>
              <h1 className="text-4xl font-bold mb-4 animate-slide-up">
                Premium Verification
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed animate-slide-up delay-200">
                Secure your premium car rental experience with our advanced verification system.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center animate-fade-in delay-300">
                <div className="w-14 h-14 bg-white/20 border border-white/30 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-blue-100 font-medium">Bank-Grade Security</p>
              </div>
              <div className="text-center animate-fade-in delay-500">
                <div className="w-14 h-14 bg-white/20 border border-white/30 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-blue-100 font-medium">Instant Access</p>
              </div>
              <div className="text-center animate-fade-in delay-700">
                <div className="w-14 h-14 bg-white/20 border border-white/30 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-blue-100 font-medium">Premium Service</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - OTP Form */}
        <div className="flex flex-col justify-center bg-white px-6 py-12 lg:px-16 xl:px-20">
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8 animate-fade-in">
              <div className="mx-auto w-16 h-16 bg-white/20 border border-white/30 rounded-2xl flex items-center justify-center mb-4">
                <img 
                  src="/logo.png" 
                  alt="Premium Car Rental Logo" 
                  className="h-10 w-10 object-contain"
                />
              </div>
            </div>

            <div className="text-center mb-8 animate-slide-up">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Verify Your Email
              </h2>
              <p className="text-gray-600 mb-2">
                Enter the 6-digit verification code sent to
              </p>
              <p className="font-semibold text-blue-600 text-lg">
                {email || 'your email address'}
              </p>
            </div>

            <Formik
              initialValues={{ otpCode: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form className="space-y-8 animate-slide-up delay-200">
                  {/* OTP Input Fields */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-6 text-center">
                      Verification Code
                    </label>
                    <div className="flex justify-center space-x-3 mb-6">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          maxLength="1"
                          className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none hover:border-gray-300 hover:shadow-md"
                          value={digit}
                          onChange={(e) => {
                            handleOtpChange(e.target, index);
                            setFieldValue('otpCode', otp.join(''));
                          }}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onPaste={handlePaste}
                        />
                      ))}
                    </div>
                    <ErrorMessage name="otpCode" component="p" className="text-sm text-red-500 text-center font-medium" />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || otp.join('').length !== 6}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying Your Access...
                      </span>
                    ) : (
                      'Verify & Continue'
                    )}
                  </button>
                </Form>
              )}
            </Formik>

            {/* Resend Section */}
            <div className="mt-8 text-center animate-fade-in delay-400">
              <p className="text-sm text-gray-600 mb-3">
                Didn't receive the verification code?
              </p>
              {canResend ? (
                <button
                  onClick={handleResendOTP}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors hover:underline"
                >
                  Resend Verification Code
                </button>
              ) : (
                <p className="text-sm text-gray-500 font-medium">
                  Resend available in {resendTimer}s
                </p>
              )}
            </div>

            {/* Back to Login */}
            <div className="mt-8 text-center animate-fade-in delay-500">
              <a
                href="/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Sign In
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
        
        .delay-400 {
          animation-delay: 400ms;
        }
        
        .delay-500 {
          animation-delay: 500ms;
        }
        
        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
};

export default OTPVerification;

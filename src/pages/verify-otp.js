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
        // Move to previous input if current is empty
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
        'https://carhubbackend-production.up.railway.app/api/user/verify-otp',
        {
          email: email,
          otp: otpCode,
        }
      );

      // Store auth token and navigate to dashboard
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
        'https://carhubbackend-production.up.railway.app/api/user/resend-otp',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Column - Branding */}
        <div className="relative hidden lg:flex lg:flex-col lg:justify-center lg:items-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-12">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 text-center max-w-md">
            <div className="mb-8">
              <img 
                src="/logo.png" 
                alt="Car Rental Logo" 
                className="mx-auto h-16 w-auto mb-6 filter brightness-0 invert"
              />
              <h1 className="text-4xl font-bold mb-4">Secure Verification</h1>
              <p className="text-blue-100 text-lg leading-relaxed">
                We've sent a 6-digit verification code to your email to ensure your account security.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-blue-100">Secure</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-blue-100">Fast</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-blue-100">Reliable</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - OTP Form */}
        <div className="flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-20">
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <img 
                src="/logo.png" 
                alt="Car Rental Logo" 
                className="mx-auto h-12 w-auto mb-4"
              />
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Verify Your Email
              </h2>
              <p className="text-gray-600 mb-2">
                Enter the 6-digit code sent to
              </p>
              <p className="font-medium text-indigo-600">
                {email || 'your email address'}
              </p>
            </div>

            <Formik
              initialValues={{ otpCode: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form className="space-y-6">
                  {/* OTP Input Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                      Verification Code
                    </label>
                    <div className="flex justify-center space-x-3 mb-4">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          maxLength="1"
                          className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
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
                    <ErrorMessage name="otpCode" component="p" className="text-sm text-red-600 text-center" />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || otp.join('').length !== 6}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      'Verify Code'
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
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
                >
                  Resend Code
                </button>
              ) : (
                <p className="text-sm text-gray-500">
                  Resend code in {resendTimer}s
                </p>
              )}
            </div>

            {/* Back to Login */}
            <div className="mt-8 text-center">
              <a
                href="/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;

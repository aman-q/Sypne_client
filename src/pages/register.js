import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

const Register = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .matches(/^[a-zA-Z]+$/, "Only letters allowed"),
    lastName: Yup.string()
      .required("Last name is required")
      .matches(/^[a-zA-Z]+$/, "Only letters allowed"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone: Yup.string()
      .matches(/^\+?\d{10,15}$/, "Must be 10–15 digits")
      .required("Phone number is required"),
    password: Yup.string()
      .min(8, "Minimum 8 characters")
      .required("Password is required"),
    retypePassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await api.post("/user/register", {
        email: values.email,
        password: values.password,
        fname: values.firstName,
        lname: values.lastName,
        phonenumber: values.phone,
      });
      localStorage.setItem("emailuser", values.email);
      navigate("/verify-otp", { state: { email: values.email } });
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed. Please try again.";
      setErrors({ email: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (error) =>
    `w-full px-4 py-3 border ${error ? "border-red-400" : "border-gray-200"} rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900`;

  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/background.webp')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/65" />
      </div>

      <div className="relative z-10 bg-white/97 backdrop-blur-sm shadow-2xl rounded-2xl p-8 sm:p-10 w-full max-w-2xl border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 flex items-center justify-center mb-5">
            <img src="/logo.png" alt="Logo" className="h-16 w-16 object-contain" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Your Account</h2>
          <p className="text-gray-500 mt-2 text-sm">Join and start your luxury car journey</p>
        </div>

        <Formik
          initialValues={{ firstName: "", lastName: "", email: "", phone: "", password: "", retypePassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name</label>
                  <Field name="firstName" type="text" placeholder="John" className={inputClass(errors.firstName && touched.firstName)} />
                  <ErrorMessage name="firstName" component="p" className="text-xs text-red-500 mt-1.5" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                  <Field name="lastName" type="text" placeholder="Doe" className={inputClass(errors.lastName && touched.lastName)} />
                  <ErrorMessage name="lastName" component="p" className="text-xs text-red-500 mt-1.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <Field name="email" type="email" placeholder="john@example.com" className={inputClass(errors.email && touched.email)} />
                  <ErrorMessage name="email" component="p" className="text-xs text-red-500 mt-1.5" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <Field name="phone" type="tel" placeholder="9876543210" className={inputClass(errors.phone && touched.phone)} />
                  <ErrorMessage name="phone" component="p" className="text-xs text-red-500 mt-1.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                  <Field name="password" type="password" placeholder="Min. 8 characters" className={inputClass(errors.password && touched.password)} />
                  <ErrorMessage name="password" component="p" className="text-xs text-red-500 mt-1.5" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                  <Field name="retypePassword" type="password" placeholder="Repeat password" className={inputClass(errors.retypePassword && touched.retypePassword)} />
                  <ErrorMessage name="retypePassword" component="p" className="text-xs text-red-500 mt-1.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Account...
                  </span>
                ) : "Create Account"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-7 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import Register from './pages/register';
import CarUploadForm from './pages/carUpload';
import CarLandingPage from './pages/landingpage';
import ProtectedRoute from './components/protectedRoute';
import CarDetailsPage from './pages/cardetatils';
import OTPVerification from './pages/verify-otp';

function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<CarLandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<OTPVerification />} />

        {/* Protected Routes */}
        <Route
          path="/car-upload"
          element={
            <ProtectedRoute>
              <CarUploadForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/car-details/:id" // Dynamic route for car details
          element={
            <ProtectedRoute>
              <CarDetailsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

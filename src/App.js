import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import Register from './pages/register';
import CarUploadForm from './pages/carUpload';
import CarLandingPage from './pages/landingpage';
import ProtectedRoute from './components/ProtectedRoute';
import CarDetailsPage from './pages/cardetatils';
import OTPVerification from './pages/verify-otp';
import ProfilePage from './pages/profile';
import BrowseCarsPage from './pages/browsecars';

function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<CarLandingPage />} />
        <Route path="/browse" element={<BrowseCarsPage />} />
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
          path="/car-details/:id"
          element={
            <ProtectedRoute>
              <CarDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

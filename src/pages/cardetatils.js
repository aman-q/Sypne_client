import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight,
  Mail,
  Car,
  Calendar,
  Building2,
  Gauge,
  X
} from 'lucide-react';
import Navbar from '../components/hedder';

const CarDetailsPage = () => {
  const { id } = useParams();
  const [carDetails, setCarDetails] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    // Fetch car details when component mounts
    const fetchCarDetails = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('authToken');
        
        // Include the token in the Authorization header
        const response = await axios.get(`https://carhubbackend-production.up.railway.app/api/cars/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Set the token in the header
          },
        });
        
        setCarDetails(response.data);
      } catch (error) {
        console.error('Error fetching car details:', error);
      }
    };
  
    fetchCarDetails();
  }, [id]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (carDetails?.cardeatil.images.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (carDetails?.cardeatil.images.length || 1) - 1 : prev - 1
    );
  };

  if (!carDetails) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Image Carousel */}
        <div className="relative h-[28rem] rounded-2xl overflow-hidden mb-8 shadow-xl bg-white">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
          <img
            src={carDetails.cardeatil.images[currentImageIndex]}
            alt={`Car view ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full text-gray-800 hover:bg-white transition-colors z-20 shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full text-gray-800 hover:bg-white transition-colors z-20 shadow-lg"
          >
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {carDetails.cardeatil.images.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Car Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold text-gray-900">
                  {carDetails.cardeatil.title}
                </h1>
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm">
                  {carDetails?.cardeatil?.tags?.car_type}
                </span>
              </div>
              <p className="text-gray-600 mb-8 text-lg">
                {carDetails.cardeatil.description}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl">
                  <Calendar className="text-blue-600" size={28} />
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-semibold text-lg">{carDetails.cardeatil.yearOfManufacture}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl">
                  <Building2 className="text-blue-600" size={28} />
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-semibold text-lg">{carDetails.cardeatil.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl">
                  <Gauge className="text-blue-600" size={28} />
                  <div>
                    <p className="text-sm text-gray-500">Drive Type</p>
                    <p className="font-semibold text-lg">{carDetails.cardeatil.driveType}</p>
                  </div>
                </div>
                {/* <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl">
                  <Car className="text-blue-600" size={28} />
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-semibold text-lg">{carDetails?.cardeatil?.tags.car_type}</p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg sticky top-24 border border-slate-200">
              <h2 className="text-2xl font-semibold mb-6">Listed by</h2>
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white">
                  <span className="text-lg font-semibold">
                    {carDetails.cardeatil.addedby.fname[0]}
                    {carDetails.cardeatil.addedby.lname[0]}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-lg">
                    {carDetails.cardeatil.addedby.fname} {carDetails.cardeatil.addedby.lname}
                  </p>
                  <p className="text-gray-500">Car Dealer</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/30"
              >
                <Mail size={20} />
                <span>Contact Now</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-semibold mb-4">Contact the Seller</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="block w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="block w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-600 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  className="block w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Write your message"
                  rows={4}
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/30"
              >
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default CarDetailsPage;

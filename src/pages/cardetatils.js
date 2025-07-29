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
  X,
  Phone,
  User,
  MapPin,
  Star,
  Shield,
  Clock,
  ArrowLeft,
  Heart,
  Share2,
  CheckCircle,
  CreditCard,
  Award,
  Users,
  Fuel,
  Settings,
  Camera,
  Eye,
  Download,
  MessageSquare,
  ChevronDown,
  Zap,
  Globe,
  Lock,
  TrendingUp,
  PlayCircle
} from 'lucide-react';
import Navbar from '../components/hedder';

const CarDetailsPage = () => {
  const { id } = useParams();
  const [carDetails, setCarDetails] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    startDate: '',
    endDate: '',
    pickupLocation: '',
    dropoffLocation: ''
  });
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('authToken');
        
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/cars/${id}`, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        console.log('Car details response:', response.data);
        setCarDetails(response.data);
      } catch (error) {
        console.error('Error fetching car details:', error);
        setError('Failed to load car details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    if (id) {
      fetchCarDetails();
    }
  }, [id]);

  // Handle booking submission
  const handleBooking = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('authToken');
      
      const startDate = new Date(bookingForm.startDate).toISOString();
      const endDate = new Date(bookingForm.endDate).toISOString();
      
      const bookingData = {
        carId: id,
        startDate: startDate,
        endDate: endDate,
        pickupLocation: bookingForm.pickupLocation,
        dropoffLocation: bookingForm.dropoffLocation
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/booking/new-booking`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Booking successful:', response.data);
      setShowBookingModal(false);
      
      // Show success animation
      showSuccessToast('Booking confirmed! Check your email for details.');
      
    } catch (error) {
      console.error('Booking failed:', error);
      showErrorToast('Booking failed. Please try again.');
    }
  };

  const showSuccessToast = (message) => {
    // You can implement a proper toast library here
    alert(message);
  };

  const showErrorToast = (message) => {
    alert(message);
  };

  const nextImage = () => {
    if (!carDetails?.car?.images?.length) return;
    setCurrentImageIndex((prev) => 
      prev === carDetails.car.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!carDetails?.car?.images?.length) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? carDetails.car.images.length - 1 : prev - 1
    );
  };

  // Premium Loading Component
  const PremiumLoader = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <Navbar />
      
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-purple-400 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
          
          <div className="space-y-4 max-w-md mx-auto">
            <div className="flex space-x-2 justify-center">
              <div className="h-3 w-3 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="h-3 w-3 bg-purple-400 rounded-full animate-bounce delay-100"></div>
              <div className="h-3 w-3 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Loading Premium Experience</h3>
            
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-blue-200 via-purple-200 to-transparent rounded-full animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-purple-200 via-indigo-200 to-transparent rounded-full animate-pulse delay-150"></div>
              <div className="h-4 bg-gradient-to-r from-indigo-200 via-blue-200 to-transparent rounded-full animate-pulse delay-300 w-3/4 mx-auto"></div>
            </div>
            
            <p className="text-gray-600 mt-6">Preparing your luxury car details...</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <PremiumLoader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-red-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <Navbar />
        
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-center bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 max-w-lg mx-4">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="text-red-600" size={40} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-8 text-lg">{error}</p>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 font-semibold"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!carDetails || !carDetails.car) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 max-w-lg">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Car className="text-gray-600" size={40} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Car Not Found</h3>
            <p className="text-gray-600 mb-8 text-lg">This luxury vehicle seems to have driven away!</p>
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Browse Other Cars
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images = carDetails?.car?.images || [];
  const currentImage = images[currentImageIndex] || '/default-car-image.jpg';
  const carInfo = carDetails.car;

  const premiumFeatures = [
    { icon: Shield, name: 'Comprehensive Insurance', desc: 'Full coverage included' },
    { icon: Clock, name: '24/7 Roadside Assistance', desc: 'Always there when you need us' },
    { icon: Award, name: 'Premium Grade Vehicle', desc: 'Top-tier maintenance standards' },
    { icon: Users, name: 'Concierge Service', desc: 'Personal assistance available' },
    { icon: Fuel, name: 'Fuel Included', desc: 'No hidden fuel charges' },
    { icon: Settings, name: 'Advanced Features', desc: 'Latest technology included' },
    { icon: Globe, name: 'GPS & Navigation', desc: 'Premium navigation system' },
    { icon: Lock, name: 'Keyless Entry', desc: 'Smart access technology' }
  ];

  const specifications = [
    { icon: Calendar, label: 'Year', value: carInfo.yearOfManufacture, color: 'from-blue-500 to-cyan-500' },
    { icon: Building2, label: 'Brand', value: carInfo.company, color: 'from-purple-500 to-pink-500' },
    { icon: Gauge, label: 'Drive Type', value: carInfo.driveType, color: 'from-green-500 to-emerald-500' },
    { icon: CreditCard, label: 'Daily Rate', value: `$${carInfo.price}`, color: 'from-orange-500 to-red-500' },
    { icon: Star, label: 'Rating', value: '4.9/5.0', color: 'from-yellow-500 to-orange-500' },
    { icon: TrendingUp, label: 'Popularity', value: 'Top 10%', color: 'from-indigo-500 to-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-gradient-to-br from-green-400/10 to-emerald-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-2/3 right-1/3 w-64 h-64 bg-gradient-to-br from-yellow-400/10 to-orange-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Animated particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <Navbar />

      {/* Enhanced Navigation with Breadcrumb */}
      <div className="pt-24 pb-4 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-300 group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back</span>
              </button>
              
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <span>Home</span>
                <ChevronRight size={14} />
                <span>Cars</span>
                <ChevronRight size={14} />
                <span className="text-gray-900 font-medium">{carInfo.title}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isLiked 
                    ? 'bg-red-500 text-white transform scale-110' 
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:scale-105'
                }`}
              >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              </button>
              <button className="p-3 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section with Advanced Gallery */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          {/* Advanced Image Gallery */}
          <div className="lg:col-span-3">
            <div className="relative">
              {/* Main Image */}
              <div className="relative h-[36rem] rounded-3xl overflow-hidden shadow-2xl bg-white group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
                
                {/* Advanced Controls */}
                <div className="absolute top-6 left-6 flex space-x-3 z-20">
                  <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    {images.length} Photos
                  </div>
                  <button
                    onClick={() => setShowImageModal(true)}
                    className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-all duration-300"
                  >
                    <Eye size={16} />
                  </button>
                </div>

                {images.length > 0 ? (
                  <>
                    <img
                      src={currentImage}
                      alt={`${carInfo.title || 'Car'} view ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = '/default-car-image.jpg';
                      }}
                    />
                    
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-4 rounded-full text-gray-800 hover:bg-white transition-all duration-300 z-20 shadow-xl hover:scale-110 opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-4 rounded-full text-gray-800 hover:bg-white transition-all duration-300 z-20 shadow-xl hover:scale-110 opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRight size={24} />
                        </button>
                        
                        {/* Progress Bar */}
                        <div className="absolute bottom-6 left-6 right-6 z-20">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full h-1 overflow-hidden">
                            <div 
                              className="bg-white h-full transition-all duration-500 rounded-full"
                              style={{ width: `${((currentImageIndex + 1) / images.length) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Image Counter */}
                        <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium z-20">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Car size={80} className="mx-auto mb-4" />
                      <p className="text-lg">No images available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-6 gap-3 mt-4">
                  {images.slice(0, 5).map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${
                        idx === currentImageIndex 
                          ? 'ring-4 ring-blue-500 ring-opacity-70 transform scale-105 shadow-xl' 
                          : 'hover:scale-105 hover:shadow-lg'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {idx === currentImageIndex && (
                        <div className="absolute inset-0 bg-blue-500/20" />
                      )}
                    </button>
                  ))}
                  
                  {images.length > 5 && (
                    <button
                      onClick={() => setShowImageModal(true)}
                      className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <div className="text-center">
                        <Camera size={20} className="mx-auto mb-1" />
                        <span className="text-xs font-medium">+{images.length - 5}</span>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Premium Booking Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl sticky top-32 border border-white/20 overflow-hidden">
              {/* Pricing Header */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-4xl font-bold">
                        ${carInfo.price}
                        <span className="text-lg font-normal opacity-80">/day</span>
                      </div>
                      <div className="text-white/80">Premium rate</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="text-yellow-300 fill-current" size={18} />
                        <span className="font-bold">4.9</span>
                      </div>
                      <div className="text-white/80 text-sm">127 reviews</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Shield size={16} />
                      <span>Insured</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award size={16} />
                      <span>Premium</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Owner Information */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <User className="mr-2 text-blue-600" size={20} />
                    Luxury Car Owner
                  </h3>
                  
                  {carInfo?.addedby ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
                            <span className="text-lg font-bold">
                              {carInfo.addedby.fname?.[0] || 'U'}
                              {carInfo.addedby.lname?.[0] || 'U'}
                            </span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                            <CheckCircle className="text-white" size={12} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-lg">
                            {carInfo.addedby.fname || ''} {carInfo.addedby.lname || ''}
                          </p>
                          <p className="text-blue-600 font-medium">Verified Premium Host</p>
                        </div>
                        <div className="text-right">
                          <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            ⭐ Superhost
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Contact Info */}
                      <div className="space-y-3 bg-white rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Mail className="text-blue-600" size={16} />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 font-medium">Email</div>
                            <div className="text-sm text-gray-900 font-medium">{carInfo.addedby.email}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Phone className="text-green-600" size={16} />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 font-medium">Phone</div>
                            <div className="text-sm text-gray-900 font-medium">
                              {carInfo.addedby.phone || '+1 (555) 123-4567'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Host Stats */}
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-white rounded-xl p-3 border border-gray-100">
                          <div className="font-bold text-lg text-gray-900">47</div>
                          <div className="text-xs text-gray-500">Cars</div>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-gray-100">
                          <div className="font-bold text-lg text-gray-900">4.9</div>
                          <div className="text-xs text-gray-500">Rating</div>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-gray-100">
                          <div className="font-bold text-lg text-gray-900">2.1k</div>
                          <div className="text-xs text-gray-500">Reviews</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Host information loading...</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-4 px-6 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 font-bold text-lg flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <Zap size={24} />
                    <span>Book Instantly</span>
                  </button>
                  
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 px-6 rounded-2xl hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transform hover:scale-[1.01]"
                  >
                    <MessageSquare size={20} />
                    <span>Message Host</span>
                  </button>
                </div>

                {/* Instant Book Benefits */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="text-green-600" size={18} />
                    <span className="font-semibold text-green-800">Instant Book Benefits</span>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Immediate confirmation</li>
                    <li>• No waiting for approval</li>
                    <li>• Premium customer support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Details Section with Tabs */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8 py-4" aria-label="Tabs">
              {[
                { id: 'overview', name: 'Overview', icon: Car },
                { id: 'specifications', name: 'Specifications', icon: Settings },
                { id: 'features', name: 'Features', icon: Award },
                { id: 'reviews', name: 'Reviews', icon: Star }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon size={18} />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl font-bold text-gray-900">
                      {carInfo.title || 'Luxury Vehicle'}
                    </h1>
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold border border-blue-200">
                        {carInfo.company}
                      </div>
                      <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-2 rounded-full text-sm font-bold border border-purple-200">
                        {carInfo.yearOfManufacture}
                      </div>
                    </div>
                  </div>
                  
                  {carInfo.description && (
                    <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                      <p>{carInfo.description}</p>
                    </div>
                  )}
                </div>

                {/* Key Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Award className="text-white" size={20} />
                      </div>
                      <h3 className="font-bold text-gray-900">Premium Grade</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Top-tier luxury vehicle with premium amenities and professional maintenance.</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <Shield className="text-white" size={20} />
                      </div>
                      <h3 className="font-bold text-gray-900">Fully Insured</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Comprehensive insurance coverage with $1M liability protection included.</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Clock className="text-white" size={20} />
                      </div>
                      <h3 className="font-bold text-gray-900">24/7 Support</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Round-the-clock customer service and roadside assistance available.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Vehicle Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {specifications.map((spec, idx) => (
                    <div key={idx} className={`bg-gradient-to-br ${spec.color} p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                      <div className="flex items-center justify-between mb-4">
                        <spec.icon size={32} className="opacity-80" />
                        <div className="bg-white/20 p-2 rounded-lg">
                          <TrendingUp size={16} />
                        </div>
                      </div>
                      <p className="text-white/80 text-sm mb-1">{spec.label}</p>
                      <p className="font-bold text-2xl">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features Tab */}
            {activeTab === 'features' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Premium Features & Amenities</h2>
                  <button
                    onClick={() => setShowAllFeatures(!showAllFeatures)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span>{showAllFeatures ? 'Show Less' : 'Show All'}</span>
                    <ChevronDown className={`transform transition-transform ${showAllFeatures ? 'rotate-180' : ''}`} size={16} />
                  </button>
                </div>
                
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-500 ${showAllFeatures ? '' : 'max-h-96 overflow-hidden'}`}>
                  {premiumFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                        <feature.icon className="text-white" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{feature.name}</h3>
                        <p className="text-gray-600 text-sm">{feature.desc}</p>
                      </div>
                      <CheckCircle className="text-green-500" size={20} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">4.9</div>
                      <div className="flex items-center space-x-1">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className="text-yellow-400 fill-current" size={16} />
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">127 reviews</div>
                    </div>
                  </div>
                </div>

                {/* Review Cards */}
                <div className="space-y-6">
                  {[
                    { name: 'Sarah Johnson', rating: 5, comment: 'Absolutely incredible experience! The car was pristine and the service was top-notch. Will definitely book again.', date: '2 days ago', verified: true },
                    { name: 'Michael Chen', rating: 5, comment: 'Premium quality vehicle with all the luxury features. Host was very responsive and professional.', date: '1 week ago', verified: true },
                    { name: 'Emma Davis', rating: 4, comment: 'Great car and smooth booking process. Minor issue with pickup time but otherwise perfect.', date: '2 weeks ago', verified: true }
                  ].map((review, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {review.name[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-bold text-gray-900">{review.name}</h4>
                                {review.verified && (
                                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                    <CheckCircle size={12} />
                                    <span>Verified</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex space-x-1">
                                  {[1,2,3,4,5].map(star => (
                                    <Star key={star} className={`${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} size={14} />
                                  ))}
                                </div>
                                <span className="text-gray-500 text-sm">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Enhanced Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-6 right-6 z-10 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-2">Reserve Your Premium Experience</h3>
                <p className="text-blue-100">Book {carInfo.title} for an unforgettable journey</p>
              </div>
            </div>

            <form onSubmit={handleBooking} className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Booking Form */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-bold text-gray-700 mb-3">
                        Pick-up Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        id="startDate"
                        value={bookingForm.startDate}
                        onChange={(e) => setBookingForm({...bookingForm, startDate: e.target.value})}
                        className="block w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-lg"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-bold text-gray-700 mb-3">
                        Return Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        id="endDate"
                        value={bookingForm.endDate}
                        onChange={(e) => setBookingForm({...bookingForm, endDate: e.target.value})}
                        className="block w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-lg"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="pickupLocation" className="block text-sm font-bold text-gray-700 mb-3">
                      Pick-up Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        id="pickupLocation"
                        value={bookingForm.pickupLocation}
                        onChange={(e) => setBookingForm({...bookingForm, pickupLocation: e.target.value})}
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-lg"
                        placeholder="Enter your pick-up location"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="dropoffLocation" className="block text-sm font-bold text-gray-700 mb-3">
                      Drop-off Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        id="dropoffLocation"
                        value={bookingForm.dropoffLocation}
                        onChange={(e) => setBookingForm({...bookingForm, dropoffLocation: e.target.value})}
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-lg"
                        placeholder="Enter your drop-off location"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h4>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-4">
                      <img src={currentImage} alt={carInfo.title} className="w-16 h-16 rounded-xl object-cover" />
                      <div>
                        <h5 className="font-bold text-gray-900">{carInfo.title}</h5>
                        <p className="text-gray-600 text-sm">{carInfo.company} • {carInfo.yearOfManufacture}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Daily Rate:</span>
                        <span className="font-semibold">${carInfo.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Service Fee:</span>
                        <span className="font-semibold">$29</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Insurance:</span>
                        <span className="font-semibold text-green-600">Included</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span className="text-blue-600">${parseInt(carInfo.price) + 29}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Premium Benefits */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <h5 className="font-bold text-gray-900 mb-3 flex items-center">
                      <Award className="mr-2 text-yellow-500" size={18} />
                      Premium Benefits
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="text-green-500" size={16} />
                        <span>Free cancellation up to 24h</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="text-green-500" size={16} />
                        <span>24/7 roadside assistance</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="text-green-500" size={16} />
                        <span>Comprehensive insurance included</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="text-green-500" size={16} />
                        <span>Professional cleaning service</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-8 mt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 font-semibold text-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-4 px-8 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] flex items-center justify-center space-x-3"
                >
                  <CreditCard size={24} />
                  <span>Confirm Reservation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full relative shadow-2xl overflow-hidden">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-6 right-6 z-10 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-8 text-white">
              <h3 className="text-3xl font-bold mb-2">Connect with Host</h3>
              <p className="text-green-100">Send a message to the car owner</p>
            </div>

            <form className="p-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-3">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="block w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-lg"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="block w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-lg"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-3">
                  Message
                </label>
                <textarea
                  id="message"
                  className="block w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-lg resize-none"
                  placeholder="Hi! I'm interested in renting your car..."
                  rows={5}
                ></textarea>
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 font-semibold text-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 px-8 rounded-2xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] flex items-center justify-center space-x-3"
                >
                  <Mail size={24} />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Screen Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <X size={32} />
          </button>
          
          <div className="max-w-7xl mx-auto px-4">
            <img
              src={currentImage}
              alt={`${carInfo.title} full view`}
              className="max-h-[90vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />
            
            {images.length > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                      idx === currentImageIndex ? 'ring-4 ring-white' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={image} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetailsPage;

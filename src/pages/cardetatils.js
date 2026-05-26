import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
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
  Shield,
  Clock,
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Fuel,
  Settings,
  Zap,
} from 'lucide-react';
import Navbar from '../components/hedder';

const Spinner = () => (
  <div className="flex flex-col items-center justify-center py-32">
    <div className="relative w-14 h-14">
      <div className="absolute inset-0 rounded-full border-[3px] border-gray-100" />
      <div className="absolute inset-0 rounded-full border-[3px] border-blue-500 border-t-transparent animate-spin" />
    </div>
    <p className="mt-5 text-sm text-gray-400 font-medium tracking-wide">Loading…</p>
  </div>
);

const CarDetailsPage = () => {
  const { id } = useParams();
  const [carDetails, setCarDetails] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    startDate: '',
    endDate: '',
    pickupLocation: '',
    dropoffLocation: '',
  });
  const [toast, setToast] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get(`/cars/${id}`);
        setCarDetails(data);
      } catch {
        setError('Failed to load car details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCarDetails();
  }, [id]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      await api.post('/booking/new-booking', {
        carId: id,
        startDate: new Date(bookingForm.startDate).toISOString(),
        endDate: new Date(bookingForm.endDate).toISOString(),
        pickupLocation: bookingForm.pickupLocation,
        dropoffLocation: bookingForm.dropoffLocation,
      });
      setShowBookingModal(false);
      showToast('success', 'Booking confirmed! Check your email for details.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking failed. Please try again.';
      showToast('error', msg);
    } finally {
      setBookingLoading(false);
    }
  };

  const nextImage = () => {
    if (!carDetails?.car?.images?.length) return;
    setCurrentImageIndex(p => (p === carDetails.car.images.length - 1 ? 0 : p + 1));
  };

  const prevImage = () => {
    if (!carDetails?.car?.images?.length) return;
    setCurrentImageIndex(p => (p === 0 ? carDetails.car.images.length - 1 : p - 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16"><Spinner /></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[80vh]">
          <div className="text-center bg-white rounded-2xl p-10 shadow-sm border border-gray-100 max-w-md mx-4">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <X className="text-red-500" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                Try Again
              </button>
              <button onClick={() => navigate('/browse')} className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!carDetails?.car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[80vh]">
          <div className="text-center bg-white rounded-2xl p-10 shadow-sm border border-gray-100 max-w-md mx-4">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Car className="text-gray-400" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Car not found</h3>
            <button onClick={() => navigate('/browse')} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
              Browse Cars
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images = carDetails.car.images || [];
  const currentImage = images[currentImageIndex] || '/default-car-image.jpg';
  const carInfo = carDetails.car;
  const isBooked = carDetails?.availability?.isCurrentlyBooked;

  const specs = [
    { icon: Calendar, label: 'Year', value: carInfo.yearOfManufacture },
    { icon: Building2, label: 'Brand', value: carInfo.company },
    { icon: Gauge, label: 'Drive Type', value: carInfo.driveType },
    { icon: Fuel, label: 'Daily Rate', value: `$${carInfo.price}` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-[100] max-w-sm px-4 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <span>{toast.type === 'success' ? '✅' : '❌'}</span>
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => setToast(null)} className="opacity-50 hover:opacity-100">✕</button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Back */}
        <button
          onClick={() => navigate('/browse')}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Browse
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Gallery */}
          <div className="lg:col-span-3 space-y-3">
            {/* Main image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 group">
              {images.length > 0 ? (
                <img
                  src={currentImage}
                  alt={carInfo.title}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src = '/default-car-image.jpg'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Car size={64} className="text-gray-300" />
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                    <ChevronLeft size={20} className="text-gray-800" />
                  </button>
                  <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                    <ChevronRight size={20} className="text-gray-800" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex ? 'border-blue-500' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Car info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{carInfo.title || 'Car Listing'}</h1>
                  <p className="text-gray-500 mt-1">{carInfo.company} · {carInfo.yearOfManufacture}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-2xl font-bold text-gray-900">${carInfo.price}</div>
                  <div className="text-sm text-gray-400">/day</div>
                </div>
              </div>

              {carInfo.description && (
                <p className="text-gray-600 leading-relaxed text-sm">{carInfo.description}</p>
              )}
            </div>

            {/* Specs */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="text-center p-3 bg-gray-50 rounded-xl">
                    <Icon size={20} className="text-blue-500 mx-auto mb-2" />
                    <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                    <div className="text-sm font-semibold text-gray-900">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Included */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-4">What's included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: Shield, text: 'Comprehensive insurance' },
                  { icon: Clock, text: '24/7 roadside assistance' },
                  { icon: Settings, text: 'Professional maintenance' },
                  { icon: CheckCircle, text: 'Free cancellation (24h)' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-blue-600" />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-24 overflow-hidden">
              {/* Price header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-gray-900">${carInfo.price}</span>
                  <span className="text-gray-400 text-sm">/day</span>
                </div>

                {/* Availability */}
                <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  isBooked ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isBooked ? 'bg-red-500' : 'bg-green-500'}`} />
                  {isBooked ? (
                    <>
                      Currently unavailable
                      {carDetails.availability?.nextAvailableFrom && (
                        <span className="font-normal opacity-80">
                          · Free {new Date(carDetails.availability.nextAvailableFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </>
                  ) : 'Available now'}
                </div>
              </div>

              {/* Owner */}
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Hosted by</h3>
                {carInfo?.addedby ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {carInfo.addedby.fname?.[0] || 'U'}{carInfo.addedby.lname?.[0] || ''}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{carInfo.addedby.fname} {carInfo.addedby.lname}</p>
                        <p className="text-xs text-gray-400">Verified host</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 text-sm text-gray-600">
                        <Mail size={14} className="text-gray-400 shrink-0" />
                        <span className="truncate">{carInfo.addedby.email}</span>
                      </div>
                      {carInfo.addedby.phone && (
                        <div className="flex items-center gap-2.5 text-sm text-gray-600">
                          <Phone size={14} className="text-gray-400 shrink-0" />
                          <span>{carInfo.addedby.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-400">Host info unavailable</p>
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="p-6 space-y-3">
                <button
                  onClick={() => setShowBookingModal(true)}
                  disabled={isBooked}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  <Zap size={18} />
                  {isBooked ? 'Unavailable' : 'Book Now'}
                </button>

                <button
                  onClick={() => setShowImageModal(true)}
                  className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  View All Photos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Book {carInfo.title}</h3>
                <p className="text-sm text-gray-400">${carInfo.price}/day</p>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleBooking} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Pick-up</label>
                  <input
                    type="datetime-local"
                    value={bookingForm.startDate}
                    onChange={e => setBookingForm({ ...bookingForm, startDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Return</label>
                  <input
                    type="datetime-local"
                    value={bookingForm.endDate}
                    onChange={e => setBookingForm({ ...bookingForm, endDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Pick-up Location</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={bookingForm.pickupLocation}
                    onChange={e => setBookingForm({ ...bookingForm, pickupLocation: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter pick-up address"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Drop-off Location</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={bookingForm.dropoffLocation}
                    onChange={e => setBookingForm({ ...bookingForm, dropoffLocation: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter drop-off address"
                    required
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-sm">
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Daily rate</span><span className="font-medium text-gray-900">${carInfo.price}</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Service fee</span><span className="font-medium text-gray-900">$29</span>
                </div>
                <div className="flex justify-between text-gray-600 pt-2 border-t border-gray-200">
                  <span>Insurance</span><span className="font-medium text-green-600">Included</span>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowBookingModal(false)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
                >
                  {bookingLoading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Confirming…</span></>
                  ) : (
                    <><CreditCard size={16} /><span>Confirm Booking</span></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full screen image modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={() => setShowImageModal(false)}>
          <button className="absolute top-5 right-5 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors" onClick={() => setShowImageModal(false)}>
            <X size={28} />
          </button>

          <div className="max-w-5xl w-full px-4" onClick={e => e.stopPropagation()}>
            <img
              src={currentImage}
              alt={carInfo.title}
              className="max-h-[80vh] w-full object-contain rounded-xl"
            />

            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextImage} className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors">
                  <ChevronRight size={24} />
                </button>
                <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`shrink-0 w-14 h-10 rounded-lg overflow-hidden transition-all ${idx === currentImageIndex ? 'ring-2 ring-white' : 'opacity-50 hover:opacity-80'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetailsPage;

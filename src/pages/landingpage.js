import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Shield, Zap, Car, ArrowRight, Star, Users, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CarCard from '../components/carcard';
import Navbar from '../components/hedder';
import api from '../lib/api';

const CarLandingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cars, setCars]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/cars')
      .then(({ data }) => setCars((data.cars || []).slice(0, 6)))
      .catch(() => setError('Failed to load cars.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/browse${searchTerm.trim() ? `?q=${encodeURIComponent(searchTerm.trim())}` : ''}`);
  };

  return (
    <>
      <Navbar />

      {/* ─── LIGHT SECTION ─── */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white">
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_10%,#000_70%,transparent_100%)]" />

        {/* ── HERO ── */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="text-center space-y-7">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 font-medium text-sm">
              <span>Introducing Premium Car Rentals</span>
              <ChevronRight className="w-4 h-4" />
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 max-w-3xl mx-auto leading-tight tracking-tight">
              Discover Luxury Cars for Your Next Adventure
            </h1>

            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Experience premium vehicles with our curated collection of luxury cars.
              Book with confidence and drive in style.
            </p>

            {/* Search → navigates to /browse */}
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by car name, brand, or description..."
                className="w-full px-6 py-4 pl-12 pr-32 rounded-2xl border-2 border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-sm text-gray-900 placeholder-gray-400 bg-white/90"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Search
              </button>
            </form>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: Shield, label: 'Verified Dealers' },
                { icon: Zap,    label: 'Instant Booking' },
                { icon: Car,    label: 'Premium Selection' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center space-x-2 bg-white border border-gray-100 px-4 py-2 rounded-full shadow-sm">
                  <Icon className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FEATURED CARS ── */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Featured Cars</h2>
              <p className="text-sm text-gray-400 mt-1">Hand-picked premium vehicles</p>
            </div>
            <button
              onClick={() => navigate('/browse')}
              className="hidden sm:flex items-center space-x-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
            >
              <span>View all cars</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-[3px] border-gray-100" />
                <div className="absolute inset-0 rounded-full border-[3px] border-blue-500 border-t-transparent animate-spin" />
              </div>
              <p className="mt-5 text-sm text-gray-400 font-medium tracking-wide">Loading cars…</p>
            </div>
          )}

          {error && <p className="text-center text-red-500 py-10">{error}</p>}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map(car => <CarCard key={car._id} car={car} />)}
            </div>
          )}

          {/* Show More */}
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/browse')}
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-2xl transition-colors shadow-lg"
            >
              <span>Browse All Cars</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="mt-3 text-xs text-gray-400">Full catalogue with filters & search</p>
          </div>
        </div>
      </div>

      {/* ─── DARK STORY SECTION ─── */}
      <div className="bg-gray-900 text-white">

        {/* Hero banner */}
        <div className="relative h-[500px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=80&auto=format&fit=crop"
            alt="Luxury sports car"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium mb-6">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>Trusted by thousands of drivers</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
                  Drive the car you've always dreamed of
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  From weekend getaways to business trips — we connect you with verified premium vehicles at transparent prices. No hidden fees. No compromises.
                </p>
                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center space-x-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {[
                { value: '500+', label: 'Premium Cars' },
                { value: '10k+', label: 'Happy Renters' },
                { value: '50+',  label: 'Cities Covered' },
                { value: '4.9★', label: 'Average Rating' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-3xl font-bold text-white mb-1">{value}</div>
                  <div className="text-gray-400 text-sm font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why CarHub */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why CarHub?</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Built for people who expect more from their rental experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&auto=format&fit=crop',
                title: 'Curated Fleet',
                body: 'Every car is hand-verified by our team. Only the finest makes and models make it onto our platform — so you always get exactly what you see.',
                icon: CheckCircle,
              },
              {
                img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80&auto=format&fit=crop',
                title: 'Instant Booking',
                body: 'No phone calls, no back-and-forth. Select your dates, confirm your booking, and receive a detailed confirmation in seconds.',
                icon: Zap,
              },
              {
                img: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&q=80&auto=format&fit=crop',
                title: 'Owner-to-Renter',
                body: 'Real verified owners. Real prices. We cut out the middleman so you pay less and owners earn more — everybody wins.',
                icon: Users,
              },
            ].map(({ img, title, body, icon: Icon }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:bg-white/[0.08] transition-colors">
                <div className="h-48 overflow-hidden">
                  <img src={img} alt={title} className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon className="w-5 h-5 text-blue-400 shrink-0" />
                    <h3 className="text-lg font-bold">{title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <footer className="bg-gray-950 text-gray-400 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-12">

            <div className="col-span-2 sm:col-span-1">
              <img src="/logo.png" alt="CarHub" className="h-10 w-auto mb-4 opacity-90" />
              <p className="text-sm leading-relaxed mb-5 text-gray-500">
                Premium car rentals, reimagined. Drive what you love — without the commitment.
              </p>
              <div className="flex space-x-2">
                <button type="button" aria-label="Twitter" className="w-8 h-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>
                <button type="button" aria-label="Instagram" className="w-8 h-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </button>
                <button type="button" aria-label="LinkedIn" className="w-8 h-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/"           className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/browse"     className="hover:text-white transition-colors">Browse Cars</a></li>
                <li><a href="/car-upload" className="hover:text-white transition-colors">List Your Car</a></li>
                <li><a href="/profile"    className="hover:text-white transition-colors">My Bookings</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <p>© {new Date().getFullYear()} CarHub. All rights reserved.</p>
            <p>Made with care for car enthusiasts everywhere.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CarLandingPage;

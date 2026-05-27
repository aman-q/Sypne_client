import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Car, ArrowLeft } from 'lucide-react';
import CarCard from '../components/CarCard';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import { getAllCars, getUserCars } from '../api/carsApi';
import useCarFilters from '../hooks/useCarFilters';

const BrowseCarsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [cars, setCars]                        = useState([]);
  const [userCars, setUserCars]                = useState([]);
  const [loading, setLoading]                  = useState(true);
  const [userCarsLoading, setUserCarsLoading]  = useState(false);
  const [error, setError]                      = useState(null);
  const [viewMyCars, setViewMyCars]            = useState(false);
  const [showFilters, setShowFilters]          = useState(false);

  const sentinelRef = useRef(null);
  const isLoggedIn  = !!localStorage.getItem('accessToken');

  const sourceList = viewMyCars ? userCars : cars;

  const {
    searchTerm, setSearchTerm,
    filters, setFilters,
    filteredCars,
    companies, driveTypes,
    activeFilterCount, clearFilters,
    BATCH,
  } = useCarFilters(sourceList, searchParams.get('q') || '');

  const [visibleCount, setVisibleCount] = useState(BATCH);

  useEffect(() => {
    getAllCars()
      .then(setCars)
      .catch(() => setError('Failed to load cars. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const fetchUserCars = async () => {
    setUserCarsLoading(true);
    try {
      const data = await getUserCars();
      setUserCars(data);
    } catch {
      setError('Failed to load your cars.');
    } finally {
      setUserCarsLoading(false);
    }
  };

  const handleMyCarsClick = () => {
    if (!viewMyCars) fetchUserCars();
    setViewMyCars(v => !v);
    setVisibleCount(BATCH);
  };

  useEffect(() => { setVisibleCount(BATCH); }, [filteredCars, BATCH]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && visibleCount < filteredCars.length) {
        setVisibleCount(v => v + BATCH);
      }
    }, { rootMargin: '200px', threshold: 0 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredCars.length]);

  const visibleCars = filteredCars.slice(0, visibleCount);
  const hasMore     = visibleCount < filteredCars.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ── STICKY SEARCH BAR — sits flush below fixed navbar ── */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">

            {/* Search input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name, brand, or description..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all shrink-0 ${
                showFilters || activeFilterCount > 0
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                  showFilters ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                }`}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* My Cars toggle (logged in only) */}
            {isLoggedIn && (
              <button
                onClick={handleMyCarsClick}
                className={`hidden sm:flex px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all shrink-0 ${
                  viewMyCars
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {viewMyCars ? 'All Cars' : 'My Cars'}
              </button>
            )}
          </div>

          {/* Filter panel — expands below the search bar */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1 uppercase tracking-wide">Brand</label>
                  <select
                    value={filters.company}
                    onChange={e => setFilters(f => ({ ...f, company: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                  >
                    <option value="">All Brands</option>
                    {companies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1 uppercase tracking-wide">Drive Type</label>
                  <select
                    value={filters.driveType}
                    onChange={e => setFilters(f => ({ ...f, driveType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                  >
                    <option value="">All Types</option>
                    {driveTypes.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1 uppercase tracking-wide">Min Price/day</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">$</span>
                    <input
                      type="number" min="0" placeholder="0"
                      value={filters.minPrice}
                      onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
                      className="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1 uppercase tracking-wide">Max Price/day</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">$</span>
                    <input
                      type="number" min="0" placeholder="Any"
                      value={filters.maxPrice}
                      onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                      className="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1 uppercase tracking-wide">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                  >
                    <option value="">Default</option>
                    <option value="price_asc">Price: Low → High</option>
                    <option value="price_desc">Price: High → Low</option>
                    <option value="year_desc">Newest First</option>
                    <option value="year_asc">Oldest First</option>
                  </select>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-gray-500">{activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}</p>
                  <button onClick={clearFilters} className="flex items-center space-x-1 text-xs text-red-500 hover:text-red-600 font-semibold transition-colors">
                    <X className="w-3 h-3" />
                    <span>Clear all</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── PAGE CONTENT — starts below sticky bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">

        {/* Page title row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {viewMyCars ? 'My Cars' : 'Browse Cars'}
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {loading ? 'Loading...' : `${filteredCars.length} ${filteredCars.length === 1 ? 'car' : 'cars'} ${searchTerm || activeFilterCount > 0 ? 'found' : 'available'}`}
              </p>
            </div>
          </div>

          {/* My Cars + List a Car — visible on mobile here */}
          <div className="flex items-center space-x-2">
            {isLoggedIn && (
              <button
                onClick={handleMyCarsClick}
                className={`sm:hidden px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  viewMyCars ? 'bg-green-600 text-white border-green-600' : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                {viewMyCars ? 'All' : 'Mine'}
              </button>
            )}
            {isLoggedIn && (
              <a href="/car-upload" className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-700 hover:border-gray-300 transition-colors shadow-sm">
                + List a Car
              </a>
            )}
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && !showFilters && (
          <div className="flex flex-wrap gap-2 mb-5">
            {filters.company && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700">
                Brand: {filters.company}
                <button onClick={() => setFilters(f => ({ ...f, company: '' }))}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filters.driveType && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700">
                Drive: {filters.driveType}
                <button onClick={() => setFilters(f => ({ ...f, driveType: '' }))}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filters.minPrice && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700">
                Min ${filters.minPrice}/day
                <button onClick={() => setFilters(f => ({ ...f, minPrice: '' }))}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filters.maxPrice && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700">
                Max ${filters.maxPrice}/day
                <button onClick={() => setFilters(f => ({ ...f, maxPrice: '' }))}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filters.sortBy && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700">
                {filters.sortBy.replace('_', ' ')}
                <button onClick={() => setFilters(f => ({ ...f, sortBy: '' }))}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Loading spinner */}
        {(loading || userCarsLoading) && <Spinner label="Loading cars…" />}

        {error && <p className="text-center text-red-500 py-10 font-medium">{error}</p>}

        {/* Empty state */}
        {!loading && !error && filteredCars.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No cars found</h3>
            <p className="text-gray-500 text-sm mb-5">
              {searchTerm || activeFilterCount > 0 ? 'Try adjusting your search or clearing the filters.' : 'No cars available right now.'}
            </p>
            {(searchTerm || activeFilterCount > 0) && (
              <button
                onClick={() => { setSearchTerm(''); clearFilters(); }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Cars grid */}
        {!loading && !error && filteredCars.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleCars.map(car => <CarCard key={car._id} car={car} />)}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="mt-10 h-10 flex items-center justify-center">
              {hasMore ? (
                <div className="flex space-x-1.5">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 100}ms` }} />
                  ))}
                </div>
              ) : filteredCars.length > BATCH ? (
                <p className="text-sm text-gray-400 font-medium">All {filteredCars.length} cars shown</p>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseCarsPage;

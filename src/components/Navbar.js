import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Car, User, BookOpen, LogOut, Plus, Menu, X } from 'lucide-react';
import { logout } from '../api/authApi';
import { clearAuth } from '../api/client';

const Navbar = () => {
  const [userInfo, setUserInfo]         = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const dropdownRef = useRef(null);
  const navigate    = useNavigate();
  const location    = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem('userinfo');
    if (stored) {
      try { setUserInfo(JSON.parse(stored)); } catch {}
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); setDropdownOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout(localStorage.getItem('refreshToken'));
    } catch {}
    finally {
      clearAuth();
      setUserInfo(null);
      setDropdownOpen(false);
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { href: '/',       label: 'Home' },
    { href: '/browse', label: 'Browse Cars' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/70 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <a href="/" className="flex items-center shrink-0 hover:opacity-85 transition-opacity">
              <img src="/logo.png" alt="CarHub" className="h-9 w-auto" />
            </a>

            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive(href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-2">
              {userInfo ? (
                <>
                  <a
                    href="/car-upload"
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>List a Car</span>
                  </a>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(v => !v)}
                      className={`flex items-center space-x-2.5 pl-2 pr-3 py-1.5 rounded-xl border transition-all duration-150 ${
                        dropdownOpen ? 'border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {userInfo.firstName?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{userInfo.firstName}</span>
                      <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-1.5">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                              {userInfo.firstName?.[0]?.toUpperCase()}{userInfo.lastName?.[0]?.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{userInfo.firstName} {userInfo.lastName}</p>
                              <p className="text-xs text-gray-400 truncate">{userInfo.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="py-1">
                          <a href="/profile" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>My Profile</span>
                          </a>
                          <a href="/profile" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <BookOpen className="w-4 h-4 text-gray-400" />
                            <span>My Bookings</span>
                          </a>
                          <a href="/car-upload" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <Car className="w-4 h-4 text-gray-400" />
                            <span>List a Car</span>
                          </a>
                        </div>

                        <div className="border-t border-gray-100 py-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <a href="/login" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                    Sign In
                  </a>
                  <a href="/register" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
                    Get Started
                  </a>
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(href) ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </a>
              ))}

              {userInfo ? (
                <>
                  <a href="/car-upload" className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    + List a Car
                  </a>
                  <a href="/profile" className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    My Profile
                  </a>
                  <div className="pt-2 pb-1 border-t border-gray-100 mt-2">
                    <div className="flex items-center space-x-3 px-3 py-2 mb-1">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {userInfo.firstName?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{userInfo.firstName} {userInfo.lastName}</p>
                        <p className="text-xs text-gray-400">{userInfo.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t border-gray-100 mt-2 flex flex-col space-y-2">
                  <a href="/login" className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 text-center transition-colors border border-gray-200">
                    Sign In
                  </a>
                  <a href="/register" className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 text-center transition-colors">
                    Get Started
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;

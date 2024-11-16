import React from 'react';

const Navbar = () => {
  return (
    <>
      {/* Background decorative element that extends behind navbar */}
      <div className="fixed top-0 left-0 right-0 h-18 bg-gradient-to-b from-gray-50 to-white z-10">
        <div className="absolute inset-0 bg-white bg-opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-sm">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="flex justify-between items-center h-20">
            {/* Left side - Logo */}
            <div className="flex-shrink-0 flex items-center lg:ml-6 xl:ml-12">
              <a href="/" className="flex items-center hover:opacity-90 transition-opacity">
                <img
                  className="h-12 w-auto"
                  src="/logo.png"
                  alt="Car App Logo"
                />
              </a>
            </div>

            {/* Right side - Login Button */}
            <div className="flex items-center space-x-4">
              <a href="/login">
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg active:scale-95 transform"
                >
                  Login
                </button>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
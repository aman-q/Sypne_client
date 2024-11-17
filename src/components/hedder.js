import React, { useEffect, useState } from 'react';

const Navbar = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Retrieve user information from localStorage
    const storedUserInfo = localStorage.getItem("userinfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage and update state
    localStorage.removeItem("userinfo");
    setUserInfo(null);
    // Redirect to login page
    window.location.href = "/login";
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
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

            {/* Right side - Conditional Rendering */}
            <div className="relative flex items-center space-x-4">
              {userInfo ? (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="text-gray-800 font-medium hover:bg-gray-200 px-4 py-2 rounded-lg transition duration-200"
                  >
                    Hello, {userInfo.firstName}!
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <a href="/login">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg active:scale-95 transform"
                  >
                    Login
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;

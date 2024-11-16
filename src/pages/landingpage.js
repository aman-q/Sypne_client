import React, { useState } from 'react';
import { Search, ArrowUpRight, Calendar, Activity, ChevronRight, Shield, Zap, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CarCard from '../components/carcard';
import Navbar from '../components/hedder';


const CarLandingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const cars = [
    {
      "tags": { "car_type": "Sedan" },
      "_id": "6737106463d91a993cbb5e29",
      "addedby": {
        "_id": "673701c1002a57914a75f8f8",
        "fname": "Aman",
        "lname": "Singh",
        "email": "aman14jsr@gmail.com"
      },
      "title": "Audi A8",
      "description": "The First in Class All new Audi A8",
      "images": [
        "https://pub-261021c7b68740ffba855a7e8a6f3c1e.r2.devcollection/dragon_fantasy_art-wallpaper-3840x2160.jpg"
      ],
      "yearOfManufacture": 2023,
      "company": "Audi",
      "driveType": "LWD",
    },
  ];

  const filteredCars = cars.filter(car => 
    car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (<>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-white bg-opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 font-medium text-sm mb-8">
                <span>Introducing Premium Car Rentals</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 max-w-3xl mx-auto leading-tight">
              Discover Luxury Cars for Your Next Adventure
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience premium vehicles with our curated collection of luxury cars.
              Book with confidence and drive in style.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mt-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by car name, company, or description..."
                  className="w-full px-6 py-4 pl-12 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Verified Dealers</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Instant Booking</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Car className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Premium Selection</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Available Cars</h2>
          <div className="flex space-x-4">
          </div>
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
        
        {filteredCars.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-50 rounded-full text-blue-600">
              <Search className="w-5 h-5" />
              <span className="font-medium">No cars found matching your search</span>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default CarLandingPage;
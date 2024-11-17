import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Search, ArrowUpRight, Calendar, Activity, Car } from 'lucide-react';

const CarCard = ({ car }) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  // Get the first image from the array
  const firstImage = car?.images?.[0];

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Function to navigate to the details page
  const goToDetails = () => {
    navigate(`/car-details/${car._id}`);
  };

  return (
    <div 
      onClick={goToDetails} // Add click event to navigate
      className="group bg-white backdrop-blur-lg rounded-2xl p-4 cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        <div className="relative h-52 mb-4 rounded-xl overflow-hidden bg-gray-100">
          {imageError || !firstImage ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <img 
                src="/background.webp" // Fallback image from public folder
                alt="Fallback image"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <img 
              src={firstImage}
              alt={`${car?.title || 'Car'} image`}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
              loading="lazy"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </div>
      
      <div className="space-y-3 relative">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-xl text-gray-900">{car?.title || 'Unknown Model'}</h3>
            <p className="text-sm text-gray-500 font-medium">{car?.company || 'Unknown Make'}</p>
          </div>
          <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1.5 rounded-full">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-600 font-semibold">{car?.driveType || 'N/A'}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2">{car?.description || 'No description available'}</p>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">{car?.yearOfManufacture || 'N/A'}</span>
          </div>
          <div className="flex items-center text-blue-600 font-medium">
            <span className="text-sm">View Details</span>
            <ArrowUpRight className="w-4 h-4 ml-1 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;

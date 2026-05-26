import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Calendar, Activity } from 'lucide-react';

const CarCard = ({ car }) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const firstImage = car?.images?.[0];

  const goToDetails = () => navigate(`/car-details/${car._id}`);

  return (
    <div
      onClick={goToDetails}
      className="group bg-white rounded-2xl cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Image */}
      <div className="relative h-52 overflow-hidden rounded-t-2xl bg-gray-100">
        {imageError || !firstImage ? (
          <img src="/background.webp" alt="Car" className="w-full h-full object-cover" />
        ) : (
          <img
            src={firstImage}
            alt={car?.title || 'Car'}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Price badge on image */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-gray-900 text-sm font-bold px-3 py-1.5 rounded-xl shadow-md">
          ${car?.price}<span className="text-xs font-medium text-gray-500">/day</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 leading-tight">{car?.title || 'Unknown Model'}</h3>
            <p className="text-sm text-gray-500 font-medium mt-0.5">{car?.company || 'Unknown Make'}</p>
          </div>
          <div className="flex items-center space-x-1 bg-blue-50 px-2.5 py-1 rounded-full shrink-0">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs text-blue-600 font-semibold">{car?.driveType || 'N/A'}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{car?.description || 'No description available'}</p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-1.5 text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-sm font-medium">{car?.yearOfManufacture || 'N/A'}</span>
          </div>
          <div className="flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-0.5 transition-transform">
            <span>View Details</span>
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;

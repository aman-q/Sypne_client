import React, { useState } from 'react';
import { Search, ArrowUpRight, Calendar, Activity, ChevronRight, Shield, Zap, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const CarCard = ({ car }) => {
      const navigate = useNavigate();
    
      return (
        <div 
          onClick={() => navigate(`/car/${car._id}`)}
          className="group bg-white backdrop-blur-lg rounded-2xl p-4 cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative">
            <div className="relative h-52 mb-4 rounded-xl overflow-hidden">
              <img 
                src={car.images[0]} 
                alt={car.title} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-medium text-blue-600 shadow-sm">
                {car.tags.car_type}
              </span>
            </div>
          </div>
          
          <div className="space-y-3 relative">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-xl text-gray-900">{car.title}</h3>
                <p className="text-sm text-gray-500 font-medium">{car.company}</p>
              </div>
              <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1.5 rounded-full">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-600 font-semibold">{car.driveType}</span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm line-clamp-2">{car.description}</p>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">{car.yearOfManufacture}</span>
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
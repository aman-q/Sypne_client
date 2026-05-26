import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const CarUploadForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    yearOfManufacture: '',
    company: '',
    driveType: '',
    price: '',
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!formData.title.trim())           e.title = 'Title is required.';
    if (!formData.description.trim())     e.description = 'Description is required.';
    if (!formData.yearOfManufacture)      e.yearOfManufacture = 'Year of manufacture is required.';
    else if (Number(formData.yearOfManufacture) > new Date().getFullYear())
                                          e.yearOfManufacture = 'Year cannot be in the future.';
    if (!formData.company.trim())         e.company = 'Company name is required.';
    if (!formData.driveType)              e.driveType = 'Drive type is required.';
    if (!formData.price)                  e.price = 'Daily price is required.';
    else if (Number(formData.price) <= 0) e.price = 'Price must be greater than 0.';
    if (imageFiles.length < 3)            e.images = 'At least 3 images are required.';
    return e;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setImageFiles(prev => [...prev, ...[...e.dataTransfer.files]]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('yearOfManufacture', formData.yearOfManufacture);
    data.append('company', formData.company);
    data.append('driveType', formData.driveType);
    data.append('price', formData.price);
    imageFiles.forEach((file) => data.append('images', file));

    try {
      setSubmitting(true);
      await api.post('/cars', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/');
    } catch (error) {
      const msg = error.response?.data?.message || 'Car upload failed, please try again.';
      setErrors({ submit: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const field = (id, label, placeholder, type = 'text', extraClass = '') => (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        id={id}
        value={formData[id]}
        onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
        className={`w-full px-4 py-2 border ${errors[id] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${extraClass}`}
        placeholder={placeholder}
      />
      {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-50 rounded-lg shadow-sm p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">List Your Car</h1>
            <p className="text-gray-500">Fill in the details to add your car to the marketplace.</p>
          </div>

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {field('title', 'Car Title', 'e.g. BMW M3 Competition')}

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                placeholder="Describe the car in detail..."
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {field('yearOfManufacture', 'Year', '2021', 'number')}
              {field('company', 'Company', 'e.g. BMW')}
              {field('price', 'Daily Price ($)', 'e.g. 120', 'number')}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Drive Type</label>
              <div className="flex space-x-6">
                {['RWD', 'FWD', 'AWD'].map((type) => (
                  <label key={type} className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="driveType"
                      value={type}
                      checked={formData.driveType === type}
                      onChange={(e) => setFormData({ ...formData, driveType: e.target.value })}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
              {errors.driveType && <p className="text-red-500 text-sm">{errors.driveType}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Images <span className="text-gray-400 font-normal">(minimum 3)</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file" id="images" multiple accept="image/*"
                  onChange={(e) => setImageFiles(prev => [...prev, ...[...e.target.files]])}
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer flex flex-col items-center">
                  <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600">Drag & drop images here, or <span className="text-blue-600 font-medium">click to select</span></p>
                  <p className="text-gray-400 text-sm mt-1">{imageFiles.length} / 10 images selected</p>
                </label>
              </div>
              {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}

              {imageFiles.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setImageFiles(files => files.filter((_, i) => i !== index))}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50"
              >
                {submitting ? 'Uploading...' : 'Upload Car'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarUploadForm;

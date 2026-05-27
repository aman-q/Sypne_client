import React from 'react';

const Spinner = ({ label = 'Loading…' }) => (
  <div className="flex flex-col items-center justify-center py-32">
    <div className="relative w-14 h-14">
      <div className="absolute inset-0 rounded-full border-[3px] border-gray-100" />
      <div className="absolute inset-0 rounded-full border-[3px] border-blue-500 border-t-transparent animate-spin" />
    </div>
    {label && <p className="mt-5 text-sm text-gray-400 font-medium tracking-wide">{label}</p>}
  </div>
);

export default Spinner;

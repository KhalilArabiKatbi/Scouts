'use client';

import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl text-white max-w-sm mx-auto">
        <div className="text-center">
          {children}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default Modal;

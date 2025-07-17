'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const SignInModal = ({ isOpen, onClose }) => {
  const router = useRouter();

  if (!isOpen) {
    return null;
  }

  const handleSignIn = () => {
    router.push('/login');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
        <p className="mb-6">You need to sign in to access the music page.</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleSignIn}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Sign In
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
